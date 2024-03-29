import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { Button } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import Moment from 'moment';

export default class EventListPage extends Component {
    constructor(props) {
        super(props);

        var group = this.props.route.params.group;
        let uid = firebase.auth().currentUser.uid;

        this.state = {
            isLoading: false,
            isPastEvent: true,
            event_list: [],          
            edit_flag: uid == group.created_by
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
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');

        var user_id = user.uid;
        console.log("User ID = ", user_id);
        this.setState({ isLoading: true });
        firestore.collection("group_list")
            .doc(group.id)
            .collection('event_list')
            .orderBy('event_time', 'asc')
            .where('event_time', '>=', cur_time)
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
                    item.attendant_label = 'Attending';
                    snapshot.forEach((doc) => {
                        var data1 = doc.data();
                        data1.id = doc.id;
                        attendant_list.push(data1);                                                                
                        if( data1.user_id == user.uid )
                        {
                            item.attendant_id = doc.id;                  
                            if( data1.status == 0 )
                                item.attendant_label = 'Attending: Yes';                            
                        }
                    });

                    

                    console.log("Attendant List", JSON.stringify(attendant_list));   

                    item.attendant_list = attendant_list;
                    count++;
                    if( count >= total_count )
                    {
                        console.log("Detail Event List", JSON.stringify(event_list)); 
                        this.setState({
                            event_list: event_list.concat(this.state.event_list),
                            isLoading: false
                        });
                    }
                });         
        });     
    }

    renderRefreshControl() {
        this.setState({ isLoading: true, event_list: [] });
        this.last_time = Moment().format('YYYY-MM-DD HH:mm:ss');

        this.getEventList();        
    }

    onLoadPastEvent = () => {
        this.setState({isLoading: true});
        var group = this.props.route.params.group;
        
        firestore.collection("group_list")
            .doc(group.id)
            .collection('event_list')
            .orderBy('event_time', 'asc')
            .where('event_time', '<', this.last_time)
            .limit(20)
            .get().then((querySnapshot) => {
                var event_list = [];
                
                querySnapshot.forEach((doc) => {                                
                    var data = doc.data();
                    data.id = doc.id;
                    
                    event_list.push(data);                    
                });

                if( event_list.length > 0 )
                {
                    this.last_time = event_list[0].event_time;
                    this.setState({isPastEvent:true});
                }
                else
                {
                    this.setState({isPastEvent:false});
                }

                console.log("Past Event List", JSON.stringify(event_list));    

                this.getAttendantListForEvent(event_list);                
            });
    }


    onGoCreate = () => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventEdit', { group: group, event: null, title: 'Create Calendar Event' });
    } 

    onGoDetailPage = (event) => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventDetail', { group: group, event: event, title: event.name });
    }

    onJoinEvent = (index) => {
        var event = this.selected_item;
        if( !event )
            return;

        if( index >= 3 )
            return;

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
            console.log('Add new attendant');
            firestore.collection("member_list")
                .where("user_id", "==", user.uid)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var data = doc.data();
                        data.status = index;
                        data.id = doc.id;

                        // attendant with profile
                        attendant_ref.add(data)
                            .then((doc1) => {                                
                                event_list = [... this.state.event_list];
                                event_list.forEach((item) => {
                                    if( event.id == item.id)
                                    {
                                        console.log("Event", JSON.stringify(item));                                                                                
                                        item.attendant_list.push(data);
                                        item.attendant_id = doc1.id;
                                        if( status == 0 )
                                            item.attendant_label = 'Attending: Yes';
                                        else
                                            item.attendant_label = 'Attending';
                                    }
                                });

                                this.setState({event_list: event_list});
                            });                   

                    });
                });
        }
        else
        {
            // .where('user_id', '==', user.uid)
            attendant_ref.doc(event.attendant_id)
                .update({
                    status: index
                }).then((doc) => {
                    // vm.renderRefreshControl();
                });  

            event_list = [... this.state.event_list];
            event_list.forEach((item) => {
                if( event.id == item.id)
                {                   
                    if( index == 0 )
                        item.attendant_label = 'Attending: Yes';
                    else
                        item.attendant_label = 'Attending';
                }
            });

            this.setState({event_list: event_list});
        }
    }

    showActionSheet = (item) => {
        this.selected_item = item
        this.ActionSheet.show()
    }

    renderRow(item) {   
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');     
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
                                item.event_time >= cur_time &&
                                <TouchableOpacity style = {{width: 100, height: 20, marginRight: 5, borderRadius: 3, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                                        onPress = {() => this.showActionSheet(item)}>
                                    <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 12}]}>{item.attendant_label}</Text>
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
                {
                    this.state.isPastEvent &&
                    <TouchableOpacity style={{alignItems:'center'}} onPress={() => this.onLoadPastEvent()}>
                        <Text style={{color:stylesGlobal.back_color, textDecorationLine: 'underline'}}>View Past Events</Text>
                    </TouchableOpacity>
                }
                <FlatList
                    data={this.state.event_list}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => item.id}
                    onRefresh={() => this.renderRefreshControl()}
                    refreshing={this.state.isLoading}
                    initialNumToRender={8}
                />

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Do you want to attend this event?'}
                    options={['Yes', 'Maybe', 'No', 'cancel']}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={2}
                    onPress={(index) => this.onJoinEvent(index)}
                    />
           
                {
                    this.state.edit_flag &&
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
                            onPress={() => this.onGoCreate()}
                        >
                        <FontAwesome5 name="plus"  size={30} color="#fff" />
                    </TouchableOpacity>
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
        paddingVertical: 20,
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

