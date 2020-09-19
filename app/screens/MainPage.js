import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';


export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            uid: ''
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    signOut = () => {
        firebase.auth().signOut().then(() => {
            this.props.navigation.navigate('Signin');
        }).catch(error => this.setState({ errorMessage: error.message}));
    }

    render() {
        this.state = {
            displayName: firebase.auth().currentUser.displayName,
            uid: firebase.auth().currentUser.uid,
        }
        return (
            <View style={styles.container}>                
                <Text style={styles.textStyle}>
                    Hello, {this.state.displayName}
                </Text>
                <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                        onPress = {() => this.signOut()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Logout</Text>
                    </TouchableOpacity>
                </View>                  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#fff'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    }
});