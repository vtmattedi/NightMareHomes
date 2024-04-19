import { Stack,Slot } from "expo-router";
import AppContext, {useAppContext} from "../Assets/AppContext";
import { StatusBar } from "react-native";

export default function Layout() {
   
    return (
        <AppContext>
            <StatusWrapper/>
            <Slot />
        </AppContext>
    );
} 

function StatusWrapper() {
    const Colors = useAppContext().stateVariable;
  
    return (
        <StatusBar backgroundColor={Colors.primary} barStyle={Colors.barStyle} />
    );
}