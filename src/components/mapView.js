/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
//import {checkPermission} from 'react-native-android-permissions';
import mapStyle from '../../MapStyles/mapStyle.json';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import MapViewDirections from 'react-native-maps-directions';
import data from '../../config.json';

let { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 31.6488;
const LONGITUDE = -8.02054;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyDM9hxPzUUHTzKUDrlpEgnv_K914dYOdm4';


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
      },
      dest: { 
      },
      coords : [],
      markers : [],
      results : [],
      results1 : [],
      prevLatLng : 0
    };
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.4);
    
        Voice.onSpeechResults = this.onSpeechResults.bind(this);
        Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
  }

  onSpeechResults(e){
    
    this.setState({
        results1 : e.value,
        dest : {
          destinationName : "Medicine Marrakech"
        }
    })
  }

  onSpeechPartialResults(e){
    this.setState({
        results : e.value
        
    })
  }

  /*isWithin20m(a, b) {
    R = 6378137;
    dx = a.longitude - b.longitude;
    
    sy = Math.sin(a.latitude) * Math.sin(b.latitude);
    sx = Math.cos(a.latitude) * Math.cos(b.latitude) * Math.cos(dx)
    distance = Math.acos( sy + sx) * R ;
    return distance <= 20;
}*/

isWithin200m(a, b) {
  const R = 6378137;
  /*var dx = a.longitude - b.longitude;
  
  var sy = Math.sin(a.latitude) * Math.sin(b.latitude);
  var sx = Math.cos(a.latitude) * Math.cos(b.latitude) * Math.cos(dx)
  var distance = Math.acos( sy + sx) * R ;
  return distance; */
  var φ1 = toRadians(a.latitude);
  var φ2 = toRadians(b.latitude);
  var Δφ = toRadians(b.latitude-a.latitude);
  var Δλ = toRadians(b.longitude-a.longitude);
  var A = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));
  
  var d = R * c; 
  return d <=200;
}

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
        position => {
          return this.setState({
                    region: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA
                    },
                    dep: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA
                    }
                  });

        },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
        let { prevLatLng } = this.state
        if(prevLatLng != 0){
          const newLatLng = {latitude: position.coords.latitude, longitude: position.coords.longitude }
          onTrack = this.isWithin200m(data[prevLatLng], data[prevLatLng]);
          switch(onTrack){
            case true : {
              if(prevLatLng == data.length-2){
                Tts.speak('you have reached your destination');
                navigator.geolocation.clearWatch(this.watchID);
              }
              else{
              Tts.speak('you are on track ! keep going');
              this.setState({
                prevLatLng: prevLatLng+1
              })
            }
              break;
            }
            case false : {
              Tts.speak('you are off track');
              break;
            }
          };  
        }  
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 5}
  );
  }


  async getDirections(startLoc, destination) {
    try {

      let resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ destination }&key=AIzaSyBC4C4GGaTEKAlZbJaWGSFVGlQ-dpTfMG4`);
      let respJson = await resp.json();
      let destLoc = `${respJson.results[0].geometry.location.lat},${respJson.results[0].geometry.location.lng}`;
        let coordns = [
          {
            latitude: this.state.dep.latitude,
            longitude: this.state.dep.longitude
          },
          {
            latitude: respJson.results[0].geometry.location.lat,
            longitude: respJson.results[0].geometry.location.lng
          }

        ];
        
        let mrkrs = this.state.markers;
        mrkrs.push({
          latitude: respJson.results[0].geometry.location.lat,
          longitude: respJson.results[0].geometry.location.lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        });
        this.setState({
          dest : {
            latitude: respJson.results[0].geometry.location.lat,
            longitude: respJson.results[0].geometry.location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          },
          markers : mrkrs,
          coords : data,
          prevLatLng: 1
        });

                
        return mrkrs;
    } catch(error) {
      Tts.speak('please repeat the location or choose another one');
    }
}
  /*renderMarkers(){
    
    (this.state.dest.latitude && this.state.dest.longitude)
    return (<MapView.Marker  key={this.state.dest.destinationName} coordinate={ this.state.dest } />);
  }*/
    
    

  /*componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }*/

  _onPressButton() {

    this.getDirections(`${this.state.dep.latitude}, ${this.state.dep.longitude}`, 
    this.state.dest.destinationName);
    
        Voice.start('fr_FR');
        Voice.stop();
        
    }
    
    render() {

      return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={this._onPressButton.bind(this)}>
                <Text style={styles.buttonText}>Choose a place</Text>
            </TouchableOpacity>
            {
                this.state.results.map( (text,index) => {
                      return ( <Text key={index + 1}>{text}</Text> )
                })
            }
            <MapView
              style={styles.sub_container}
              provider={ PROVIDER_GOOGLE }
              mapType='satellite'
              customMapStyle={ mapStyle }
              showsUserLocation={ true }
              followUserLocation={true}
              ref={c => this.mapView = c}
              region={ this.state.region }
              onRegionChange={ region => this.setState({region}) }
            >
              {
                (this.state.coords.length >= 2) && (
                  <MapView.Marker  
                    key={this.state.dest.destinationName} 
                    coordinate={ this.state.coords[this.state.coords.length-1] } 
                  />)
              }
              {(this.state.coords.length >= 2 ) && (
                  <MapViewDirections
                    origin={this.state.coords[0]}
                    destination={this.state.coords[this.state.coords.length-1]}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="blue"
                    mode="walking"
                    avoid ="indoor|tolls|highways"
                    transit_routing_preference="less_walking|fewer_transfers"
                    onReady={(result) => {
                      Tts.speak('the requested track is available');
                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: parseInt(width / 30, 10),
                          bottom: parseInt(height / 30, 10),
                          left: parseInt(width / 30, 10),
                          top: parseInt(height / 30, 10),
                        }
                      });
                    }}
                    onError={(errorMessage) => {
                      // console.log('GOT AN ERROR');
                    }}
                    
                  />
                )}
            </MapView>
          </View>
      );
    }
  }
 
function toRadians(val){
  return val * Math.PI /180;
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    paddingTop: 0,
    alignItems: 'center'
  },
  sub_container: {
    height: '80%',
    width: '100%',
    paddingTop: 0,
    alignItems: 'center',
    borderRadius : 20
  },
  button: {
    marginBottom: 0,
    width: '100%',
    height: '20%',
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 40,
    color: 'white',
    fontWeight : 'bold'
    
  }
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