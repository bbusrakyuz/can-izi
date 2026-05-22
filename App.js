import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';

export default function App() {
  const [emergencySent, setEmergencySent] = useState(false);
  const [deviceName, setDeviceName] = useState('UnknownDevice');

  useEffect(() => {
    const getDeviceName = async () => {
      const name = Device.deviceName || Device.modelName || 'UnknownDevice';
      setDeviceName(name);
    };
    getDeviceName();
  }, []);

  const sendEmergencySignal = async () => {
    try {
      // Get battery level
      const battery = await Battery.getBatteryLevelAsync();

      const data = {
        deviceName: deviceName,
        battery: Math.round(battery * 100),
        status: 'critical'
      };

      // Send to local API (laptop hotspot IP - adjust as needed)
      await axios.post('http://192.168.1.100:3000/emergency', data);

      setEmergencySent(true);
      Alert.alert('Acil Durum Gönderildi', 'Sinyal gönderildi, yardım geliyor!');
    } catch (error) {
      Alert.alert('Hata', 'Sinyal gönderilemedi: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CAN-İZİ MOBiL</Text>
      <Text style={styles.subtitle}>Arama Kurtarma Uygulaması</Text>
      <Text style={styles.deviceText}>Cihaz: {deviceName}</Text>
      <TouchableOpacity style={styles.button} onPress={sendEmergencySignal}>
        <Text style={styles.buttonText}>ACİL DURUM</Text>
      </TouchableOpacity>
      {emergencySent && <Text style={styles.sentText}>Sinyal gönderildi!</Text>}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  deviceText: {
    fontSize: 14,
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sentText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default App;