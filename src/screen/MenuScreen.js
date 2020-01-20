/* eslint-disable import/named */
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'

import PropTypes from 'prop-types'
import Touchable from '../components/Touchable'
import { train } from '../modules/Api'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#dcf7c5',
    padding: 20,
  },
  button: {
    padding: 20,
    borderRadius: 4,
    backgroundColor: '#054f47',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
})

class MenuScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }

    this.train = this.train.bind(this)
    this.navigate = this.navigate.bind(this)
  }

  navigate(to) {
    const { navigation } = this.props

    navigation.navigate(to)
  }

  train() {
    this.setState({ loading: true })
    train()
      .then((response) => {
        this.setState({ loading: false })
        Alert.alert('Register Photo',
          response.status,
          [
            { text: 'OK' },
          ])
      })
  }

  render() {
    const { loading } = this.state

    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Image style={{ height: 100, alignSelf: 'center', marginBottom: 20 }} source={require('../../assets/logo.png')} resizeMode="contain" />

        <Touchable onPress={() => this.navigate('Register')}>
          <View style={styles.button}>
            <Text style={{ color: '#fffdd0', fontWeight: '600' }}>REGISTER USER</Text>
          </View>
        </Touchable>

        <Touchable onPress={() => this.navigate('RegisterPhoto')}>
          <View style={styles.button}>
            <Text style={{ color: '#fffdd0', fontWeight: '600' }}>ENROLLMENT</Text>
          </View>
        </Touchable>

        { (!loading) ? (
          <Touchable onPress={this.train}>
            <View style={styles.button}>
              <Text style={{ color: '#fffdd0', fontWeight: '600' }}>TRAIN</Text>
            </View>
          </Touchable>
        ) : (
          <View style={styles.button}>
            <ActivityIndicator color="white" />
          </View>
        ) }

        <Touchable onPress={() => this.navigate('Single')}>
          <View style={styles.button}>
            <Text style={{ color: '#fffdd0', fontWeight: '600' }}>RECOGNITION</Text>
          </View>
        </Touchable>

        <Touchable onPress={() => this.navigate('Config')}>
          <View style={styles.button}>
            <Text style={{ color: '#fffdd0', fontWeight: '600' }}>CONFIG</Text>
          </View>
        </Touchable>
      </View>
    )
  }
}

MenuScreen.defaultProps = {}
MenuScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

export default MenuScreen
