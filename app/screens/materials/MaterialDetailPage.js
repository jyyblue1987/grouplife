import React, { useState, useEffect } from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { stylesGlobal } from '../../styles/stylesGlobal';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';

export default function MaterialDetailPage(props) {
    const [isUploading, setUploading] = useState(false)

    const group = props.route.params.group;

    useEffect(() => {
        console.log("MaterialDetailPage Enter");
        
    }, []);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{width:'100%'}}>
                    

            </KeyboardAwareScrollView>

            {
                isUploading && <View style={stylesGlobal.preloader}>
                    <Progress.Bar progress={upload_progress} width={200} />
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
    }
});