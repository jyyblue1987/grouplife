import React, { useState } from 'react';
import {Component} from 'react';

import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RadioButtonRN from 'radio-buttons-react-native';
import { Card } from 'react-native-material-ui';

import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import { Icon } from 'react-native-material-ui';

export default function MaterialCreatePage(props) {
    const [title, setTitle] = useState("")
    const material_type_list = [
        { label: 'Freeform Text', type: 1},
        { label: 'Upload File', type: 2 }
    ];

    const onSelectType = (type) => {
        console.log(type);
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
                        style={[stylesGlobal.inputStyle, {marginTop: 35, marginLeft: 20}]}
                        placeholder="Title"
                        autoCapitalize = 'none'
                        value={title}
                        onChangeText={(val) => setTitle(val)}
                    />
                

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
    }
});  
