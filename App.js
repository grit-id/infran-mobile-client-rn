import React from 'react'
import {
  PermissionsAndroid,
  Platform,
} from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AsyncStorage from '@react-native-community/async-storage'

import {
  MenuScreen,
  SingleScreen,
  ConfigScreen,
  RegisterScreen,
  RegisterPhotoScreen,
} from './src/screen/Screen'

export const AppNavigator = createStackNavigator(
  {
    Menu: {
      screen: MenuScreen,
      navigationOptions: () => ({
        title: 'INFRAN',
      }),
    },

    Single: {
      screen: SingleScreen,
      navigationOptions: () => ({
        title: 'Single Face',
      }),
    },

    Register: {
      screen: RegisterScreen,
      navigationOptions: () => ({
        title: 'Registrasi',
      }),
    },

    RegisterPhoto: {
      screen: RegisterPhotoScreen,
      navigationOptions: () => ({
        title: 'Ambil Foto',
      }),
    },

    Config: {
      screen: ConfigScreen,
      navigationOptions: () => ({
        title: 'Konfigurasi',
      }),
    },
  },
  {
    initialRouteName: 'Menu',
    defaultNavigationOptions: {
      title: 'Infran',
      headerBackTitle: 'Kembali',
      headerStyle: {
        backgroundColor: '#054f47',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
)

const AppContainer = createAppContainer(AppNavigator);
const DEFAULT_SERVER = 'http://trial.api.infran.grit.id/'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      server: null,
    }

    this.requestPermission = this.requestPermission.bind(this)
    this.getHost = this.getHost.bind(this)
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.requestPermission()
    }
    this.getHost()
  }

  async getHost() {
    try {
      const server = await AsyncStorage.getItem('server')

      if (server !== null) {
        this.setState({ server })
      } else {
        // create default value
        await AsyncStorage.setItem('server', DEFAULT_SERVER)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async setHost() {
    try {
      const server = await AsyncStorage.getItem('server')

      if (server !== null) {
        this.setState({ server })
      } else {
        // create default value
        await AsyncStorage.setItem('single', DEFAULT_SERVER)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ],
        {
          title: 'Infran App Permission',
          message: 'Infran App needs access to your storage for pick file to upload.',
        },
      )

      if (granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' && granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
        console.log('Permission accepted')
      } else {
        console.log('Read storage permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    const { server } = this.state
    return (
      <AppContainer
        ref={(nav) => { this.navigator = nav }}
        screenProps={{
          getHost: this.getHost,
          server,
        }}
      />
    )
  }
}
