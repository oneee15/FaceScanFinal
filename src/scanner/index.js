import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { Camera, getCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from "@react-navigation/native";

import { colors } from '../../app.json';
import { postDetect } from "../utils/api";

import { GradientButton } from '../components/Buttons';
import BoundingBox from "../components/Boundingbox";
import MakeIcon from "../components/Icons";
import { launchImageLibrary } from "react-native-image-picker";
import { Modal, Card, Button, Spinner } from "@ui-kitten/components";

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

    const [uploadedImage, setUploadedImage] = useState(null)
    const [visible, setVisible] = useState(false)

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

    const handleUpload = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo'
        })

        if (result?.assets.length > 0) {

            setVisible(true)
            setDetecting(true)

            let uploadedFile = {
                ...result?.assets[0],
                path: result?.assets[0].originalPath
            }

            setUploadedImage(uploadedFile)

            const detection = await postDetect(uploadedFile)
            const { predictions } = detection

            console.log("Predictions:", predictions)

            if (predictions.length > 0) {

                let namedPredictions = predictions.map((pred) => {
                    return { className: pred["class"], probability: pred["confidence"] }
                })
                setDiseases((prev) => [...prev, ...namedPredictions])
                setBoxes(predictions)
                setDetecting(false)
            } else {
                setDetecting(false)
                setUploadedImage(null)
            }
        }
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
            <View style={{ flex: 0.5, alignItems: 'center' }}>
                <Text style={{ marginTop: 5 }}>{diseases?.length > 0 ? "Show Results" : detecting ? "Detecting" : "Start Scanning"}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 30 }}>

                <View style={{ flex: 1 }}></View>

                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handleSwitchCamera} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <MakeIcon name="camera" type="AntDesign" size={30} />
                        <Text>Switch</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handleScanProceedBtn} style={{ flex: 0, width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: 'center', backgroundColor: colors.text.primary }}>
                        <MakeIcon name={diseases?.length > 0 ? "search1" : "scan1"} type="AntDesign" size={45} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={handleUpload} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <MakeIcon name="upload" type="AntDesign" size={30} />
                        <Text>Upload</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}></View>

            </View>
            <BoundingBox boxes={boxes} />

            <Modal visible={visible}>
                <Card disabled={true} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>
                    {uploadedImage && <Image source={{ uri: uploadedImage?.uri }} style={{ width: Dimensions.get("screen").width - 50, height: 450 }} />}
                    {detecting && <Text style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, color: '#000' }}>
                        <Spinner /> Detecting...
                    </Text>}
                    {diseases && diseases.length > 0 && <Text style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, color: '#000' }}>{diseases[0]?.className}</Text>}
                    <Button disabled={detecting} onPress={handleProceed}>
                        SHOW RESULTS
                    </Button>
                </Card>
            </Modal>

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