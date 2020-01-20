/* eslint-disable import/named */
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native'

import Touchable from '../components/Touchable'
import { createUser } from '../modules/Api'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#dcf7c5',
    padding: 20,
  },
  row: {
    margin: 5,
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
  label: {
    textAlign: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
})

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nik: '',
      nama: '',

      loading: false,
    }

    this.doClear = this.doClear.bind(this)
  }

  doClear() {
    this.setState({ nik: '', nama: '' })
  }

  doRegister() {
    this.setState({ loading: true })
    const {
      nik,
      nama,
    } = this.state

    createUser({ nik, nama, trial: 'yes' })
      .then((result) => {
        Alert.alert('Register', result.data.status)
        this.setState({ loading: false }, this.doClear)
      })
  }

  render() {
    const {
      nik, nama, loading,
    } = this.state

    if (loading) {
      return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#054f47" />
            <Text style={{ marginTop: 10 }}>Mendaftarkan user baru.. </Text>
          </View>
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>

        <KeyboardAvoidingView style={styles.row}>
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

          <Touchable onPress={() => this.doRegister()}>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>Daftar Baru</Text>
            </View>
          </Touchable>
        </KeyboardAvoidingView>

      </ScrollView>
    )
  }
}

export default RegisterScreen
