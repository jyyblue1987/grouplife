import React, { Component, useState, useEffect } from "react";

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { SearchBar } from 'react-native-elements';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import Moment from 'moment';

export default function GroupListPage(props) {

    const [initialize, setInitialize] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [group_list, setGroup_list] = useState([])
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [search, setSearch] = useState("")
  
    useEffect(() => {
        if(!initialize)
            renderRefreshControl();
        setInitialize(true)
    }, [])

    const getMyGroupList = () => {
        var user = firebase.auth().currentUser;
        if( user == null )
        {
            console.log("Invalid User");
            return;    
        }

        var user_id = user.uid;
        console.log("User ID = ", user_id);
        
        firestore.collection("group_list")
            .where("member_list", "array-contains", user_id)
            .get().then((querySnapshot) => {
                var group_list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    data.id = doc.id;

                    group_list.push(data);                    
                });

                setGroup_list(group_list)
                setLoading(false)
            });
    }

    const searchGroupList = (search) => {
        var user = firebase.auth().currentUser;
        if( user == null )
        {
            console.log("Invalid User");
            return;    
        }

        var user_id = user.uid;
        console.log("User ID = ", user_id);

        setLoading(true)
        setGroup_list([])

        firestore.collection("group_list")
            .where('group_name', '>=', search)
            .where('group_name', '<=', search + '~')
            .get().then((querySnapshot) => {
                var group_list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    data.id = doc.id;

                    if( data.member_list == null || data.member_list.includes(user_id) == false )
                    {                        
                        group_list.push(data);
                    }
                });

                setGroup_list(group_list)
                setLoading(false)
            });
    }

    const renderRefreshControl = () => {
        setLoading(true)
        if( isSearchVisible == false )
            getMyGroupList();
        else
            searchGroupList(search);
    }

    const onShowSearch = () => {
        console.log("onShowSearch");
        setIsSearchVisible(true)
        searchGroupList(search);
    }

    const updateSearch = (search) => {        
        setSearch(search)
    }

    const onSubmitSearch = () => {
        console.log("Submit", search);
        searchGroupList(search);
    }

    const onCancelSearch = () => {
        console.log("onCancelSearch");
        setIsSearchVisible(false)
        setSearch('')
        setGroup_list([])

        renderRefreshControl();
    }

    const onClearSearch = () => {
        onSubmitSearch();
    }

    const onCreated = data => {
        console.log("Back to Home", JSON.stringify(data));
        if( data.created == true )
        {
            var doc = {id: data.doc_id};
            onJoinGroup(doc);            
        }
    }

    const onGoCreate = () => {
        if( isSearchVisible )
            onCancelSearch();

        props.navigation.navigate('GroupCreate', { onCreated: onCreated });
    }

    const joinChatRoom = (group) => {

        var messageThreadRef = firestore.collection("MESSAGE_THREADS").doc(group.threadId);
        messageThreadRef.get().then(function(doc) {
            if (doc.exists) 
            {
                var data = doc.data();
                data.member_list = group.member_list;

                let unreadMsgCountData = {
                    _id: firebase.auth().currentUser.uid,
                    count: 0,
                }

                // checking if user is existing in this group
                let isExisted = false
                data?.unread_msg_count_list.forEach( item => {
                    if (item._id == unreadMsgCountData._id) {
                        isExisted = true
                    }
                })

                if (isExisted == false ) {
                    data.unread_msg_count_list.push(unreadMsgCountData)
                }

                messageThreadRef.set(data).then(function(doc) {
                    console.log("succeed joining to group chat room!");
                }).catch(function(error) {
                    console.log("Error joinning message thread:", error);
                });

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    const onJoinGroup = (item) => {
        var groupRef = firestore.collection("group_list").doc(item.id);        
        groupRef.get().then(function(doc) {
            if (doc.exists) 
            {
                var data = doc.data();
                if( data.member_list == null )
                    data.member_list = [];
        
                var user = firebase.auth().currentUser;
                data.member_list.push(user.uid);

                console.log("Document data:", data);
                groupRef.set(data).then(function(doc) {

                    joinChatRoom(data);
                    renderRefreshControl();

                }).catch(function(error) {
                    console.log("Error setting group:", error);
                });                    
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      
    }

    const renderRow = (item) => {
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={() => props.navigation.navigate('GroupDetail', {group: item})}>
                    <View style={{justifyContent: "center"}}>
                        <FastImage style = {{width: 100, height: '100%'}} 
                            source = {{uri: item.group_image}}
                            />
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {item.group_name}
                        </Text>

                        <Text style={{fontSize: 17}}>
                            {item.group_desc}
                        </Text>

                        <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15, marginBottom: 7}} />

                        <View style={{width: '100%',marginTop: 3, flexDirection:'row'}}>
                            <Text
                                style={{fontSize: 16, color:'gray'}}
                                >
                                {Moment(item.created_at).format('dddd LT')}
                            </Text>      
                            {
                                isSearchVisible &&        
                                <TouchableOpacity style = {{width: 60, height: 20, marginLeft: 30, borderRadius: 3, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                                    onPress = {() => onJoinGroup(item)}>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 12}]}>Join</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    return (
        <View style={styles.container}>
            <View style = {{width: '100%', height: 80, justifyContent: 'center'}}>
                <Text
                    style={styles.header}
                    >
                    {isSearchVisible ? 'Search Groups' : 'My Groups'}
                </Text>
            </View>

            {
                isSearchVisible && <SearchBar 
                    placeholder="group..."
                    searchIcon={{size: 28}}
                    containerStyle={stylesGlobal.searchcontainer}                               
                    inputContainerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}                    
                    placeholderTextColor={'gray'}
                    platform="ios"
                    autoCapitalize='none'
                    showCancel={true}
                    onChangeText={updateSearch}
                    onSubmitEditing={onSubmitSearch}                        
                    onCancel={onCancelSearch}
                    onClear={onClearSearch}
                    value={search}
                />
            }

            <FlatList
                data={group_list}
                renderItem={({item}) => renderRow(item)}
                keyExtractor={(item, index) => item.id}
                onRefresh={() => renderRefreshControl()}
                refreshing={isLoading}
                initialNumToRender={8}
            />

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
                    left: 10,
                    backgroundColor:stylesGlobal.back_color,
                    borderRadius:100,
                    }}
                    onPress={() => onGoCreate()}
                >
                <FontAwesome5 name="plus"  size={30} color="#fff" />
            </TouchableOpacity>

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
                    onPress={() => onShowSearch()}
                >
                <FontAwesome5 name="search"  size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
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

