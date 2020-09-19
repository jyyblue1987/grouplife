import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';


export default class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            email: '', 
            password: '',
            isLoading: false
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    registerUser = () => {
        if( this.state.email === '' && this.state.password === '' ) {
            Alert.alert("Enter details to signup!");
        }
        else
        {
            this.setState( {
                isLoading: true,
            });
        }

        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( (res) => {   
                res.user.updateProfile({
                    displayName: this.state.displayName
                });

                console.log('User registered successfully!');                
                
                this.setState({
                    isLoading: false,
                    displayName: '',
                    email: '',
                    password: ''
                });

                this.props.navigation.navigate('Signin');
            })
            .catch(error => this.setState({errorMessage: error.message})) 
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Name"
                    autoCapitalize = 'none'
                    value={this.state.displayName}
                    onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                    />      
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Email"
                    autoCapitalize = 'none'
                    value={this.state.email}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Password"
                    autoCapitalize = 'none'
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={true}
                />

                <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                        onPress = {() => this.registerUser()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>SignUp</Text>
                    </TouchableOpacity>
                </View>
                
                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Signup')}>
                    Already Registered? Click here to login
                </Text>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },   
    loginText: {
        color: stylesGlobal.back_color,
        marginTop: 25,
        textAlign: 'center'
    },   
});

