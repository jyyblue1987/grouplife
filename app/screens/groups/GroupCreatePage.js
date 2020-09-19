import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from 'react-native-material-ui';

import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';

export default class GroupCreatePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false, 
            group_name: '',      
            group_desc: '',     
            group_type: 'ca'
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    render() {
  
        return (
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
                        <Button raised primary text="Upload" />
                    </View>
                </ScrollView>                
            </View>
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
