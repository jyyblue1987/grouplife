import React, { useEffect, useState } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList, Alert } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Card } from 'react-native-material-ui';
import FastImage from 'react-native-fast-image';

import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';
const GLOBAL = require('../../Globals');

export default function TestimonyListPage(props) {
    const group = props.route.params.group;    
    const user = firebase.auth().currentUser;

    const [isLoading, setLoading] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [comment, setComment] = useState("");
    const [testimony_list, setTestimonyList] = useState([]);


    useEffect(() => {
        console.log("useEffect");
        refreshList();
    }, []);

    const refreshList = async() => {
        setLoading(true);

        var ref = await firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.TESTIMONY_REQUEST)
            .orderBy('created_at', 'desc')
            .get();

        var list = [];
        for(const doc of ref.docs)
        {
            var data = doc.data();
            data._id = doc.id;       
            
            var testimony_ref = firestore.collection(GLOBAL.GROUP_LIST)
                .doc(group.id)
                .collection(GLOBAL.TESTIMONY_REQUEST)
                .doc(doc.id);

            testimony_collection = await testimony_ref.collection(GLOBAL.TESTIMONY_LIST)
                .get();

            data.like_count = testimony_collection.docs.length;

            testimony_self_collection = await testimony_ref.collection(GLOBAL.TESTIMONY_LIST)
                                    .where("user_id", "==", user.uid)
                                    .get();
            data.like_self_count = testimony_self_collection.docs.length;

            comment_collection = await testimony_ref.collection(GLOBAL.COMMENT_LIST)
                .get();

            data.comment_count = comment_collection.docs.length;
            data.comment_open = false;

            list.push(data);
        }

        setTestimonyList(list);

        setLoading(false);
    }

    const onGoCreate = () => {
        setAdding(true);
        setMessage("");
    }


    const onAddRequest = async() => {
        console.log("Message", message);
        setLoading(true);

        var data = {};

        data.message = message;
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        data.created_at = cur_time;
        data.created_by = user.uid;

        var ref = await firestore.collection("member_list")
            .where("user_id", "==", user.uid)
            .get();

        var member = undefined;
        for(const doc of ref.docs)
        {
            var data1 = doc.data();
            member = data1;
            break;
        }

        data.member = member;

        await firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.TESTIMONY_REQUEST)
            .add(data);

        await refreshList();

        setAdding(false);
        setLoading(false); 
    }

    const onDeleteRequest = (item) => {
        Alert.alert(
            'Delete Request',
            'Are you sure to delelet this testimony request?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => deleteRequest(item) }
                ],
                { cancelable: false }
            );
    }

    const deleteRequest = async(item) => {
        if( item.created_by != user.uid )
            return;

        try {
            await firestore.collection(GLOBAL.GROUP_LIST)
                .doc(group.id)
                .collection(GLOBAL.TESTIMONY_REQUEST)
                .doc(item._id)              
                .delete();

            await refreshList(item);

        } catch(e) {
            console.og
        }
    }

    const onPressLike = async(item) => {
        var ref = firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.TESTIMONY_REQUEST)
            .doc(item._id)
            .collection(GLOBAL.TESTIMONY_LIST);

        try {
            var list = await ref.where("user_id", "==", user.uid)
                .get();
            
            if( list.docs.length < 1 )
            {
                // Add Testimony
                console.log("Not Exists");
                // not pray
                await ref.add({user_id: user.uid});                
                item.like_count++;
                item.like_self_count++;
            }
            else
            {
                // Remove Prayer                
                console.log("Exists");

                for(const doc of list.docs)
                {
                    await ref.doc(doc.id).delete();                          
                    item.like_self_count--;

                }                
                item.like_count--;                
            }
        } catch(e) {
            console.log("Exception", e);
        }

        testimony_list.forEach(row => {
            if( row._id == item._id )
            {
                row.like_count = item.like_count;
                row.like_self_count = item.like_self_count;
            }
        });

        setTestimonyList([...testimony_list]);
    }

    const onToggleComment = (item) => {
        setComment("");

        item.comment_open = !item.comment_open;        
        refreshComment(item);        
    }

    const onAddComment = async(item) => {
        var ref = firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.TESTIMONY_REQUEST)
            .doc(item._id)
            .collection(GLOBAL.COMMENT_LIST);
        
        try {            
            // not pray
            var data = {};
            data.created_by = user.uid;
            var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
            data.created_at = cur_time;
            data.comment = comment;

            var member_ref = await firestore.collection("member_list")
                .where("user_id", "==", user.uid)
                .get();

            var member = undefined;
            for(const doc of member_ref.docs)
            {
                var data1 = doc.data();
                member = data1;
                break;
            }

            data.member = member;

            await ref.add(data);                
            
        } catch(e) {
            console.log("Exception", e);
        }

        await refreshComment(item);

        setComment("");
    }

    const onDeleteComment = async(item, row) => {
        if( row.created_by != user.uid )
            return;

        Alert.alert(
            'Delete Comment',
            'Are you sure to delelet this comment?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => deleteComment(item, row) }
                ],
                { cancelable: false }
            );
    }

    const deleteComment = async(item, row) =>{
        try {
            await firestore.collection(GLOBAL.GROUP_LIST)
                .doc(group.id)
                .collection(GLOBAL.TESTIMONY_REQUEST)
                .doc(item._id)
                .collection(GLOBAL.COMMENT_LIST)
                .doc(row._id)
                .delete();

            await refreshComment(item);

        } catch(e) {
            console.og
        }
    }

    const refreshComment = async(item) => {
        if( item.comment_open )
        {
            var ref = await firestore.collection(GLOBAL.GROUP_LIST)
                .doc(group.id)
                .collection(GLOBAL.TESTIMONY_REQUEST)
                .doc(item._id)
                .collection(GLOBAL.COMMENT_LIST)
                .orderBy("created_at", "asc")
                .get();

            item.comment_count = ref.docs.length;
            var list = [];
            for(const doc of ref.docs) {
                var data = doc.data();
                data._id = doc.id;

                list.push(data);
            }

            item.comment_list = list;

            testimony_list.forEach(row => {
                if( row._id == item._id )
                {                             
                    row.comment_count = item.comment_count;                
                    row.comment_list = item.comment_list;                
                    row.comment_open = item.comment_open;       
                }
            });

        }
        else
        {
            testimony_list.forEach(row => {
                if( row._id == item._id )
                {
                    row.comment_open = item.comment_open;                
                    row.comment_list = [];                
                }
            });
        }

        setTestimonyList([...testimony_list]);
    }

    const onPressProfile = (item) => {
        props.navigation.navigate('MemberProfile', {user: item.member});
    }

    const renderRow = (item) => {        
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <View style={{width: '100%', padding: 6}}>
                    <View style={{width: '100%', alignItems: "center", flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => onPressProfile(item)}>
                            <FastImage style = {{width: 50, height: 50, borderRadius: 25, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                                source = {{uri: item.member.picture}}                                
                                /> 
                        </TouchableOpacity>
                        <Text style={{fontSize: 16, marginLeft: 7}}>{item.member.first_name} {item.member.last_name}</Text>
                        {
                            item.created_by == user.uid &&
                            <TouchableOpacity style={{marginLeft: 10, alignItems: 'center'}}
                                onPress={() => onDeleteRequest(item)}
                                >
                                <FontAwesome5 name="trash" size={20} style={{color: stylesGlobal.back_color}} />         
                            </TouchableOpacity>
                        }
                        <View style={{flex:1}}>
                            <Text style={{fontSize: 16, alignSelf: 'flex-end'}}>{Moment(item.created_at).format('MMM DD YYYY')}</Text>
                        </View>
                    </View>       
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 20}}>{item.message}</Text>
                    </View>             
                    <View style={{width: '100%', flexDirection: 'row', marginTop: 5}}>
                        <TouchableOpacity style={{flex:1, flexDirection: 'row', paddingLeft: 40, alignItems: 'center'}}
                            onPress={() => onPressLike(item)}
                            >
                            <FontAwesome5 name="heart" size={30} style={{color: item.like_self_count > 0 ? stylesGlobal.back_color : 'gray'}} />                            
                            <Text style={{marginLeft: 10, fontSize: 17, color: item.like_self_count > 0 ? stylesGlobal.back_color : 'black'}}>{item.like_count}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1, flexDirection: 'row', paddingLeft: 40, alignItems: 'center'}}
                            onPress={() => onToggleComment(item)}
                            >
                            <FontAwesome5 name="comment-alt" size={30} style={{color: 'gray'}} />                            
                            <Text style={{marginLeft: 10, fontSize: 17}}>{item.comment_count}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15, marginBottom: 7}} />

                    {
                        item.comment_open && 
                        <View style={{width: '100%', padding: 6}}>
                            {
                                item.comment_list.map((row, key) => {
                                    return (
                                        <View style={{width: '100%', padding: 6}} key={row._id}>
                                            <View style={{width: '100%', alignItems: "center", flexDirection: 'row'}}>
                                                <TouchableOpacity onPress={() => onPressProfile(row)}>
                                                    <FastImage style = {{width: 50, height: 50, borderRadius: 25, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                                                        source = {{uri: row.member.picture}}
                                                        onPress={() => onPressProfile(row)}
                                                        />
                                                </TouchableOpacity> 
                                                <Text style={{fontSize: 16, marginLeft: 7}}>{row.member.first_name} {row.member.last_name}</Text>
                                                {
                                                    row.created_by == user.uid &&
                                                    <TouchableOpacity style={{marginLeft: 10, alignItems: 'center'}}
                                                        onPress={() => onDeleteComment(item, row)}
                                                        >
                                                        <FontAwesome5 name="trash" size={20} style={{color: stylesGlobal.back_color}} />         
                                                    </TouchableOpacity>
                                                }
                                                <View style={{flex:1}}>
                                                    <Text style={{fontSize: 16, alignSelf: 'flex-end'}}>{Moment(row.created_at).format('MMM DD YYYY')}</Text>
                                                </View>
                                            </View>       
                                            <View style={{padding: 5}}>
                                                <Text style={{fontSize: 17, marginLeft: 50}}>{row.comment}</Text>
                                            </View>          
                                        </View>   
                                    );
                                })
                            }
                            <TextInput
                                style={[stylesGlobal.inputStyle, {height:80, marginTop: 20, marginBottom: 0}]}
                                placeholder="Please write a comment..."                            
                                multiline={true}
                                autoCapitalize = 'none'
                                value={comment}                               
                                onChangeText={(val) => setComment(val)}
                                />

                            <TouchableOpacity style = {{backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginTop: 5, paddingHorizontal: 10, paddingVertical: 5}} 
                                onPress = {() => onAddComment(item)}>
                                <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Add Comment</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View> 
            </Card>
		)
	}

    return (
        <View style={styles.container}>
            {
                isAdding &&
                <Card style={{container: {borderRadius: 5, padding: 10, justifyContent: 'center'}}}                
                    >
                    <Text style={{fontSize: 16}}>Add Testimony</Text>

                    <TextInput
                        style={[stylesGlobal.inputStyle, {height:80, marginTop: 20, marginBottom: 0}]}
                        placeholder="Please write a request here..."                            
                        multiline={true}
                        autoCapitalize = 'none'
                        value={message}
                        onChangeText={(val) => setMessage(val)}
                        />

                    <TouchableOpacity style = {{backgroundColor: stylesGlobal.back_color, width: 80, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', marginTop: 5, padding: 5}} 
                        onPress = {() => onAddRequest()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Save</Text>
                    </TouchableOpacity>
                </Card>
            }

            <KeyboardAwareFlatList
                data={testimony_list}
                renderItem={({item}) => renderRow(item)}
                keyExtractor={(item, index) => item._id}
                onRefresh={() => refreshList()}
                refreshing={isLoading}
                initialNumToRender={8}
            />
            {                
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
                        onPress={() => onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
            }

            {
                isLoading && <View style={stylesGlobal.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            }
        </View>
    );
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});