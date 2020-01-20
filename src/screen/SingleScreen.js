/* eslint-disable import/named */
import React from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'

import { RNCamera } from 'react-native-camera'
import { sha256 } from 'react-native-sha256'

import { whoisit } from '../modules/Api'
import Touchable from '../components/Touchable'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#dcf7c5',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  submitButton: {
    width: 240,
    paddingVertical: 20,
    borderRadius: 4,
    marginVertical: 10,
    backgroundColor: '#054f47',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
})

export default class SingleScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraType: 'front',
      photo: null,
      result: null,
    }

    this.renderResult = this.renderResult.bind(this)
    this.takePicture = this.takePicture.bind(this)
    this.doReset = this.doReset.bind(this)
  }

  doReset() {
    this.setState({
      photo: null,
      result: null,
    })
  }

  async takePicture() {
    if (this.camera) {
      const options = {
        quality: 0.9, base64: true, width: 800, height: 600,
      }
      const newPhoto = await this.camera.takePictureAsync(options)
      this.camera.pausePreview()

      this.setState({ photo: newPhoto })

      sha256(newPhoto.base64).then((hash) => {
        const { photo } = this.state
        const payload = {
          data: photo.base64,
          hash,
          trial: 'yes',
        }

        whoisit(payload)
          .then((response) => {
            if (response.data !== null) {
              console.log(response.data)
              this.setState({ result: response.data }, Alert.alert('Recognition', `${response.data.status}: ${response.data.data[0].person_in_picture}`))
            } else {
              Alert.alert('Recognition', response.error)
            }
          })
      })

      this.camera.resumePreview()
    }
  }

  renderCamera() {
    const { cameraType } = this.state

    return (
      <View style={[styles.container, { backgroundColor: '#000000' }]}>
        <View style={{ flex: 1 }}>
          <RNCamera
            ref={(ref) => {
              this.camera = ref
            }}
            mirrorImage={false}
            style={styles.preview}
            type={cameraType}
            flashMode={RNCamera.Constants.FlashMode.auto}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          >
            <Touchable onPress={this.takePicture}>
              <View style={styles.capture} />
            </Touchable>
          </RNCamera>
        </View>
      </View>
    )
  }

  renderResult() {
    const { result, photo } = this.state

    return (
      <ScrollView style={styles.container}>
        <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{
              width: width - 20, height: width - 20, backgroundColor: '#cc7722', alignSelf: 'center',
            }}
            source={{ uri: `data:image/png;base64,${photo.base64}` }}
          />

          { (typeof (result) !== 'undefined' && result !== null) ? (
            <View style={{ maxWidth: 240, justifyContent: 'center', alignItems: 'center' }}>
              { (result.person_in_picture) ? (<Text numberOfLines={2} style={{ color: '#cc7722', padding: 5 }}>{ `PERSON: ${result.person_in_picture}` }</Text>) : null }
              { (result.pip_nik) ? (<Text numberOfLines={2} style={{ color: '#cc7722' }}>{ `NIK: ${result.pip_nik}` }</Text>) : null }
              { (result.error_message !== null) ? (<Text numberOfLines={2} style={{ fontSize: 10, color: 'red', textAlign: 'center' }}>{ result.error_message }</Text>) : null }
            </View>
          ) : null }
          <Touchable onPress={() => this.doReset()}>
            <View style={styles.submitButton}>
              <Text style={{ color: '#fffdd0', fontWeight: '600' }}>Ulangi</Text>
            </View>
          </Touchable>
        </View>
      </ScrollView>
    )
  }

  render() {
    const { result } = this.state

    if (result == null) {
      return this.renderCamera()
    }

    return this.renderResult()
  }
}
