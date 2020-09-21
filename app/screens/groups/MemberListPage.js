import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-material-ui';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class MemberListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            member_list: [],
        }
    }

    UNSAFE_componentWillMount() {
        this.renderRefreshControl();
    }

    getMemberList() {
        this.setState({
            member_list: [{id: 1}, {id: 2}, {id: 3}],
            isLoading: false
        })
    }

    renderRefreshControl() {
        this.setState({ isLoading: true })
        this.getMemberList()
    }

    renderRow(item) {
		return (			
            <Card style={{container:{borderRadius: 15}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row', padding: 5}} onPress={() => this.props.navigation.navigate('MemberProfile', {group: item})}>
                    <View style={{justifyContent: "center"}}>
                        <Image style = {{width: 60, height: 60, borderRadius: 30, borderColor: stylesGlobal.back_color, borderWidth: 2}} source = {require("../../assets/images/group_image.jpg")}/>
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Michael Snow
                        </Text>

                        <Text style={{fontSize: 17}}>
                            Group Leader
                        </Text>
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && <View style={stylesGlobal.preloader}>
                        <ActivityIndicator size="large" color="#9E9E9E"/>
                    </View>
                }              
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

