import React, { createContext, useState,useContext, useEffect } from 'react';
import { getData, storeData } from './Storage';
import {getStyle} from '../Consts/Colors';
// Create a new context
const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

// Create a provider component
export default AppProvider = ({ children }) => {
    // Define your state variables here
    const [stateVariable, setStateVariable] = useState(getStyle(false));

    const loadValue = async () => {
        await getData("DarkMode").then((value) => {
            setStateVariable(getStyle(value==='true'?true:false));
            console.log('Retrieved data:', value);
        });
        
    };

    const storeValue = async (key,value) => {
        result = await storeData(key,value);
        loadValue();
    
    }


    useEffect(() => {
        loadValue();
    }, []);

    // Define any functions or methods you need

    // Return the context provider with the state and functions
    return (
        <AppContext.Provider
            value={{
                stateVariable,
                setStateVariable,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
