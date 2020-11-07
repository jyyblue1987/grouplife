import * as React from 'react';
import {Component} from 'react';
import { Button, ButtonGroup } from 'react-native-elements';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';

import firebase from '../../../database/firebase';
import { firestore} from '../../../database/firebase';

export default class EventDetailPage extends Component {
    constructor(props) {
        super(props);

        var user = firebase.auth().currentUser;
        var event = this.props.route.params.event;
        
        this.state = {
            isLoading: false,
            event: this.props.route.params.event,
            edit_flag: event.created_by == user.uid,
            attendant_list: [],
            attend_index: 0
        }

        this.attendant_id = '';

        console.log(this.state.event);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.initListener = this.props.navigation.addListener('focus', this.initData.bind(this));
    }

    initData = async() => {
        console.log('initData');
        this.getEventData();                
    }

    onCreated = data => {

    }

    getEventData() {
        this.setState({            
            isLoading: true,
            attendant_list: [],
        });

        var group = this.props.route.params.group;
        var event = this.props.route.params.event;
        firestore.collection("group_list")
            .doc(group.id)
            .collection("event_list")
            .doc(event.id)
            .onSnapshot(documentSnapshot  => {
                const data = documentSnapshot.data();     
                console.log("Event Data", JSON.stringify(data));           
                this.setState({event: data});
                this.getAttendantList();
            });
    }

    getAttendantList() {
        // get attendant status of current user
        var user = firebase.auth().currentUser;
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;
        var vm = this;
        console.log("User ID =", user.uid);
        firestore.collection("group_list")
            .doc(group.id)
            .collection("event_list")
            .doc(event.id)
            .collection("attendant_list")
            .get().then((querySnapshot) => {
                var list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Attendant list feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    if( data.user_id == user.uid)
                    {                        
                        vm.attendant_id = doc.id;
                        vm.setState({attend_index: data.status});
                        console.log("Attendant ID =", vm.attendant_id);
                    }

                    data.id = doc.id;
                    list.push(data);                    
                });

                this.setState({
                    attendant_list: list,
                    isLoading: false,
                });
            }); 
    }

    onUpdateAttend = status => {        
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;
        console.log("Attendant ID = ", this.attendant_id);

        firestore.collection("group_list")
            .doc(group.id)
            .collection("event_list")
            .doc(event.id)
            .collection("attendant_list")
            // .where('user_id', '==', user.uid)
            .doc(this.attendant_id)
            .update({
                status: status
            });

        this.setState({attend_index: status});           
    }

    onGoEditPage = () => {        
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;

        this.props.navigation.navigate('EventEdit', { onCreated: this.onCreated, group: group, event: event, title: 'Edit Calendar Event' });
    }


    render() {
        const buttons = ['Yes', 'Maybe', 'No'];
        const attend_index = this.state.attend_index;
        
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
                <ScrollView style={{width:'100%', paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{fontSize: 40, fontWeight: 'bold'}}>
                                {this.state.event.name}
                            </Text>
                        </View>        
                        {
                            this.state.edit_flag &&
                            <TouchableOpacity style={styles.iconButton}
                                onPress={() => this.onGoEditPage()}
                                >
                                <FontAwesome5Icon name="edit" size={20} color='white' />
                            </TouchableOpacity>
                        }
                    </View> 

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <FontAwesome name="calendar" size={30} color={stylesGlobal.back_color} />
                        <View style={{flex:1}}>
                            <Text style={{fontSize: 20, marginLeft: 10}}>
                                {Moment(this.state.event.event_time).format('dddd, MMM d')}th, {Moment(this.state.event.event_time).format('HH:mm')}
                            </Text>
                        </View>
                    </View>  

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20}}>
                            Attending:
                        </Text>
                        <View style={{flex:1}}>
                            <ButtonGroup
                                onPress={(index) => this.onUpdateAttend(index)}
                                selectedIndex={attend_index}
                                buttons={buttons}                                
                                />
                        </View>
                    </View>      

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Host:
                        </Text>
                        <Text style={{fontSize: 20, marginLeft: 20}}>
                            {this.state.event.host}
                        </Text>
                    </View>    

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Location:
                        </Text>
                        <Text style={{fontSize: 20, marginLeft: 20}}>
                            {this.state.event.location}
                        </Text>
                    </View>    
                    {
                        this.state.event.video_conf_link != "" &&
                        <View style={{paddingVertical: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                Video Conference Link:
                            </Text>
                            <Text style={{fontSize: 20, marginLeft: 20}}>
                                {this.state.event.video_conf_link}
                            </Text>
                        </View>          
                    }

                    {
                        this.state.event.phone != "" &&
                        <View style={{paddingVertical: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                Phone Conference:
                            </Text>
                            <Text style={{fontSize: 20, marginLeft: 20}}>
                                {this.state.event.phone}
                            </Text>
                        </View>          
                    }
                        
                    <View style={{paddingVertical: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Event Details:
                        </Text>
                        <Text style={{fontSize: 20, marginLeft: 20}}>
                            {this.state.event.detail}
                        </Text>
                    </View>    

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Food:
                        </Text>
                        <Text style={{fontSize: 20, marginLeft: 20}}>
                            {this.state.event.food}
                        </Text>
                    </View>        

                    <View style={{alignContent: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Attendees:
                        </Text>

                        <View style={{marginLeft:20}}>
                            {
                                this.state.attendant_list.map((item) => (
                                    <Text style={{fontSize: 20}}>
                                        {item.first_name} {item.last_name} {"<"}{item.status == 0 ? 'Yes': ''}{item.status == 1 ? 'Maybe': ''}{item.status == 2 ? 'No': ''}{">"} 
                                    </Text>
                                ))
                            }
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

    iconButton: {
        width: 45,
        height: 45,
        backgroundColor: stylesGlobal.back_color,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    }
    
    
});