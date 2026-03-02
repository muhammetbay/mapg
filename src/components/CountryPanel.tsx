import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Country } from '../types';

interface Props {
  country: Country | null;
  onClose: () => void;
}

export default function CountryPanel({ country, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    if (country) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 200,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    }
  }, [country]);

  if (!country) return null;

  const flagEmoji = countryCodeToFlag(country.id.toUpperCase());

  return (
    <Animated.View
      style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.flag}>{flagEmoji}</Text>
          <Text style={styles.countryName}>{country.name}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <Text style={styles.codeLabel}>
        ISO Code: <Text style={styles.codeValue}>{country.id.toUpperCase()}</Text>
      </Text>
    </Animated.View>
  );
}

/** Convert ISO 3166-1 alpha-2 code to flag emoji */
function countryCodeToFlag(code: string): string {
  if (code.length !== 2) return '🌍';
  const offset = 0x1f1e6 - 65; // 'A' = 65
  const chars = [...code].map((c) =>
    String.fromCodePoint(c.charCodeAt(0) + offset)
  );
  return chars.join('');
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0d2137',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    fontSize: 36,
  },
  countryName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    flexShrink: 1,
  },
  closeBtn: {
    backgroundColor: '#1e3d5a',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#8ab4d4',
    fontSize: 14,
    fontWeight: '600',
  },
  codeLabel: {
    color: '#8ab4d4',
    fontSize: 14,
    marginTop: 4,
  },
  codeValue: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
