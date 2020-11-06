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
import GroupChatPage from  './app/screens/groups/GroupChatPage';
import MemberListPage from  './app/screens/groups/MemberListPage';
import MemberProfilePage from  './app/screens/profile/MemberProfilePage';
import MyProfileEditPage from  './app/screens/profile/MyProfileEditPage';
import EventListPage from './app/screens/calendar/EventListPage';

const Stack = createStackNavigator();

export default class App extends Component {

    constructor(props) {
        super(props);
        
    }

    componentDidMount() {

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
							title: '',
							headerShown: false,							
						}} 
					/>
					<Stack.Screen name="GroupChatPage" component={GroupChatPage} 
						options={{
							title: 'Chat',
						}} 
					/>
					<Stack.Screen name="MemberList" component={MemberListPage} 
						options={{
							title: 'Group Members',							
						}} 
					/>  

					<Stack.Screen name="MemberProfile" component={MemberProfilePage} 
						options={{
							title: 'Member Profile',							
						}} 
					/>

					<Stack.Screen name="MyProfileEdit" component={MyProfileEditPage} 
						options={{
							title: 'Event Calendar',							
						}} 
					/>     

					<Stack.Screen name="EventList" component={EventListPage} 
						options={{
							title: 'Event Calendar',							
						}} 
					/>    


                </Stack.Navigator>
            </NavigationContainer>

        )
    }
}
