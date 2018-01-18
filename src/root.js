import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Map from './components/mapView';

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