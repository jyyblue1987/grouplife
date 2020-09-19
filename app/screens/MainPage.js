import * as React from 'react';
import {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';

const Tab = createBottomTabNavigator();

function GroupHomePage() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>GroupHomePage!</Text>
      </View>
    );
}
  
function NewsPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>News/Social Feed!</Text>
        </View>
    );
}

function ProfilePage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ProfilePage!</Text>
        </View>
    );
}

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    render() {
       
        return (           
            <Tab.Navigator
                initialRouteName="Home"
                tabBarOptions={{
                    activeTintColor: stylesGlobal.back_color,
                    showLabel: false
                }}
                >
                <Tab.Screen
                    name="Group"
                    component={GroupHomePage}
                    options={{                    
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="home" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="News"
                    component={NewsPage}
                    options={{                    
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="compass" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfilePage}
                    options={{                    
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="user" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
           
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