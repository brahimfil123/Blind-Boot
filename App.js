/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Map from './src/components/mapView';

export default class App extends Component {

  constructor() {
    super();

  }

  
  render() {
    return (
        <Map />
    );
  }
}
