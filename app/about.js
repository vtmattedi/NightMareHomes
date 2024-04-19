import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Switch, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TwoColorSquare from '../Assets/TwoColorSquare';
import { useState } from 'react';
import LinkButton from '../Assets/LinkButton';
import { currentVersion, versionDate } from '../Consts/Version';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {getData, storeData} from '../Assets/Storage';

const windowSize = Math.round(Dimensions.get('window').width);

const AboutMe = () => {
    const TextColor = 'orange';
    const [selected, setSelected] = useState(0);
    const logo_inverted = require('../Assets/images/logo-inverted-nobg.png');
    const logo = require('../Assets/images/splash.png');
    const [imgSource, setImgSource] = useState(logo_inverted);
    const photo = require('../Assets/images/not-found-nobg.png');


    const stylesOpt = [
        {
            p: '#000',
            s: '#fff',
        },
        {
            p: '#ccc',
            s: '#333',

        },
        {
            p: '#222',
            s: 'orange',

        },
        {
            p: '#eee',
            s: '#000',

        },
        {
            p: '#222',
            s: 'lightblue',
        },
        {
            p: '#333',
            s: 'white',
        },
        {
            p: '#000',
            s: 'lightblue',
        },
        {
            p: '#111',
            s: 'lightblue',
        }
    ];

    useEffect(() => {
        getData('theme').then((value) => {
            if (value !== null) {
                setSelected(parseInt(value));
            }
            else
            {
                setSelected(0);
            }

        });
    }, []);
    return (
        <View
            style=
            {
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: stylesOpt[selected].p,
                    color: stylesOpt[selected].p,
                }
            }>
            <StatusBar style="light-content" />
            <Stack.Screen options={
                {
                    headerTitleStyle: {
                        backgroundColor: stylesOpt[selected].p,
                        borderColor: stylesOpt[selected].s,
                    },

                    contentStyle: {
                        backgroundColor: stylesOpt[selected].p,
                        borderColor: stylesOpt[selected].s,
                    },
                    headerTintColor: stylesOpt[selected].s,
                    title: "About Me",
                    headerStyle: {
                        backgroundColor: stylesOpt[selected].p,
                        borderColor: stylesOpt[selected].s,
                        borderWidth: 1,
                    },

                }
            }
            />
            <View style={styles.photoView}>
                <Image source={photo}
                    style={{
                        width: 200, height: 200,
                        backgroundColor: stylesOpt[selected].p
                    }} />

                <Text style={[styles.textStyle, { color: stylesOpt[selected].s, marginRight: 20 }]}>{"My name is Vítor Mattedi Carvalho, I am a computer engeneering student at Federal University of Bahia. I developed a couple of devices to automate somethings in my house and this app serves as a front end for the whole system. "}</Text>
            </View>
            <View style={[styles.photoView, { color: stylesOpt[selected].s, flex: 1 }]}>
                <View style={[styles.textStyle, { color: stylesOpt[selected].s }]}>
                    <LinkButton title="Linkedin" url="https://linkedin.com/" brand="linkedin" />
                    <LinkButton title="vtmattedi" url="https://github.com/vtmattedi/" brand="github" />
                    <LinkButton title="Portifolio" url="https://mattedi-works.vercel.app/" brand="web" />
                </View>

                <View>
                    <Image source={imgSource}
                        style={{
                            width: 200, height: 200,
                            backgroundColor: stylesOpt[selected].p
                        }}
                    />
                </View>
            </View>



            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: stylesOpt[selected].s }}>{"App Version: " + currentVersion}</Text>
                <Text style={{ color: stylesOpt[selected].s }}>{"Build Time: " + versionDate}</Text>
            </View>
        </View >
    );
};

export default AboutMe;

const styles = StyleSheet.create({
    textStyle:
    {
        color: 'orange',
        alignItems: 'center',
        textAlign: 'justify',
        maxWidth: windowSize - 200,
    },
    photoView:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});