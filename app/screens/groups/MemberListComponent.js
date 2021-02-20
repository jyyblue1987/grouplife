import React from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList, Alert } from 'react-native';

export default function MemberListComponent(props) {
    return (
        <View>
            {
                props.member_list && props.member_list.length > 0 &&
                <Text
                    style={[styles.paraText2, {marginTop:10}]}
                    >
                    Member List
                </Text>
            }

            <View style={{marginTop: 5}}>
                {
                    props.member_list && props.member_list.map((item, key) => {
                        return (
                            <View key={key}>
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
                                        </View>    

                                        <Text style={{fontSize: 17}}>
                                            {item.role}
                                        </Text>
                                    </View>    
                                </TouchableOpacity> 
                            </View>
                        );
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({ 
    paraText2: {
        color: '#383838B2',        
        fontSize: 17,        
    }
});
