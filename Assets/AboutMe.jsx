
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from './AppContext';

const AboutMe = () => {
    const router = useRouter();
    const Colors = useAppContext().stateVariable;
    const styles = StyleSheet.create({
        AboutMe: {
            backgroundColor: Colors.textBg,
            padding: 10,
            borderRadius: 20,
            borderColor: Colors.text,
            borderWidth: 1,
            
            margin: 10,
        },
        Text: {
            fontSize: 20,
            color: Colors.text,
        }
    
    });
    return (
        <View style ={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        
        }}>
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/about',
                    });
                }}
                style={styles.AboutMe}
            >
                <Text style={styles.Text}>About Me</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    router.push({
                        pathname: '/Configuration',
                    });
                }}
                style={styles.AboutMe}
            >
                <Text style={styles.Text}>Settings</Text>
            </TouchableOpacity>
        </View>
    )
};

export default AboutMe;

