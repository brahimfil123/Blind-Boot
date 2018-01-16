/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Polyline from '@mapbox/polyline';
//import {checkPermission} from 'react-native-android-permissions';
import mapStyle from '../../MapStyles/mapStyle.json';
import RNFS from 'react-native-fs';

let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 31.6488;
const LONGITUDE = -8.02054;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class Map extends Component {

  constructor() {
    super();

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      dep: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      dest: {
        latitude: 31.6415409,
        longitude: -8.0153567,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coords : [],
      markers : [
        {
          title : "Me"
        }
      ]
    };
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          dep: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });

        this.getDirections(`${ this.state.dep.latitude }, ${ this.state.dep.longitude }`,
        `${ this.state.dest.latitude }, ${ this.state.dest.longitude }`);

      },
    (error) => console.log(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
  }

  async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&mode=walking`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        var path = RNFS.DocumentDirectoryPath + '/brahim.txt';
        
        // write the file
        RNFS.writeFile(path, JSON.stringify(coords), 'utf8')
          .then((success) => {
            console.log('FILE WRITTEN!');
            this.setState({coords: coords})
          })
          .catch((err) => {
            console.log(err.message);
          });
        
        
        return coords
    } catch(error) {
        alert(error)
        return error
    }
}
    
    /*this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );*/


  /*componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }*/

  render() {
    console.log("i am here");
    return (
      
      <MapView
        provider={ PROVIDER_GOOGLE }
        style={ styles.container }
        mapType='satellite'
        customMapStyle={ mapStyle }
        showsUserLocation={ true }
        followUserLocation={true}
        region={ this.state.region }
        onRegionChange={ region => this.setState({region}) }
        //onRegionChangeComplete={ region => this.setState({region}) }
      >
        <MapView.Marker
          coordinate={ this.state.dep }
          title={"dep"}
        />
        <MapView.Marker
          coordinate={ this.state.dest }
          title={"dest"}
        />
        <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={10}
strokeColor="red"/>
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});

/*setTimeout(() => {
      requestPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
        console.log("Granted!", result);
        // now you can set the listenner to watch the user geo location
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            });
          },
        (error) => console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );
      }, (result) => {
        console.log("Not Granted!");
        console.log(result);
      });
    // for the correct StatusBar behaviour with translucent={true} we need to wait a bit and ask for permission after the first render cycle
    // (check https://github.com/facebook/react-native/issues/9413 for more info)
    }, 0);
    

    checkPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
      console.log("Already Granted!");
      console.log(result);
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
          });
        },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
      );
    }, (result) => {
      console.log("Not Granted!");
      console.log(result);
    });
    */