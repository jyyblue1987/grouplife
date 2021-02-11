import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class MemberProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            user: this.props.route.params.user,
            image_modal_visible: false
        }

        console.log(this.state.user);
    }

    componentDidMount() {
    }

    onShowProfileImage() {
        console.log("onShowProfileImage");
        this.setState({image_modal_visible: true});
    }


    render() {
        var user = this.state.user;
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
                <ScrollView style={{width:'100%', paddingHorizontal: 20}}>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <TouchableOpacity style={{justifyContent: "center"}}
                        onPress = {() => this.onShowProfileImage()}
                        >
                            <FastImage style = {{width: 90, height: 90, borderRadius: 45, borderColor: stylesGlobal.back_color, borderWidth: 2}} source = {{uri:user.picture}}/>
                        </TouchableOpacity>
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
                                    {user.address} {user.address && user.city ? ",," : ""} {user.city}
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    {user.state} {user.country}                                    
                                </Text>
                            </View>    
                        </View>
                    </View>       

                    
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.image_modal_visible}                                                
                        >          
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({image_modal_visible: false})
                            } }>
                            <FastImage style = {{width: '100%', height: '100%'}} source = {{uri:user.picture}}/>
                        </TouchableOpacity>
                        
                    </Modal>
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

    contactPanel: {
        width: 60,
        height: 60,
        backgroundColor: stylesGlobal.back_color,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    }
    
    
});