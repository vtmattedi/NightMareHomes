// MyComponent.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import init from 'react_native_mqtt';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { MQTT_USER, MQTT_URL, MQTT_PASSWD, MQTT_WEBSOCKET } from '../Consts/Creds';
import { StyleSheet, Text, View, Button, ScrollView, AppState, TouchableOpacity, FlatList, Image, TouchableHighlight, Dimensions, Alert, Modal, StatusBar } from 'react-native';
// import Gauge from './Gauge';
import * as NightMare from '../NightMareSystems/NightMareSystems';
import { useRouter, Stack } from 'expo-router';
import DeviceCard from './DeviceCard';
import ActionCard from './ActionCard'
import AboutMe from './AboutMe';
import ShowNumber from './ShowNumber';
import NumberModal from './NumberModal';
import AdjustNumberModal from './AdjustTarget';
import InfoModal from './InfoModal';
import SelectColor from './SelectColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useAppContext } from '../Assets/AppContext';

SplashScreen.preventAutoHideAsync();
const windowSize = Math.round(Dimensions.get('window').width);
const useLong = windowSize > 500;
init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
});

const compareBtns = (a, b) => {
    var a_val = a.id;
    var b_val = b.id;

    if (useLong) {
        a_val = a.longId;
        b_val = b.longId;
    }

    if (a_val === 'last' || b_val === 'first') {
        return 1;
    }
    if (b_val === 'last' || a_val === 'first') {
        return -1;
    }

    if (a_val < b_val) {
        return -1;
    }
    if (a_val > b_val) {
        return 1;
    }
    return 0;
};

