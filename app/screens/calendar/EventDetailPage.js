import * as React from 'react';
import {Component} from 'react';
import { Button, ButtonGroup } from 'react-native-elements';

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';

import firebase from '../../../database/firebase';

export default class EventDetailPage extends Component {
    constructor(props) {
        super(props);

        var user = firebase.auth().currentUser;
        var event = this.props.route.params.event;
        
        this.state = {
            isLoading: false,
            event: this.props.route.params.event,
            edit_flag: event.created_by == user.uid,
            attend_index: 1
        }

        console.log(this.state.event);
    }

    componentDidMount() {
    }

    onCreated = data => {

    }

    onUpdateAttend = index => {        
        this.setState({attend_index: index});
    }

    onGoEditPage = () => {        
        var group = this.props.route.params.group;
        var event = this.props.route.params.event;

        this.props.navigation.navigate('EventEdit', { onCreated: this.onCreated, group: group, event: event, title: 'Edit Calendar Event' });
    }


    render() {
        const buttons = ['Yes', 'Maybe', 'No'];
        const attend_index = this.state.attend_index;
        
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }
                <ScrollView style={{width:'100%', paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{fontSize: 40, fontWeight: 'bold'}}>
                                {this.state.event.name}
                            </Text>
                        </View>        
                        {
                            this.state.edit_flag &&
                            <TouchableOpacity style={styles.iconButton}
                                onPress={() => this.onGoEditPage()}
                                >
                                <FontAwesome5Icon name="edit" size={20} color='white' />
                            </TouchableOpacity>
                        }
                    </View> 

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <FontAwesome name="calendar" size={30} color={stylesGlobal.back_color} />
                        <View style={{flex:1}}>
                            <Text style={{fontSize: 20, marginLeft: 10}}>
                                {Moment(this.state.event.event_time).format('dddd, MMM d')}th, {Moment(this.state.event.event_time).format('HH:mm')}
                            </Text>
                        </View>
                    </View>  

                    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{fontSize: 20}}>
                            Attending:
                        </Text>
                        <View style={{flex:1}}>
                            <ButtonGroup
                                onPress={(index) => this.onUpdateAttend(index)}
                                selectedIndex={attend_index}
                                buttons={buttons}                                
                                />
                        </View>
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
        paddingBottom: 35,        
    }, 

    iconButton: {
        width: 45,
        height: 45,
        backgroundColor: stylesGlobal.back_color,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    }
    
    
});