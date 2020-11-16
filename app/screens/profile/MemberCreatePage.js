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
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        
        var data = {
            first_name: this.state.first_name,      
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
        }

        // find member
        firestore.collection("member_list")
            .where('email', '==', data.email)
            .get().then((querySnapshot) => {
                var user_id = '';
                querySnapshot.forEach((doc) => {
                    var data = doc.data();
                    user_id = data.user_id;                    
                });                    

                if( user_id == '' ) // New User 
                {

                }
                else // Exist User
                {
                    console.log("Exist User", user_id);
                    vm.joinUserOnGroup(user_id);
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

    clearInputData(member_list)
    {
        this.setState({                    
            isLoading: false,
        });
      
        const { navigation, route } = this.props;
        navigation.goBack();            

        var data = {};
        data.member_list = member_list;
        route.params.onCreated({ data:  data});
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
