import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { SearchBar } from 'react-native-elements';
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
                    snapshot.forEach((doc) => {
                        var data1 = doc.data();
                        data1.id = doc.id;
                        attendant_list.push(data1);                                                                
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

        // this.setState({
        //     event_list: event_list,
        //     isLoading: false
        // });
        
    }

    renderRefreshControl() {
        this.setState({ isLoading: true });
        this.getEventList();        
    }

 

    onCreated = data => {
        console.log("Back to Eventlist", JSON.stringify(data));
        if( data.created == true )
        {
            this.renderRefreshControl();    
        }
    }

    onGoCreate = () => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventEdit', { onCreated: this.onCreated, group: group, event: null, title: 'Create Calendar Event' });
    } 

    onGoDetailPage = (event) => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventDetail', { onCreated: this.onCreated, group: group, event: event, title: event.name });
    }

    renderRow(item) {        
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={() => this.onGoDetailPage(item)}>
                    <View style={{justifyContent: "center", alignItems:"center", width: 80, backgroundColor: stylesGlobal.back_color}}>
                        <Text style={{fontSize:38, color: 'white', fontWeight: 'bold'}}>
                            {Moment(item.event_time).format('d')}
                        </Text>

                        <Text style={{fontSize:20, color: 'white'}}>
                            {Moment(item.event_time).format('MMM')}
                        </Text>
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {item.name}
                        </Text>

                        <Text style={{fontSize: 17, color:'gray'}}>
                            {item.location}
                        </Text>

                        <View style={{width: '100%', height: 30, marginTop: 10, flexDirection:'row'}}>
                            <View style={{width:(40 + 20 * (item.attendant_list.length - 1))}}>
                                {
                                    item.attendant_list.map((row, index) => (
                                        <FastImage style = {[styles.member_icon, {left: 20 * index}]} source = {{uri: row.picture}}/>
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

