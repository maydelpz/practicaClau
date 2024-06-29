import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import useAuth from "../hooks/useAuth";

function Router() {
  // const auth = false
  const demo = useAuth();

  return (
    <NavigationContainer>
      {/* {demo.user != undefined ? <AppStack /> : <AuthStack />} */}
      <AppStack />
    </NavigationContainer>
  );
}

export default Router;
