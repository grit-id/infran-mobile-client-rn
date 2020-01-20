import React from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native'

export default (props) => (Platform.OS === 'android'
  ? (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.SelectableBackground()}
    />
  )
  : <TouchableOpacity {...props} />)
