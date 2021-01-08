import React, { useState, useEffect } from 'react';
import {Component} from 'react';

import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioButtonRN from 'radio-buttons-react-native';
import { Card } from 'react-native-material-ui';
import {actions, getContentCSS, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import { Icon } from 'react-native-material-ui';

export default function MaterialCreatePage(props) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [type, setType] = useState(1)

    const material_type_list = [
        { label: 'Freeform Text', type: 1},
        { label: 'Upload File', type: 2 }
    ];

    const initHTML = "";

    const richText = React.createRef();
    linkModal = React.createRef();

    useEffect(() => {
        setContent("Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>")        
    })

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
        console.log('Keyup:', data);
    }

    const onSaveMaterial = async() => {
        let html = await richText.current?.getContentHtml();
        console.log(html);
    }

    const onCancelMaterial = () => {                
        richText.current?.setContentHTML(initHTML);
    }

    const onInsertLink = () => {
        // this.richText.current?.insertLink('Google', 'http://google.com');
        linkModal.current?.setModalVisible(true);
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
