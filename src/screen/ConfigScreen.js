import React from 'react'
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Touchable from '../components/Touchable'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#dcf7c5',
    padding: 20,
  },
  row: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#054f47',
    fontWeight: '600',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  submitButton: {
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#054f47',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
})

export default class ConfigScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      server: null,
    }

    this.doSave = this.doSave.bind(this)
  }

  componentDidMount() {
    this.init()
  }

  async init() {
    try {
      const server = await AsyncStorage.getItem('server')
      this.setState({ server })
    } catch (e) {
      console.log(e)
    }
  }

  doSave() {
    const { server } = this.state

    Keyboard.dismiss()
    AsyncStorage.setItem(
      'single',
      server,
      Alert.alert(
        'Setting',
        'Data berhasil disimpan',
        [
          { text: 'OK', onPress: () => {} },
        ],
        { cancelable: false },
      ),
    )
  }

  render() {
    const { server } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Server</Text>
          <TextInput
            style={styles.textInput}
            autoCorrect={false}
            placeholder="IP address"
            onChangeText={(value) => this.setState({ server: value })}
            value={server}
            autoCapitalize="none"
          />
        </View>

        <Touchable onPress={() => this.doSave()}>
          <View style={styles.submitButton}>
            <Text style={{ color: '#fffdd0', fontWeight: '600' }}>Simpan</Text>
          </View>
        </Touchable>
      </View>
    )
  }
}
