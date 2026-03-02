import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CountryPanel from '../components/CountryPanel';
import WorldMap from '../components/WorldMap';
import { Country } from '../types';

export default function MapScreen() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryPress = (country: Country) => {
    setSelectedCountry((prev) =>
      prev?.id === country.id ? null : country
    );
  };

  const handleClose = () => setSelectedCountry(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1e30" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Text style={styles.title}>🌍 World Map</Text>
          {selectedCountry && (
            <Text style={styles.hint}>Tap anywhere on the map to deselect</Text>
          )}
          {!selectedCountry && (
            <Text style={styles.hint}>Tap a country to explore · Pinch to zoom</Text>
          )}
        </View>
        <View style={styles.mapWrapper}>
          <WorldMap
            onCountryPress={handleCountryPress}
            selectedCountryId={selectedCountry?.id ?? null}
          />
        </View>
        <CountryPanel country={selectedCountry} onClose={handleClose} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a1e30',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a1e30',
    borderBottomWidth: 1,
    borderBottomColor: '#1a3a5c',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 11,
    color: '#5a8ab0',
    marginTop: 2,
  },
  mapWrapper: {
    flex: 1,
  },
});
