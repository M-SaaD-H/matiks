import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Fonts, Spacing } from '../theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ScoreCounterProps {
  finalScore: number;
  onComplete?: () => void;
  delay?: number;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  finalScore,
  onComplete,
  delay = 300,
}) => {
  const progress = useSharedValue(0);
  const scoreOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const scoreScale = useSharedValue(1);
  const dividerWidth = useSharedValue(0);
  const hasCompleted = useSharedValue(false);

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    hasCompleted.value = false;
    scoreScale.value = withSequence(
      withTiming(0.95, { duration: 0 }),
      withSpring(1.05, { damping: 12, stiffness: 140 }),
      withSpring(1, { damping: 12, stiffness: 140 })
    );
  }, [finalScore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade in label first
      labelOpacity.value = withTiming(1, { duration: 400 });
      scoreOpacity.value = withTiming(1, { duration: 300 });

      // Divider grows in width
      dividerWidth.value = withTiming(40, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });

      // Animate score: tick up with slight overshoot
      progress.value = withSequence(
        withTiming(finalScore * 1.04, {
          duration: 1800,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(finalScore, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        })
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [finalScore, delay]);

  // Use animatedProps to update TextInput value on UI thread
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(progress.value)}`,
    } as any;
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
    transform: [{ scale: scoreScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    width: dividerWidth.value,
    opacity: labelOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, labelStyle]}>YOUR SCORE</Animated.Text>
      <Animated.View style={containerStyle}>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          style={styles.score}
          animatedProps={animatedProps}
          defaultValue="0"
        />
      </Animated.View>
      <Animated.View style={[styles.divider, dividerStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Fonts.scoreLabelSize,
    color: Colors.textSecondary,
    letterSpacing: 4,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  score: {
    fontSize: Fonts.scoreSize,
    fontWeight: '800',
    color: Colors.accent,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    padding: 0,
    minWidth: 200,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.surfaceLight,
    marginTop: Spacing.md,
    borderRadius: 1,
  },
});
