import { useBatteryLevel } from "expo-battery";
import React from "react";
import { Text, View } from "react-native";


function BatteryLevel() {
  const batteryLevel = useBatteryLevel();
  return (
    <View>
      <Text>{(batteryLevel*100).toFixed(0)}%</Text>
    </View>
  );
}

export {BatteryLevel}