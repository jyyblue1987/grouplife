import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-material-ui';
import firebase from '../../../database/firebase';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class GroupListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            group_list: [],
        }
    }

    UNSAFE_componentWillMount() {
        this.renderRefreshControl();
    }

    getGroupList() {
        this.setState({
            group_list: [{id: 1}, {id: 2}, {id: 3}],
            isLoading: false
        })
    }

    renderRefreshControl() {
        this.setState({ isLoading: true })
        this.getGroupList()
    }

    renderRow(item) {
		return (			
            <Card>
                <View style={{flex:1, flexDirection: 'row'}}>
                    <View style={{justifyContent: "center"}}>
                        <Image style = {{width: 100, height: '100%'}} source = {require("../../assets/images/logo.png")}/>
                    </View>
                    <View style={{width:'100%'}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                            Downtown Group
                        </Text>

                        <Text style={{fontSize: 18}}>
                            Woodside Detroit
                        </Text>

                        <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15, marginBottom: 7}} />

                        <Text style={{fontSize: 16, color: 'gray'}}>
                            Monday, 6:30 PM
                        </Text>
                    </View>    
                </View> 
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
                <View style = {{width: '100%', height: 80, justifyContent: 'center'}}>
                    <Text
                        style={styles.header}
                        >
                        My Groups
                    </Text>
                </View>

                <FlatList
                    data={this.state.group_list}
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
                        onPress={() => this.props.navigation.navigate('GroupCreate')}
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
    }
    
});

