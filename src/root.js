import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Map from './components/mapView';
import Recorder from './components/recorder';

export default class Root extends Component {

  constructor() {
    super();

  }

  
  render() {
    return (
        <Map />
    );
  }
}