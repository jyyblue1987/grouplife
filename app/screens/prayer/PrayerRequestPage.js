import React, { useEffect, useState } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-material-ui';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';

export default function PrayerRequestPage(props) {
    const group = props.route.params.group;    

    const [isLoading, setLoading] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const [message, setMessage] = useState("");


    useEffect(() => {
        console.log("useEffect");
        refreshList();
    }, []);

    const refreshList = async() => {
        
    }

    const onGoCreate = () => {
        setAdding(true);
        setMessage("");
    }


    const onAddRequest = async() => {
        setAdding(false);
        console.log("Message", message);
    }


    return (
        <View style={styles.container}>
            {
                isAdding &&
                <Card style={{container: {borderRadius: 5, padding: 10, justifyContent: 'center'}}}                
                    >
                    <Text style={{fontSize: 16}}>Add Prayer Request</Text>

                    <TextInput
                        style={[stylesGlobal.inputStyle, {height:80, marginTop: 20, marginBottom: 0}]}
                        placeholder="Please write a request here..."                            
                        multiline={true}
                        autoCapitalize = 'none'
                        value={message}
                        onChangeText={(val) => setMessage(val)}
                        />

                    <TouchableOpacity style = {{backgroundColor: stylesGlobal.back_color, width: 80, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginTop: 5, padding: 5}} 
                        onPress = {() => onAddRequest()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Save</Text>
                    </TouchableOpacity>
                </Card>
            }
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