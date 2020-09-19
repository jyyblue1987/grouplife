import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
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
            group_list: [{id: 1}, {id: 2}],
            isLoading: false
        })
    }

    renderRefreshControl() {
        this.setState({ isLoading: true })
        this.getGroupList()
    }

    renderRow(item) {
		return (
			<Text>
                Group Name
            </Text>
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
        padding: 35,
    }, 
    
    header: {
        fontSize: 25
    }
    
});

