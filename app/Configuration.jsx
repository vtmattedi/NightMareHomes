import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Switch } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { storeData, getData } from '../Assets/Storage';
import { Stack, router } from 'expo-router';
import { useAppContext } from '../Assets/AppContext';

const Configuration = () => {
    const [config, setConfig] = useState({
    });
    const {stateVariable, setStateVariable} =   useAppContext();

    const handleInputChange = (name, value) => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            [name]: value,
        }));

    };

    const handleSubmit = () => {
        // Handle the configuration submission here
        storeData("DarkMode",config.darkMode);
        setStateVariable(config.darkMode);
        router.dismiss();
    };
    
    useEffect(() => {
        getData("DarkMode").then((value) => {
            setConfig((prevConfig) => ({
                ...prevConfig,
                darkMode: value === 'true' ? true : false,
            }));
        });
    }, []); 

    return (
        <View>
            <Stack.Screen title="Settings" />
            <View >
                <Text>Dark Mode</Text>
                <Switch
                    value={config.darkMode || false}
                    onValueChange={(value) => handleInputChange('darkMode', value)} />

            </View>
            <View >
                <Text>MQTT Server:</Text>
                <TextInput
                    placeholder="Config Option 1"
                    value={config.option1 || ''}
                    onChangeText={(value) => handleInputChange('option1', value)}>
                </TextInput>
            </View>
            <View >
                <Text>MQTT Port: (WebSocket)</Text>
                <TextInput
                    placeholder="Config Option 1"
                    value={config.option1 || ''}
                    onChangeText={(value) => handleInputChange('option1', value)}>
                </TextInput>
            </View>
            <View >
                <Text>Use Credentials</Text>
                <Switch
                    value={config.darkMode || false}
                    onValueChange={(value) => handleInputChange('darkMode', value)} />

            </View>
            <View >
            <Text>User:</Text>
                <TextInput
                    placeholder="Config Option 1"
                    value={config.option1 || ''}
                    onChangeText={(value) => handleInputChange('option1', value)}>
                </TextInput>
            </View>
            <View >
            <Text>Password:</Text>
                <TextInput
                    placeholder="Config Option 1"
                    value={config.option1 || ''}
                    onChangeText={(value) => handleInputChange('option1', value)}>
                </TextInput>
            </View>


            <TextInput
                placeholder="Config Option 2"
                value={config.option2 || ''}
                onChangeText={(value) => handleInputChange('option2', value)}
            />
            {/* Add more configuration inputs as needed */}
            <Button title="Save Configuration" onPress={handleSubmit} />
        </View>
    );
};

export default Configuration;
