import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import firebase from '../../database/firebase';
import {firestore} from '../../database/firebase';
import { stylesGlobal } from '../styles/stylesGlobal';
import Moment from 'moment';

export default class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            email: '', 
            password: '',
            isLoading: false
        }
    }

    componentDidMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    registerUser = () => {
        if( this.state.email === '' && this.state.password === '' ) {
            Alert.alert("Enter details to signup!");
        }
        else
        {
            this.setState( {
                isLoading: true,
            });
        }

        var vm = this;
        vm.user_id = '';

        firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then( (res) => {   
                res.user.updateProfile({
                    displayName: this.state.displayName
                });

                vm.user_id = res.user.uid;

                console.log('User registered successfully!', vm.user_id);                

                // find member
                firestore.collection('member_list')
                    .where('email', '==', vm.state.email)
                    .get().then((querySnapshot) => {                                                  
                        var member = undefined;
                        querySnapshot.forEach((doc) => {
                            member = doc.data();
                            member.id = doc.id;
                        });        
                        
                        if( member )                            
                            vm.joinMemberOnGroupList(member);       
                        else
                            vm.createMember();                            
                    });

                
            })
            .catch(error => {
                this.setState({
                        isLoading: false,
                        errorMessage: error.message
                    });
                Alert.alert(error.message);
            }) 
    }

    createMember() {
        // create member
        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        var data = {
            user_id: this.user_id,
            first_name: this.state.displayName,
            last_name: '',
            picture: '',
            email: this.state.email,
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            desc: '',
            role: 'Member',
            created_at: cur_time,     
            created_by: this.user_id,               
        };

        console.log("createMember", JSON.stringify(data));

        var vm = this;

        firestore.collection("member_list").add(data).then(function(docRef) {
            console.log("Member is created with ID:", docRef.id);

            data.id = docRef.id;
            vm.joinMemberOnGroupList(data);

            vm.props.navigation.navigate('Signin');                    
        }).catch(function(error) {
            vm.setState({
                isLoading: false,                       
            });
            Alert.alert(error.message);
        });
    }

    joinMemberOnGroupList(member) {
        if( member.user_id == '' )
        {
            // update member's user id
            firestore.collection('member_list')
                .doc(member.id)
                .update({user_id: this.user_id});   
        }

        console.log("joinMemberOnGroupList", JSON.stringify(member));
        var vm = this;
        member.user_id = this.user_id;
        firestore.collection('group_list')
            .get().then((querySnapshot) => {                         
                     
                querySnapshot.forEach((doc) => {    
                    var group = doc.data(); 
                    group.id = doc.id;               
                    vm.joinMemberOnGroup(group, member);
                });                    
            });

        vm.setState({
            isLoading: false,
            displayName: '',
            email: '',
            password: ''
        });

        vm.props.navigation.navigate('Signin');                    
    }

    joinMemberOnGroup(group, member)
    {
        console.log("joinMemberOnGroup", JSON.stringify(group), JSON.stringify(member));
        var vm = this;
        firestore.collection('group_list')
            .doc(group.id)
            .collection('candidate_list')
            .where('member_id', '==', member.id)
            .get().then((querySnapshot) => {
                var candidate = undefined;
                querySnapshot.forEach((doc) => {    
                    candidate = doc.data();                    
                    candidate.id = doc.id;
                });     

                if( candidate ) // exist candidate
                {
                    vm.moveCandidateToGroupMember(group, candidate, member);
                }
            });
    }

    moveCandidateToGroupMember(group, candidate, member)
    {
        console.log("moveCandidateToGroupMember, Candidate", JSON.stringify(candidate));
        // remove candidate
        firestore.collection('group_list')
            .doc(group.id)
            .collection('candidate_list')
            .doc(candidate.id)
            .delete().then(function() {
                // update group member list
                var member_list = [...group.member_list.filter((item) => item != member.user_id), member.user_id];

                console.log("New Membmer List", JSON.stringify(member_list));
                
                firestore.collection("group_list")
                    .doc(group.id)
                    .update({member_list: member_list})
                    .then(function() {
                        
                    });
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
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Name"
                    autoCapitalize = 'none'
                    value={this.state.displayName}
                    onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                    />      
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Email"
                    autoCapitalize = 'none'
                    value={this.state.email}
                    onChangeText={(val) => this.updateInputVal(val, 'email')}
                />
                <TextInput
                    style={stylesGlobal.inputStyle}
                    placeholder="Password"
                    autoCapitalize = 'none'
                    value={this.state.password}
                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                    maxLength={15}
                    secureTextEntry={true}
                />

                <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                        onPress = {() => this.registerUser()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>SignUp</Text>
                    </TouchableOpacity>
                </View>
                
                <Text
                    style={styles.loginText}
                    onPress={() => this.props.navigation.navigate('Signup')}>
                    Already Registered? Click here to login
                </Text>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },   
    loginText: {
        color: stylesGlobal.back_color,
        marginTop: 25,
        textAlign: 'center'
    },   
});

