import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, Modal, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CalendarPicker from 'react-native-calendar-picker';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class EventEditPage extends Component {
    calendarDate = new Date();
    constructor(props) {
        super(props);

        var event = this.props.route.params.event;
        var group = this.props.route.params.group;

        if( event == null )
        {
            var host = '';
            if( group.leader_list && group.leader_list.length > 0 )
                host = group.leader_list[0].name;

            this.state = {
                isLoading: false,                        
                name: '',      
                date: new Date(Moment(group.meeting_time)),
                time: new Date(Moment(group.meeting_time)),
                host: host,
                location: group.location,
                detail: '',
                food: '',      
                video_conf_link: '',
                phone: '',
                datepicker_show: false,
                picker_mode: 'time',
                calendar_modal_visible: false
            }
        }
        else
        {
            this.state = {
                isLoading: false,                        
                name: event.name,      
                date: new Date(Moment(event.event_time)),
                time: new Date(Moment(event.event_time)),
                host: event.host,
                location: event.location,
                detail: event.detail,
                food: event.food,      
                video_conf_link: event.video_conf_link,
                phone: event.phone,
                datepicker_show: false,
                picker_mode: 'time',
                calendar_modal_visible: false
            }
        }

        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    showDatePicker() {
        this.setState({calendar_modal_visible: true, picker_mode: 'date'});

    }

    showTimePicker() {
        this.setState({datepicker_show: true, picker_mode: 'time'});
    }

    onDateChange(date) {
        console.log("Selected_Date", date);

        this.calendarDate = date;
    }

    onChangeEventDate() 
    {
        console.log("onChangeEventDate", this.calendarDate);
        this.setState({date: this.calendarDate, calendar_modal_visible: false});
        console.log("onChangeEventDate", this.state.date);
    }

    onChangeEventTime(selectedDate) 
    {
        console.log("selectedDate", selectedDate);
        const currentDate = selectedDate || this.state.time;
        this.setState({time: currentDate, datepicker_show: false});
    }

    onCancelEventDate() {
        this.setState({datepicker_show: false, calendar_modal_visible: false});
    }

    onSaveEvent = () => {
        console.log("On Save Event");
        this.setState({isLoading: true});

        var vm = this;

        var user = firebase.auth().currentUser;
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        var event_time = Moment(this.state.date).format('YYYY-MM-DD') + ' ' + Moment(this.state.time).format("HH:mm:ss");

        var event_data = {
            name: this.state.name,      
            event_time: event_time,
            host: this.state.host,
            location: this.state.location,
            detail: this.state.detail,
            food: this.state.food,      
            video_conf_link: this.state.video_conf_link,
            phone: this.state.phone,          
            created_by: user.uid,   
            updated_at: cur_time           
        }

        // find event for selected grouop
        var eventRef = firestore.collection("group_list")
            .doc(group.id)
            .collection('event_list');

          
        if( event == null )
        {
            event_data.created_at = cur_time;
            
            // create event
            eventRef.add(event_data).then(function(docRef) {
                console.log("Event is created with ID:", docRef.id);

                firestore.collection("member_list")
                    .where("user_id", "==", user.uid)
                    .get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            var data = doc.data();
                            data.status = 0;

                            // attendant with profile
                            docRef.collection("attendant_list").add(data);                            
                        });
                        vm.clearInputData(docRef.id);
                    });
                
            }).catch(function(error) {
                console.error("Error adding event: ", error);
                vm.clearInputData();            
            });
        }
        else
        {
            // update event
            eventRef = eventRef.doc(event.id);
            eventRef.update(event_data).then(function(doc) {
                vm.clearInputData(event.id);
            }).catch(function(error) {
                console.log("Error setting group:", error);
                vm.clearInputData();  
            }); 
        }

        console.log("Event Data", JSON.stringify(event_data));
    }

    clearInputData(doc_id)
    {
        this.setState({                    
            isLoading: false,
        });
        if( doc_id )
        {
            const { navigation, route } = this.props;
            navigation.goBack();            
        }
        else
        {
            Alert.alert("Failed to create event!");
        }
    }

    render() {
  
        return (
           
            <View style={styles.container}>      
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }          
                <KeyboardAwareScrollView style={{width:'100%'}}
                    keyboardShouldPersistTaps="handled"
                    >                 
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Event Name"
                            autoCapitalize = 'none'
                            value={this.state.name}
                            onChangeText={(val) => this.updateInputVal(val, 'name')}
                        />

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>                        
                        <TouchableOpacity style = {[{width:'100%'}, styles.roundButton]} 
                        onPress = {() => this.showDatePicker()}
                        >
                            <FontAwesome5 name="calendar-alt"  size={22} color={stylesGlobal.back_color} />
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18, marginLeft: 20}}>{Moment(this.state.date).format('D MMM Y')}</Text>                            
                        </TouchableOpacity>                        
                    </View>

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>                        
                        <TouchableOpacity style = {[{width:'100%'}, styles.roundButton]} 
                        onPress = {() => this.showTimePicker()}
                        >
                            <FontAwesome5 name="clock"  size={22} color={stylesGlobal.back_color} />
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18, marginLeft: 20}}>{Moment(this.state.time).format('hh:mm A')}</Text>                            
                        </TouchableOpacity>                        
                    </View>

                    <DateTimePickerModal
                        isVisible={this.state.datepicker_show}
                        mode={this.state.picker_mode}
                        date={this.state.time}
                        onConfirm = {(date) => this.onChangeEventTime(date)}
                        onCancel = {() =>this.onCancelEventDate()}
                    />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.calendar_modal_visible}                        
                        >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <CalendarPicker 
                                    onDateChange={this.onDateChange}
                                    selectedStartDate={this.state.date}
                                    />
                                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'flex-end'}}>
                                    <TouchableOpacity style = {{justifyContent: 'center', alignItems: 'center'}} 
                                        onPress = {() => this.onChangeEventDate()}>
                                        <Text style = {[stylesGlobal.general_font_style, {color: stylesGlobal.back_color, fontSize: 16}]}>Confirm</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style = {{justifyContent: 'center', alignItems: 'center', marginLeft: 20}} 
                                        onPress = {() => this.onCancelEventDate()}>
                                        <Text style = {[stylesGlobal.general_font_style, {color: stylesGlobal.back_color, fontSize: 16}]}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Event Host"
                            autoCapitalize = 'none'
                            value={this.state.host}
                            onChangeText={(val) => this.updateInputVal(val, 'host')}
                        />
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Event Location"
                            autoCapitalize = 'none'
                            value={this.state.location}
                            onChangeText={(val) => this.updateInputVal(val, 'location')}
                        />
                    <TextInput
                            style={[stylesGlobal.inputStyle, {height:80, marginTop: 35}]}
                            placeholder={"Event Details \n(Topics, reading materials, questions for discussion)"}                            
                            multiline
                            autoCapitalize = 'none'
                            value={this.state.detail}
                            onChangeText={(val) => this.updateInputVal(val, 'detail')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Food"
                            autoCapitalize = 'none'
                            value={this.state.food}
                            onChangeText={(val) => this.updateInputVal(val, 'food')}
                        />
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Video Conference Link"
                            autoCapitalize = 'none'
                            value={this.state.video_conf_link}
                            onChangeText={(val) => this.updateInputVal(val, 'video_conf_link')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Phone conferece dial-in info"
                            autoCapitalize = 'none'
                            value={this.state.phone}
                            onChangeText={(val) => this.updateInputVal(val, 'phone')}
                        />

                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                        onPress = {() => this.onSaveEvent()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Save Event</Text>
                    </TouchableOpacity>
                </View>
                </KeyboardAwareScrollView>      
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }       
                {
                    this.state.isUploading && <View style={stylesGlobal.preloader}>
                        <Progress.Bar progress={this.state.upload_progress} width={200} />
                    </View>
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
        paddingBottom: 30,
        paddingHorizontal: 10,
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },    

    roundButton: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 45, 
        paddingHorizontal: 8, 
        borderRadius:8, 
        borderColor: '#383838B2', 
        borderWidth: 1,        
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});
