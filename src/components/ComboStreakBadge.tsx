import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Fonts, Spacing, Radius, Animations } from '../theme';

interface ComboStreakBadgeProps {
  streak: number;
  delay?: number;
}

export const ComboStreakBadge: React.FC<ComboStreakBadgeProps> = ({ streak, delay = 800 }) => {
  const badgeScale = useSharedValue(1);
  const badgeOpacity = useSharedValue(0);
  const flameBlink = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      // This looks way better than that is specified in the requirements.
      badgeScale.value = withSequence(
        withTiming(1, { duration: 0 }),
        withSpring(1.1, Animations.spring.bouncy),
        withSpring(1, Animations.spring.bouncy),
      );

      badgeOpacity.value = withSequence(
        withTiming(0.8, { duration: 0 }),
        withTiming(1, { duration: Animations.durations.intermediate }),
      );

      flameBlink.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: Animations.durations.lg }),
          withTiming(1, { duration: Animations.durations.oneSecond }),
        ),
        -1,
        true,
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [badgeOpacity, badgeScale, delay, flameBlink]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const flameBlinkStyle = useAnimatedStyle(() => ({
    opacity: flameBlink.value,
  }));

  return (
    <Animated.View style={[styles.container, badgeStyle]}>
      <View style={styles.badge}>
        <View style={styles.flameWrapper}>
          <Animated.Text style={[styles.flame, flameBlinkStyle]}>🔥</Animated.Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>Combo Streak!</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.comboBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    // borderColor: 'rgba(255, 140, 66, 0.2)',
    gap: Spacing.xs,
  },
  flameWrapper: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  flame: {
    fontSize: 21,
    zIndex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Math.max(2, Math.floor(Spacing.xs / 2)),
  },
  streakNumber: {
    fontSize: Fonts.comboSize - 2,
    fontWeight: '800',
    color: Colors.comboText,
  },
  streakLabel: {
    fontSize: Fonts.comboSize - 4,
    fontWeight: '600',
    color: Colors.comboText,
    opacity: 0.85,
  },
});
