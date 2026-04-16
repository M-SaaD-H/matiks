import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Spacing, Radius, Animations } from '../theme';

interface ShareButtonProps {
  delay?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ delay = 0 }) => {
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20); // animate in from below
  const shimmerTranslateX = useSharedValue(-200);

  useEffect(() => {
    const timer = setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: Animations.durations.md });
      buttonTranslateY.value = withSpring(0, Animations.spring.snappy);

      // Shimmer loop
      shimmerTranslateX.value = withRepeat(
        withSequence(
          withTiming(200, { duration: Animations.durations.shimmer }),
          withTiming(-200, { duration: 0 }),
        ),
        -1,
        false,
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [buttonOpacity, buttonTranslateY, shimmerTranslateX, delay]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.93, {
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }, { translateY: buttonTranslateY.value }],
    opacity: buttonOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, buttonStyle]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.button}>
        <View style={styles.buttonContent}>
          <Animated.Text style={styles.buttonText}>Share Result</Animated.Text>
          {/* Shimmer overlay */}
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  button: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
  },
  buttonContent: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl + Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonText: {
    fontSize: Fonts.buttonSize,
    fontWeight: '700',
    color: Colors.background,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: Colors.shimmerBright,
    opacity: 0.3,
    transform: [{ skewX: '-20deg' }],
  },
});
