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
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      dest: {
        destinationName : "Medicine Marrakech",
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coords : [],
      markers : []
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
            longitudeDelta: LONGITUDE_DELTA
          },
          dep: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        
        this.getDirections({ lat : this.state.dep.latitude , lon : this.state.dep.longitude }, this.state.dest.destinationName);

      },
    (error) => console.log(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
  }

  async getDirections(startLoc, destination) {
    try {
      let { lat, lon } = startLoc;
        let resp = await fetch("http://10.0.2.2:3000/api/getDirection",
          {
            method: 'POST', // or 'PUT'
            body: JSON.stringify({
              destination,
              lat,
              lon
            }), 
            headers: new Headers({
              'Content-Type': 'application/json'
          })
        });
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.data.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        let mrkrs = this.state.markers;
        mrkrs.push({
          latitude: respJson.destination.lat,
          longitude: respJson.destination.lon,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        });
        this.setState({
          coords: coords,
          markers : mrkrs
        });
                
        return coords
    } catch(error) {
        alert(error)
        console.log(error);
    }
}
  renderMarkers(){
    
    if(!this.state.markers[0]){
      return [];
    }

    return this.state.markers.map(marker => <MapView.Marker  key={this.state.dest.destinationName} coordinate={ marker } />);
  }
    
    /*
    <MapView.Marker
          coordinate={ this.state.dep }
          title={"dep"}
        />
    this.watchID = navigator.geolocation.watchPosition(
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
        {this.renderMarkers()}
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