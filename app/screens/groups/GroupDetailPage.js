import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class GroupDetailPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    UNSAFE_componentWillMount() {
    }

    getGroupList() {
        this.setState({
            isLoading: false
        })
    }


    render() {
  
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 35,
        paddingHorizontal: 10,
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    }
    
});