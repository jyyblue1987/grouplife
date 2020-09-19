/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {Component} from "react";

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from  './app/screens/SignInScreen';

const Stack = createStackNavigator();

export default class App extends Component {

    constructor(props) {
        super(props);
        
    }

    UNSAFE_componentWillMount() {

    }

    render() {
        return(
            <NavigationContainer>
                <Stack.Navigator 
                    initialRouteName = "SignInScreen"
                    screenOptions={({ route }) => ({
                        headerShown: false
                    })}
                    headerMode="none"
                >
                    <Stack.Screen name="SignInScreen" component={SignInScreen} />                   
                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}
