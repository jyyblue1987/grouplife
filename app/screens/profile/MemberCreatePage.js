import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class MemberCreatePage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,                        
            first_name: '',      
            last_name: '',
            emai: '',
            phone: '',
        }
        
    }

    componentDidMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    onAddMember = () => {
        // TODO: Validation
        console.log("On Save Member");
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
            Alert.alert("Failed to create member!");
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
                            placeholder="First Name"
                            autoCapitalize = 'none'
                            value={this.state.first_name}
                            onChangeText={(val) => this.updateInputVal(val, 'first_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 20}]}
                            placeholder="Last Name"
                            autoCapitalize = 'none'
                            value={this.state.first_name}
                            onChangeText={(val) => this.updateInputVal(val, 'last_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 20}]}
                            placeholder="Email"
                            autoCapitalize = 'none'
                            value={this.state.email}
                            onChangeText={(val) => this.updateInputVal(val, 'email')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 20}]}
                            placeholder="Phone Number"
                            autoCapitalize = 'none'
                            value={this.state.phone}
                            onChangeText={(val) => this.updateInputVal(val, 'email')}
                        />
                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                        <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                            onPress = {() => this.onAddMember()}>
                            <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Add Member</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>      
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
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
  
});
