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
                    isLoading: true,                    
                    picture: uri,                    
                });
                
                this.uploadImage(uri, 'image/jpeg')
                    .then(url => { 
                        this.setState({picture: url, isLoading: false});
                        console.log("Upload URL = ", url);

                    })
                    .catch(error => {
                        this.setState({picture: '', isLoading: false});
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

    onSaveProfile = () => {
        console.log("On Save Profile", JSON.stringify(this.state));
        this.setState({isLoading: true});

        var data = {
            user_id: this.state.user_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            picture: this.state.picture,
            email: this.state.email,
            phone: this.state.phone,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            desc: this.state.desc,
            role: this.state.role,
        };

        var vm = this;
        var userRef = firestore.collection("member_list").doc(this.state.id);        
        
        userRef.set(data).then(function(doc) {
            const { navigation, route } = vm.props;
            navigation.goBack();
            route.params.onUpdated({ updated: true });
        }).catch(function(error) {
            console.log("Error setting group:", error);
        }); 
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
                        <Button title="Save" type="clear" titleStyle={{color:stylesGlobal.back_color}} onPress = {() => this.onSaveProfile()} />
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
