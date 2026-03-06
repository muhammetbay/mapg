import React, { useMemo, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import worldMap from '@svg-maps/world';
import { Country } from '../types';
import countryColors from '../data/countryColors';
import continents, { Continent, countryToContinent } from '../data/continents';
import { getPathCenter } from '../utils/getPathCenter';

type Mode = 'continents' | 'countries';

interface Props {
  mode: Mode;
  selectedContinent: Continent | null;
  onContinentPress: (continent: Continent) => void;
  onCountryPress: (country: Country) => void;
  selectedCountryId: string | null;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const MIN_SIZE_FOR_FLAG = 4;

function codeToFlag(id: string): string {
  const code = id.toUpperCase();
  if (code.length !== 2) return '';
  const offset = 0x1f1e6 - 65;
  return [...code].map((c) => String.fromCodePoint(c.charCodeAt(0) + offset)).join('');
}

function darken(hex: string, factor: number): string {
  const c = hex.replace('#', '');
  const r = Math.round(parseInt(c.substring(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(c.substring(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(c.substring(4, 6), 16) * (1 - factor));
  return `rgb(${r},${g},${b})`;
}

interface GeoItem {
  country: Country;
  continentId: string;
  fill: string;
  stroke: string;
  continentColor: string;
  cx: number;
  cy: number;
  flag: string;
  showFlag: boolean;
  fontSize: number;
}

const continentColorMap: Record<string, string> = {};
continents.forEach((c) => (continentColorMap[c.id] = c.color));

const continentLabels: { id: string; name: string; x: number; y: number }[] = [
  { id: 'na', name: 'North\nAmerica', x: 170, y: 220 },
  { id: 'sa', name: 'South\nAmerica', x: 265, y: 500 },
  { id: 'eu', name: 'Europe', x: 510, y: 290 },
  { id: 'af', name: 'Africa', x: 520, y: 450 },
  { id: 'as', name: 'Asia', x: 750, y: 280 },
  { id: 'oc', name: 'Oceania', x: 900, y: 490 },
];

export default function WorldMap({
  mode,
  selectedContinent,
  onContinentPress,
  onCountryPress,
  selectedCountryId,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);
  const lastDistance = useRef<number | null>(null);
  const lastTouchCount = useRef(0);

  const geoData: GeoItem[] = useMemo(() => {
    return (worldMap.locations as Country[]).map((country) => {
      const continentId = countryToContinent[country.id] || '';
      const cColor = continentColorMap[continentId] || '#888888';
      const flagColor = countryColors[country.id] || '#5BAD6F';
      const { x, y, width, height } = getPathCenter(country.path);
      const minDim = Math.min(width, height);
      const showFlag = minDim >= MIN_SIZE_FOR_FLAG;
      const fontSize = Math.max(2.5, Math.min(9, minDim * 0.5));
      return {
        country,
        continentId,
        fill: flagColor,
        stroke: darken(flagColor, 0.4),
        continentColor: cColor,
        cx: x,
        cy: y,
        flag: codeToFlag(country.id),
        showFlag,
        fontSize,
      };
    });
  }, []);

  const getDistance = (touches: GestureResponderEvent['nativeEvent']['touches']) => {
    if (touches.length < 2) return null;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastDistance.current = null;
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const dist = getDistance(touches);
          if (dist !== null && lastDistance.current !== null) {
            const scaleDelta = dist / lastDistance.current;
            const newScale = Math.min(
              MAX_SCALE,
              Math.max(MIN_SCALE, currentScale.current * scaleDelta)
            );
            currentScale.current = newScale;
            scale.setValue(newScale);
          }
          lastDistance.current = dist;
          lastTouchCount.current = 2;
        } else if (touches.length === 1 && lastTouchCount.current < 2) {
          translateX.setValue(currentTranslateX.current + gestureState.dx);
          translateY.setValue(currentTranslateY.current + gestureState.dy);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (lastTouchCount.current < 2) {
          currentTranslateX.current += gestureState.dx;
          currentTranslateY.current += gestureState.dy;
        }
        lastDistance.current = null;
        lastTouchCount.current = 0;
      },
    })
  ).current;

  const viewBox =
    mode === 'countries' && selectedContinent
      ? selectedContinent.viewBox
      : worldMap.viewBox;

  const visibleGeo =
    mode === 'countries' && selectedContinent
      ? geoData.filter((g) => g.continentId === selectedContinent.id)
      : geoData;

  const continentLookup = useMemo(() => {
    const map: Record<string, Continent> = {};
    continents.forEach((c) => (map[c.id] = c));
    return map;
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.mapContainer,
          {
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        <Svg viewBox={viewBox} width="100%" height="100%" style={styles.svg}>
          {visibleGeo.map(({ country, fill, stroke, continentColor }) => {
            const isSelected = selectedCountryId === country.id;
            let pathFill: string;
            let pathStroke: string;
            let strokeW: number;

            if (mode === 'continents') {
              pathFill = continentColor;
              pathStroke = darken(continentColor, 0.3);
              strokeW = 0.15;
            } else {
              pathFill = isSelected ? '#FFD700' : fill;
              pathStroke = isSelected ? '#B8860B' : stroke;
              strokeW = isSelected ? 0.6 : 0.25;
            }

            return (
              <Path
                key={country.id}
                d={country.path}
                fill={pathFill}
                stroke={pathStroke}
                strokeWidth={strokeW}
                onPress={() => {
                  if (mode === 'continents') {
                    const cid = countryToContinent[country.id];
                    if (cid && continentLookup[cid]) {
                      onContinentPress(continentLookup[cid]);
                    }
                  } else {
                    onCountryPress(country);
                  }
                }}
              />
            );
          })}

          {mode === 'continents' &&
            continentLabels.map((cl) => {
              const continent = continentLookup[cl.id];
              if (!continent) return null;
              const lines = cl.name.split('\n');
              return (
                <G key={cl.id} onPress={() => onContinentPress(continent)}>
                  {lines.map((line, li) => (
                    <SvgText
                      key={`${cl.id}-${li}`}
                      x={cl.x}
                      y={cl.y + li * 16}
                      fontSize={13}
                      fontWeight="bold"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth={0.5}
                      textAnchor="middle"
                    >
                      {line}
                    </SvgText>
                  ))}
                </G>
              );
            })}

          {mode === 'countries' &&
            visibleGeo.map(({ country, showFlag, cx, cy, flag, fontSize }) =>
              showFlag ? (
                <SvgText
                  key={`flag-${country.id}`}
                  x={cx}
                  y={cy}
                  fontSize={fontSize}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  onPress={() => onCountryPress(country)}
                >
                  {flag}
                </SvgText>
              ) : null
            )}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#1a3a5c',
  },
  mapContainer: {
    flex: 1,
  },
  svg: {
    flex: 1,
  },
});
