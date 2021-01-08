import React, { useEffect, useState } from 'react';
import {Component} from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { stylesGlobal } from '../../styles/stylesGlobal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';
  
import firebase from '../../../database/firebase';
import { firestore, storage} from '../../../database/firebase';

export default function MaterialListPage(props) {
    const [material_list, setMaterialList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        console.log("useEffect");
        refreshList();
    }, []);

    const group = props.route.params.group;

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = async(rowMap, rowKey) => {
        closeRow(rowMap, rowKey);

        setLoading(true);
        
        await firestore.collection("group_list")
                    .doc(group.id)
                    .collection("material_list")
                    .doc(rowKey)
                    .delete();

        console.log("delete row", rowKey);

        refreshList();
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    
    const onCreated = data => {
        refreshList();
    }

    const onGoCreate = () => {
        props.navigation.navigate('MaterialCreate', { group: group, onCreated: onCreated });
    }

    const refreshList = async() => {
        setLoading(true);
        var ref = await firestore.collection("group_list")
            .doc(group.id)
            .collection('material_list')
            .orderBy('created_at', 'desc')
            .get();

        var list = [];
        for(const doc of ref.docs)
        {
            var data = doc.data();
            data.key = doc.id;
            list.push(data);
        }

        setMaterialList(list);

        setLoading(false);
    }

    const renderItem = data => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text style={{fontSize: 17}}>{data.item.title}</Text>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>            
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            <SwipeListView
                data={material_list}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}                
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />

            {                
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
                        onPress={() => onGoCreate()}
                    >
                    <FontAwesome5 name="plus"  size={30} color="#fff" />
                </TouchableOpacity>
            }

            {
                isLoading && <View style={stylesGlobal.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            }
        </View>
    );
   
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },  

    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {        
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    
});
