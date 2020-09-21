import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-material-ui';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class GroupDetailPage extends Component {
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

                <View style={{width: '100%', height: 300}}>                    
                    <Image style = {{width: '100%', height: '100%'}} source = {require("../../assets/images/group_image_detail.jpg")}/>
                    <View style={{width:'100%', flexDirection:'row', alignItems: 'center', position: 'absolute', paddingVertical: 9, bottom: 0, backgroundColor: stylesGlobal.back_color}}>
                        <FontAwesome5 name="calendar" size={22} color={'#fff'} style={{marginLeft: 15}} />
                        <Text style={{marginLeft: 10, color: '#fff'}}>Next group meeting in 2 days, 3 hours</Text>
                    </View>
                    <TouchableOpacity style={{position: 'absolute', left: 20, top: 45}}>
                        <Ionicons name="arrow-back" size={30} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={{paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 22}}>
                        Downdown Group
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                        <Text style={{flex:1, fontSize: 16}}>Woodside Detroit</Text>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', fontSize: 16}}>
                            <FontAwesome5 name="user" size={18} color={stylesGlobal.back_color} style={{marginLeft: 15}} />
                            <Text style={{marginLeft: 15, fontSize: 16}}>31 Members</Text>
                        </View>                        
                    </View>

                    <Text style={{fontSize: 15, color: '#383838B2'}}>
                        Monday's, 6:30 PM
                    </Text>
                </View>

                

                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10}}>
                        <Ionicons name="ios-information-circle-outline" size={22} color={stylesGlobal.back_color} />
                        <Text style={styles.textStyle}>Overview</Text>
                    </TouchableOpacity>
                </Card>
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
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    textStyle: {
        marginLeft: 18,
    }

    
    
});