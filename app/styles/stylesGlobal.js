import {
    Dimensions, 
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export const BACK_COLOR = '#3476cb';
export const stylesGlobal = {
    header_bar: {
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: BACK_COLOR,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },        
    },

    button_style: {
        color: '#fff',
        backgroundColor: BACK_COLOR,
    },

    back_color: BACK_COLOR


    
}