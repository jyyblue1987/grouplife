import React, { useState, useEffect } from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { WebView } from 'react-native-webview';
import { Card } from 'react-native-material-ui';
import * as Progress from 'react-native-progress';

import { stylesGlobal } from '../../styles/stylesGlobal';

import RNFS from 'react-native-fs';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';
import Share from 'react-native-share';

export default function MaterialDetailPage(props) {
    const [isDownloading, setDownloading] = useState(false)
    const [download_progress, setDownloadProgress] = useState(0)
    const [material, setMaterial] = useState(props.route.params.material);

    const group = props.route.params.group;    
    const isAdmin = firebase.auth().currentUser.uid == group.created_by;

    useEffect(() => {
        console.log("MaterialDetailPage Enter");
        
        var title = Moment(material.created_at).format('MMM D') + "th - " + material.title;
        props.navigation.setOptions({title: title});

    }, []);

    const onRefresh = data => {
        const { navigation, route } = props;

        route.params.onRefresh({ created: true });     
        console.log("Updated Material", data);

        setMaterial(data.data);
    }

    const onGoEdit = () => {
        console.log("onGoEdit");

        props.navigation.navigate('MaterialEdit', { group: group, material: material, onRefresh: onRefresh });
    }

    const onDownloadFile = () => {
        local_path = `${RNFS.DocumentDirectoryPath}/` + material.filename + '.' + material.filetype;
        console.log("Start Download", local_path);

        RNFS.downloadFile({
            fromUrl: material.content,
            toFile: local_path,
            //headers
            background: true, // Continue the download in the background after the app terminates (iOS only)**
            discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
            cacheable: true, // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)**
        
            begin: (res) => {
                console.log("Response begin ===\n\n");
                console.log(res);
                setDownloading(true);
            },
            progress: (res) => {
                let progress = res.bytesWritten / res.contentLength;
                setDownloadProgress(progress);
            }
          }).promise.then((r) => {
            console.log("Download is done", r);
            setDownloading(false);
            shareFile(local_path)
          });
    }

    const shareFile = (path) => {
        Share.open({
            url: path,            
          });
    }

    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <Text style={[styles.title, {}]}>
                    {material.title}
                </Text>
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
                isDownloading && <View style={stylesGlobal.preloader}>
                    <Progress.Bar progress={download_progress} width={200} />
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
    },

    title: {
        fontSize: 17,
        color: stylesGlobal.back_color,
        marginBottom: 15,
        marginHorizontal: 10,     
    }
});