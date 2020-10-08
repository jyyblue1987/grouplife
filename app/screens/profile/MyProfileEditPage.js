import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

import RNFetchBlob from 'rn-fetch-blob';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob;

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
import { firestore, storage} from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class MyProfileEditPage extends Component {
    constructor(props) {
        super(props);

        var state = {...this.props.route.params.user};
        state.isLoading = false;
        this.state = state;
    }

    UNSAFE_componentWillMount() {
        
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
            allowsEditing: false,
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
                    isLoading: true,                    
                    image_uri: uri,                    
                });
                
                this.uploadImage(uri, 'image/jpeg')
                    .then(url => { 
                        this.setState({group_image: url, isLoading: false});
                        console.log("Upload URL = ", url);

                    })
                    .catch(error => {
                        this.setState({group_image: '', isLoading: false});
                        console.log(error)
                    });

            }
            
        });
    }

    uploadImage(uri, mime = 'application/octet-stream') {
        return new Promise((resolve, reject) => {            
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            console.log(filename);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            console.log("uploadUri", uploadUri);
            // create reference
            var storageRef = storage.ref();
            console.log("imageRef");
            var imageRef = storageRef.child("images/" + filename);

            let uploadBlob = null
    
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                    uploadBlob = blob
                    return imageRef.put(blob, { contentType: mime });
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL();
                })
                .then((url) => {
                    resolve(url);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }



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
        var meeting_time = Moment(currentDate).format('HH:mm');
        this.setState({date: currentDate, meeting_time: meeting_time, timepicker_show: false});
    }

    onCancelMeetingTime() {
        this.setState({timepicker_show: false});
    }

    onAddLeader() {

    }

    onCreateGroup = () => {
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
            leader_name: this.state.leader_name,
            leader_phone: this.state.leader_phone,
            leader_email: this.state.leader_email, 
            created_by: firebase.auth().currentUser.uid,
            created_at: cur_time,
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

    render() {
  
        return (
            <ThemeContext.Provider value={getTheme(uiTheme)}>
            <View style={styles.container}>                
                <ScrollView style={{width:'100%'}}>
                    <View style = {{width: '100%', marginTop: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text
                            style={[styles.header, {flex: 1}]}
                            >
                            My Profile
                        </Text>                            
                        <Button title="Save" type="clear" titleStyle={{color:stylesGlobal.back_color}} onPress = {() => this.onCreateGroup()} />
                    </View>

                    <View style = {{width: '100%', marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
                        <View style={{justifyContent: "center", flex: 1}}>
                            <FastImage style = {{width: 90, height: 90, borderRadius: 45, borderColor: stylesGlobal.back_color, borderWidth: 2}} source = {{uri:this.state.picture}}/>
                        </View>                           
                        <Button title="Upload" buttonStyle={{backgroundColor:stylesGlobal.back_color,borderRadius:6}} onPress = {() => this.showImagePicker()} />
                    </View>

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="First Name"
                            autoCapitalize = 'none'
                            value={this.state.first_name}
                            onChangeText={(val) => this.updateInputVal(val, 'first_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Last Name"
                            autoCapitalize = 'none'
                            value={this.state.last_name}
                            onChangeText={(val) => this.updateInputVal(val, 'last_name')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Phone"
                            autoCapitalize = 'none'
                            value={this.state.phone}
                            onChangeText={(val) => this.updateInputVal(val, 'phone')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Address"
                            autoCapitalize = 'none'
                            value={this.state.address}
                            onChangeText={(val) => this.updateInputVal(val, 'address')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="City, State"
                            autoCapitalize = 'none'
                            value={this.state.city}
                            onChangeText={(val) => this.updateInputVal(val, 'city')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 15}]}
                            placeholder="Country"
                            autoCapitalize = 'none'
                            value={this.state.country}
                            onChangeText={(val) => this.updateInputVal(val, 'country')}
                        />

                    <TextInput
                            style={[stylesGlobal.inputStyle, {height:80}]}
                            placeholder="About Me Description"                            
                            multiline={true}
                            autoCapitalize = 'none'
                            value={this.state.desc}
                            onChangeText={(val) => this.updateInputVal(val, 'desc')}
                        />
                   
                </ScrollView>      
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
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
