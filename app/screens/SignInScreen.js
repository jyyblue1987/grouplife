import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import firebase from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';


export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '', 
            password: '',
            isLoading: false
        }
    }

    componentDidMount() {
        let user = firebase.auth().currentUser;
        if( user != null )
            this.props.navigation.navigate('Main');   
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    userLogin = async() => {
        if( this.state.email === '' && this.state.password === '' ) {
            Alert.alert("Enter details to signin!");
        }
        else
        {
            this.setState( {
                isLoading: true,
            });
        }

        try {
            await firebase.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password);

            this.setState({
                isLoading: false,
                email: '',
                password: ''
            });
    
            const action = CommonActions.reset({
                index: 0,
                routes: [{ name: "Main" }]
            });

            this.props.navigation.dispatch(action);

        } catch(e) {
            this.setState({
                isLoading: false,                   
            });

            this.setState({errorMessage: e.message});
            Alert.alert(e.message);
        }
        
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
                        onPress = {() => this.userLogin()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>SignIn</Text>
                    </TouchableOpacity>
                </View>
                
                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Signup')}>
                    Don't have account? Click here to signup
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

