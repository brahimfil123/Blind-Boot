import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';


export default class Recorder extends Component {

  constructor() {
    super();
    this.state = {
        results : [],
        results1 : [],
        status : {
        pressed : false
        }
    };
    Tts.setDefaultLanguage('en-US');

    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);

  }

  onSpeechResults(e){
      
      this.setState({
          results1 : e.value
      })
  }

  onSpeechPartialResults(e){
    this.setState({
        results : e.value
    })
  }

  _onPressButton() {

    Tts.speak('Hi, everyone!');

    
    /*if(this.state.pressed == false){
        Voice.start('en_US');
        this.setState({
            pressed : true
        }); 
    }
    else {
        if(this.state.pressed == true){
            Voice.stop();
            this.setState({
                pressed : false
            });
          }
    }*/
  }
   _onPressButton2() {
    
        Voice.start('fr_FR');
        
    }
    _onPressButton1() {
        
        Voice.stop();
                
    }

  render() {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={this._onPressButton2.bind()}>
                <View style={styles.button}>
                 <Text style={styles.buttonText}>Choose a place</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onPressButton1.bind()}>
                <View style={styles.button}>
                 <Text style={styles.buttonText}>Stop</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onPressButton.bind()}>
                <View style={styles.button}>
                 <Text style={styles.buttonText}>Speak</Text>
                </View>
            </TouchableOpacity>
            {
              this.state.results.map( (text,index) => {
                    return ( <Text key={index + 1}>{text}</Text> )
              })
            }
        </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      paddingTop: 60,
      alignItems: 'center'
    },
    button: {
      marginBottom: 30,
      width: 260,
      alignItems: 'center',
      backgroundColor: '#2196F3'
    },
    buttonText: {
      padding: 20,
      color: 'white'
    }
  })