const MqttView = () => {

    const [mqttStatus, setmqttStatus] = useState(false);
    const [serverValues, setServerValues] = useState(JSON);
    const client = new Paho.MQTT.Client(MQTT_URL, MQTT_WEBSOCKET, 'clientID-0x' + parseInt(String(Math.random() * 0x100000), 16));
    const [DeviceStatus, setDeviceStatus] = useState(null);
    const [Mycroft, setMycroft] = useState(new NightMare.LightController("Mycroft"));
    const [Sherlock, setSherlock] = useState(new NightMare.LightColorController("Sherlock"));
    const [Adler, setAdler] = useState(new NightMare.AcController("Adler"));
    const router = useRouter();
    const [tbtn, settbtn] = useState(0);
    const [fontsLoaded, fontError] = useFonts({
        'FontAwesome': require('./fonts/fa6-free-solid.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });
    try {
        //start();

    }
    catch (error) {
        console.log('error:', error);
    }
    // const onLayoutRootView = useCallback(async () => {
    //     if (fontsLoaded || fontError) {
    //       await SplashScreen.hideAsync();
    //     }
    //   }, [fontsLoaded, fontError]);
    const syncTimer = useRef(null);
    if (syncTimer.current === null) {
        syncTimer.current = setInterval(() => {
            Adler.syncServerVariables();
            Mycroft.syncServerVariables();
            Sherlock.syncServerVariables();
        }, 1000);
    }




    const [modals, setModals] = useState({
        target: false,
        actemp: false,
        info: false,
        infoTitle: "",
        infoPhrase: "",
        color: false
    });
    const appState = useRef(AppState.currentState);

    const timerRef = useRef(null);
    // if (timerRef.current === null) {
    //     timerRef.current = setInterval(() => {
    //         setDeviceStatus((prevState) => {
    //             Adler.syncServerVariables();
    //             Mycroft.syncServerVariables();
    //             Sherlock.syncServerVariables();
    //         });
    //     }, 1000);
    // }

    const InfoTemplate = () => {
        return (() => {
            setModals({
                ...modals, info: true,
                infoTitle: "Button not implemented",
                infoPhrase: "Ohhhhh, it looks like you found a button that is not implemented yet. Please be patient, it will be implemented soon."
            });
        }
        );
    }

    const data = [
        {
            title: "Light",
            description: "Toggle the light",
            image: require('./images/light-nobg.png'),
            onPress: () => Mycroft.toggle(),
            state: Mycroft.stale ? 'offline' : 'online',
            styleId: Mycroft.state ? 'light-on' : 'light-off',
            id: 1,
            longId: 1
        },
        {
            title: "Ac",
            description: Adler.AcIsOn ? Adler.AcTemperature : "Turned off",
            state: Adler.stale ? 'offline' : 'online',
            styleId: Adler.AcIsOn ? 'ac-on' : 'ac-off',
            image: require('./images/ac-nobg.png'),
            onPress: () => {
                Adler.togglePower();
            },
            onLongPress: () => {
                setModals({ ...modals, actemp: true });
            },
            addtionalData: Adler.AcIsSet,
            id: 2,
            longId: 3
        },
        {
            title: "Bed Leds",
            description: Sherlock.state ? "On" : "Off",
            addtionalData: (Sherlock.brightness) * 0x1000000 + Sherlock.color,
            state: Sherlock.stale ? 'offline' : 'online',
            styleId: Sherlock.state ? 'b-led-on' : 'b-led-off',
            image: require('./images/bed-led-mirror-nobg.png'),
            onPress: () => {
                Sherlock.toggle();
            },
            onLongPress: () => {
                setModals({ ...modals, color: true });
            },
            id: 3,
            longId: 2
        },
        {
            title: "Door",
            description: Adler.doorState > 0 ? "Open" : "Closed",
            image: require('./images/door-nobg.png'),
            onPress: Adler.doorState > 0 ? () => {
                console.log(Adler.doorState);
                Adler.ignoreDoor();
                Alert.alert('Ignoring door open until phisically closed');
            } : () => {
                console.log("Door already closed. Can't ignore");
            },
            onLongPress: () => {
                console.log("long press");
                setModals({
                    ...modals,
                    info: true,
                    infoTitle: "Door",
                    infoPhrase: "The door sensor is used to detect if the door is open or closed. If the door is open, the AC will be turned off but you can press this button to ignore the door open state until the door is closed."
                });
            },
            state: Adler.stale ? 'offline' : 'online',
            styleId: Adler.doorState > 0 ? 'door-open' : 'door-closed',
            id: 4,
            longId: 6
        },
        {
            title: "Auto",
            description: Mycroft.automationRestore > 0 | Sherlock.automationRestore > 0 ? "Restore: " + NightMare.getTime(NightMare.safeMax(Mycroft.automationRestore, Sherlock.automationRestore), true) : "Auto mode",
            state: Mycroft.stale && Sherlock.stale ? 'offline' : 'online',
            styleId: Mycroft.automationRestore > 0 | Sherlock.automationRestore > 0 ? 'auto-off' : 'auto-on',
            image: require('./images/automation-nobg.png'),
            onPress: () => {
                Mycroft.restoreAutomation();
                Sherlock.restoreAutomation();
                Alert.alert('NightMare Systems', 'Setting everything to automatic mode!',);
            },
            id: 6,
            longId: 5
        },

        {
            title: "Control Temp.",
            description: Adler.AcIsSet ? "Enabled" : "Disabled",
            state: Adler.stale ? 'offline' : 'online',
            styleId: Adler.AcIsSet ? 'set-ac-on' : 'set-ac-off',
            onPress: () => {
                Adler.toggleSet();
            },
            onLongPress: () => {
                setModals({ ...modals, target: true });
            },
            id: 5,
            longId: 5
        },

        // {
        //     title: "Info",
        //     state: Sherlock.stale ? 'offline' : 'online',
        //     styleId: 'sherlock-info',
        //     description: serverValues ? `${serverValues['Sherlock/sensors/dhtHum']}% ${serverValues['Sherlock/sensors/dhtTemp']}°C` : "",
        //     onPress: () => {
        //         setModals({ ...modals, info: true, infoTitle: "Sherlock", infoPhrase: "Holmes" });
        //     },
        //     onLongPress: () => {
        //         setModals({ ...modals, color: true });
        //     },
        //     id: 7,
        //     longId: 0xff
        // },

        {
            title: "Sleep in",
            state: Sherlock.stale ? 'offline' : 'online',
            styleId: Adler.SleepIn ? 'sleep-on' : 'sleep-off',
            description: Adler.SleepIn ? 'Enabled' : 'Disabled',
            image: require('./images/zzz-nobg.png'),
            onPress: () => {
                Adler.setSleepIn();
            },
            onLongPress: () => {
                setModals({
                    ...modals,
                    info: true,
                    infoTitle: "Sleep In",
                    infoPhrase: "If enabled, the AC will be turned off 3 hours later than the usual."
                });
            },
            id: 8,
            longId: 8
        },
        {
            title: "MQTT",
            state: 'mqtt',
            styleId: mqttStatus ? 'mqtt-on' : 'mqtt-off',
            description: mqttStatus ? 'Connected' : 'Disconnected',
            onPress: () => {
                start();
            },
            onLongPress: () => {
                setModals({
                    ...modals,
                    info: true,
                    infoTitle: "MQTT Status",
                    infoPhrase: "Click to manual reconnect to the mqtt server"
                });
            },
            id: 0x100,
            longId: 0x100
        },
        {
            title: "Test",
            state: 'Example',
            styleId:  tbtn === 0? 'offline' : 'test-' + tbtn,
            description:'Example',
            onPress: () => {
                settbtn((tbtn + 3) % 3);
            },
            onLongPress: () => {
                setModals({
                    ...modals,
                    info: true,
                    infoTitle: "Test Button",
                    infoPhrase: `This is a test button. It will change the style of the button. Current style: ` + tbtn>0? `test-${tbtn}` : `offline`
                });
            },
            id: 7,
            longId: 8
        },


    ]





    const onConnect = () => {
        //  const { client } = this.state;
        SplashScreen.hideAsync();
        client.subscribe('#');
        setmqttStatus(true);
        if (!DeviceStatus) {
            publish('All/control', 'get_state');
        }
    };

    const onConnectionLost = responseObject => {
        if (responseObject.errorCode !== 0) {
            setmqttStatus(false);
        }
    };

    const handleServerValues = (topic, message) => {
        if (topic.indexOf('Adler/state') > -1) {
            Adler.assert(message);
        }
        else if (topic.indexOf('Sherlock/state') > -1) {
            Sherlock.assert(message);
        }
        else if (topic.indexOf('Mycroft/state') > -1) {
            Mycroft.assert(message);
        }
        setServerValues(prevState => ({
            ...prevState,
            [topic]: message
        }));
        router.setParams({ data: JSON.stringify({ [topic]: message }) });
        //router.setParams({ data:`{"${topic}": "${message}"}`});
    }
    const onMessageArrived = message => {
        //setResult(`${message.topic}: ${message.payloadString}`);
        const { topic, payloadString } = message;
        handleServerValues(topic, payloadString);
        console.log(topic, payloadString);
        //      console.log(topic.indexOf('/'), topic.split('/')[0]);
        if (topic.indexOf('/') > -1) {
            const name = topic.split('/')[0];
            if (name == "All")
                return;
            setDeviceStatus(prevState => ({
                ...prevState,
                [name]: {
                    status: "Online",
                    lastUpdate: new Date().getTime(),
                    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
                }
            }));
            //console.log(DeviceStatus);
        }

    };
    const Colors = useAppContext().stateVariable;
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            flexDirection: 'column',
            borderBlockColor: Colors.secondary,
            borderWidth: 1,
            width: windowSize > 800 ? 800 : windowSize,
        },
        border: {
            borderBlockColor: '#000',
            borderWidth: 1,
        },
        innerText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.text,
        },
        title: {
            color: Colors.text,
            fontSize: 40,
            fontFamily: 'Inter',
            
        },
        DevicesContainer: {
            backgroundColor: '#ccc',
            flexDirection: 'row',
            margin: 10,
            paddingHorizontal: 5,
            borderRadius: 10,
            borderBlockColor: 'black',
            borderWidth: 1,
    
        },
        bigCointainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        AcSideBtn: {
            width: 120,
            height: 80,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'black',
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
            fontColor: 'white',
        },
        btnText:
        {
            fontSize: 24,
            fontWeight: "bold",
        },
        DevicesTitle: {
            marginLeft: 10,
            bottom: 0,
            fontSize: 16,
            alignSelf: 'flex-start',
        },
        ActionsContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            columnGap: 10,
            padding: 10,
            marginTop: 10,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
            height: 100,
        },
    
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
    
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            width: windowSize * 0.9,
            top: '40%',
            height: '80%',
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 50,
    
        },
    });

    useEffect(() => {
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        //Set the publishFn for all devices
        Adler.publishFn = (topic, message) => { return publish(topic, message) };
        Mycroft.publishFn = (topic, message) => { return publish(topic, message) };
        Sherlock.publishFn = (topic, message) => { return publish(topic, message) };

        start = () => {
            if (client.isConnected()) {
                console.log('client already connected');
                return;
            }
            client.connect({
                onSuccess: onConnect,
                useSSL: true,
                userName: MQTT_USER,
                password: MQTT_PASSWD,
            });
        };
        finish = () => {
            console.log('disconnecting <--', 'mqttStatus:', mqttStatus, client.isConnected());
            if (client.isConnected()) {
                client.disconnect();
                setmqttStatus(false);
            }
        };
        start();
        publish = (topic, payload) => {
            // console.log('publishing:', topic, payload);
            // console.log(client.isConnected());
            if (!client.isConnected()) {
                console.log('client not connected');
                return false;
            }
            try {
                client.send(topic, payload, 0, false);
                return true;
            } catch (error) {
                console.log('error:', error);
                return false;
            }
        };



        // const sync = setInterval(() => {
        //     Adler.syncServerVariables();
        //     Mycroft.syncServerVariables();
        //     Sherlock.syncServerVariables();

        // }, 1000);

        return () => {

            //clearInterval(sync);
            finish();
        };


    }, [appState]); // Run this effect only once when the component mounts

    const map_temperature = (value) => {
        const min = 20;
        const max = 35;
        const newMin = 0;
        const newMax = 100;
        //const newValue = (max - min) / (newMax - newMin) * value;
        const newValue = ((value - min) * (newMax - newMin)) / (max - min) + newMin;
        //console.log(value, Math.round(newValue));
        return Math.round(newValue);
    };

    const getTemp = () => {
        if (Adler.RoomTemperature === 0xff) {
            return { value: undefined, text: '--' };
        }
        return {
            value: map_temperature(Adler.RoomTemperature),
            text: parseFloat(Adler.RoomTemperature).toFixed(1)
        };
    }



    return (
        fontsLoaded ?
            <SafeAreaView style={styles.container}  >
                
                <Stack.Screen options={
                    {
                        title: "Home",
                        headerTitleStyle: mqttStatus === "Connected" ? styles.titleStyle : styles.titleStyleDisconnected,
                        headerShown: false,
                    }
                } />
                <View>
                    <Text style={styles.title}>{"NightMare Holmes"}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <ShowNumber text={getTemp().text} subtext={"Room Temperature"} unit={"°C"} />
                    {
                        Adler.AcIsSet &&
                        <ShowNumber text={
                            Adler.stale ? "--" : Adler.SetTemperature} subtext={"Target"} unit={"°C"} />
                    }
                </View>


                {/* <Text > {JSON.stringify(serverValues, undefined, 2).replace("{", "").replace("}", "")}</Text>
            <Button title="Publish" onPress={() => printDevices()} style={{ height: 100, width: 10 }} />
            <TouchableOpacity style={{ width: 100, height: 100, marginTop: 10, backgroundColor: '#f0f' }} onPress={() => Adler.togglePower()}>
                <Text>My button</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', margin: '10' }}>
                <Gauge fill={getTemp().value} text={getTemp().text} sizeScaler={1} subText={"Temperature"} />
                <Gauge fill={getHumd()} primaryColor='#00aaff' subText={"humidty"} subTextAbove={true} />
            </View>
            <AcView
                Set = {Adler.AcIsSet}
                SetTemp = {Adler.SetTemperature}
                AcTemp = {Adler.AcTemperature}
                AcOn = {Adler.AcIsOn}/> */}
                <ScrollView style={{ height: 400 }}>
                    <View style={styles.ActionsContainer}>
                        {
                            data.sort(compareBtns).map((item, index) => {
                                return (
                                    <ActionCard
                                        key={index}
                                        title={item.title}
                                        description={item.description}
                                        image={item.image}
                                        onPress={item.onPress}
                                        onLongPress={item.onLongPress ? item.onLongPress : InfoTemplate()}
                                        addtionalData={item.addtionalData}
                                        state={item.state}
                                        styleId={item.styleId}
                                    />
                                );
                            })
                        }
                    </View>
                </ScrollView>

                {/* <Text style={styles.DevicesTitle}>Devices:</Text>
                <View style={styles.DevicesContainer}>
                    {DeviceStatus &&
                        <FlatList
                            data={Object.entries(DeviceStatus).sort((a, b) => a[0].localeCompare(b[0]))}
                            renderItem={({ item }) => (
                                <>
                                    <DeviceCard card={item} handleTouch={() => {
                                        router.push(
                                            {
                                                pathname: `/Devices/[DeviceName]`,
                                                params: {
                                                    DeviceName: item[0],
                                                    data: JSON.stringify(serverValues)
                                                }
                                            });
                                    }} />
                                </>

                            )}
                            horizontal />
                    }
                </View> */}
                <AboutMe />
                <Modal
                    visible={modals.actemp}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModals({ ...modals, actemp: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView]}>
                            <NumberModal
                                title={"Set AC temp"}
                                startingNum={Adler.AcTemperature}
                                onOk={
                                    (num) => {
                                        Adler.setTemperature(num);
                                        setModals({ ...modals, actemp: false });
                                    }
                                }
                                onClose={() => setModals({ ...modals, actemp: false })} />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={modals.target}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModals({ ...modals, target: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView]}>
                            <AdjustNumberModal
                                title={"Set Target"}
                                startingNum={Adler.SetTemperature}
                                onOk={
                                    (num) => {
                                        Adler.setTarget(num);
                                        console.log("num: " + num);
                                        setModals({ ...modals, target: false });
                                    }
                                }
                                onClose={() => setModals({ ...modals, target: false })} />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={modals.info}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModals({ ...modals, info: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView]}>
                            <InfoModal
                                title={modals.infoTitle}
                                phrase={modals.infoPhrase}
                                onClose={() => setModals({ ...modals, info: false })} />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={modals.color}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModals({ ...modals, color: false });
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView]}>
                            <SelectColor
                                startingVal={Sherlock.color}
                                title={"Bed Light Color: "}
                                onOk={(color) => {
                                    setModals({ ...modals, color: false })
                                    Sherlock.setColor(color);
                                }}
                                onClose={() => setModals({ ...modals, color: false })} />
                        </View>
                    </View>
                </Modal>

            </SafeAreaView > :
            <SafeAreaView style={styles.container}  >
                <Stack.Screen options={
                    {
                        title: `Home ` + String(appState.current),
                        headerTitleStyle: mqttStatus === "Connected" ? styles.titleStyle : styles.titleStyleDisconnected,
                        headerShown: false,
                    }
                } />
                <Image source={require("./images/splash.png")}  />
            </SafeAreaView>



    );
};


export default MqttView;
