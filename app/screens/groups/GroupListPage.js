import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-material-ui';
import { SearchBar } from 'react-native-elements';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';
import Moment from 'moment';

export default class GroupListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            group_list: [],
            isSearchVisible: false,
            search: '',            
        }
    }

    UNSAFE_componentWillMount() {
        this.renderRefreshControl();
    }

    getGroupList() {
        firestore.collection("group_list").get().then((querySnapshot) => {
            var group_list = [];

            querySnapshot.forEach((doc) => {
                console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                var data = doc.data();
                data.id = doc.id;

                group_list.push(data);
            });

            this.setState({
                group_list: group_list,
                isLoading: false
            })
        });        
    }

    searchGroupList(search) {
        this.setState({ isLoading: true });
        firestore.collection("group_list")
            .where('group_name', '>=', search)
            .where('group_name', '<=', search + '~')
            .get().then((querySnapshot) => {
                var group_list = [];

                querySnapshot.forEach((doc) => {
                    console.log("Data is feteched", doc.id, JSON.stringify(doc.data()));                
                    var data = doc.data();
                    data.id = doc.id;

                    group_list.push(data);
                });

                this.setState({
                    group_list: group_list,
                    isLoading: false
                })
            });
    }

    renderRefreshControl() {
        this.setState({ isLoading: true });
        if( this.state.isSearchVisible == false )
            this.getGroupList();
        else
            this.searchGroupList(this.state.search);
    }

    onShowSearch() {
        console.log("onShowSearch");
        this.setState({
            isSearchVisible: true,
        });
    }

    updateSearch = (search) => {        
        this.setState({search: search});
    }

    onSubmitSearch = () => {
        console.log("Submit", this.state.search);
        this.searchGroupList(this.state.search);
    }

    onCancelSearch = () => {
        this.setState({isSearchVisible: false, search: ''});
        this.renderRefreshControl();
    }

    onClearSearch = () => {
        this.onSubmitSearch();
    }

    onCreated = data => {
        console.log("Back to Home", JSON.stringify(data));
        if( data.created == true )
            this.renderRefreshControl();
    }

    onGoCreate = () => {
        this.props.navigation.navigate('GroupCreate', { onCreated: this.onCreated });
    }



    renderRow(item) {
		return (			
            <Card style={{container:{borderRadius: 6}}}>
                <TouchableOpacity style={{flex:1, flexDirection: 'row'}} onPress={() => this.props.navigation.navigate('GroupDetail', {group: item})}>
                    <View style={{justifyContent: "center"}}>
                        <Image style = {{width: 100, height: '100%'}} source = {{uri: item.group_image}}/>
                    </View>
                    <View style={{width:'100%', marginLeft: 7, paddingVertical: 9}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            {item.group_name}
                        </Text>

                        <Text style={{fontSize: 17}}>
                            {item.group_desc}
                        </Text>

                        <View style = {{width: '100%', borderWidth:0.5, borderColor:'lightgray', marginTop: 15, marginBottom: 7}} />

                        <Text style={{fontSize: 16, color: 'gray'}}>
                            {Moment(item.created_at).format('dddd LT')}
                        </Text>
                    </View>    
                </TouchableOpacity> 
            </Card>
		)
	}

    render() {
  
        return (
            <View style={styles.container}>
                <View style = {{width: '100%', height: 80, justifyContent: 'center'}}>
                    <Text
                        style={styles.header}
                        >
                        {this.state.isSearchVisible ? 'Search Groups' : 'My Groups'}
                    </Text>
                </View>

                {
                    this.state.isSearchVisible && <SearchBar 
                        placeholder="group..."
                        searchIcon={{size: 28}}
                        containerStyle={stylesGlobal.searchcontainer}                               
                        inputContainerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}                    
                        placeholderTextColor={'gray'}
                        platform="ios"
                        autoCapitalize='none'
                        showCancel={true}
                        onChangeText={this.updateSearch}
                        onSubmitEditing={this.onSubmitSearch}                        
                        onCancel={this.onCancelSearch}
                        onClear={this.onClearSearch}
                        value={this.state.search}
                    />
                }

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
                        left: 10,
                        backgroundColor:stylesGlobal.back_color,
                        borderRadius:100,
                        }}
                        onPress={() => this.onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>

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
                        onPress={() => this.onShowSearch()}
                    >
                    <FontAwesome5 name="search"  size={30} color="#fff" />
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

