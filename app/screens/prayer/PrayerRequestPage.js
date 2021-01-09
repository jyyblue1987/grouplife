import React, { useEffect, useState } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';

export default function PrayerRequestPage(props) {
    const group = props.route.params.group;    

    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        console.log("useEffect");
        refreshList();
    }, []);

    const refreshList = async() => {
        
    }

    return (
        <View style={styles.container}>
            {                
                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:70,
                        height:70,
                        position: 'absolute',                                          
                        bottom: 20,                                                    
                        right: 20,
                        backgroundColor:stylesGlobal.back_color,
                        borderRadius:100,
                        }}                        
                        onPress={() => onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
            }

            {
                isLoading && <View style={stylesGlobal.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            }
        </View>
    );
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});