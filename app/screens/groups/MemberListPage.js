import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Card } from 'react-native-material-ui';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';


export default class MemberListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            group: this.props.route.params.group,
            member_list: [],
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

    renderRow(item) {
		return (			
            <Card style={{container:{borderRadius: 15}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row', padding: 5}} onPress={() => this.props.navigation.navigate('MemberProfile', {user: item})}>
                    <View style={{justifyContent: "center"}}>
                        <FastImage style = {{width: 60, height: 60, borderRadius: 30, borderColor: stylesGlobal.back_color, borderWidth: 2}} 
                        source = {{uri: item.picture}}
                        />
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {item.first_name}
                        </Text>

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
    }
    
});

