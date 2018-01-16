import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import pick from 'lodash/pick';

import haversine from 'haversine'

const { width, height } = Dimensions.get('window');

export default class MapF extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {}
        }

    }
      
    componentDidMount() {
        
        navigator.geolocation.getCurrentPosition(
          (position) => {},
          (error) => alert(error.message),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
        this.watchID = navigator.geolocation.watchPosition((position) => {
            const { routeCoordinates, distanceTravelled } = this.state
            const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }
            const positionLatLngs = pick(position.coords, ['latitude', 'longitude'])
      
            this.setState({
              routeCoordinates: routeCoordinates.concat(positionLatLngs),
              distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
              prevLatLng: newLatLngs
            })
        });
    }
    
    calcDistance(newLatLng) {
        const { prevLatLng } = this.state
        return (haversine(prevLatLng, newLatLng) || 0)
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    render() {
        return (
        
            <MapView
            style={styles.container}
            mapType='satellite'
            showsUserLocation={true}
            followUserLocation={true}
            />

        );
    }
}

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
    },
  });