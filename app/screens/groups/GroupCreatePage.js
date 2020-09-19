import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from 'react-native-material-ui';
import ImagePicker from 'react-native-image-picker';

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
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class GroupCreatePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false, 
            group_name: '',      
            group_desc: '',     
            group_type: 'ca',
            image_uri: '',
        }
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
                this.setState({
                    image_uri: response.uri,                    
                })                
            }
        });
    }

    render() {
  
        return (
            <ThemeContext.Provider value={getTheme(uiTheme)}>
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
                <ScrollView style={{width:'100%'}}>
                    <View style = {{width: '100%', height: 80, justifyContent: 'center'}}>
                        <Text
                            style={styles.header}
                            >
                            Create Group
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

                    <DropDownPicker 
                        items={[
                            {label: 'Church Affiliation', value: 'ca'},
                            {label: 'Group Type1', value: 'gt1'}
                        ]}
                        defaultValue={this.state.group_type}
                        containerStyle={{height:40}}
                        style={{backgroundColor:'#fafafa'}}
                        itemStyle={{justifyContent: 'flex-start'}}
                        dropDownStyle={{backgroundColor:'#fafafa'}}
                        onChangeItem={item => this.setState({
                            group_type: item.value
                        })}
                    />

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>
                        <Text
                            style={{flex:1, fontSize: 18, alignSelf:'center'}}
                            >
                            Select a Cover Photo
                        </Text>              
                        <Button raised primary text="Upload" onPress = {() => this.showImagePicker()} />
                    </View>

                    <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source={this.state.image_uri != "" ? {uri: this.state.image_uri} : {}}></Image>
                </ScrollView>                
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
        paddingVertical: 0,
        paddingHorizontal: 10,
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    }
    
});
