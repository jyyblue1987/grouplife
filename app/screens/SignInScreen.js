import * as React from 'react';
import {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    UNSAFE_componentWillMount() {
        
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Signin Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
   
});

