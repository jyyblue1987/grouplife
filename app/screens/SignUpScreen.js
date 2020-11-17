import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from '../../database/firebase';
import {firestore} from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';
import Moment from 'moment';

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

    componentDidMount() {
        
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

        var vm = this;

        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( (res) => {   
                res.user.updateProfile({
                    displayName: this.state.displayName
                });

                console.log('User registered successfully!');                
                
                // create member
                var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
                var data = {
                    user_id: res.user.uid,
                    first_name: this.state.displayName,
                    last_name: '',
                    picture: '',
                    email: this.state.email,
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    country: '',
                    desc: '',
                    role: 'Member',
                    created_at: cur_time,     
                    created_by: res.user.uid,               
                };

                firestore.collection("member_list").add(data).then(function(docRef) {
                    console.log("User is created with ID:", docRef.id);

                    vm.setState({
                        isLoading: false,
                        displayName: '',
                        email: '',
                        password: ''
                    });
    
                    vm.props.navigation.navigate('Signin');                    
                }).catch(function(error) {
                    vm.setState({
                        isLoading: false,                       
                    });
                    Alert.alert(error.message);
                });

                
            })
            .catch(error => {
                this.setState({
                        isLoading: false,
                        errorMessage: error.message
                    });
                Alert.alert(error.message);
            }) 
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

