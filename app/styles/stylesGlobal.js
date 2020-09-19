import {
    Dimensions, 
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export const stylesGlobal = {
    header_bar: {
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#3476cb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
    
}