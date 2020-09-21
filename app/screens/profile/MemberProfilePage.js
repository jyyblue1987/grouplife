import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-material-ui';

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
                <ScrollView style={{width:'100%', paddingHorizontal: 20}}>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <View style={{justifyContent: "center"}}>
                            <Image style = {{width: 90, height: 90, borderRadius: 45, borderColor: stylesGlobal.back_color, borderWidth: 2}} source = {require("../../assets/images/group_image.jpg")}/>
                        </View>
                        <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                Michael Snow
                            </Text>

                            <Text style={{fontSize: 17}}>
                                Group Leader
                            </Text>
                        </View>    
                    </View>

                    <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray'}} />

                    <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
                        About Me
                    </Text>    
                    <Text style={{fontSize: 17, marginTop: 5}}>
                        <Text>I have been involved with small groups for almost 15 years. I love running, hiking, and meeting new people.</Text>
                        <Text style={{fontWeight: 'bold', color: stylesGlobal.back_color}}>   Read More</Text>
                    </Text>                      

                    <View style={{container: {borderRadius: 10}, marginTop: 30}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18, marginTop: 10}}>
                            Contact Info
                        </Text>
                        {/* Email */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={{justifyContent: "center"}}>
                                <Image style = {{width: 60, height: 60}} source = {require("../../assets/images/group_image.jpg")}/>
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Email Address
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    jason.lowe@gmail.com
                                </Text>
                            </View>    
                        </View>

                        {/* Email */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={{justifyContent: "center"}}>
                                <Image style = {{width: 60, height: 60}} source = {require("../../assets/images/group_image.jpg")}/>
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Phone
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    313-31303131
                                </Text>
                            </View>    
                        </View>

                        {/* Email */}
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                            <View style={{justifyContent: "center"}}>
                                <Image style = {{width: 60, height: 60}} source = {require("../../assets/images/group_image.jpg")}/>
                            </View>
                            <View style={{width:'100%', marginLeft: 10, paddingVertical: 9}}>
                                <Text style={{fontSize: 20, color:'gray'}}>
                                    Address
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    123 Main Street
                                </Text>
                                <Text style={{fontSize: 17}}>
                                    Detroit, Mi
                                </Text>
                            </View>    
                        </View>
                    </View>                 
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