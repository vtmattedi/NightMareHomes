import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import MqttView from '../Assets/MqttView';
import { useRouter } from 'expo-router';


export default function Home() {
    const router = useRouter();
  return (
    <SafeAreaView style={styles.container} >
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <Button title="Press me" onPress={() => alert('Button pressed')} /> */}
      
      <MqttView/>
      {/* <MqttLog/> */}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
