import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { Button } from 'react-native-elements';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import Moment from 'moment';

export default class EventListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            event_list: [],          
        }
    }

    componentDidMount() {
        this.initListener = this.props.navigation.addListener('focus', this.initData.bind(this));        
    }

    initData = async() => {
        console.log('EventListPage initData');
        this.renderRefreshControl();
    }

    getEventList() {
        var user = firebase.auth().currentUser;
        if( user == null )
        {
            console.log("Invalid User");
            return;    
        }

        var group = this.props.route.params.group;

        var user_id = user.uid;
        console.log("User ID = ", user_id);
        this.setState({ isLoading: true });
        firestore.collection("group_list")
            .doc(group.id)
            .collection('event_list')
            .orderBy('created_at', 'asc')
            .get().then((querySnapshot) => {
                var event_list = [];
                
                querySnapshot.forEach((doc) => {                                
                    var data = doc.data();
                    data.id = doc.id;
                    
                    event_list.push(data);                    
                });

                console.log("Event List", JSON.stringify(event_list));    

                this.getAttendantListForEvent(event_list);                
            });        
    }

    getAttendantListForEvent(event_list)
    {
        var total_count = event_list.length;

        if( total_count < 1 )
        {
            this.setState({
                event_list: [],
                isLoading: false
            });
        }

        var user = firebase.auth().currentUser;
        var count = 0;
        var group = this.props.route.params.group;
        event_list.forEach((item) => {              
            firestore.collection("group_list")
                .doc(group.id)
                .collection('event_list')
                .doc(item.id)
                .collection('attendant_list')
                .get().then((snapshot) => {
                    var attendant_list = [];
                    item.attendant_id = '';
                    snapshot.forEach((doc) => {
                        var data1 = doc.data();
                        data1.id = doc.id;
                        attendant_list.push(data1);                                                                
                        if( data1.user_id == user.uid )
                            item.attendant_id = doc.id;                        
                    });

                    console.log("Attendant List", JSON.stringify(attendant_list));   

                    item.attendant_list = attendant_list;
                    count++;
                    if( count >= total_count )
                    {
                        console.log("Detail Event List", JSON.stringify(event_list)); 
                        this.setState({
                            event_list: event_list,
                            isLoading: false
                        });
                    }
                });         
        });

                
    }

    renderRefreshControl() {
        this.setState({ isLoading: true });
        this.getEventList();        
    }


    onGoCreate = () => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventEdit', { group: group, event: null, title: 'Create Calendar Event' });
    } 

    onGoDetailPage = (event) => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventDetail', { group: group, event: event, title: event.name });
    }

    onJoinEvent = (event) => {
        var vm = this;
        var user = firebase.auth().currentUser;
        var group = this.props.route.params.group;          
        var attendant_ref = firestore.collection("group_list")
            .doc(group.id)
            .collection("event_list")
            .doc(event.id)
            .collection("attendant_list");

        if( event.attendant_id == '' )
        {
            firestore.collection("member_list")
                .where("user_id", "==", user.uid)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var data = doc.data();
                        data.status = 0;

                        // attendant with profile
                        attendant_ref.add(data)
                            .then((doc) => {
                                vm.renderRefreshControl();
                            });                    
                    });
                });
        }
        else
        {
            // .where('user_id', '==', user.uid)
            attendant_ref.doc(event.attendant_id)
                .update({
                    status: 0
                }).then((doc) => {
                    vm.renderRefreshControl();
                });  
        }
    }

    renderRow(item) {        
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.onGoDetailPage(item)}>
                    <View style={{justifyContent: "center", alignItems:"center", width: 80, backgroundColor: stylesGlobal.back_color}}>
                        <Text style={{fontSize:38, color: 'white', fontWeight: 'bold'}}>
                            {Moment(item.event_time).format('D')}
                        </Text>

                        <Text style={{fontSize:20, color: 'white'}}>
                            {Moment(item.event_time).format('MMM')}
                        </Text>
                    </View>
                    <View style={{flex:1, marginLeft: 7, paddingVertical: 9}}>
                        <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                            <Text style={{flex:1,fontSize: 20, fontWeight: 'bold'}}>
                                {item.name}
                            </Text>
                            {
                                <TouchableOpacity style = {{width: 80, height: 20, marginRight: 5, borderRadius: 3, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                                        onPress = {() => this.onJoinEvent(item)}>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 12}]}>Attending</Text>
                                </TouchableOpacity>
                            }
                        </View>

                        <Text style={{fontSize: 17, color:'gray'}}>
                            {item.location}
                        </Text>
                        
                        <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15}} />

                        <View style={{width: '100%', height: 30, marginTop: 10, flexDirection:'row'}}>
                            <View style={{width:(40 + 20 * (item.attendant_list.length - 1))}}>
                                {
                                    item.attendant_list.map((row, index) => (
                                        <FastImage key={row.id} style = {[styles.member_icon, {left: 20 * index}]} source = {{uri: row.picture}}/>
                                    ))
                                }                                
                            </View>
                            <View style={{flexDirection:'row', marginTop: 3}}>
                                <Text style={{fontSize: 17, color:'gray'}}>
                                    + {item.attendant_list.length} Others RSVP'd
                                </Text>
                            </View>
                        </View>
                        
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>          
                <FlatList
                    data={this.state.event_list}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => item.id}
                    onRefresh={() => this.renderRefreshControl()}
                    refreshing={this.state.isLoading}
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
                        right: 10,
                        backgroundColor:stylesGlobal.back_color,
                        borderRadius:100,
                        }}                        
                        onPress={() => this.onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
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
        paddingHorizontal: 10,
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    member_icon: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        borderColor: stylesGlobal.back_color, 
        borderWidth: 2, 
        position: 'absolute'
    }


    
});

