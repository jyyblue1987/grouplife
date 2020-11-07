import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class EventEditPage extends Component {
    constructor(props) {
        super(props);

        var event = this.props.route.params.event;
        if( event == null )
        {
            this.state = {
                isLoading: false,                        
                name: '',      
                date: new Date(),
                date_str: '',
                time_str: '',
                host: '',
                location: '',
                detail: '',
                food: '',      
                video_conf_link: '',
                phone: '',
                datepicker_show: false,
                picker_mode: 'time'
            }
        }
        else
        {
            this.state = {
                isLoading: false,                        
                name: event.name,      
                date: new Date(Moment(event.event_time)),
                date_str: Moment(event.event_time).format('d MMM Y'),
                time_str: Moment(event.event_time).format('HH:mm'),
                host: event.host,
                location: event.location,
                detail: event.detail,
                food: event.food,      
                video_conf_link: event.video_conf_link,
                phone: event.phone,
                datepicker_show: false,
                picker_mode: 'time'
            }
        }
    }

    componentDidMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    showDatePicker() {
        this.setState({datepicker_show: true, picker_mode: 'date'});
    }

    showTimePicker() {
        this.setState({datepicker_show: true, picker_mode: 'time'});
    }

    onChangeEventDate(selectedDate) 
    {
        this.setState({date: currentDate, datepicker_show: false});
        
        const currentDate = selectedDate || this.state.date;
        if( this.state.picker_mode == 'date' )
        {
            var date_str = Moment(currentDate).format('d MMM Y');
            this.setState({date_str: date_str});
        }
        if( this.state.picker_mode == 'time' )
        {
            var time_str = Moment(currentDate).format('HH:mm');
            this.setState({time_str: time_str});
        }
    }

    onCancelEventDate() {
        this.setState({datepicker_show: false});
    }

    onSaveEvent = () => {
        console.log("On Save Event");
        this.setState({isLoading: true});

        var vm = this;

        var user = firebase.auth().currentUser;
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        var event_time = Moment(this.state.date).format('YYYY-MM-DD HH:mm:ss');

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
           
        this.setState({isLoading: false});
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
            route.params.onCreated({ created: true, doc_id: doc_id });
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
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18, marginLeft: 20}}>{this.state.date_str}</Text>                            
                        </TouchableOpacity>                        
                    </View>

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>                        
                        <TouchableOpacity style = {[{width:'100%'}, styles.roundButton]} 
                        onPress = {() => this.showTimePicker()}
                        >
                            <FontAwesome5 name="clock"  size={22} color={stylesGlobal.back_color} />
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18, marginLeft: 20}}>{this.state.time_str}</Text>                            
                        </TouchableOpacity>                        
                    </View>

                    <DateTimePickerModal
                        isVisible={this.state.datepicker_show}
                        mode={this.state.picker_mode}
                        onConfirm = {(date) => this.onChangeEventDate(date)}
                        onCancel = {() =>this.onCancelEventDate()}
                    />
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
});
