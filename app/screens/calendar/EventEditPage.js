import * as React from 'react';
import {Component} from 'react';

import {    
    Platform,
} from 'react-native';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Progress from 'react-native-progress';
import storage from '@react-native-firebase/storage';

import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

// you can set your style right here, it'll be propagated to application
const uiTheme = {
    palette: {
        primaryColor: stylesGlobal.back_color,
    },
    button: {
        upperCase: false,
    },
};

import { firestore } from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class EventEditPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            errors: [],
            uploadState: null,
            uploadTask: null,
            percentUploaded: 0,
        }

        var state = {...this.props.route.params.user};
        state.isLoading = false;
        state.isUploading = false;
        state.upload_progress = 0;
        this.state = state;
    }

    componentDidMount() {
        
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
                    picture: uri,                    
                });
                
                this.uploadImage(uri)
                    // .then(url => { 
                    //     this.setState({picture: url, isUploading: false});
                    //     console.log("Upload URL = ", url);

                    // })
                    // .catch(error => {
                    //     this.setState({picture: '', isUploading: false});
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
            uploadTask: storage().ref("/profileImages/" + filename).putFile(uploadUri)
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
                                    this.setState({ uploadState: 'done', picture: downloadUrl, isUploading: false})
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
                            picture: ""
                        });
                    },
                )
            }
        )
    }

    onSaveEvent = () => {
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
                <KeyboardAwareScrollView style={{width:'100%'}}>                 
                    <TextInput
                            style={[stylesGlobal.inputStyle, {marginTop: 35}]}
                            placeholder="Event Name"
                            autoCapitalize = 'none'
                            value={this.state.name}
                            onChangeText={(val) => this.updateInputVal(val, 'name')}
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
                            value={this.state.video_conf_link}
                            onChangeText={(val) => this.updateInputVal(val, 'video_conf_link')}
                        />

                    <View style = {{width: '100%', alignItems: 'center', marginTop: 50}}>
                    <TouchableOpacity style = {{width: '90%', height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center'}} 
                        onPress = {() => this.saveEvent()}>
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
