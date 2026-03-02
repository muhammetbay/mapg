import React, { useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import worldMap from '@svg-maps/world';
import { Country } from '../types';

interface Props {
  onCountryPress: (country: Country) => void;
  selectedCountryId: string | null;
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;

export default function WorldMap({ onCountryPress, selectedCountryId }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  // Track pinch gesture
  const lastDistance = useRef<number | null>(null);
  const lastTouchCount = useRef(0);

  const getDistance = (touches: GestureResponderEvent['nativeEvent']['touches']) => {
    if (touches.length < 2) return null;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (touches: GestureResponderEvent['nativeEvent']['touches']) => {
    return {
      x: (touches[0].pageX + touches[1].pageX) / 2,
      y: (touches[0].pageY + touches[1].pageY) / 2,
    };
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
          // Pinch to zoom
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
          // Pan
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
          {(worldMap.locations as Country[]).map((country) => (
            <Path
              key={country.id}
              d={country.path}
              fill={selectedCountryId === country.id ? '#4A90D9' : '#5BAD6F'}
              stroke="#1a3a1a"
              strokeWidth={0.3}
              onPress={() => onCountryPress(country)}
            />
          ))}
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
