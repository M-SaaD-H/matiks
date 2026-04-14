import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { Colors, Fonts, Spacing, Radius } from '../theme';

interface ComboStreakBadgeProps {
  streak: number;
  delay?: number;
}

export const ComboStreakBadge: React.FC<ComboStreakBadgeProps> = ({
  streak,
  delay = 800,
}) => {
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Badge entry: scale from 0 → 1.15 → 1.0 with bounce
      badgeOpacity.value = withTiming(1, { duration: 200 });
      badgeScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1.0, { damping: 12, stiffness: 180 })
      );

      // Flame pulsing: looping scale + opacity
      flameScale.value = withDelay(
        600,
        withRepeat(
          withSequence(
            withTiming(1.2, { duration: 600 }),
            withTiming(1.0, { duration: 600 })
          ),
          -1,
          true
        )
      );

      flameOpacity.value = withDelay(
        600,
        withRepeat(
          withSequence(
            withTiming(0.7, { duration: 600 }),
            withTiming(1.0, { duration: 600 })
          ),
          -1,
          true
        )
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, badgeStyle]}>
      <View style={styles.badge}>
        <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
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
    marginBottom: Spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.comboBg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 66, 0.2)',
    gap: Spacing.sm,
  },
  flame: {
    fontSize: 24,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  streakNumber: {
    fontSize: Fonts.comboSize,
    fontWeight: '800',
    color: Colors.comboOrange,
  },
  streakLabel: {
    fontSize: Fonts.comboSize - 4,
    fontWeight: '600',
    color: Colors.comboOrange,
    opacity: 0.85,
  },
});
