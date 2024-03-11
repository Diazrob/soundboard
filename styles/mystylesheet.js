import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: '#283747',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#D3D3D3',
    borderColor: 'black',
    borderRadius: 7,
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#3498db',
    borderRadius: 5,
},

buttonText: {
    fontSize: 24,
},
recordingButton: {
  backgroundColor: 'white',
  border: 0,
  borderRadius: 56,
  color: 'black',
},
soundLabel: {
  fontSize: 29,
  fontWeight: 'bold',
},
sectionHeading: {
  backgroundColor: '#202020',
    borderRadius: 10,
    textAlign: 'center',
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center',
},
sectionHeading2: {
  backgroundColor: 'white',
    borderRadius: 10,
    textAlign: 'center',
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'center',
    marginVertical: 10,
},
titleText: {
  color: 'white',
  fontSize: 35,
  paddingHorizontal: 20,
  paddingVertical: 10,
},
titleText2: {
  color: 'black',
  fontSize: 35,
  paddingHorizontal: 20,
  paddingVertical: 10,
},
audioStatus :{
  fontSize: 20,
},
audioStatus2 :{
  fontSize: 20,
  color: '#82E0AA'
},
scrollArea: {
  marginVertical: 60,
  flex: 1,
},
soundsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginTop: 10,
},
soundItem: {
flexBasis: '35%',
 marginVertical: 10,
},
recordingItem: {
  flexBasis: '35%',
  marginVertical: 10,
},
recordingLabel: {
  fontSize: 29,
  fontWeight:'bold',
  color: 'white',
}
});

export default styles;