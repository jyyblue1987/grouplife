import {
    Dimensions, 
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get("window");
const isIos = Platform.OS === 'ios'
const isIphoneX = isIos && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896);

export const BACK_COLOR = '#327FEB';
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

    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },

    button_style: {
        color: '#fff',
        backgroundColor: BACK_COLOR,
    },

    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFFDD'        
    },

    searchcontainer: {
        backgroundColor: 'transparent',
        borderWidth: 0, //no effect        
        shadowColor: 'transparent', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },

    back_color: BACK_COLOR


    
}