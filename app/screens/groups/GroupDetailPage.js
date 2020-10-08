import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import LinearGradient from 'react-native-linear-gradient';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';

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
        this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    }


    init_data = async() => {
        console.log("Group Detail Init Data", JSON.stringify(this.state.group));

        var member_count = 0;
        if( this.state.group.member_list != null )
            member_count = this.state.group.member_list.length;

        this.setState({
            member_count: member_count,
        });
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
                    <View style={{width: '100%', height: 300}}>                        
                        <FastImage style = {{width: '100%', height: '100%'}} source = {{uri:this.state.group.group_image}}>                       
                        </FastImage>
                        <LinearGradient colors={["black", "transparent"]} style={styles.linearGradient}>
                        </LinearGradient>                 
                        <View style={{width:'100%', flexDirection:'row', alignItems: 'center', position: 'absolute', paddingVertical: 9, bottom: 0, backgroundColor: stylesGlobal.back_color}}>
                            <FontAwesome5 name="calendar" size={22} color={'#fff'} style={{marginLeft: 15}} />
                            <Text style={{marginLeft: 10, color: '#fff'}}>Next group meeting in 2 days, 3 hours</Text>
                        </View>
                        <TouchableOpacity style={{position: 'absolute', left: 20, top: 45}}
                            onPress={() => this.props.navigation.goBack()}
                            >
                            <Ionicons name="arrow-back" size={30} color={'#fff'} />
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 22}}>
                            {this.state.group.group_name}
                        </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Text style={{flex:1, fontSize: 16}}>{this.state.group.group_desc}</Text>
                            <View style={{flex:1, flexDirection: 'row', alignItems: 'center', fontSize: 16}}>
                                <FontAwesome5 name="user" size={18} color={stylesGlobal.back_color} style={{marginLeft: 15}} />
                                <Text style={{marginLeft: 15, fontSize: 16}}
                                onPress={() => this.props.navigation.navigate('MemberList', {group: this.state.group})}
                                >
                                {this.state.member_count}   Members
                                </Text>
                            </View>                        
                        </View>

                        <Text style={{fontSize: 15, color: '#383838B2'}}>                            
                            {Moment(this.state.group.created_at).format('dddd LT')}
                        </Text>
                    </View>

                    {/* Overview */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <Ionicons name="ios-information-circle-outline" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Overview</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Group Chat */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <Entypo name="chat" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Group Chat</Text>
                            <View style={{width: 28, height: 28, borderRadius: 14, position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 10, backgroundColor:'#0AB97A'}}>
                                <Text style={{color:'white', fontSize: 17}}>2</Text>
                            </View>                        
                        </TouchableOpacity>
                    </Card>

                    {/* Material */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <FontAwesome5 name="book-open" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Materials</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Group Poll */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <Fontisto name="checkbox-active" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Group Poll</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Group Poll */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <MaterialIcons name="schedule" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Schedule</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Prayer Requests */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <MaterialIcons name="schedule" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Prayer Requests</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Testimonials */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <MaterialIcons name="schedule" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Testimonials</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Freedback */}
                    <Card style={{container: {borderRadius: 10}}}>
                        <TouchableOpacity style={styles.cardButtonStyle}>
                            <MaterialIcons name="schedule" size={22} color={stylesGlobal.back_color} />
                            <Text style={styles.textStyle}>Freedback</Text>
                        </TouchableOpacity>
                    </Card>
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
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    textStyle: {
        marginLeft: 18,
    },
    linearGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0
    },

    cardButtonStyle: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10, 
        paddingVertical: 15
    }

    
    
});