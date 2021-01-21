import * as React from 'react';
import {Component} from 'react';
const GLOBAL = require('../../Globals');

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
        var email = this.state.email;
        
        // find member
        firestore.collection("member_list")
            .where('email', '==', email)
            .get().then((querySnapshot) => {
                var member = undefined;                
                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    data.member_id = doc.id;
                    member = data;
                    exist = true;
                });                    

                if( member && member.user_id != '' ) // Exist User
                {
                    console.log("Exist User", member.user_id);
                    vm.joinUserOnGroup(member.user_id);
                }
                else if( member ) // Already add, but not login
                {
                    vm.updateCandidateList(member);
                }
                else // Not added
                {
                    vm.addMember();
                }                
            });
    }

    joinUserOnGroup(user_id) {
        var group = this.props.route.params.group;
        var member_list = [...group.member_list.filter((item) => item != user_id), user_id];

        console.log("New Membmer List", JSON.stringify(member_list));
        var vm = this;

        firestore.collection("group_list")
            .doc(group.id)
            .update({member_list: member_list})
            .then(function() {
                vm.clearInputData(member_list);
            });
    }

    addMember()
    {
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        var user = firebase.auth().currentUser;

        var data = {
            first_name: this.state.first_name,      
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            user_id: "",
            picture: "",
            address: "",
            city: "",
            state: "",
            country: "",
            desc: "",
            role: "",
            created_at: cur_time,
            created_by: user.uid,
        };

        console.log("Add Member:", JSON.stringify(data));

        var vm = this;

        firestore.collection("member_list")
            .add(data)
            .then((doc) => {
                data.member_id = doc.id;
                vm.addCandidateList(data);    

                // TODO: Send Email
                this.sendEmail(data.email);
            });
    }

    addCandidateList(data)
    {
        console.log("Add Candidate List:", JSON.stringify(data));
        var group = this.props.route.params.group;
        firestore.collection('group_list')
            .doc(group.id)
            .collection('candidate_list')
            .add(data);

        this.goBackPage();

        const { navigation, route } = this.props;
        var group = this.props.route.params.group;

        var data = {};
        data.member_list = group.member_list;
        route.params.onCreated({ data:  data});
    }

    updateCandidateList(member)
    {
        // TODO: Send Email
        this.sendEmail(member.email);

        // check if exists on candidate list
        var group = this.props.route.params.group;
        var vm = this;

        console.log("Update Candidate List:", JSON.stringify(member));

        firestore.collection("group_list")
            .doc(group.id)
            .collection("candidate_list")
            .where('member_id', '==', member.member_id)
            .get().then((querySnapshot) => {
                var exist = false;          
                querySnapshot.forEach((doc) => {
                    exist = true;
                });                    

                if( exist == false )
                    vm.addCandidateList(member);
                else
                    vm.goBackPage();       
            });
        
    }

    clearInputData(member_list)
    {
        this.goBackPage();  

        const { navigation, route } = this.props;

        var data = {};
        data.member_list = member_list;
        route.params.onCreated({ data:  data});
    }

    goBackPage() 
    {
        this.setState({                    
            isLoading: false,
        });
      
        const { navigation, route } = this.props;
        navigation.goBack();    
    }

    sendEmail(email) {        
        var user = firebase.auth().currentUser;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({                 
                user_id: user.uid, 
                // idToken: user.getIdToken(),
                displayName: user.displayName,
                email: email
            })
        };

        console.log("Send Email", requestOptions);

        fetch(GLOBAL.FIREBASE_URL + 'sendEmail', requestOptions)
            // .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);            
            })
            .catch((error) => {
                console.error(error);
            });
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
                            value={this.state.last_name}
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
                            onChangeText={(val) => this.updateInputVal(val, 'phone')}
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
