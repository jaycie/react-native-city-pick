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
      visible: false,
      selectedProvince: '',
      selectedCity: '',
      selectedArea: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.chooseRegion.bind(this)}>
            <Text style={styles.welcome}>请选择城市</Text>
        </TouchableOpacity>
        <Text>已选择： {this.state.selectedProvince} {this.state.selectedCity} {this.state.selectedArea}</Text>

        <Region visible={this.state.visible} setChoosed={this.setChoosed.bind(this)} cancled={this.cancled.bind(this)} />
      </View>
    );
  }

  chooseRegion() {
    this.setState({
      visible: true
    })
  }

  cancled() {
    this.setState({
      visible: false
    });
    console.log(this.state.visible);
  }

  setChoosed(p, c, a) {
    this.setState({
      selectedProvince: p,
      selectedCity: c,
      selectedArea: a,
      visible: false
    });
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
