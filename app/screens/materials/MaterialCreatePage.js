import React, { useState } from 'react';
import {Component} from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';

export default function MaterialCreatePage(props) {

    return (
        <View style={styles.container}>

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
