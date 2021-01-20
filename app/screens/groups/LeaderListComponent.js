import React from 'react';

import { StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList, Alert } from 'react-native';

export default function LeaderListComponent(props) {
    return (
        <View>
            {
                props.leader_list && props.leader_list.length > 0 &&
                <Text
                    style={[styles.paraText2, {marginTop:10}]}
                    >
                    Leader List
                </Text>
            }

            <View style={{marginTop: 5}}>
                {
                    props.leader_list && props.leader_list.map((row, key) => {
                        return (
                            <View key={key}>
                                <Text>{row.name} - {row.phone} - {row.email}</Text>
                                <View style = {{width: '100%', borderWidth:0.2, borderColor:'lightgray', marginVertical: 3}} />
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
