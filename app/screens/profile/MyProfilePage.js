import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {Button, Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';

export default class MyProfielPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,  
            user: {},
        }

    }

    componentDidMount() {
        this.getProfile();
    }

    getProfile() {
        this.setState({                    
            isLoading: true,
        });
        var uid = firebase.auth().currentUser.uid;
        firestore.collection("member_list")
            .where("user_id", "==", uid)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    data.id = doc.id;
                    this.setState({user: data});                    
                });

                this.setState({                    
                    isLoading: false,
                });
            }); 
    }

    onEditProfile = () => {
        this.props.navigation.navigate('MyProfileEdit', {user: this.state.user, onUpdated: this.onUpdated});
    }

    onUpdated = data => {
        console.log("Back to Home", JSON.stringify(data));
        if( data.updated == true )
        {
            this.getProfile();
        }
    }


    render() {
        var user = this.state.user;
        return (
            <View style={styles.container}>
                <ScrollView style={{width:'100%', paddingHorizontal: 20}}>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <View style={{justifyContent: "center"}}>
                            <FastImage style = {{width: 90, height: 90, borderRadius: 45, borderColor: stylesGlobal.back_color, borderWidth: 2}} source = {{uri:user.picture}}/>
                        </View>
                        <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                {this.state.user.first_name} {user.last_name}
                            </Text>

                            <Text style={{fontSize: 17}}>
                                {user.role}
                            </Text>
                        </View>    
                        
                    </View>

                    <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray'}} />

                    <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
                        About Me
                    </Text>    
                    <Text style={{fontSize: 17, marginTop: 5}}>
                        <Text>{user.desc}</Text>
                        <Text style={{fontWeight: 'bold', color: stylesGlobal.back_color}}>   Read More</Text>
                    </Text>                      

                    <View style={{container: {borderRadius: 10}, marginTop: 30}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
                            Contact Info
                        </Text>
                        {/* Email */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={styles.contactPanel}>
                                <Fontisto name="email" size={25} color='white' />
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Email Address
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    {user.email}
                                </Text>
                            </View>    
                        </View>

                        {/* Phone */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={styles.contactPanel}>
                                <Fontisto name="mobile" size={25} color='white' />
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Phone
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    {user.phone}
                                </Text>
                            </View>    
                        </View>

                        {/* Address */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={styles.contactPanel}>
                                <Ionicons name="location" size={25} color='white' />
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Address
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    {user.address}, {user.city}
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    {user.state} {user.country}                                    
                                </Text>
                            </View>    
                        </View>                        
                    </View>                 
                </ScrollView>
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
                        onPress={() => this.onEditProfile()}
                    >
                    <FontAwesome5 name="edit"  size={30} color="#fff" />
                </TouchableOpacity>
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
    }, 

    contactPanel: {
        width: 60,
        height: 60,
        backgroundColor: stylesGlobal.back_color,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    }
});