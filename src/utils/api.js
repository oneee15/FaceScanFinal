import axios from "axios";
import { readFile } from "react-native-fs";

import { detectionApiKey, detectionApiUrl } from '../../app.json';

export const postDetect = async (snap, callback, onError) => {

    const image = await readFile(`file://${snap.path}`, {
        encoding: "base64"
    });

    const res = await axios({
        method: "POST",
        url: detectionApiUrl,
        params: {
            api_key: detectionApiKey
        },
        data: `data:image/png;base64,${image}`
    })
    // console.log(res.data)
    if (res?.data) return res?.data

    return { predictions: [] }

    // axios({
    //   method: "POST",
    //   url: roboflowDetectionApiUrl,
    //   params: {
    //     api_key: roboflowDetectionApiKey
    //   },
    //   data: `data:image/png;base64,${image}`,
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   }
    // })
    // .then(function(response) {
    //   if(response.data){
    //     if(response.data?.predictions){
    //       callback(response?.data)
    //     }
    //   }
    // })
    // .catch(function(error) {
    //     console.log("Error: ", error.message);
    //     onError(error)
    // });
}