import React, {useEffect, useState } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Alert} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { stylesGlobal } from '../../styles/stylesGlobal';

import firebase from '../../../database/firebase';



export default function SettingPage(props) {
    const [isLoading, setLoading] = useState(false);

    const onUserLogout = async() => {
        Alert.alert(
            'Setting',
            'Are you sure to sign out?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => userLogout() }
                ],
                { cancelable: false }
            );
    }

    const userLogout = async() => {
        setLoading(true);
        try {
            await firebase.auth().signOut();
            setLoading(false);

            const action = CommonActions.reset({
                index: 0,
                routes: [{ name: "Signin" }]
            });
    
            props.navigation.dispatch(action);
        } catch(e) {
            setLoading(false);
            Alert.alert(e.message);
        }        
    }

    return (
        <View style={[styles.container, { justifyContent: 'flex-end' }]}>            
            {
                isLoading && <View style={stylesGlobal.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            }
            <View style = {{width: '100%', alignItems: 'center', marginBottom: 50}}>
                <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                    onPress = {() => onUserLogout()}>
                    <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",        
        backgroundColor: '#fff'
    },

    
  });