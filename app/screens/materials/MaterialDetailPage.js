import React, { useState, useEffect } from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';
import { Card } from 'react-native-material-ui';
import { stylesGlobal } from '../../styles/stylesGlobal';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';


export default function MaterialDetailPage(props) {
    const [isUploading, setUploading] = useState(false)

    const group = props.route.params.group;
    const material = props.route.params.material;
    const isAdmin = firebase.auth().currentUser.uid == group.created_by;

    useEffect(() => {
        console.log("MaterialDetailPage Enter");
        
        var title = Moment(material.created_at).format('MMM D') + "th - " + material.title;
        props.navigation.setOptions({title: title});

    }, []);

    const onGoEdit = () => {
        console.log("onGoEdit");

    }

    const onDownloadFile = () => {

    }

    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                {
                    material.type == 1 &&  
                    <View style={{height: '100%'}}>                        
                        <WebView 
                            originWhitelist={['*']}
                            source={{ html: material.content }}                                         
                        />
                    </View> 
                }
                
                {
                    material.type == 2 &&
                    <View>
                        <Card style={{container: {borderRadius: 5, height: 40, paddingHorizontal: 10, justifyContent: 'center'}}}
                            onPress={() => onDownloadFile()}
                            >
                            <Text style={styles.link}>{material.filename}</Text>
                        </Card>

                        <View style={{height: '100%', marginTop: 5}}> 
                            <WebView 
                                originWhitelist={['*']}
                                source={{ uri: material.content }}                                         
                            />
                        </View>
                    </View>
                }
                

            </View>

            {
                isUploading && <View style={stylesGlobal.preloader}>
                    <Progress.Bar progress={upload_progress} width={200} />
                </View>
            } 

            {
                isAdmin &&
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
                        onPress={() => onGoEdit()}
                    >
                    <FontAwesome5 name="edit"  size={30} color="#fff" />
                </TouchableOpacity>
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

    link: {
        fontSize: 17,
        color: stylesGlobal.back_color,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: stylesGlobal.back_color,
    }
});