import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import Modal from 'react-native-modalbox';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CheckBox} from'react-native-elements';

import firebase from '../../../database/firebase';
import { firestore} from '../../../database/firebase';
const GLOBAL = require('../../Globals');

export default class MemberListPage extends Component {
    constructor(props) {
        super(props);

        var group = this.props.route.params.group;
        let uid = firebase.auth().currentUser.uid;

        this.state = {
            isLoading: false,
            group: this.props.route.params.group,
            member_list: [],            
            swipeToClose: true,
            group_message: '',
            send_mode: 'Email',
            edit_flag: uid == group.created_by
        }
    }

    componentDidMount() {
        this.renderRefreshControl();
    }

    async getMemberList() {
        this.setState({
            member_list: [],
            isLoading: true
        });


        var ref = await firestore.collection("member_list")                        
                        .where("user_id", "in", this.state.group.member_list)                        
                        // .orderBy("first_name", "desc")
                        .get();

        var list = [];
        for(const doc of ref.docs)
        {
            var data = doc.data();
            data.id = doc.id;            
            list.push(data);
        }

        var ref = await firestore.collection("group_list")
                .doc(this.state.group.id)
                .collection("candidate_list")
                .get();

        for(const doc of ref.docs)
        {
            var data = doc.data();
            data.id = doc.id;            
            list.push(data);
        }

        this.setState({
            member_list: list,            
            isLoading: false,
        });
    }

    renderRefreshControl() {
        this.setState({ isLoading: true })
        this.getMemberList()
    }

    onRemoveMember = (item) => {
        Alert.alert(
            'Delete Member',
            'Are you sure to delelet "' + item.first_name + '"?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => this.removeMember(item) }
                ],
                { cancelable: false }
            );
    }

    async removeMember(item) {
        this.setState({            
            isLoading: true
        });
        
        var group = this.props.route.params.group;

        var member_list = this.state.member_list.filter(row => {
            return item.id != row.id;
        });

        member_list = [... member_list];
      
        if( item.user_id )  // Already exist user
        {
            var user_ids = member_list.map(row => {
                return row.user_id;
            });

            console.log("User IDs", JSON.stringify(user_ids));

            await firestore.collection("group_list")
                .doc(group.id)
                .update({member_list: user_ids});

            var group = {... this.state.group};
            group.member_list = user_ids;

            this.setState({group: group});
        }
        else
        {
            await firestore.collection("group_list")
                .doc(group.id)
                .collection("candidate_list")
                .doc(item.id)
                .delete();
        }

        
        await this.getMemberList();

        const { navigation, route } = this.props;    
        var data = {};
        data.member_list = user_ids;
        route.params.onUpdated({ data:  data});
    }

    onCreated = (data) => {
        var member_list = data.data.member_list;
        var new_group = {... this.state.group};
        new_group.member_list = member_list;
        this.setState({group: new_group});

        this.getMemberList();

        const { navigation, route } = this.props;   
        route.params.onUpdated(data);
    }

    onCreateMember = () => {
        var group = this.props.route.params.group;
        this.props.navigation.navigate('MemberCreate', {group: group, onCreated: this.onCreated});
    }
    
    onShowSendMessage = () => {
        this.refs.modal1.open();
    }


    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    onSendMessage = () => {
        var user = firebase.auth().currentUser;
        var send_mode = this.state.send_mode;
        var group = this.props.route.params.group;

        var vm = this;
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({                 
                user_id: user.uid,
                // idToken: user.getIdToken(),
                displayName: user.displayName,
                group_id: group.id, 
                send_mode: send_mode, 
                message: this.state.group_message
            })
        };
    
        console.log("Send Email", requestOptions);


        fetch(GLOBAL.FIREBASE_URL + 'sendMessageToGroup', requestOptions)
            // .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);     
                Alert.alert('Message is sent to group members');
                vm.refs.modal1.close();       
            })
            .catch((error) => {
                console.error(error);
            });       
    }

    renderRow(item) {
		return (			
            <Card style={{container:{borderRadius: 15}}}>
                <TouchableOpacity style={{flexDirection: 'row', padding: 5}} onPress={() => this.props.navigation.navigate('MemberProfile', {user: item})}>
                    <View style={{justifyContent: "center"}}>
                        <FastImage style = {{width: 60, height: 60, borderRadius: 30, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                        source = {{uri: item.picture}}
                        />
                    </View>
                    <View style={{flex:1, marginLeft: 7, paddingVertical: 9}}>
                        <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                            <Text style={{flex:1, fontSize: 20, fontWeight: 'bold'}}>
                                {item.first_name}
                            </Text>
                            {
                                this.state.edit_flag &&
                    
                                <TouchableOpacity style={styles.iconButton}
                                        onPress={() => this.onRemoveMember(item)}
                                        >
                                    <FontAwesome5 name="trash" size={17} color={stylesGlobal.back_color} />
                                </TouchableOpacity>
                            }
                        </View>    

                        <Text style={{fontSize: 17}}>
                            {item.role}
                        </Text>
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>                
                <FlatList
                    data={this.state.member_list}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => item.id}
                    onRefresh={() => this.renderRefreshControl()}
                    refreshing={this.state.isLoading}
                    initialNumToRender={8}
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
                            left: 20,
                            backgroundColor:stylesGlobal.back_color,
                            borderRadius:100,
                            }}
                            onPress={() => this.onShowSendMessage()}
                        >
                        <FontAwesome5 name="comment"  size={30} color="#fff" />
                    </TouchableOpacity>
                }
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
                            onPress={() => this.onCreateMember()}
                        >
                        <FontAwesome5 name="plus"  size={30} color="#fff" />
                    </TouchableOpacity>
                }

                <Modal
                    style={[styles.modal, styles.modal1]}
                    ref={"modal1"}
                    swipeToClose={this.state.swipeToClose}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>
                    <Text style={{fontSize: 27, marginTop: 25, marginBottom: 25}}>Send Message</Text>         
                    <CheckBox                        
                        title='Email'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        containerStyle={styles.radioButton}
                        onPress={()=>this.setState({send_mode:'Email'})}
                        checked={this.state.send_mode == 'Email'}
                        />

                    <CheckBox                        
                        title='SMS'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        containerStyle={styles.radioButton}
                        onPress={()=>this.setState({send_mode:'SMS'})}
                        checked={this.state.send_mode == 'SMS'}
                        />

                    <CheckBox                        
                        title='Notification'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        containerStyle={styles.radioButton}
                        onPress={()=>this.setState({send_mode:'Notification'})}
                        checked={this.state.send_mode == 'Notification'}
                        />

                    <TextInput
                            style={{width: '90%', height:80, marginTop: 40}}
                            placeholder="Message"                            
                            multiline={true}
                            autoCapitalize = 'none'
                            value={this.state.group_message}
                            onChangeText={(val) => this.updateInputVal(val, 'group_message')}
                        />

                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                        <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                            onPress = {() => this.onSendMessage()}>
                            <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Send Message</Text>
                        </TouchableOpacity>
                    </View>
                    
                </Modal>
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

    iconButton: {
        width: 30,
        height: 30,        
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    },

    modal: {        
        alignItems: 'center',
        width: '90%',        
        height: '80%',
        borderRadius: 10
    },

    radioButton: {
        width: '70%',
        backgroundColor: 'white',
        borderColor: 'white'
    }
});

