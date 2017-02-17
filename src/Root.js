/**
 * react-native-city-picker
 * https://github.com/jaycie/react-native-city-pick
 * xiezhanggen@gmail.com
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Region from './region';

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.chooseRegion.bind(this)}>
            <Text style={styles.welcome}>请选择城市</Text>
        </TouchableOpacity>

        <Region visible={this.state.visible} />
      </View>
    );
  }

  chooseRegion() {
    console.log('start');
    this.setState({
      visible: true
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
