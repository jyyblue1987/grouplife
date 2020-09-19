import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class GroupListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    UNSAFE_componentWillMount() {
        
    }

    


    render() {
  
        return (
            <View style={styles.container}>
                

                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:70,
                        height:70,
                        position: 'absolute',                                          
                        bottom: 10,                                                    
                        right: 10,
                        backgroundColor:stylesGlobal.back_color,
                        borderRadius:100,
                        }}
                        onPress={() => this.props.navigation.navigate('GroupCreate')}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 35,
    },   
    
  });

