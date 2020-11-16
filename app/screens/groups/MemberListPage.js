import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore} from '../../../database/firebase';

export default class MemberListPage extends Component {
    constructor(props) {
        super(props);

        var group = this.props.route.params.group;
        let uid = firebase.auth().currentUser.uid;

        this.state = {
            isLoading: false,
            group: this.props.route.params.group,
            member_list: [],
            edit_flag: uid == group.created_by
        }
    }

    componentDidMount() {
        this.renderRefreshControl();
    }

    getMemberList() {
        this.setState({
            member_list: [],
            isLoading: true
        });

        firestore.collection("member_list")
            .where("user_id", "in", this.state.group.member_list)
            .get().then((querySnapshot) => {
                var list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    data.id = doc.id;
                    list.push(data);
                    
                });

                this.setState({
                    member_list: list,
                    isLoading: false,
                });
            }); 
    }

    renderRefreshControl() {
        this.setState({ isLoading: true })
        this.getMemberList()
    }

    onRemoveMember = (item) => {
        Alert.alert(
            'Delete Member',
            'Are you sure to delelet "' + item.first_name + '"?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Yes', onPress: () => this.removeMember(item) }
                ],
                { cancelable: false }
            );
    }

    removeMember(item) {
        this.setState({            
            isLoading: true
        });
        
        var group = this.props.route.params.group;
        var member_list = this.state.member_list.filter(row => {
            return item.user_id != row.user_id;
        });

        member_list = [... member_list];
        
        var user_ids = member_list.map(row => {
            return row.user_id;
        });

        console.log("User IDs", JSON.stringify(user_ids));

        firestore.collection("group_list")
            .doc(group.id)
            .update({member_list: user_ids})
            .then(function() {
                this.setState({
                        isLoading: false,
                        member_list: member_list
                    });
            }).catch(function(error) {
                Alert.alert("Failed to delete member", JSON.stringify(error));
            });
    }

    renderRow(item) {
		return (			
            <Card style={{container:{borderRadius: 15}}}>
                <TouchableOpacity style={{flexDirection: 'row', padding: 5}} onPress={() => this.props.navigation.navigate('MemberProfile', {user: item})}>
                    <View style={{justifyContent: "center"}}>
                        <FastImage style = {{width: 60, height: 60, borderRadius: 30, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                        source = {{uri: item.picture}}
                        />
                    </View>
                    <View style={{flex:1, marginLeft: 7, paddingVertical: 9}}>
                        <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                            <Text style={{flex:1, fontSize: 20, fontWeight: 'bold'}}>
                                {item.first_name}
                            </Text>
                            {
                                this.state.edit_flag &&
                    
                                <TouchableOpacity style={styles.iconButton}
                                        onPress={() => this.onRemoveMember(item)}
                                        >
                                    <FontAwesome5 name="trash" size={17} color={stylesGlobal.back_color} />
                                </TouchableOpacity>
                            }
                        </View>    

                        <Text style={{fontSize: 17}}>
                            {item.role}
                        </Text>
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>                
                <FlatList
                    data={this.state.member_list}
                    renderItem={({item}) => this.renderRow(item)}
                    keyExtractor={(item, index) => item.id}
                    onRefresh={() => this.renderRefreshControl()}
                    refreshing={this.state.isLoading}
                    initialNumToRender={8}
                />
                {
                    this.state.edit_flag &&
                    <TouchableOpacity
                        style={{
                            borderWidth:1,
                            borderColor:'rgba(0,0,0,0.2)',
                            alignItems:'center',
                            justifyContent:'center',
                            width:70,
                            height:70,
                            position: 'absolute',                                          
                            bottom: 20,                                                    
                            right: 20,
                            backgroundColor:stylesGlobal.back_color,
                            borderRadius:100,
                            }}                        
                            onPress={() => onGoEdit()}
                        >
                        <FontAwesome5 name="plus"  size={30} color="#fff" />
                    </TouchableOpacity>
                }
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

    iconButton: {
        width: 30,
        height: 30,        
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center'
    }
    
});

