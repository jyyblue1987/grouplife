import * as React from 'react';
import {Component} from 'react';

import Moment from 'moment';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Checkbox } from 'react-native-material-ui';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
            day_flag: [true, true, true, true, true, true, true],
            timepicker_show: false,
            date: new Date(),
            meeting_time: 'Meeting Time',
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
                        containerStyle={{height:45}}
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
                        <Button raised primary text="Upload" upperCase={false} onPress = {() => this.showImagePicker()} />
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
                                onCheck = {(value) => this.setDayFlag(value, 3)}/>
                            <Checkbox label="Sunday" value="0" checked={this.state.day_flag[0]}
                                style={{label: {color:'#383838B2'}, container: {height: 30}}}
                                onCheck = {(value) => this.setDayFlag(value, 0)}/>
                        </View>

                        <View style={{flex:1, flexDirection:'column', alignItems: 'flex-start'}}>
                            <Checkbox label="Tuesday" value="2" checked={this.state.day_flag[2]}
                                style={{label: {color:'#383838B2'}}}
                                onCheck = {(value) => this.setDayFlag(value, 2)}/>
                            <Checkbox label="Thursday" value="4" checked={this.state.day_flag[4]}
                                style={{label: {color:'#383838B2'}}}
                                onCheck = {(value) => this.setDayFlag(value, 4)}/>
                            <Checkbox label="Saturday" value="6" checked={this.state.day_flag[6]}
                                style={{label: {color:'#383838B2'}}}
                                onCheck = {(value) => this.setDayFlag(value, 6)}/>                           
                        </View>
                    </View>

                    <View style={{width: '100%', flexDirection: 'row', marginTop: 15}}>                        
                        <TouchableOpacity style = {[{width:'100%'}, styles.showdowButton]} 
                        onPress = {() => this.showTimepicker()}
                        >
                            <Text style={{flex:1, color: '#383838B2', fontSize: 18}}>{this.state.meeting_time}</Text>
                            <Image style = {{width: 20, height: 20, tintColor: stylesGlobal.back_color}} source = {require("../../assets/images/dropdown.png")}/>
                        </TouchableOpacity>                        
                    </View>

                    <DateTimePickerModal
                        isVisible={this.state.timepicker_show}
                        mode="time"
                        onConfirm = {(date) => this.onChangeMeetingTime(date)}
                        onCancel = {() =>this.onCancelMeetingTime()}
                    />
                   
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

    showdowButton: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 45, 
        paddingHorizontal: 8, 
        borderRadius:8, 
        borderColor: '#383838B2', 
        borderWidth: 1,        
    },

    checkBox: {
        
    }
    
});
