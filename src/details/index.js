import React, { useEffect, useState } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { BackHandler, FlatList, Linking, StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../app.json';
import { GradientButton } from '../components/Buttons';

import { diseases } from './data.json';

const testData = [{ name: "Eczema", percentage: "80%" }, { name: "Tigyawat", percentage: "60%" }]

const BulletList = ({ value }) => {
  if (value && value?.includes(",")) {
    let list = value.split(",")
    console.log(list)
    return list.map((item, index) => {
      return <Text style={styles.resultLabel} key={index}>&#8226; {item}</Text>
    })
  }
  return ""
}

const ListResults = ({ data, navigation }) => {

  const [disease, setDisease] = useState({})

  useEffect(() => {
    diseases.map((item, index) => {
      if (item.className == data.className) {
        setDisease(item)
      }
    })
    // console.log(disease)
  }, [diseases, data])

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Scanner' }]
    })
  }

  const handleOnPressLink = (url) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.headerText}>{disease?.className}</Text>

      <FlatList
        scrollEnabled={true}
        data={[1]}
        showsVerticalScrollIndicator={false}
        renderItem={() => {
          return (
            <View>
              <Text style={{ ...styles.resultLabel, color: 'orange' }}>Description:</Text>
              <View style={{ height: 8 }}></View>
              <Text style={styles.resultLabel}>{disease?.description}</Text>
              <View style={{ height: 30 }}></View>

              <Text style={{ ...styles.resultLabel, color: 'orange' }}>Causes:</Text>
              <View style={{ height: 8 }}></View>
              <Text style={styles.resultLabel}>{disease?.causes}</Text>
              <View style={{ height: 30 }}></View>

              <Text style={{ ...styles.resultLabel, color: 'orange' }}>Medication:</Text>
              <View style={{ height: 8 }}></View>
              {/* <Text style={styles.resultLabel}>{disease?.medication}</Text> */}
              <BulletList value={disease?.medication} />
              <View style={{ height: 30 }}></View>

              <Text style={{ ...styles.resultLabel, color: 'orange' }}>Prevention:</Text>
              <View style={{ height: 8 }}></View>
              <Text style={styles.resultLabel}>{disease?.prevention}</Text>
              <View style={{ height: 30 }}></View>

              {/* <TouchableOpacity onPress={() => handleOnPressLink(disease?.link)}>
                <Text style={styles.resultLabel}>For more information about {disease?.className}, 
                  <Text style={{...styles.resultLabel, color: 'lightblue'}}> visit this link</Text>
                </Text>
              </TouchableOpacity> */}
              <View style={{ height: 50 }}></View>

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
        }}
      />


    </View>
  )

}

const Details = ({ route, navigation }) => {

  return (
    <LinearGradient style={styles.container} colors={[...colors.bg.gradient, "#31447d"]}>
      <ListResults data={route.params} navigation={navigation} />
    </LinearGradient>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', padding: 20,
  },
  headerText: {
    fontSize: 32, color: colors.text.primary, textAlign: 'center', paddingTop: 40, paddingBottom: 40
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
    flex: 0,
    fontSize: 14, color: "#fff", textAlign: 'left'
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

export default Details;