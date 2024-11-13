import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const BoundingBox = ({ boxes }) => {

    const [boundingBoxes, setBoundingBoxes] = useState(boxes ? boxes : [])

    useEffect(() => {
        setBoundingBoxes(boxes)
    }, [boxes])

    if (boundingBoxes?.length == 0) return null

    return (
        <>
            {boundingBoxes?.map((box, index) => {

                const getAdjustedValue = (num, thres) => {
                    let threshold = thres ? thres : 300
                    return num - threshold
                }

                return (
                    <View key={index} style={{
                        ...styles.boundingBox,
                        // width: getAdjustedValue(box?.width),
                        // height: getAdjustedValue(box?.height, 0),
                        // left: getAdjustedValue(box?.x, 0),
                        // top: getAdjustedValue(box?.y / 2, 0)
                    }}>
                        <Text style={styles.boundingBoxText}>{box?.class}</Text>
                    </View>
                )
            })}
        </>
    )
}

const styles = StyleSheet.create({
    boundingBox: {
        flex: 1,
        zIndex: 9999,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        marginLeft: '10%',
        marginTop: '20%',
        width: '80%',
        height: 400,
        borderColor: '#7151d4',
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
        padding: 8,
    },
    boundingBoxText: {
        color: '#fff',
        fontSize: 25
    },
})

export default BoundingBox;