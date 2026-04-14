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
import { Colors, Fonts, Spacing } from '../theme';

interface RankRevealProps {
  rank: number;
  totalPlayers: number;
  delay?: number;
}

export const RankReveal: React.FC<RankRevealProps> = ({
  rank,
  totalPlayers,
  delay = 0,
}) => {
  const containerTranslateY = useSharedValue(50);
  const containerOpacity = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const totalOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Container slides up
      containerOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.quad),
      });
      containerTranslateY.value = withSpring(0, {
        damping: 18,
        stiffness: 120,
        mass: 0.8,
      });

      labelOpacity.value = withTiming(1, { duration: 400 });
      totalOpacity.value = withDelay(
        350,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

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
      <View style={styles.rankCard}>
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  rankCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 200,
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
