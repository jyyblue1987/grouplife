import * as React from 'react';
import {Component} from 'react';

import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';

export default class MaterialListPage extends Component {
    constructor(props) {
        super(props);

        var group = this.props.route.params.group;
        let uid = firebase.auth().currentUser.uid;

        this.state = {
            isLoading: false,            
            material_list: [],          
            edit_flag: uid == group.created_by
        }
    }

    componentDidMount() {
        this.initListener = this.props.navigation.addListener('focus', this.initData.bind(this));        
    }

    initData = async() => {
        console.log('MaterialListPage initData');
        this.renderRefreshControl();
    }

    renderRefreshControl() {
        this.setState({ isLoading: true, material_list: [] });

        // this.getEventList();        
    }

    render() {
  
        return (
            <View style={styles.container}>          
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
                            onPress={() => this.onGoCreate()}
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
        paddingVertical: 20,
        paddingHorizontal: 10,
    },  
    
});
