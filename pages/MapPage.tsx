import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LocationAccuracy, LocationObject, LocationOptions, getCurrentPositionAsync, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import { io } from 'socket.io-client';
import * as Crypto from "expo-crypto"

const public_id = Crypto.randomUUID();

export default function MapPage() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<LocationObject[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationObject>(null as any);
  const socketRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const options: LocationOptions = { accuracy: LocationAccuracy.BestForNavigation, distanceInterval: 1 }
      let location = await getCurrentPositionAsync({});
      await watchPositionAsync(options, handlePosition);
      setCurrentLocation(location);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    socketRef.current = io("http://10.2.218.30:3000/"); // Conexión al servidor Socket.IO

    // Escuchar mensajes entrantes
    socketRef.current.on('location', (location) => {
      setLocations((prevLocations) => {
        const functionalLocations = prevLocations.filter((prevLocation) => prevLocation.id != location.id);
        return [...functionalLocations, location]
      });
    });

    // Limpiar efectos al desmontar el componente
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handlePosition(location) {
    console.log(location)
    location.id = public_id;
    socketRef.current.emit('location', location);
  }

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }}>
        {
          locations.map((location) =>
            <Marker coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }} image={require("../assets/favicon.png")}>
            </Marker>
          )
        }

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});