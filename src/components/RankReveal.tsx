import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts, Spacing, Animations } from '../theme';

interface RankRevealProps {
  rank: number;
  totalPlayers: number;
  delay?: number;
}

export const RankReveal: React.FC<RankRevealProps> = ({ rank, totalPlayers, delay = 0 }) => {
  const containerTranslateY = useSharedValue(50);
  const containerOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const totalOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Container slides up
      containerOpacity.value = withTiming(1, {
        duration: Animations.durations.md,
        easing: Easing.out(Easing.quad),
      });
      containerTranslateY.value = withSpring(0, Animations.spring.default);

      labelOpacity.value = withTiming(1, { duration: Animations.durations.intermediate });
      totalOpacity.value = withDelay(
        350,
        withTiming(1, {
          duration: Animations.durations.md,
          easing: Easing.out(Easing.quad),
        }),
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [containerOpacity, containerTranslateY, labelOpacity, totalOpacity, delay]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: containerTranslateY.value }],
    opacity: containerOpacity.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const totalStyle = useAnimatedStyle(() => ({
    opacity: totalOpacity.value,
  }));

  const formattedTotal = totalPlayers.toLocaleString();

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.label, labelStyle]}>RANK</Animated.Text>
      <View style={styles.rankRow}>
        <View style={styles.rankInner}>
          <Text style={styles.hash}># </Text>
          <Text style={styles.rankNumber}>{rank}</Text>
        </View>
        <Animated.View style={totalStyle}>
          <View style={styles.ofRow}>
            <Text style={styles.of}> of </Text>
            <Text style={styles.total}>{formattedTotal}</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rankInner: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ofRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hash: {
    fontSize: Fonts.rankNumberSize - 4,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  rankNumber: {
    fontSize: Fonts.rankNumberSize,
    fontWeight: '800',
    color: Colors.text,
  },
  of: {
    fontSize: Fonts.rankSize,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  total: {
    fontSize: Fonts.rankSize,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
