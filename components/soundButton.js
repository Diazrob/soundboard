import { Pressable, Text } from "react-native";
import styles from "../styles/mystylesheet";
import { useState,useEffect } from "react";


export default SoundButton = ({buttonId, buttonText, onPress, onLongPress}) => {
  return (
    <Pressable 
       style={styles.button}
       onPress={onPress}
       onLongPress={onLongPress}
       key={buttonId}
       >
          <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
  )
}