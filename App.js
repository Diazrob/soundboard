import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from './styles/mystylesheet';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { SoundButton} from './components/soundButton';

export default function App() {
  const [db, setDb] = useState(null);
  const [updateItems, forceUpdate] = useState(null);
  const [sounds, setSounds] = useState([]);
  const [recordings, setRecordings] = useState([]);

  // connect to the database
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
      db = SQLite.openDatabase('mysounds.db');
    }
    setDb(db);

    // create tables if it doesn't exist.
    db.transaction((sd) => {
      sd.executeSql(
        "create table if not exists sound (id integer primary key not null, item blob, title text);"
      ), 
        (_, error) => console.log(error),
        () => console.log("Sound table exists or was created")
    })

    db.transaction((rd) => {
      rd.executeSql(
        "create table if not exists recording (id integer primary key not null, item blob), title text;"
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
            (sd) => {
              sd.executeSql(
                "select * from sound",
                [],
                (_,{rows}) => setSounds(rows._array),
                (_,error) => console.log(error)
              ),
                (_,error) => console.log(error),
                () => console.log('sounds was reloaded')
            }
        )

        db.transaction(
          (rd) => {
            rd.executeSql(
              "select * from recording",
              [],
              (_,{rows}) => setRecordings(rows._array),
              (_,error) => console.log(error)
            ),
              (_,error) => console.log(error),
              () => console.log('recordings was reloaded')
          }
      )
      }
    },[db, updateItems]);

    // add Sound
  
    // load a Sound
    // play a Sound
    // pause a Sound
    // stop a Sound
    // unload a Sound
    
  return (
    <View style={styles.container}>
      <View>
       <Text style={styles.sectionHeading}>Sound Effects</Text>
       <Pressable>
        <Text>Delete this Pressable</Text>
       </Pressable>
       {sounds.map(
        ({id, item, title}) =>  {(
            <SoundButton
              key={1} // change to id
              buttonId={1} // change to id
              buttonText={"Sound 1"} // change to title
              onPress={()=>{}}
              onLongPress={()=>{}}
            />
          )
        }
       )}
      
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


