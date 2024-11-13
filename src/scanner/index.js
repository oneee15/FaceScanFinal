import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Camera, getCameraDevice } from 'react-native-vision-camera';
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

    const devices = Camera.getAvailableCameraDevices()
    const [cameraDevice, setCameraDevice] = useState(getCameraDevice(devices, 'back'))

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
        const position = cameraDevice?.position == 'front' ? 'back' : 'front';
        setCameraDevice(getCameraDevice(devices, position));
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

            let namedPredictions = predictions.map((pred) => {
                return { className: pred["class"], probability: pred["confidence"] }
            })
            setDiseases((prev) => [...prev, ...namedPredictions])
            setBoxes(predictions)

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

    const handleScanProceedBtn = () => {
        console.log("Detecting State: ", detecting)
        console.log("Detections: ", diseases)
        handleStartStop()
        if (!detecting && diseases.length == 0) {
            setDetecting(true)
            handleDetect()
        } else if (!detecting && diseases.length > 0) {
            setDetecting(false)
            handleProceed()
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 7 }}>
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
                    onPress={handleScanProceedBtn}
                    text={diseases?.length > 0 ? "Show Results" : detecting ? "Detecting" : "Start Scanning"}
                    iconProp={{
                        float: 'right',
                        type: 'AntDesign',
                        name: diseases?.length > 0 ? "search1" : "scan1",
                        size: 25,
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
        flex: 1,
        backgroundColor: colors.bg.dark
    },
    cameraStyle: {
        ...StyleSheet.absoluteFill,
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height - 226
    }
}

export default ScannerScreen;