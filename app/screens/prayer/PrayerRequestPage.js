import React, { useEffect, useState } from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Card } from 'react-native-material-ui';
import FastImage from 'react-native-fast-image';

import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';

import Moment from 'moment';
const GLOBAL = require('../../Globals');

export default function PrayerRequestPage(props) {
    const group = props.route.params.group;    
    const user_id = firebase.auth().currentUser.uid;

    const [isLoading, setLoading] = useState(false);
    const [isAdding, setAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [prayer_list, setPrayerList] = useState([]);


    useEffect(() => {
        console.log("useEffect");
        refreshList();
    }, []);

    const refreshList = async() => {
        setLoading(true);

        var ref = await firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.PRAYER_REQUEST)
            .orderBy('created_at', 'desc')
            .get();

        var list = [];
        for(const doc of ref.docs)
        {
            var data = doc.data();
            data._id = doc.id;       
            
            firebase.auth().currentUser.uid;

            var prayer_ref = firestore.collection(GLOBAL.GROUP_LIST)
                .doc(group.id)
                .collection(GLOBAL.PRAYER_REQUEST)
                .doc(doc.id);

            pray_collection = await prayer_ref.collection(GLOBAL.PRAYER_LIST)
                .get();

            data.prayer_count = pray_collection.docs.length;

            pray_self_collection = await prayer_ref.collection(GLOBAL.PRAYER_LIST)
                                    .where("user_id", "==", user_id)
                                    .get();
            data.prayer_self_count = pray_self_collection.docs.length;

            comment_collection = await prayer_ref.collection(GLOBAL.COMMENT_LIST)
                .get();

            data.comment_count = comment_collection.docs.length;

            list.push(data);
        }

        setPrayerList(list);

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
        data.created_by = firebase.auth().currentUser.uid;

        var user = firebase.auth().currentUser;

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
            .collection(GLOBAL.PRAYER_REQUEST)
            .add(data);

        setAdding(false);
        setLoading(false); 
    }

    const onPressPraying = async(item) => {
        var ref = firestore.collection(GLOBAL.GROUP_LIST)
            .doc(group.id)
            .collection(GLOBAL.PRAYER_REQUEST)
            .doc(item._id)
            .collection(GLOBAL.PRAYER_LIST);

        try {
            var list = await ref.where("user_id", "==", user_id)
                .get();
            
            if( list.docs.length < 1 )
            {
                console.log("Not Exists");
                // not pray
                await ref.add({user_id, user_id});                
                item.prayer_count++;
                item.prayer_self_count++;
            }
            else
            {
                console.log("Exists");

                for(const doc of list.docs)
                {
                    await ref.doc(doc.id).delete();                          
                    item.prayer_self_count--;

                }                
                item.prayer_count--;                
            }
        } catch(e) {
            console.log("Exception", e);
        }

        prayer_list.forEach(row => {
            if( row._id == item._id )
            {
                row.prayer_count = item.prayer_count;
                row.prayer_self_count = item.prayer_self_count;
            }
        });

        console.log("Prayer List", prayer_list);        
        setPrayerList([...prayer_list]);
    }

    const onToggleComment = () => {
        
    }

    const renderRow = (item) => {        
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <View style={{width: '100%', padding: 6}}>
                    <View style={{width: '100%', alignItems: "center", flexDirection: 'row'}}>
                        <FastImage style = {{width: 50, height: 50, borderRadius: 25, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                            source = {{uri: item.member.picture}}
                            /> 
                        <Text style={{fontSize: 16, marginLeft: 7}}>{item.member.first_name} {item.member.last_name}</Text>
                        <View style={{flex:1}}>
                            <Text style={{fontSize: 16, alignSelf: 'flex-end'}}>{Moment(item.created_at).format('MMM DD YYYY')}</Text>
                        </View>
                    </View>       
                    <View style={{padding: 5}}>
                        <Text style={{fontSize: 20}}>{item.message}</Text>
                    </View>             
                    <View style={{width: '100%', flexDirection: 'row', marginTop: 5}}>
                        <TouchableOpacity style={{flex:1, flexDirection: 'row', paddingLeft: 40, alignItems: 'center'}}
                            onPress={() => onPressPraying(item)}
                            >
                            <FontAwesome5 name="praying-hands" size={30} style={{color: item.prayer_self_count > 0 ? stylesGlobal.back_color : 'gray'}} />                            
                            <Text style={{marginLeft: 10, fontSize: 17, color: item.prayer_self_count > 0 ? stylesGlobal.back_color : 'black'}}>{item.prayer_count}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1, flexDirection: 'row', paddingLeft: 40, alignItems: 'center'}}
                            onPress={() => onToggleComment(item)}
                            >
                            <FontAwesome5 name="comment-alt" size={30} style={{color: 'gray'}} />                            
                            <Text style={{marginLeft: 10, fontSize: 17}}>{item.comment_count}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15, marginBottom: 7}} />

                    
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
                    <Text style={{fontSize: 16}}>Add Prayer Request</Text>

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

            <FlatList
                data={prayer_list}
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