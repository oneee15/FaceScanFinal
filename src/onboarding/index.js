import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { Camera } from 'react-native-vision-camera';

import { colors } from '../../app.json';
import { appLogo } from '../../assets/provider';

const NoPermissionScreen = () => {
  return (
    <LinearGradient style={styles.container} colors={colors.bg.gradient}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.applogo} />
      </View>
      <Text style={styles.title} category='h2'>Face<Text style={{ ...styles.title, color: "white" }} category='h2'> Check</Text> </Text>
      <Text style={styles.desc} >You need to enable permission to access camera to continue.</Text>
    </LinearGradient>
  )
}

const Onboard = () => {

  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    Camera.requestCameraPermission().then((p) =>
      setHasPermission(p === 'granted')
    )
  }, [])

  if (!hasPermission) return NoPermissionScreen()

  return (
    <LinearGradient style={styles.container} colors={colors.bg.gradient}>
      <View style={styles.logoContainer}>
        <Image source={appLogo} style={styles.applogo} />
      </View>
      <Text style={styles.title} category='h2'>Face<Text style={{ ...styles.title, color: "white" }} category='h2'> Check</Text> </Text>
      <Text style={styles.desc} >Face check app is used to detect and identify diseases that our face may acquire.</Text>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button} colors={colors.primary.gradient}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Scanner")}
          style={styles.buttonInner}
        >
          <Text style={styles.buttonTxt}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', textAlign: 'center',
  },
  logoContainer: {
    paddingVertical: 80
  },
  applogo: {
    width: 100, height: 100, borderRadius: 50
  },
  title: {
    width: '80%', textAlign: 'center', color: colors.text.primary, fontWeight: 'bold'
  },
  desc: {
    width: '80%', textAlign: 'center', marginTop: 30, color: colors.text.secondary
  },
  button: {
    position: 'absolute', bottom: 100, borderRadius: 14,
    borderColor: colors.primary.light,
    borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1
  },
  buttonInner: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: 90, borderRadius: 14,
  },
  buttonTxt: {
    color: "#fff", fontWeight: 'bold', fontSize: 16
  }
})

export default Onboard;