import { StyleSheet, Text, View, Image } from 'react-native';
/*dependencias:
npx expo install expo-media-library
npx expo install expo-camera*/
import { Camera, CameraType } from 'expo-camera'; /*libreria*/ 
import * as MediaLibrary from 'expo-media-library'; /*libreria*/ 
import React, { useState, useEffect, useRef } from 'react';
import Button from './src/components/Button';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);  /*para pedir permisos de camara*/
  const [image, setImage] = useState(null); /*en esta constante se guardara la imagen al tomar la foto*/
  const [type, setType] = useState(Camera.Constants.Type.back); /*para indicar el tipo de camara[frontal o trasera] */
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); /* para indicar si queremos el flash encendido o no*/
  const cameraRef = useRef(null); /* referencia a la camara */

  /* #1 */
  /*aqui se piden los permisos la primera vez q se abre la app */
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync(); /*permiso de acceder a la libreria */
      const cameraStatus = await Camera.requestCameraPermissionsAsync(); /*permisos de camara */
      setHasCameraPermission(cameraStatus.status === 'granted'); /*pasa de estado null a granted */
    })(); /*funcion se manda llamar con los parentesis, es una funcion sin nombre */
  }, []) /*estos corchetes son un arreglo basico y sirve para q los permisos solo se pidan la 1ra vez*/

  /* #4 */
  /*funcion para tomar una foto */
  const takePicture = async () => {
    if(cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync(); /*metodo de la camara para tomar foto */
        console.log(data);  /*en data se arroja una altura, uri y ancho de la foto tomada en consola */
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }

  /* #5 */
  /* funcion que permite guardar la imagen en la media library del dispositivo */
  const saveImage = async () => {
    if(image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture save! c:')
        setImage(null); /*la imagen cambia a nulo nuevamente */
      } catch (e) {
        console.log(e)
      }
    }
  }

  /* #2 */
  /* si no se dan permisos de camara entonces se mostrara un texto */
  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  }

  /* #3 */
  return (
    <View style={styles.container}>
      {!image ? /*si no hay una imagen entonces... */
      <Camera
        style={styles.camera}
        type={type} /*las propiedades del componente Camera se igualan a la constantes*/
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 30,
        }}>
          <Button icon={'retweet'} onPress={() => {
            setType(type === CameraType.back ? CameraType.front : CameraType.back)
          }} />
          <Button icon={'flash'} 
            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
            onPress={() => {
              setFlash(flash === Camera.Constants.FlashMode.off 
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off 
                )
            }} />
        </View>
      </Camera>
      : /*si si hay una imagen entonces... se mostrara la imagen tomada */
      <Image source={{uri: image}} style={styles.camera} />
      }
      <View>
        {image ? /*si si hay una imagen entonces... 2 botones retomar o guardar dicha imagen*/
        /*en el boton de retomar la foto se vuelve a poner la image en nula, es decir se pierde la uri o referencia de esa imagen*/
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50
        }}> 
          <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} />
          <Button title={"Save"} icon="check" onPress={saveImage} />
        </View>
        : /*si no hay una imagen entonces se mostrara la camara */
        <Button title={'Take picture'} icon="camera" onPress={takePicture}/> /*boton para sacar foto */
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20
  },
  camera: {
    flex:1,  /*con esto abarca toda la pantalla*/
    borderRadius: 20,
  }
});
