import * as React from 'react';
import {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { stylesGlobal } from '../styles/stylesGlobal';

import GroupListPage from './groups/GroupListPage';
const Tab = createBottomTabNavigator();
  
function NewsPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>News/Social Feed Page!</Text>
        </View>
    );
}

function ProfilePage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profile Page!</Text>
        </View>
    );
}

function NotificationPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Notification Page!</Text>
        </View>
    );
}

function SettingPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Setting Page!</Text>
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
                initialRouteName="GroupList"
                tabBarOptions={{
                    activeTintColor: stylesGlobal.back_color,
                    showLabel: false
                }}
                >
                <Tab.Screen
                    name="GroupList"
                    component={GroupListPage}
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

                <Tab.Screen
                    name="Notification"
                    component={NotificationPage}
                    options={{                    
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="bell" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Setting"
                    component={SettingPage}
                    options={{                    
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="cog" color={color} size={size} />
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