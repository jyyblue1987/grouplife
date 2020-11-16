import React, { Component, useState, useEffect } from "react";

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import LinearGradient from 'react-native-linear-gradient';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import { firestore, storage} from '../../../database/firebase';
import {
    useFocusEffect
   } from '@react-navigation/native';
  

export default function GroupDetailPage(props) {

    const [initialize, setInitialize] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [member_count, setMemberCount] = useState(0)
    const [group, setGroup] = useState(props.route.params.group)
    const [isMember, setIsMember] = useState(false)
    const [unreadMessage, setUnreadMessage] = useState(0)
    const [editFlag, setEditFlag] = useState(false)

    useFocusEffect(() => {
        if(initialize) {
            return;
        }
        setInitialize(true)

        init_data();
        let uid = firebase.auth().currentUser.uid
        
        const subscriber = firestore
            .collection('MESSAGE_THREADS')
            .doc(group?.threadId)
            .onSnapshot(documentSnapshot  => {
                const data = documentSnapshot.data()

                console.log('setUnreadMessage');
                
                let myUnreadMsgCountData = data?.unread_msg_count_list.find( item => item._id == uid)
                setUnreadMessage(myUnreadMsgCountData?.count == undefined ? 0: myUnreadMsgCountData?.count)
            })
    
        return () => subscriber()

      }, [])
  
      
    // componentDidMount() {
    //     this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    // }

    const init_data = () => {
        console.log("Group Detail Init Data", JSON.stringify(group));
        
        let uid = firebase.auth().currentUser.uid;
        let member_count = 0;
        let isMember = false;
        
        setEditFlag(uid == group.created_by);

        if( group.member_list != null ) {
            member_count = group.member_list.length;

            group?.member_list?.forEach(userid => {
                
                if (userid == uid ) {
                    isMember = true
                }
            });
        }

        // getUnreadMessageCount()   // only when enter from grup page not but chat page

        setMemberCount(member_count)
        setIsMember(isMember)
    }

    const onPressGroupChat = () => {
        if (!isMember) {
            alert("You are not a member of this group. Please join to this group")
            return
        }
        props.navigation.navigate('GroupChatPage', {group: group})
    }

    const onCreated = () => {
        console.log("onCreated");
    }

    const onUpdated = (data) => {
        var new_data = {... group, ...data.data};
        console.log("Updated Detail", JSON.stringify(new_data));
        setGroup(new_data);

        let member_count = new_data.member_list.length;
        console.log("New Member Count", member_count);
        setMemberCount(member_count);
    }

    const onGoEdit = () => {        
        props.navigation.navigate('GroupCreate', {group: group, onUpdated: onUpdated});
    }

    return (
        <View style={styles.container}>
            {
                isLoading && <View style={stylesGlobal.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            }
            <ScrollView style={{width:'100%'}}>
                <View style={{width: '100%', height: 300}}>                        
                    <FastImage style = {{width: '100%', height: '100%'}} source = {{uri: group.group_image}}>                       
                    </FastImage>
                    <LinearGradient colors={["black", "transparent"]} style={styles.linearGradient}>
                    </LinearGradient>                 
                    <View style={{width:'100%', flexDirection:'row', alignItems: 'center', position: 'absolute', paddingVertical: 9, bottom: 0, backgroundColor: stylesGlobal.back_color}}>
                        <FontAwesome5 name="calendar" size={22} color={'#fff'} style={{marginLeft: 15}} />
                        <Text style={{marginLeft: 10, color: '#fff'}}>Next group meeting in 2 days, 3 hours</Text>
                    </View>
                    <TouchableOpacity style={{position: 'absolute', left: 20, top: 45}}
                        onPress={() => props.navigation.goBack()}
                        >
                        <Ionicons name="arrow-back" size={30} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={{paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 22}}>
                        {group.group_name}
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                        <Text style={{flex:1, fontSize: 16}}>{group.group_desc}</Text>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', fontSize: 16}}>
                            <FontAwesome5 name="user" size={18} color={stylesGlobal.back_color} style={{marginLeft: 15}} />
                            <Text style={{marginLeft: 15, fontSize: 16}}
                            onPress={() => props.navigation.navigate('MemberList', {group: group, onUpdated: onUpdated})}
                            >
                            {member_count}   Members
                            </Text>
                        </View>                        
                    </View>

                    <Text style={{fontSize: 15, color: '#383838B2'}}>                            
                        {Moment(group.created_at).format('dddd LT')}
                    </Text>
                </View>

                {/* Overview */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}>
                        <Ionicons name="ios-information-circle-outline" size={22} style={styles.iconStyle}/>
                        <Text style={styles.textStyle}>Overview</Text>
                    </TouchableOpacity>
                </Card>

                {/* Group Chat */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle} onPress={()=> onPressGroupChat()}>
                        <Entypo name="chat" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Group Chat</Text>

                        {unreadMessage != 0 &&
                            <View style={{width: 28, height: 28, borderRadius: 14, position: 'absolute', justifyContent: 'center', alignItems: 'center', right: 10, backgroundColor:'#0AB97A'}}>
                                <Text style={{color:'white', fontSize: 17}}>{unreadMessage}</Text>
                            </View>                        
                        }
                    </TouchableOpacity>
                </Card>

                {/* Material */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}>
                        <FontAwesome5 name="book-open" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Materials</Text>
                    </TouchableOpacity>
                </Card>

                {/* Schedule */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}
                        onPress={() => props.navigation.navigate('EventList', {group: group})}
                        >
                        <FontAwesome name="calendar" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Calendar</Text>
                    </TouchableOpacity>
                </Card>

                {/* Prayer Requests */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}                    
                    >
                        <MaterialIcons name="schedule" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Prayer Requests</Text>
                    </TouchableOpacity>
                </Card>

                {/* Testimonials */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}>
                        <MaterialIcons name="schedule" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Testimonials</Text>
                    </TouchableOpacity>
                </Card>

                {/* Freedback */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}>
                        <MaterialIcons name="schedule" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Freedback</Text>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
            {
                editFlag &&
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
        paddingBottom: 35,        
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    textStyle: {
        marginLeft: 18,
    },

    iconStyle: {
        width: 25,  
        color: stylesGlobal.back_color  
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