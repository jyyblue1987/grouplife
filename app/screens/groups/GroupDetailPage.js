import React, { Component, useState, useEffect } from "react";

import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
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
  
import LeaderListComponent from './LeaderListComponent';


export default function GroupDetailPage(props) {

    const [initialize, setInitialize] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [member_count, setMemberCount] = useState(0)
    const [member_list, setMemberList] = useState([])
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

      })
  
      
    // componentDidMount() {
    //     this.initListener = this.props.navigation.addListener('focus', this.init_data.bind(this));
    // }

    const init_data = async() => {
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

        var ref = await firestore.collection("group_list")
            .doc(group.id)
            .collection("candidate_list")
            .get();

        member_count += ref.docs.length;

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

    const onPressMaterial = () => {
        console.log("onPressMaterial");
        if (!isMember) {
            alert("You are not a member of this group. Please join to this group")
            return
        }

        props.navigation.navigate('MaterialList', {group: group})
    }

    const onPressPrayer = () => {
        console.log("onPressPrayer");
        if (!isMember) {
            alert("You are not a member of this group. Please join to this group")
            return
        }

        props.navigation.navigate('PrayerRequest', {group: group})
    }


    const onPressTestimony = () => {
        console.log("onPressTestimony");
        if (!isMember) {
            alert("You are not a member of this group. Please join to this group")
            return
        }

        props.navigation.navigate('TestimonyList', {group: group})
    }

    const onCreated = () => {
        console.log("onCreated");
    }

    const onUpdated = async(data) => {
        var new_data = {... group, ...data.data};
        console.log("Updated Detail", JSON.stringify(new_data));
        setGroup(new_data);

        let member_count = new_data.member_list.length;

        var ref = await firestore.collection("group_list")
            .doc(group.id)
            .collection("candidate_list")
            .get();

        member_count += ref.docs.length;

        console.log("New Member Count", member_count);
        setMemberCount(member_count);
    }

    const onGoEdit = () => {        
        props.navigation.navigate('GroupCreate', {group: group, onUpdated: onUpdated});
    }

    const onLeaveGroup = () => {

        Alert.alert(
            'Leave Group',
            'Are you sure to leave this group "' + group.group_name + '"?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => leaveGroup() }
                ],
                { cancelable: false }
            );
    }

    const leaveGroup = () => {
        console.log("leaveGroup");

        let uid = firebase.auth().currentUser.uid

        firestore.collection('group_list')
            .doc(group.id)
            .get()
            .then(doc  => {
                const group_data = doc.data();     
               
                console.log("Old Membmer List", JSON.stringify(group_data.member_list));

                var member_list = group_data.member_list.filter((item) => item != uid);
                console.log("New Membmer List", JSON.stringify(member_list));

                updateMember(group, member_list);

            });

    }

    const updateMember = (group, member_list) => {
        console.log('updateMember');
        var vm = this;
        firestore.collection("group_list")
            .doc(group.id)
            .update({member_list: member_list})
            .then(function() {
                console.log("You did leave group successfully");

                const { navigation, route } = props;
                navigation.goBack();
                route.params.onRefresh();
            });
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
                    <View style={{ marginTop: 10}}>
                        <Text style={{fontSize: 16}}>{group.group_desc}</Text>                      
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', fontSize: 16, marginTop: 15}}>
                        <FontAwesome5 name="user" size={18} color={stylesGlobal.back_color} />
                        <Text style={{marginLeft: 15, fontSize: 16}}
                        onPress={() => props.navigation.navigate('MemberList', {group: group, onUpdated: onUpdated})}
                        >
                        {member_count}   Members
                        </Text>
                    </View>                        

                    <Text style={{fontSize: 15, color: '#383838B2', marginTop: 15}}>                            
                        {Moment(group.meeting_time).format('dddd LT')}
                    </Text>

                    <LeaderListComponent leader_list={group.leader_list} />

                </View>

                {/* Overview */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}>
                        <Ionicons name="ios-information-circle-outline" size={22} style={styles.iconStyle}/>
                        <Text style={styles.textStyle}>Overview</Text>
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

                {/* Material */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle} onPress={() => onPressMaterial() }>
                        <FontAwesome5 name="book-open" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Materials</Text>
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

                {/* Prayer Requests */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle} 
                        onPress={() => onPressPrayer() }                  
                    >                        
                        <Image style = {{width: 24, height: 22, tintColor: stylesGlobal.back_color}} source = {require("../../assets/images/pray_selected.png")}/>                        
                        <Text style={styles.textStyle}>Prayer Requests</Text>

                    </TouchableOpacity>
                </Card>

                {/* Testimonials */}
                <Card style={{container: {borderRadius: 10}}}>
                    <TouchableOpacity style={styles.cardButtonStyle}
                        onPress={() => onPressTestimony()}
                        >
                        <MaterialIcons name="schedule" size={22} style={styles.iconStyle} />
                        <Text style={styles.textStyle}>Testimonials</Text>
                    </TouchableOpacity>
                </Card>

                {/* Leave Group Button */}
                {
                    isMember && 
                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                        <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} 
                            onPress = {() => onLeaveGroup()}>
                            <Text style = {[stylesGlobal.general_font_style, {color: stylesGlobal.back_color, fontSize: 16, fontWeight: 'bold'}]}>Leave Group</Text>
                        </TouchableOpacity>
                    </View>
                }


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