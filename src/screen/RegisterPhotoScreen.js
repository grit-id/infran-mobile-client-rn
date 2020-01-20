/* eslint-disable import/named */
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native'

import { RNCamera } from 'react-native-camera'
import { sha256 } from 'react-native-sha256'

import { uploadUserPhoto } from '../modules/Api'
import Touchable from '../components/Touchable'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcf7c5',
  },
  row: {
    padding: 20,
  },
  preview: {
    width,
    height: height / 2,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 4,
    marginTop: 10,
    backgroundColor: '#054f47',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fffdd0',
    fontWeight: '600',
  },
})

export default class RegisterPhotoScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nik: '',
      nama: '',
      loading: false,
    }
  }

  async doRegister() {
    if (this.cameraRegister) {
      this.setState({ loading: true })

      const {
        nik,
        nama,
      } = this.state

      const options = {
        quality: 1,
        base64: true,
        doNotSave: true,
        orientation: 'portrait',
        fixOrientation: true,
        height: 800,
        width: 600,
      }

      const photo = await this.cameraRegister.takePictureAsync(options)
      this.cameraRegister.pausePreview()

      sha256(photo.base64).then((hash) => {
        const timestamp = Math.round(new Date().getTime() / 1000)

        uploadUserPhoto({
          data: photo.base64,
          hash,
          file_name: `${timestamp}.jpg`,
          nik,
          nama,
          trial: 'yes',
        })
          .then((response) => {
            this.cameraRegister.resumePreview()

            if (response.data.err_code === '0') {
              this.setState({ loading: false }, Alert.alert('Register Photo', response.data.status))
            } else {
              Alert.alert('Register Photo',
                response.data.status,
                [
                  { text: 'OK', onPress: () => this.setState({ loading: false }) },
                ])
            }
          })
      })
    } else {
      Alert.alert('Login', 'Kamera tidak dapat mengambil foto anda, silahkan ulangi lagi')
      this.cameraRegister.resumePreview()
      this.setState({ loading: false })
    }
  }

  render() {
    const { nik, nama, loading } = this.state
    return (
      <ScrollView style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.cameraRegister = ref
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        />

        <View style={styles.row}>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder="NIK"
            onChangeText={(value) => this.setState({ nik: value })}
            value={nik}
            keyboardType="number-pad"
            autoCapitalize="none"
            maxLength={20}
          />

          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder="Nama"
            onChangeText={(value) => this.setState({ nama: value })}
            value={nama}
            autoCapitalize="none"
          />


          { (!loading) ? (
            <Touchable onPress={() => this.doRegister()}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>Take Photo</Text>
              </View>
            </Touchable>
          ) : (
            <View style={styles.button}>
              <ActivityIndicator color="white" />
            </View>
          ) }
        </View>
      </ScrollView>
    )
  }
}
