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
import { getPathCenter } from '../utils/getPathCenter';

interface Props {
  onCountryPress: (country: Country) => void;
  selectedCountryId: string | null;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const MIN_SIZE_FOR_FLAG = 3; // min bounding-box dimension to show a flag

/** Convert ISO alpha-2 to flag emoji */
function codeToFlag(id: string): string {
  const code = id.toUpperCase();
  if (code.length !== 2) return '';
  const offset = 0x1f1e6 - 65;
  return [...code].map((c) => String.fromCodePoint(c.charCodeAt(0) + offset)).join('');
}

/** Darken a hex color by a factor (0–1) */
function darken(hex: string, factor: number): string {
  const c = hex.replace('#', '');
  const r = Math.round(parseInt(c.substring(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(c.substring(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(c.substring(4, 6), 16) * (1 - factor));
  return `rgb(${r},${g},${b})`;
}

interface CountryGeo {
  country: Country;
  fill: string;
  stroke: string;
  cx: number;
  cy: number;
  flag: string;
  showFlag: boolean;
  fontSize: number;
}

export default function WorldMap({ onCountryPress, selectedCountryId }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  const lastDistance = useRef<number | null>(null);
  const lastTouchCount = useRef(0);

  // Pre-compute centers and flag info once
  const geoData: CountryGeo[] = useMemo(() => {
    return (worldMap.locations as Country[]).map((country) => {
      const color = countryColors[country.id] || '#5BAD6F';
      const { x, y, width, height } = getPathCenter(country.path);
      const minDim = Math.min(width, height);
      const showFlag = minDim >= MIN_SIZE_FOR_FLAG;
      // Scale font size to country size, clamped
      const fontSize = Math.max(2, Math.min(8, minDim * 0.45));
      return {
        country,
        fill: color,
        stroke: darken(color, 0.4),
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
          const newX = currentTranslateX.current + gestureState.dx;
          const newY = currentTranslateY.current + gestureState.dy;
          translateX.setValue(newX);
          translateY.setValue(newY);
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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.mapContainer,
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
        ]}
      >
        <Svg
          viewBox={worldMap.viewBox}
          width="100%"
          height="100%"
          style={styles.svg}
        >
          {/* Country shapes */}
          {geoData.map(({ country, fill, stroke }) => (
            <Path
              key={country.id}
              d={country.path}
              fill={selectedCountryId === country.id ? '#FFD700' : fill}
              stroke={selectedCountryId === country.id ? '#B8860B' : stroke}
              strokeWidth={selectedCountryId === country.id ? 0.6 : 0.25}
              onPress={() => onCountryPress(country)}
            />
          ))}
          {/* Flag emojis on top */}
          {geoData.map(({ country, showFlag, cx, cy, flag, fontSize }) =>
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
