import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useGlobalSearchParams } from 'expo-router'

const DeviceInfo = () => {

    const router = useRouter();
    const [serverValues, setServerValues] = useState();
    //const [DeviceName, setDeviceName] = useState();
    const params = useGlobalSearchParams();
    const DeviceName = params.DeviceName;



    useEffect(() => {
        if (params.data === null || params.data === undefined);
        else {
            //Check for valid Json. JSON do not have a is_valid method.
            try {
                var json = JSON.parse(params.data);
                for (const topic in json) {
                    if (topic.indexOf(params.DeviceName) === 0) {
                        const message = json[topic];
                        setServerValues(prevState => ({
                            ...prevState,
                            [topic]: message
                        }));
                    }
                }
                //Clear the data after parsing to prevent re-rendering
                router.setParams({ data: undefined });
                //MQTTView keeps feeding the received data to this component.
            }
            catch (e) {
                console.log("Could not parse data: ", params.data, "Error: ", e);
            }
        }

    }, [params.data]);



    return (
        <View>
            <Stack.Screen options={
                {
                    title: DeviceName,
                    // headerRight: () => (
                    //     <Button
                    //         onPress={() => alert('This is a button!, functionality not implemented. Edit \'./app/Devices/[DeviceName].js\' to add functionality')}
                    //         title="Edit"
                    //     />
                    // ),
    
                }
            } />
            <Text>Device Information for {DeviceName} </Text>
            {serverValues &&
                Object.entries(serverValues).map(([key, value]) => {
                    return (
                        <Text key={key}>{key + ": " + value}</Text>
                    )
                })
            }

        </View>
    );
};

export default DeviceInfo;