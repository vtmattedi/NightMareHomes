
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
const DeviceCard = ({ card, handleTouch }) => {
    const name = card[0];
    const status = (new Date().getTime() - timestamp >  (5 * 60 * 1000)) ? 'Offline' : 'Online';
    const time = card[1].time;
    const timestamp = card[1].lastUpdate;
    const statusColor = status === 'Online' ? 'green' : 'red';

    return (
        <TouchableOpacity style={styles.deviceCard} onPress={handleTouch}>
            <Text style={styles.name}>{name}</Text>
            <Text>Status:
                <Text style={{color: statusColor}}>{status}</Text>
                </Text>
            <Text>Last message: {time}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    deviceCard: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        ShadowRoot: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
};

export default DeviceCard;