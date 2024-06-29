import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
import useAuth from "../hooks/useAuth";
import HomePage from "../pages/HomePage";
import LogoutButton from "../components/LogoutButton";
import { BatteryLevel } from "../components/BatteryLevel";
import CameraPage from "../pages/CameraPage";
import MapPage from "../pages/MapPage";
import ChatPage from "../pages/ChatPage";

const Stack = createNativeStackNavigator();
function AppStack() {
  const { logout } = useAuth();
  return (
    <Stack.Navigator screenOptions={{headerRight: () => <LogoutButton logoutHandler={logout}/>
      ,headerLeft: () => <BatteryLevel/>
    }}>
      <Stack.Screen
        name="Home"
        component={HomePage}
      />
      <Stack.Screen
        name="Camera"
        component={CameraPage}
      />
      <Stack.Screen
        name="Map"
        component={MapPage}
      />
      <Stack.Screen
        name="Chat"
        component={ChatPage}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
