import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

import { stylesGlobal } from '../../styles/stylesGlobal';

export default class MemberProfielPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            group: this.props.route.params.group
        }

        console.log(this.state.group);
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
                <ScrollView style={{width:'100%'}}>
                    
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingBottom: 35,        
    }, 
    
    
});