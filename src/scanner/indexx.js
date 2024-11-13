import React, { useEffect, useRef, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';

import {trainDataModelID, colors} from '../../app.json';
import { GradientButton } from '../components/Buttons';

function groupByClassName(arr) {
  return arr.reduce((acc, item) => {
      const { className } = item;
      if (!acc[className]) {
          acc[className] = [];
      }
      acc[className].push(item);
      return acc;
  }, {});
}

const Scanner = () => {

  const navigation = useNavigation()
  const [predictions, setPredictions] = useState([])
  const [facingMode, setFacingMode] = useState('environment')
  const [scannerUrl, setScannerUrl] = useState(`file:///android_asset/scanner.html?detect=true&threshold=0.99&id=${trainDataModelID}&camera=${facingMode}`)

  useEffect(() => {
    setScannerUrl(`file:///android_asset/scanner.html?detect=true&threshold=0.99&id=${trainDataModelID}&camera=${facingMode}`)
  }, [trainDataModelID, facingMode])

  const handlePredictions = ({nativeEvent}) => {
    try { 
      if(nativeEvent){
        const data = JSON.parse(nativeEvent.data)
        if(data.className != "no_detection"){
          setPredictions(prevState => ([...prevState, data]))
        }
      }
    } catch (error) {
      console.log(error, nativeEvent.data)
    }
  }

  const handleProceed = () => {

    let results = []
    const grouped = groupByClassName(predictions)

    Object.keys(grouped).forEach((value, index) => {
      const top = grouped[value].reduce((max, current) =>
        current.probability > max.probability ? current : max
      )
      results.push(top)
    })
    navigation.navigate("Result", {results})

  }

  const toggleCameraMode = () => {
    if(facingMode == 'environment') setFacingMode('user')
    else if(facingMode == 'user') setFacingMode('environment')
  }

  return (
    <View style={styles.container}>
      <WebView 
        source={{uri: scannerUrl}}
        style={styles.webview}
        javaScriptEnabled={true}
        startInLoadingState={false}
        originWhitelist={['*']}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowingReadAccessToURL='file:///android_asset/'
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={handlePredictions}
      />

      <View>
        <TouchableOpacity>

        </TouchableOpacity>
      </View>
      
      {/* <View style={{paddingVertical: 32, paddingHorizontal: 24, backgroundColor: '#000'}}>
        <GradientButton 
          onPress={handleProceed}
          text="Show Results"
          iconProp={{
            float: 'right',
            type: 'AntDesign',
            name: 'export',
            size: 30,
            color: '#fff'
          }}
        />
        
      </View> */}

      <View style={{flex: 0, flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 30}}>
        <GradientButton
          onPress={toggleCameraMode} 
          text="Switch"
          iconProp={{
            type: 'AntDesign',
            name: 'camera',
            size: 20,
            color: '#fff',
            style: { flex: 0, marginTop: 0 }
          }}
          containerStyle={{flex: 5}}
          bgColors={colors.warning.gradient}
        />
        <View style={{flex: 1}} />
        <GradientButton 
          onPress={handleProceed}
          text="Show Results"
          iconProp={{
            float: 'right',
            type: 'AntDesign',
            name: 'export',
            size: 20,
            color: '#fff',
            style: { flex: 0, marginTop: 0 }
          }}
          containerStyle={{flex: 9}}          
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.dark
  },
  webview: {
    flex: 1,
    backgroundColor: colors.bg.dark
  },
  button: {
    margin: 30,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: colors.primary.dim,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 13
  },
  buttonText: {
    color: "#fff"
  }
})

export default Scanner;