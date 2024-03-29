import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'react-native-material-ui';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
// import firestore from '@react-native-firebase/firestore'
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

import LeaderListComponent from './LeaderListComponent';

//import RNFetchBlob from 'rn-fetch-blob';

// // Prepare Blob support
// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob;

// you can set your style right here, it'll be propagated to application
const uiTheme = {
    palette: {
        primaryColor: stylesGlobal.back_color,
    },
    button: {
        upperCase: false,
    },
};

import firebase from '../../../database/firebase';
import { firestore} from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import storage from '@react-native-firebase/storage';

export default class GroupCreatePage extends Component {  
    constructor(props) {
        super(props);

        var group = this.props.route.params.group;

        

        if( group == null )
        {
            this.state = {
                title: 'Create Group',
                edit_label: 'Create', 
                isLoading: false,                        
                group_name: '',      
                group_desc: '',                 
                group_type: '',
                image_uri: '',
                group_image: '',
                day_flag: [false, false, false, false, false, false, false],
                timepicker_show: false,
                date: new Date(),
                meeting_time: 'Meeting Time',
                occurence: '2',
                location: '',
                event_title: '',
                event_desc: '',
                video_conf_link: '',
                phone_conf_link: '',
                leader_name: '',
                leader_phone: '',
                leader_email: '',      
                created_by: '',     
                isUploading: false, 
                upload_progress: 0, 
                leader_list: []
            }
        }
        else
        {
            this.state = {
                title: 'Edit Group',
                edit_label: 'Save',
                isLoading: false,                        
                group_name: group.group_name,      
                group_desc: group.group_desc,                 
                group_type: group.group_type,
                image_uri: '',
                group_image: group.group_image,
                day_flag: group.day_flag,
                timepicker_show: false,
                date: new Date(),
                meeting_time: group.meeting_time,
                occurence: group.occurence,
                location: group.location,
                event_title: group.event_title,
                event_desc: group.event_desc,
                video_conf_link: group.video_conf_link,
                phone_conf_link: group.phone_conf_link,
                leader_name: group.leader_name,
                leader_phone: group.leader_phone,
                leader_email: group.leader_email,      
                created_by: group.created_by,     
                isUploading: false, 
                upload_progress: 0, 
                leader_list: group.leader_list
            }
        }
    }

