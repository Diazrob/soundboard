import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, Platform, ScrollView, Button, FlatList } from 'react-native';
import Constants from 'expo-constants'
import * as SQLite from 'expo-sqlite';
import styles from './styles/mystylesheet';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';


export default function App() {

  //#region sound effect elements
  const sounds = [
    { localUri: require('./assets/soundeffects/separation.mp3'),label: "Song 1"},
    { localUri: require('./assets/soundeffects/crowdlaughing.wav'),label: "Laughing"},
    { localUri: require('./assets/soundeffects/dingdong.wav'),label: "Dingdong"},
    { localUri: require('./assets/soundeffects/flutemusicnotif.wav'),label: "Flute"},
    { localUri: require('./assets/soundeffects/monkeyapplause.wav'),label: "Applause"},
  ];
  const [playbackStatus, setPlaybackStatus] = useState("Loaded");
  const [myPBO, setMyPBO] = useState(null);
  const [individualPlaybackStatus, setIndividualPlaybackStatus] = useState(Array(sounds.length).fill('Loaded'));
  const [soundObjects, setSoundObjects] = useState([]);

  //#endregion
  // #region recording elements
  const [db, setDb] = useState(null);
  const [updateItems, forceUpdate] = useState(null);

  const [recording, setRecording] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [recordingUris, setRecordingUris] = useState([]);
  const [playbacks, setPlaybacks] = useState([]);
  const [permissionsResponse, requestPermission] = Audio.usePermissions();
  //#endregion

// #region connect to the database
  
  useEffect(() => {
    let db = null;
    if (Platform.OS === 'web') {
      db = {
        transaction: () => {
          return {
            executeSql: () => {}
          }
        }
      }
    } else {
      db = SQLite.openDatabase('myrecordings.db');
    }
    setDb(db);

    // create tables if it doesn't exist.
    db.transaction((rd) => {
      rd.executeSql(
        "create table if not exists recording (id integer primary key not null, item text);"
      ), 
        (_, error) => console.log(error),
        () => console.log("Recording table exists or was created")
    })
    return () => { db ? db.close : undefined}
  },[])

    // executes when the items in the db changes
    useEffect(()=> {
      if (db) {
        db.transaction(
          (rd) => {
            rd.executeSql(
              "select * from recording",
              [],
              (_,{rows}) => setRecording(rows._array),
              (_,error) => console.log(error)
            ),
              (_,error) => console.log(error),
              () => console.log('recordings was reloaded')
          }
      )
      }
    },[db, updateItems]);

    const addRecording = (item) => {
      db.transaction(
        (sd) => {
          sd.executeSql(
              "insert into recording (item) values (?)",
              [item],
              () => console.log("added ", item), // if it work
              (_,error) => console.log(error)     // if it doesn't work
          )
      },
      (_,error) => console.log('addRecord() failed', error),
      forceUpdate(f => f+1 )
      )
    }

    const deleteRecord = (id) => {
      db.transaction(
          (tx) => {
              tx.executeSql(
                  "delete from recording where id = ?",
                  [id],
                  () => console.log("deleted record ", id), // if it work
                  (_, error) => console.log(error)     // if it doesn't work
              )
          },
          (_, error) => console.log('deleteRecord() failed', error),
          forceUpdate(f => f + 1)
      )
  }
//#endregion

const startRecording = async () => {
  try {
    // request permission to use the mic
    if (permissionsResponse.status !== 'granted') {
      console.log('Requesting permissions.');
      await requestPermission();
    }
    console.log('Permission is ', permissionsResponse.status);

    // set some device specific values
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log('Starting recording...');
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecordings((prevRecordings) => [...prevRecordings, recording]);
    console.log('...recording');
  }
  catch (errorEvent) {
    console.error('Failed to startRecording(): ', errorEvent);
  }
}

const stopRecording = async () => {
  try {
    if(recordings.length === 0) {
      console.log('No recording to stop.');
      return;
    }

    const lastRecording = recordings[recordings.length - 1];
    // stop the actual recording
    await lastRecording.stopAndUnloadAsync();

    // save the recorded object location
    const uri = lastRecording.getURI();

    setRecordingUris((prevUris)=> [...prevUris,uri]);
    addRecording(uri);

    // forget the recording object
    setRecordings((prevRecordings) => prevRecordings.slice(0, -1));

    // log the result
    console.log('Recording stopped and stored at ', uri);
  }
  catch (errorEvent) {
    console.error('Failed to stopRecording(): ', errorEvent);
  }
}

const playRecording = async (index) => {
  const { sound } = await Audio.Sound.createAsync({
    uri: recordingUris[index],
  });
  setPlaybacks((prevPlaybacks) => [...prevPlaybacks,sound]);
  await sound.replayAsync();
  console.log('Playing recorded sound from ', recordingUris[index]);
}

// This effect hook will make sure the app stops recording when it ends
useEffect(() => {
  return () => {
    recordings.forEach(async (recording) => {
      await recording.stopAndUnloadAsync();
    });
  };
}, []);

// Effect hook to unload all playback sounds when the component unmounts
useEffect(() => {
  return () => {
    playbacks.forEach(async (sound) => {
      await sound.unloadAsync();
    });
  };
}, []);

//#region Sound Functions
    // load a Sound
    const loadSounds = async (index) => {
      try {
        const soundObjectsArray = await Promise.all(
          sounds.map(async (sound) => {
            const { sound: loadedSound } = await Audio.Sound.createAsync(sound.localUri);
            return loadedSound;
          })
        );
          setSoundObjects(soundObjectsArray);
          setPlaybackStatus("Loaded");
        }catch (error) {
          console.log(error);
        }
      };

    // play a Sound
    const playSound = async (index) => {
      try {
        await soundObjects[index].playAsync();
        updateIndividualPlaybackStatus(index, 'Playing');
        //setPlaybackStatus("Playing");
      } catch (error) {
        console.error(error);
      }
    };
    // pause a Sound
    const pauseSound = async (index) => {
      try {
        if (soundObjects[index] && individualPlaybackStatus[index] === "Playing") {
        await soundObjects[index].pauseAsync();
        updateIndividualPlaybackStatus(index, 'Paused');//setPlaybackStatus("Paused");
        }
      } catch (error) {
        console.error(error);
      }
    };
    // stop a Sound
    const stopSound = async (index) => {
      try {
        await soundObjects[index].stopAsync();
        updateIndividualPlaybackStatus(index, 'Stopped');//setPlaybackStatus("Stopped");
      } catch (error) {
        console.error(error);
      }
    };
  
    // unload a sound
    const unloadSounds = async () => {
      try {
        await Promise.all(soundObjects.map((sound) => sound.unloadAsync()));
        setIndividualPlaybackStatus(Array(sounds.length).fill('Unloaded'));//setPlaybackStatus("Unloaded");
      } catch (error) {
        console.error(error);
      }
    };

    const updateIndividualPlaybackStatus = (index, status) => {
      setIndividualPlaybackStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = status;
        return newStatus;
      });
    };

    useEffect(() => {
      loadSounds();
  
      // Clean up when the component unmounts
      return () => {
          unloadSounds();
      };
    }, []);
    //#endregion
  return (
    <ScrollView style={styles.scrollArea}>
    {/* sound effect view */}
    <View style={styles.container}>
      <View style={styles.sectionHeading}>
       <Text style={styles.titleText}>Sound Effects</Text>
       </View>
       <View style={styles.soundsContainer}>
       {sounds.map((sound, index) => (
        <View key={index} style={styles.soundItem}>
          <Text style={styles.soundLabel}>{sound.label}</Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (individualPlaybackStatus[index] === "Playing") {
              pauseSound(index);
              } else {
                playSound(index);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {individualPlaybackStatus[index] === "Playing" ? "Pause" : "Play"}
              </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => stopSound(index)}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
          <Text style={styles.audioStatus}>Status: {individualPlaybackStatus[index]}</Text>
        </View>
      ))}
      </View>
      <StatusBar style="auto" />
    </View>


  {/* recording effect view */}   
    <View style={styles.container2}>
      <View style={styles.sectionHeading2}>
        <Text style={styles.titleText2}>Database Recordings</Text>
    </View>
   
    <Pressable
    style={styles.button}
    onPress={recordings.length > 0 ? stopRecording : startRecording}
    >
    <Text style={styles.buttonText}>{recordings.length > 0 ? 'Stop Recording' : 'Start Recording'}</Text>
    </Pressable>
  {recording.map((uri, index) => (
    <View key={index} style={styles.recordingItem}>
      <Text style={styles.recordingLabel}>{`Recording ${index + 1}`}</Text>

      <Pressable
      style={styles.button}
        onPress={() => playRecording(index)}
      >
        <Text style={styles.buttonText}>Play</Text>
      </Pressable>

      <Pressable
      style={styles.button}
        onPress={() => deleteRecord(index)}
      >
        <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      <Text style={styles.audioStatus2}>Status: {playbacks[index] ? 'Playing' : 'Stopped'}</Text>
    </View>
  ))}
    </View>

    </ScrollView>
  );
}