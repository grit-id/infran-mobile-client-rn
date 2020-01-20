import axios from 'axios'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

const DEFAULT_HOST = 'http://trial.api.infran.grit.id'
const MAX_TIMEOUT = 10000

async function createUser(payload, timeout = MAX_TIMEOUT) {
  const result = await AsyncStorage.getItem('host')

  let HOST = `${DEFAULT_HOST}/api/`
  if (result) {
    HOST = `${result}/api/`
  }

  return axios.post(`${HOST}infran/addfruser`, payload, { timeout })
    .then((response) => {
      if (response.status === 200) {
        return { data: response.data, error: null }
      }
      return { error: 'Server tidak di temukan', data: null }
    })
    .catch((error) => {
      Alert.alert(
        'Error',
        error.message,
        [
          { text: 'OK', onPress: () => {} },
        ],
        { cancelable: false },
      )
      return { error, data: null }
    })
}

async function uploadUserPhoto(payload, timeout = MAX_TIMEOUT) {
  return AsyncStorage.getItem('host').then((result) => {
    let HOST = `${DEFAULT_HOST}/api/`
    if (result) {
      HOST = `${result}/api/`
    }

    return axios.post(`${HOST}infran/uploadreg`, payload, { timeout })
      .then((response) => {
        if (response.status === 200) {
          return { data: response.data, error: null }
        }
        return { error: 'Server tidak di temukan', data: null }
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false },
        )
        return { error, data: null }
      })
  })
}

async function train(timeout = MAX_TIMEOUT) {
  return AsyncStorage.getItem('host').then((result) => {
    let HOST = `${DEFAULT_HOST}/api/`
    if (result) {
      HOST = `${result}/api/`
    }

    return axios.post(`${HOST}infran/rtm`, { command: 'FORCED_TRAINING', trial: 'yes' }, { timeout })
      .then((response) => {
        if (response.status === 200) {
          return { data: response.data, error: null }
        }
        return { error: 'Server tidak di temukan', data: null }
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false },
        )
        return { error, data: null }
      })
  })
}

async function whoisit(payload, timeout = MAX_TIMEOUT) {
  return AsyncStorage.getItem('host').then((result) => {
    let HOST = `${DEFAULT_HOST}/api/`
    if (result) {
      HOST = `${result}/api/`
    }

    return axios.post(`${HOST}infran/whoisit`, payload, { timeout })
      .then((response) => {
        if (response.status === 200) {
          return { data: response.data, error: null }
        }
        return { error: response.data.message, data: null }
      })
      .catch((error) => {
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK', onPress: () => {} },
          ],
          { cancelable: false },
        )
        return { error, data: null }
      })
  })
}

module.exports = {
  createUser,
  uploadUserPhoto,
  train,
  whoisit,
}
