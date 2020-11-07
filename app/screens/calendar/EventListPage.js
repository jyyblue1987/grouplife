import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { SearchBar } from 'react-native-elements';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import Moment from 'moment';

export default class EventListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            event_list: [],          
        }
    }

    componentDidMount() {
        this.renderRefreshControl();
    }

    getEventList() {
        var user = firebase.auth().currentUser;
        if( user == null )
        {
            console.log("Invalid User");
            return;    
        }

        var group = this.props.route.params.group;

        var user_id = user.uid;
        console.log("User ID = ", user_id);
        this.setState({ isLoading: true });
        firestore.collection("group_list")
            .doc(group.id)
            .collection('event_list')
            .get().then((querySnapshot) => {
                var event_list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    data.id = doc.id;

                    event_list.push(data);                    
                });

                this.setState({
                    event_list: event_list,
                    isLoading: false
                })
            });        
    }

    renderRefreshControl() {
        this.setState({ isLoading: true });
        this.getEventList();        
    }

 

    onCreated = data => {
        console.log("Back to Eventlist", JSON.stringify(data));
        if( data.created == true )
        {
            this.renderRefreshControl();    
        }
    }

    onGoCreate = () => {        
        var group = this.props.route.params.group;
        this.props.navigation.navigate('EventEdit', { onCreated: this.onCreated, group: group, event: null });
    } 

    renderRow(item) {
        var group = this.props.route.params.group;
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={() => this.props.navigation.navigate('EventEdit', {group: group, event: item, onCreated: this.onCreated})}>
                    <View style={{justifyContent: "center", alignItems:"center", width: 80, backgroundColor: stylesGlobal.back_color}}>
                        <Text style={{fontSize:38, color: 'white', fontWeight: 'bold'}}>
                            {Moment(item.event_time).format('d')}
                        </Text>

                        <Text style={{fontSize:20, color: 'white'}}>
                            {Moment(item.event_time).format('MMM')}
                        </Text>
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {item.name}
                        </Text>

                        <Text style={{fontSize: 17, color:'gray'}}>
                            {item.location}
                        </Text>

                        <View style={{width: '100%', height: 30, marginTop: 10, flexDirection:'row', alignContent: 'center'}}>
                            <View style={{width:80}}>
                                <FastImage style = {[styles.member_icon, {left: 0}]} source = {require("../../assets/images/group_image_detail.jpg")}/>
                                <FastImage style = {[styles.member_icon, {left: 20}]} source = {require("../../assets/images/group_image_detail.jpg")}/>
                                <FastImage style = {[styles.member_icon, {left: 40}]} source = {require("../../assets/images/group_image_detail.jpg")}/>
                            </View>
                            <View style={{lexDirection:'row', alignContent: 'center'}}>
                                <Text style={{fontSize: 17, color:'gray'}}>
                                    +{item.member_list.length} Others RSVP'd
                                </Text>
                            </View>
                        </View>
                        
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>          
                <FlatList
                    data={this.state.event_list}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => item.id}
                    onRefresh={() => this.renderRefreshControl()}
                    refreshing={this.state.isLoading}
                    initialNumToRender={8}
                />
           
                <TouchableOpacity
                    style={{
                        borderWidth:1,
                        borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:70,
                        height:70,
                        position: 'absolute',                                          
                        bottom: 10,                                                    
                        right: 10,
                        backgroundColor:stylesGlobal.back_color,
                        borderRadius:100,
                        }}                        
                        onPress={() => this.onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 35,
        paddingHorizontal: 10,
    }, 
    
    header: {
        fontSize: 30,
        fontWeight: 'bold'
    },

    member_icon: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        borderColor: stylesGlobal.back_color, 
        borderWidth: 2, 
        position: 'absolute'
    }


    
});

