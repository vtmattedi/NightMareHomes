import { StyleSheet } from 'react-native';
import { getData } from '../Assets/Storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const getStyle = (darkMode) => {

   getData("DarkMode").then((value) => {
    darkMode = value==='true'?true:false;    
});


    if (darkMode) {
        return Colors.DarkMode;
    }
    else {
        return Colors.LightMode;
    }

}


const Colors = StyleSheet.create({
    DarkMode: {
        primary: '#111',
        bg: '#111',
        secondary: '#fff',
        terciary: '#666',
        text: 'orange',
        textBg: '#77777777',
        borderColor: '#fff',
        barStyle: 'light-content',
    },
    LightMode: {
        primary: '#fff',
        bg: '#fff',
        secondary: '#000',
        terciary: '#ccc',
        text: '#000',
        textBg: '#333',
        barStyle: 'dark-content',
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
});

export { Colors, getStyle };