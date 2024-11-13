import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from "@react-navigation/native";

import { colors } from '../../app.json';
import { postDetect } from "../utils/api";

import { GradientButton } from '../components/Buttons';
import BoundingBox from "../components/Boundingbox";

const groupByClassName = (arr) => {
    return arr.reduce((acc, item) => {
        const { className } = item;
        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(item);
        return acc;
    }, {});
}

const ScannerScreen = () => {

    const navigation = useNavigation()
    const cameraRef = useRef(null)
    const [detecting, setDetecting] = useState(false)
    const [cameraDevice, setCameraDevice] = useState(useCameraDevice('back'))
    const [diseases, setDiseases] = useState([])
    const [boxes, setBoxes] = useState([])

    useEffect(() => {
        const interval = setInterval(() => {
            if (detecting) {
                handleDetect()
            } else {
                setBoxes([])
            }
        }, 5000) // 1000 is 1 seconds
        return () => clearInterval(interval)
    }, [detecting])

    const handleSwitchCamera = () => {
        setCameraDevice(cameraDevice == 'back' ? useCameraDevice('front') : useCameraDevice('back'))
    }

    const handleStartStop = async () => {
        setDetecting(!detecting)
    }

    const handleDetect = async () => {

        const snapshot = await cameraRef.current.takeSnapshot({
            quality: 90
        })

        setDetecting(true)
        console.log("detecting...")

        const result = await postDetect(snapshot)
        const { predictions } = result

        console.log("Predictions:", predictions)

        if (predictions.length > 0) {

            setDiseases((prev) => [...prev, predictions])
            setBoxes(predictions)

            console.log("Letters:", letters)
            console.log("Message:", message)
        }

    }

    const handleProceed = () => {

        let results = []
        const grouped = groupByClassName(diseases)

        Object.keys(grouped).forEach((value, index) => {
            const top = grouped[value].reduce((max, current) =>
                current.probability > max.probability ? current : max
            )
            results.push(top)
        })
        navigation.navigate("Result", { results })

    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 4 }}>
                <Camera
                    ref={cameraRef}
                    style={styles.cameraStyle}
                    device={cameraDevice}
                    isActive={true}
                />
            </View>
            <View style={{ flex: 0, flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 30 }}>
                <GradientButton
                    onPress={handleSwitchCamera}
                    text="Switch"
                    iconProp={{
                        type: 'AntDesign',
                        name: 'camera',
                        size: 20,
                        color: '#fff',
                        style: { flex: 0, marginTop: 0 }
                    }}
                    containerStyle={{ flex: 5 }}
                    bgColors={colors.warning.gradient}
                />
                <View style={{ flex: 1 }} />
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
                    containerStyle={{ flex: 9 }}
                />
            </View>
            <BoundingBox boxes={boxes} />
        </View>
    )
}

const styles = {
    container: {
        ...StyleSheet.absoluteFill,
        flex: 1
    },
    cameraStyle: {
        ...StyleSheet.absoluteFill,
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height - 300
    }
}

export default ScannerScreen;