import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Cloudinary } from "@cloudinary/url-gen";
import { UploadApiOptions, upload } from "cloudinary-react-native";
import * as Crypto from "expo-crypto";

export default function CameraPage() {
  const [facing, setFacing] = useState("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [image, setImage] = useState<CameraCapturedPicture>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!cameraPermission && !mediaPermission) {
    return <View />;
  }

  if (!cameraPermission?.granted && !mediaPermission?.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={() => {
            requestCameraPermission();
            requestMediaPermission();
          }}
          title="grant permission"
        />
      </View>
    );
  }

  async function uploadImageToCloudinarySDK(uri: String) {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dpjwt3wc0",
        apiKey: "924747896266865",
        apiSecret: "JD8svlGklQSgx3Tw9DsqMJDrPIU",

      },
      url: {
        secure: true,
      },
    });

    const options: UploadApiOptions = {
      upload_preset: "ml_default",
      public_id: "wachumaralavaquita",
    };

    console.log(uri);

    await upload(cld, {
      file: uri,
      options,
      callback: (error: any, response: any) => {
        console.log(response ?? error);
      },
    });
  }

  async function uploadImageToCloudinaryRaw(base64){
    const base64Image = "data:image/jpeg;base64," + base64;
    const formData = new FormData();
    const public_id = Crypto.randomUUID();
    formData.append("file", base64Image, "file");
    formData.append("upload_preset", "practicaClau");
    formData.append("public_id", public_id);
    const response = await fetch("https://api.cloudinary.com/v1_1/ddcgybcnk/image/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
    .catch((err)=> err)
    console.log(response);
  }


  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  async function takePicture() {
    if (!mediaPermission?.granted && mediaPermission?.canAskAgain) {
      requestMediaPermission();
    }
    if (cameraRef.current) {
      cameraRef.current
        .takePictureAsync({ skipProcessing: true, base64: true })
        .then(async (picture) => {
          try {
            setImage(picture);
            //await uploadImageToCloudinarySDK(picture?.uri);
            uploadImageToCloudinaryRaw(picture?.base64)
          } catch (error) {
            alert("We couldn't take the picture");
          }
        });
    }
  }

  if (image) {
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={() => {
            setImage(null);
          }}
          title="Back"
        />
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.text}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.takePictureButton}
            onPress={takePicture}
          >
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  takePictureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -35,
    alignSelf: "center",
    flex: 1,
  },
});
