import React, { useEffect, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { BackHandler, StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {colors} from '../../app.json'
import { GradientButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';

const testData = [{name: "Eczema", percentage: "80%"}, {name: "Tigyawat", percentage: "60%"}]

const getPercentage = (value) => {
  return `${parseFloat(parseFloat(value) * 100).toFixed(0)}%`
}

const ListResults = ({results, navigation}) => {

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Scanner' }]
    })
  }

  const handleNavigate = (data) => {
    navigation.navigate("Details", data)
  }

  if(!results || results.length == 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.headerText}>No Detections! &#x2713;</Text>
        <Text style={styles.headerContent}>There were no detections found on the subject.</Text>
        <GradientButton 
          onPress={handleReset}  
          text="Scan Again"
          iconProp={{
            type: 'AntDesign',
            name: 'back',
            size: 30,
            color: '#fff'
          }}
        />
      </View>
    )
  }

  return (
  <Layout style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0)'}}>
    <View>
      <Text style={styles.headerText}>Scan Complete <Text style={{color: '#fff', fontSize: 45}}>&#x2713;</Text></Text>
      <Text style={styles.headerContent}>See scan results below for detected diseases on your face</Text>
    </View>
    <View style={styles.resultscontainer}>
      {results && results?.length > 1 && results?.map((item, index) => {
        return (
          <TouchableOpacity onPress={() => handleNavigate(item)} key={index} style={styles.resultItem}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Disease:</Text>
              <Text style={styles.resultLabel}>Percentage:</Text>
            </View>
            <View style={styles.resultContainer}>
              <Text style={styles.resultName}>{item.className}</Text>
              <Text style={styles.resultPct}>{getPercentage(item.probability)}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
      {results?.length == 1 && results?.map((item, index) => {
        return (
          <TouchableOpacity onPress={() => handleNavigate(item)} key={index} style={styles.resultItem}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Disease:</Text>
            </View>
            <View style={styles.resultContainer}>
              <Text style={styles.resultName}>{item.className}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
    
    <View style={{flex: 0, flexDirection: 'row'}}>
      <GradientButton 
        onPress={handleReset}
        text="Reset"
        iconProp={{
          type: 'AntDesign',
          name: 'reload1',
          size: 20,
          color: '#fff',
          style: { flex: 0, marginTop: 0 }
        }}
        containerStyle={{flex: 9}}
      />
      <View style={{flex: 1}} />
      <GradientButton 
        onPress={() => BackHandler.exitApp()}  
        text="Quit"
        iconProp={{
          float: 'right',
          type: 'AntDesign',
          name: 'logout',
          size: 20,
          color: '#fff',
          style: { flex: 0, marginTop: 0 }
        }}
        containerStyle={{flex: 9}}
        bgColors={colors.warning.gradient}
      />
    </View>

  </Layout>
  )
}

const Output = ({route, navigation}) => {

  const { results } = route.params

  return (
    <LinearGradient style={styles.container} colors={[...colors.bg.gradient, "#31447d"]}>
      <ListResults results={results} navigation={navigation} />
    </LinearGradient>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', padding: 20,
  },
  headerText: {
    fontSize: 32, color: colors.text.primary, textAlign: 'center', paddingTop: 80, paddingBottom: 40
  },
  headerContent: {
    fontSize: 14, color: "#fff", textAlign: 'center', paddingBottom: 140
  },
  resultscontainer: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 8, paddingHorizontal: 4
  },  
  resultContainer: {
    flex: 0, flexDirection: 'row', marginTop: 12
  },
  resultLabel: {
    flex:1,
    fontSize: 14, color: "#fff", textAlign: 'center'
  },
  resultName: {
    flex: 1,
    fontSize: 24, color: colors.text.primary, textAlign: 'center'
  },
  resultPct: {
    flex: 1,
    fontSize: 24, color: colors.text.primary, textAlign: 'center'
  }
})

export default Output;