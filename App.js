import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react'; // UseEffect will load saved data every time the screen loads itself
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [name, setName] = useState()
  const [urlInput, setUrl] = useState("http://picsum.photos/300")
  const [base64Img, setBase64Img] = useState();
  const imageURL = "http://picsum.photos/300";

  // Function to convert blob to Base64
  const convertBlobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const save = async () => {
    try {
      await AsyncStorage.setItem('Myname', name); //Text

      //await AsyncStorage.setItem('MyImageUrl', urlInput); //Image

      const response = await fetch(urlInput);
      const imageBlob = await response.blob();
      const base64Image = await convertBlobToBase64(imageBlob);

      await AsyncStorage.setItem('bImage', base64Image); //Image

      // To save an object we will have to use the stringify method
      /*let user = {
        name: "DesignIntoCode",
        location: "US",
      };
      await AsyncStorage.setItem("Myname", JSON.stringify(user));*/
      // We can also do one to merge items, If we have another property we want to merge into the user json, we can do that
      // https://www.youtube.com/watch?v=PhhyBmAIehg
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let savedName = await AsyncStorage.getItem('Myname');
      let savedImg = await AsyncStorage.getItem('MyImageUrl');
      let savedImg64 = await AsyncStorage.getItem('bImage');
      /*
      if ((savedName !== null) && (savedImg !== null) && savedImg64 != null) {
        setName(savedName);
        setUrl(savedImg);
        setBase64Img(savedImg64);
        console.log(savedImg64);
      }*/
      if (savedName !== null && savedImg !== null) {
        setName(savedName);
        setBase64Img(savedImg64);
        //console.log(savedImg64);
      }


      // To load an object we need to do:
      /*
      let jsonValue = await AsyncStorage.getItem('Myname')
      if (jsonValue != null) {
        setName(JSON.parse(jsonValue))
      }*/

    } catch (err) {
      alert(err);
    }
  }

  const remove = async () => {
    try {
      await AsyncStorage.removeItem('Myname');
    } catch {
      alert(err);
    } finally {
      setName("");
    }
  };

  // This will only rerender on the initial page load
  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: base64Img}}
        style={{ width: 300, height: 300 }}
      />
      {/*<Image //TODO: this can be replaced by json file to extract image url
        source={{ uri: urlInput }} // need to convert object in value 
        style={{ width: 300, height: 300 }}
      />*/}

      <Text style={{ height: 30 }}>{name}</Text>
      <Text style={styles.name}>What's your name?</Text>
      <TextInput style={styles.input} onChangeText={(text) => setName(text)} />

      <Text style={styles.name}>Insert an URL</Text>
      <TextInput style={styles.input} onChangeText={(urlText) => setUrl(urlText)} />

      <TouchableOpacity style={styles.button} onPress={() => save()}>
        <Text style={{ color: "white" }}>Save my name!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => remove()}>
        <Text style={{ color: "white" }}>Remove my name!</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: "300",
  },
  input: {
    borderWidth: 1,
    borderColor: '#575DD9',
    alignSelf: "stretch",
    margin: 32,
    height: 64,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: "300",
  },
  button: {
    borderWidth: 1,
    backgroundColor: '#575DD9',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 32,
    marginHorizontal: 32,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 32,
  }

});
