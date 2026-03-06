import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CountryPanel from '../components/CountryPanel';
import WorldMap from '../components/WorldMap';
import { Country } from '../types';
import { Continent } from '../data/continents';

export default function MapScreen() {
  const [mode, setMode] = useState<'continents' | 'countries'>('continents');
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleContinentPress = (continent: Continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
    setMode('countries');
  };

  const handleCountryPress = (country: Country) => {
    setSelectedCountry((prev) =>
      prev?.id === country.id ? null : country
    );
  };

  const handleBack = () => {
    setMode('continents');
    setSelectedContinent(null);
    setSelectedCountry(null);
  };

  const handleClosePanel = () => setSelectedCountry(null);

  const hintText =
    mode === 'continents'
      ? 'Tap a continent to explore its countries'
      : selectedCountry
        ? 'Tap another country or use the back button'
        : 'Tap a country to see details';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1e30" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            {mode === 'countries' && (
              <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={12}>
                <Text style={styles.backArrow}>{'<'}</Text>
              </Pressable>
            )}
            <Text style={styles.title}>
              {mode === 'continents'
                ? 'World Map'
                : selectedContinent?.name ?? 'Countries'}
            </Text>
          </View>
          <Text style={styles.hint}>{hintText}</Text>
        </View>

        <View style={styles.mapWrapper}>
          <WorldMap
            mode={mode}
            selectedContinent={selectedContinent}
            onContinentPress={handleContinentPress}
            onCountryPress={handleCountryPress}
            selectedCountryId={selectedCountry?.id ?? null}
          />
        </View>

        <CountryPanel country={selectedCountry} onClose={handleClosePanel} />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    backgroundColor: '#1e3d5a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: {
    color: '#8ab4d4',
    fontSize: 16,
    fontWeight: '700',
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
