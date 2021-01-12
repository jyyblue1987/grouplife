import React, { useState, useEffect } from 'react';
import {Component} from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioButtonRN from 'radio-buttons-react-native';
import { Card } from 'react-native-material-ui';
import {actions, getContentCSS, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import * as Progress from 'react-native-progress';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';

import { stylesGlobal } from '../../styles/stylesGlobal';
import {linkify} from '../../Utils';

import firebase from '../../../database/firebase';
import { firestore } from '../../../database/firebase';
import { Icon } from 'react-native-material-ui';
import storage from '@react-native-firebase/storage';

import Moment from 'moment';

export default function MaterialCreatePage(props) {
    const [title, setTitle] = useState("")
    const [type, setType] = useState(1)
    const [isUploading, setUploading] = useState(false)
    const [upload_progress, setUploadProgress] = useState(0)
    const [filename, setFileName] = useState("")
    const [downloadUrl, setDownloadUrl] = useState("")
    const [fileType, setFileType] = useState("")

    const group = props.route.params.group;

    const material_type_list = [
        { label: 'Freeform Text', type: 1},
        { label: 'Upload File', type: 2 }
    ];

    const initHTML = "";

    const richText = React.createRef();
    linkModal = React.createRef();

    
    useEffect(() => {
        
    }, [])

    const onSelectType = (item) => {
        setType(item.type);
    }

    const onEditorInitialized = () => {
        console.log("onEditorInitialized");
    }

    const onChangeHTML = (html) => {
        consoe.log(html);
    }

    const handleKeyUp = data => {
        // console.log('Keyup:', data);
    }

    const onSaveMaterial = async() => {
        let html = await richText.current?.getContentHtml();
        console.log(html);

        var data = {};
        data.title = title;
        data.type = type;

        var cur_time = Moment().format('YYYY-MM-DD HH:mm:ss');
        data.created_at = cur_time;
        data.created_by = firebase.auth().currentUser.uid;
        
        if( type == 1 ) // free text
            data.content = linkify(html);            
        else
        {
            data.content = downloadUrl;
            data.filename = filename;
            data.filetype = fileType;
        }

        console.log(data);

        const ref = await firestore.collection("group_list")
            .doc(group.id)
            .collection("material_list")
            .add(data);

        if( ref )
        {          
            console.log("Material is created with");

            const { navigation, route } = props;
            navigation.goBack();
            route.params.onRefresh({ created: true });
        }
        else
        {
            console.error("Error");
        }
    }

    const onCancelMaterial = () => {                
        richText.current?.setContentHTML(initHTML);
    }

    const onInsertLink = () => {
        // this.richText.current?.insertLink('Google', 'http://google.com');
        linkModal.current?.setModalVisible(true);
    }

    const onShowDocumentPicker = async() => {
        // Pick a single file
        try {
            const res = await DocumentPicker.pick({
                
            });
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );

            uploadFile(res.uri, res.name, res.type, res.size);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const onShowDocumentPicker1 = async() => {
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
                
                uploadFile(uri, "document", "pdf", 100);               
            }
            
        });
    }


    const uploadFile = async(uri, name, type, size) => {
        const fname = firebase.auth().currentUser.uid + "_" + name;
        console.log('filename------------', fname);

        setFileName(name);
        setFileType(type);

        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        console.log("uploadUri-----------", uploadUri);

        uploadTask = storage().ref("/materials/" + fname).putFile(uploadUri)
        setUploading(true);
        uploadTask.on( 'state_changed', async(snapshot) => {
                switch (snapshot.state) {
                    case 'running':
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                        if( progress <= 1.0 )
                            setUploadProgress(progress)

                        console.log(snapshot.bytesTransferred + ' is transferred in total ' + snapshot.totalBytes);  
                        break;
                    case 'success':
                        url = await snapshot.ref.getDownloadURL();
                        console.log('---------- success = ', url); 

                        setUploading(false);
                        setDownloadUrl(url);

                        break;
                    default:
                        break;
                }
            },
            err => {
                console.error(err);               
                setUploading(false);                
            },
        )
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{width:'100%'}}>
                <Card style={{container: {borderRadius: 10, paddingBottom: 10}}}>
                    <RadioButtonRN 
                        data={material_type_list}
                        selectedBtn={e => onSelectType(e)}
                        initial={1}
                        box={false}
                        icon={
                            <Icon
                                name="check-circle"
                                size={25}
                                color={stylesGlobal.back_color}
                            />
                        }
                        />
                </Card>

                <TextInput
                        style={[stylesGlobal.inputStyle, {marginTop: 35, marginLeft: 20, height:30}]}
                        placeholder="Title"
                        autoCapitalize = 'none'
                        multiline={true}
                        value={title}                        
                        onChangeText={(val) => setTitle(val)}
                    />

                {
                    type == 1 && 
                    <View>
                        <RichToolbar
                                style={[styles.richBar]}
                                flatContainerStyle={styles.flatStyle}
                                editor={richText}
                                selectedIconTint={'#2095F2'}
                                disabledIconTint={'#bfbfbf'}
                                onInsertLink={onInsertLink}
                            />

                        <RichEditor
                            ref={richText}
                            initialContentHTML={initHTML}
                            style={styles.rich}
                            editorInitializedCallback={() => onEditorInitialized()}
                            onChange={(html) => onChangeHTML(html)}
                            onFocus={() => onChangeHTML("Focus")}
                            onKeyUp={(data) => handleKeyUp(data)}
                            />
                    </View>
                }

                {
                    type == 2 &&
                    <View>
                        <View style={{width: '100%', flexDirection: 'row', marginTop: 15, paddingHorizontal: 5}}>
                            <Text
                                style={{flex:1, fontSize: 18, alignSelf:'center'}}
                                >
                                File Upload
                            </Text>              
                            <Button title="Choose File" buttonStyle={{backgroundColor:stylesGlobal.back_color,borderRadius:6}} onPress = {() => onShowDocumentPicker()} />
                        </View>

                        <View style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
                            <Text style={{fontSize: 18}}>{filename}</Text>
                        </View>
                    </View>
                }

                <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>
                    <TouchableOpacity style = {{flex: 1, height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5}} 
                        onPress = {() => onSaveMaterial()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style = {{flex: 1, height: 40, backgroundColor: stylesGlobal.back_color, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5}} 
                        onPress = {() => onCancelMaterial()}>
                        <Text style = {[stylesGlobal.general_font_style, {color: '#fff', fontSize: 16}]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                    

            </KeyboardAwareScrollView>

            {
                isUploading && <View style={stylesGlobal.preloader}>
                    <Progress.Bar progress={upload_progress} width={200} />
                </View>
            } 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },

    richBar: {
        borderColor: '#efefef',
        borderTopWidth: StyleSheet.hairlineWidth,
    },

    flatStyle: {
        paddingHorizontal: 12,
    },

    rich: {
        minHeight: 300,
        flex: 1,
    },
});  
