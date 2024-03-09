import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from './styles/mystylesheet';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { SoundButton} from './components/soundButton';

export default function App() {
  const sounds = [
    { localUri: require('./assets/soundeffects/separation.mp3'),label: "Song 1"},
    { localUri: require('./assets/soundeffects/crowdlaughing.wav'),label: "Laughing"},
    { localUri: require('./assets/soundeffects/dingdong.wav'),label: "Dingdong"},
    { localUri: require('./assets/soundeffects/flutemusicnotif.wav'),label: "Notification"},
    { localUri: require('./assets/soundeffects/monkeyapplause.wav'),label: "Applause"},
  ];
  const [playbackStatus, setPlaybackStatus] = useState("Unloaded");
  const [myPBO, setMyPBO] = useState(null);
  const [individualPlaybackStatus, setIndividualPlaybackStatus] = useState(Array(sounds.length).fill('Unloaded'));
  const [soundObjects, setSoundObjects] = useState([]);

  const [db, setDb] = useState(null);
  const [updateItems, forceUpdate] = useState(null);
  
  const [recordings, setRecordings] = useState([]);
//#region database
  // connect to the database
  // useEffect(() => {
  //   let db = null;
  //   if (Platform.OS === 'web') {
  //     db = {
  //       transaction: () => {
  //         return {
  //           executeSql: () => {}
  //         }
  //       }
  //     }
  //   } else {
  //     db = SQLite.openDatabase('mysounds.db');
  //   }
  //   setDb(db);

  //   // create tables if it doesn't exist.
  //   db.transaction((rd) => {
  //     rd.executeSql(
  //       "create table if not exists recording (id integer primary key not null, item blob), title text;"
  //     ), 
  //       (_, error) => console.log(error),
  //       () => console.log("Recording table exists or was created")
  //   })
  //   return () => { db ? db.close : undefined}
  // },[])

  //   // executes when the items in the db changes
  //   useEffect(()=> {
  //     if (db) {
  //       db.transaction(
  //         (rd) => {
  //           rd.executeSql(
  //             "select * from recording",
  //             [],
  //             (_,{rows}) => setRecordings(rows._array),
  //             (_,error) => console.log(error)
  //           ),
  //             (_,error) => console.log(error),
  //             () => console.log('recordings was reloaded')
  //         }
  //     )
  //     }
  //   },[db, updateItems]);
//#endregion
    // add Sound
  
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
    
  return (
    <View style={styles.container}>
      <View>
       <Text style={styles.sectionHeading}>Sound Effects</Text>
       {sounds.map((sound, index) => (
        <View key={index}>
          <Text style={styles.buttonText}>{sound.label}</Text>
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
          <Text style={styles.buttonText}>Status: {individualPlaybackStatus[index]}</Text>
        </View>
      ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


