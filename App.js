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

import {stylesGlobal} from './app/styles/stylesGlobal';
import SignInScreen from  './app/screens/SignInScreen';
import SignUpScreen from  './app/screens/SignUpScreen';
import MainPage from  './app/screens/MainPage';
import GroupCreatePage from  './app/screens/groups/GroupCreatePage';
import GroupDetailPage from  './app/screens/groups/GroupDetailPage';

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
                    initialRouteName = "Signin"
                    screenOptions={
						({ route }) => (
							stylesGlobal.header_bar
						)
					}                    
                >
                    <Stack.Screen name="Signin" component={SignInScreen} options={{title: 'Login'}} />
					<Stack.Screen name="Signup" component={SignUpScreen} options={{title: 'Signup'}} />                   
					<Stack.Screen name="Main" component={MainPage} 
						options={{							
							headerShown: false
						}} 
					/>            
					<Stack.Screen name="GroupCreate" component={GroupCreatePage} 
						options={{
							title: 'Create Group',							
						}} 
					/>     
					<Stack.Screen name="GroupDetail" component={GroupDetailPage} 
						options={{
							title: 'Group Home',							
						}} 
					/>      
                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}