    componentDidMount() {        
        var group = this.props.route.params.group;
        if( group == null )
            this.props.navigation.setOptions({title: 'Create Group'});
        else
            this.props.navigation.setOptions({title: 'Edit Group'});        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    showImagePicker = async() => {
        var options = {
            title: 'Select Image',
            mediaType: 'photo',
            quality: 1.0,
            allowsEditing: true,
            noData: true,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                var uri = response.uri;
                console.log(uri);
                this.setState({
                    isUploading: true,
                    image_uri: uri,                    
                });
                
                this.uploadImage(uri)
                // this.uploadImage(uri, 'image/jpeg')
                    // .then(url => { 
                    //     this.setState({group_image: url, isUploading: false});
                    //     console.log("Upload URL = ", url);

                    // })
                    // .catch(error => {
                    //     this.setState({group_image: '', isUploading: false});
                    //     console.log(error)
                    // });

            }
            
        });
    }

    uploadImage = (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        console.log('filename------------', filename);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        console.log("uploadUri-----------", uploadUri);

        this.setState({
            uploadTask: storage().ref("/images/" + filename).putFile(uploadUri)
        },
            () => {
                this.state.uploadTask.on( 'state_changed', snapshot => {
                        switch (snapshot.state) {
                            case 'running':
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                                if( progress <= 1.0 )
                                    this.setState({upload_progress: progress});

                                console.log(snapshot.bytesTransferred + ' is transferred in total ' + snapshot.totalBytes);  
                                break;
                            case 'success':
                                snapshot.ref.getDownloadURL().then(downloadUrl => {
                                    console.log('---------- success = ', downloadUrl)
                                    this.setState({ uploadState: 'done', group_image: downloadUrl, isUploading: false})
                                });
                                break;
                            default:
                                break;
                        }
                    },
                    err => {
                        console.error(err);
                        this.setState({
                            uploadState: 'error',
                            uploadTask: null,
                            isUploading: false,
                            group_image: ""
                        });
                    },
                )
            }
        )
    }
    // uploadImage(uri, mime = 'application/octet-stream') {
    //     var vm = this;
    //     return new Promise((resolve, reject) => {            
    //         const filename = uri.substring(uri.lastIndexOf('/') + 1);
    //         console.log(filename);
    //         const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    //         console.log("uploadUri", uploadUri);
    //         // create reference
    //         var storageRef = storage.ref();
    //         console.log("imageRef");
    //         var imageRef = storageRef.child("images/" + filename);

    //         let uploadBlob = null
    
    //         fs.readFile(uploadUri, 'base64')
    //             .then((data) => {
    //                 return Blob.build(data, { type: `${mime};BASE64` })
    //             })
    //             .then((blob) => {
    //                 uploadBlob = blob
    //                 var uploadTask = imageRef.put(blob, { contentType: mime });

    //                 uploadTask.on('state_changed', function(snapshot){
    //                     // Observe state change events such as progress, pause, and resume
    //                     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //                     var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
    //                     if( progress <= 1.0 )
    //                         vm.setState({upload_progress: progress});

    //                     console.log(snapshot.bytesTransferred + ' is transferred in total ' + snapshot.totalBytes);                        
    //                 });

    //                 return uploadTask;
    //             })
    //             .then(() => {
    //                 uploadBlob.close()
    //                 return imageRef.getDownloadURL();
    //             })
    //             .then((url) => {
    //                 resolve(url);
    //             })
    //             .catch((error) => {
    //                 reject(error);
    //             })
    //     })
    // }



    setDayFlag(value, num) {
        console.log(value);
        var day_flag = [...this.state.day_flag];
        day_flag[num] = value;
        this.setState({day_flag: day_flag});
    }

    showTimepicker() {
        this.setState({timepicker_show: true});
    }

    onChangeMeetingTime(selectedDate) 
    {
        const currentDate = selectedDate || this.state.date;
        var meeting_time = Moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        console.log(meeting_time);
        this.setState({date: currentDate, meeting_time: meeting_time, timepicker_show: false});
    }

    onCancelMeetingTime() {
        this.setState({timepicker_show: false});
    }

    onAddLeader() {
        var leader_list = [... this.state.leader_list];

        leader_list.push({
            name: this.state.leader_name,
            phone: this.state.leader_phone,
            email: this.state.leader_email,
        });

        this.setState({leader_list: leader_list});

        this.setState({
            leader_name: '',
            leader_phone: '',
            leader_email: '',
        });
    }

    onPressCreateGroup () {
        var group = this.props.route.params.group;
        if( group == null )        
            this.createChatRoom();
        else
            this.updateGroupData();        
    }

    createChatRoom () {
        const { group_name } = this.state
        let member_list = []
        let unread_msg_count_list  = []
        
        member_list.push(firebase.auth().currentUser.uid)

        let unreadMsgCountData = {
            _id: firebase.auth().currentUser.uid,
            count: 0,
        }

        unread_msg_count_list.push(unreadMsgCountData)

        if (group_name.length > 0) {
            // create new thread using firebase & firestore
            firestore
                .collection('MESSAGE_THREADS')
                .add({
                name: group_name,
                latestMessage: {
                    text: `${group_name} created. Welcome!`,
                    createdAt: new Date().getTime()
                },
                member_list,
                unread_msg_count_list,
                })
                .then(docRef => {
                    docRef.collection('MESSAGES').add({
                    text: `${group_name} created. Welcome!`,
                    createdAt: new Date().getTime(),
                    system: true
                    })
                    
                    this.onCreateGroup(docRef.id)
                })
        }
    }

    onCreateGroup = (threadId) => {
        console.log("On Create Group", this.state.group_name);
        this.setState({isLoading: true});

        console.log("Make Data");

        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');

        var data = {
            group_name: this.state.group_name,
            group_desc: this.state.group_desc,
            group_type: this.state.group_type,
            group_image: this.state.group_image,
            day_flag: this.state.day_flag,
            meeting_time: this.state.meeting_time,
            occurence: this.state.occurence,
            location: this.state.location,
            event_title: !this.state.event_title ? '' : this.state.event_title,
            event_desc: !this.state.event_desc ? '' : this.state.event_title,
            video_conf_link: !this.state.video_conf_link ? '' : this.state.video_conf_link,
            phone_conf_link: !this.state.phone_conf_link ? '' : this.state.phone_conf_link,
            leader_name: this.state.leader_name,
            leader_phone: this.state.leader_phone,
            leader_email: this.state.leader_email, 
            leader_list: !this.state.leader_list ? [] : this.state.leader_list,
            created_by: firebase.auth().currentUser.uid,
            created_at: cur_time,
            threadId,
        };

        console.log(JSON.stringify(data));

        var vm = this;
        firestore.collection("group_list").add(data).then(function(docRef) {
            console.log("Group is created with ID:", docRef.id);
            vm.clearInputData(docRef.id);
        }).catch(function(error) {
            console.error("Error adding group: ", error);
            vm.clearInputData();            
        });

        console.log("Make Data End");
    }

    updateGroupData() {
        this.setState({isLoading: true});

        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');

        var data = {
            group_name: this.state.group_name,
            group_desc: this.state.group_desc,
            group_type: this.state.group_type,
            group_image: this.state.group_image,
            day_flag: this.state.day_flag,
            meeting_time: this.state.meeting_time,
            occurence: this.state.occurence,
            location: this.state.location,
            event_title: !this.state.event_title ? '' : this.state.event_title,
            event_desc: !this.state.event_desc ? '' : this.state.event_title,
            video_conf_link: !this.state.video_conf_link ? '' : this.state.video_conf_link,
            phone_conf_link: !this.state.phone_conf_link ? '' : this.state.phone_conf_link,
            leader_name: this.state.leader_name,
            leader_phone: this.state.leader_phone,
            leader_email: this.state.leader_email,            
            leader_list: !this.state.leader_list ? [] : this.state.leader_list,
            updated_at: cur_time,            
        };

        console.log(JSON.stringify(data));

        var vm = this;
        var group = this.props.route.params.group;
        firestore.collection("group_list").doc(group.id).update(data).then(function() {
            console.log("Group is updated");
            vm.goBackPage(data);            
        }).catch(function(error) {
            console.error("Error update group: ", error);
            vm.clearInputData();            
        });
    }

    clearInputData(doc_id)
    {
        if( doc_id )
        {
            const { navigation, route } = this.props;
            navigation.goBack();
            route.params.onCreated({ created: true, doc_id: doc_id });
        }
        else
        {
            Alert.alert("Failed to create group!");
        }
    }

    goBackPage(data)
    {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.onUpdated({ data:  data});
    }

    render() {
  
        return (
            <ThemeContext.Provider value={getTheme(uiTheme)}>
            <View style={styles.container}>                
                <KeyboardAwareScrollView style={{width:'100%'}}>
                    <View style = {{width: '100%', height: 80, marginTop: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text
                            style={[styles.header, {flex: 1}]}
                            >
                            {this.state.title}                            
                        </Text>                            
                    </View>

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Group Name"
                            autoCapitalize = 'none'
                            value={this.state.group_name}
                            onChangeText={(val) => this.updateInputVal(val, 'group_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {height:80}]}
                            placeholder="Group Description"                            
                            multiline={true}
                            autoCapitalize = 'none'
                            value={this.state.group_desc}
                            onChangeText={(val) => this.updateInputVal(val, 'group_desc')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Group Type"
                            autoCapitalize = 'none'
                            value={this.state.group_type}
                            onChangeText={(val) => this.updateInputVal(val, 'group_type')}
                        />

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>
                        <Text
                            style={{flex:1, fontSize: 18, alignSelf:'center'}}
                            >
                            Select a Cover Photo
                        </Text>              
                        <Button title="Upload" buttonStyle={{backgroundColor:stylesGlobal.back_color,borderRadius:6}} onPress = {() => this.showImagePicker()} />
                    </View>
                    {
                        this.state.image_uri != "" && 
                        <Image style = {{width: '100%', height: 300, resizeMode: 'contain', marginTop: 20}} source={this.state.image_uri != "" ? {uri: this.state.image_uri} : {}}></Image>
                    }

                    <Text
                        style={styles.paraText}
                        >
                        Mettings
                    </Text>         
                    <Text
                        style={styles.paraText2}
                        >
                        Add in the information about when and where you meet.
                    </Text>
                    <Text
                        style={styles.paraText3}
                        >
                        Metting Day(s)
                    </Text>
                    <View style={{flexDirection:'row', width: '100%', marginTop:10}}>
                        <View style={{flex:1, flexDirection:'column'}}>
                            <Checkbox label="Monday" value="1" checked={this.state.day_flag[1]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 1)}/>
                            <Checkbox label="Wednesday" value="3" checked={this.state.day_flag[3]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 3)}/>
                            <Checkbox label="Friday" value="5" checked={this.state.day_flag[5]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 5)}/>
                            <Checkbox label="Sunday" value="0" checked={this.state.day_flag[0]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 0)}/>
                        </View>

                        <View style={{flex:1, flexDirection:'column', height: 95}}>
                            <Checkbox label="Tuesday" value="2" checked={this.state.day_flag[2]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 2)}/>
                            <Checkbox label="Thursday" value="4" checked={this.state.day_flag[4]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 4)}/>
                            <Checkbox label="Saturday" value="6" checked={this.state.day_flag[6]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 6)}/>                                                    
                        </View>
                    </View>

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>                        
                        <TouchableOpacity style = {[{width:'100%'}, styles.roundButton]} 
                        onPress = {() => this.showTimepicker()}
                        >
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18}}>{this.state.meeting_time == 'Meeting Time' ? 'Meeting Time' : Moment(this.state.meeting_time).format("hh:mm A")}</Text>
                            <Image style = {{width: 20, height: 20, tintColor: stylesGlobal.back_color}} source = {require("../../assets/images/dropdown.png")}/>
                        </TouchableOpacity>                        
                    </View>

                    <DateTimePickerModal
                        isVisible={this.state.timepicker_show}
                        mode="time"
                        onConfirm = {(date) => this.onChangeMeetingTime(date)}
                        onCancel = {() =>this.onCancelMeetingTime()}
                    />

                    <DropDownPicker 
                        items={[
                            {label: 'Twice a week', value: '1'},
                            {label: 'Once a week', value: '2'},
                            {label: 'Every 2 weeks', value: '3'},
                            {label: 'Once a month', value: '4'},
                        ]}
                        defaultValue={this.state.occurence}
                        containerStyle={{height:45, marginTop: 20}}
                        style={{backgroundColor:'#fafafa'}}
                        itemStyle={{justifyContent: 'flex-start'}}
                        dropDownStyle={{backgroundColor:'#fafafa'}}
                        onChangeItem={item => this.setState({
                            occurence: item.value
                        })}
                    />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Location"
                            autoCapitalize = 'none'
                            value={this.state.location}
                            onChangeText={(val) => this.updateInputVal(val, 'location')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Event Title"
                            autoCapitalize = 'none'
                            value={this.state.event_title}
                            onChangeText={(val) => this.updateInputVal(val, 'event_title')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {height:80, marginTop: 15}]}
                            placeholder={"Event Details \n(Topics, reading materials, questions for discussion)"}                            
                            multiline
                            autoCapitalize = 'none'
                            value={this.state.event_desc}
                            onChangeText={(val) => this.updateInputVal(val, 'event_desc')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Video Conference Link"
                            autoCapitalize = 'none'
                            value={this.state.video_conf_link}
                            onChangeText={(val) => this.updateInputVal(val, 'video_conf_link')}
                        />
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Phone Conference Link"
                            autoCapitalize = 'none'
                            value={this.state.phone_conf_link}
                            onChangeText={(val) => this.updateInputVal(val, 'phone_conf_link')}
                        />

                    <Text
                        style={styles.paraText}
                        >
                        Leader Information
                    </Text>         

                    <LeaderListComponent leader_list={this.state.leader_list} />

                    <Text
                        style={[styles.paraText2, {marginTop:10}]}
                        >
                        Information about the event reader
                    </Text>

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Name"
                            autoCapitalize = 'none'
                            value={this.state.leader_name}
                            onChangeText={(val) => this.updateInputVal(val, 'leader_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Phone Number"
                            autoCapitalize = 'none'
                            value={this.state.leader_phone}
                            onChangeText={(val) => this.updateInputVal(val, 'leader_phone')}
                        />
                   
                   <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Email Address"
                            autoCapitalize = 'none'
                            value={this.state.leader_email}
                            onChangeText={(val) => this.updateInputVal(val, 'leader_email')}
                        />

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15, justifyContent: 'center'}}>                        
                        <TouchableOpacity style = {[{width:'70%', justifyContent: 'center'}, styles.addButton]} 
                        onPress = {() => this.onAddLeader()}
                        >                            
                            <FontAwesome5 name="plus-circle"  size={22} style = {{position: "absolute", left: 4}} color={stylesGlobal.back_color} />
                            <Text style={{color: stylesGlobal.back_color, fontSize: 17, alignContent: 'center'}}>Add Additional Leader</Text>                            
                        </TouchableOpacity>                        
                    </View>

                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                        <TouchableOpacity style = {{width: '95%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                            onPress = {() => this.onPressCreateGroup()}>
                            <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>{this.state.edit_label}</Text>
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
            </ThemeContext.Provider>
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
    paraText: {
        color: stylesGlobal.back_color,
        marginTop: 25,
        fontSize: 20,
        
    },

    paraText2: {
        color: '#383838B2',        
        fontSize: 17,        
    },

    paraText3: {
        color: '#383838',        
        marginTop: 20,
        fontSize: 17,        
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

    addButton: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 32, 
        paddingHorizontal: 8, 
        borderRadius:20, 
        borderColor: stylesGlobal.back_color, 
        borderWidth: 1,        
    },

    checkBox: {
        
    }
    
});
