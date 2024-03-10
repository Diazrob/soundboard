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
    backgroundColor: '#C1C1C1',
    alignItems: 'center',
    justifyContent: 'center',
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
soundLabel: {
  fontSize: 30,
},
sectionHeading: {
  fontSize: 40,
  marginBottom: 8,
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
}
});

export default styles;