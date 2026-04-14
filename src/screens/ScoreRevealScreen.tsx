import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ScoreCounter } from '../components/ScoreCounter';
import { ComboStreakBadge } from '../components/ComboStreakBadge';
import { RankReveal } from '../components/RankReveal';
import { ShareButton } from '../components/ShareButton';
import { PlayAgainButton } from '../components/PlayAgainButton';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { Colors, Spacing, Fonts } from '../theme';

// Mock game data
const GAME_DATA = {
  playerName: 'You',
  score: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
};

export const ScoreRevealScreen: React.FC = () => {
  const [scoreComplete, setScoreComplete] = useState(false);

  // Entrance animations for static elements
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-15);
  const avatarScale = useSharedValue(0);
  const avatarOpacity = useSharedValue(0);
  const avatarRingRotate = useSharedValue(0);
  const footerOpacity = useSharedValue(0);
  const scoreGlow = useSharedValue(0);

  const handleScoreComplete = useCallback(() => {
    setScoreComplete(true);
    // Fire score glow pulse
    scoreGlow.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.4, { duration: 800 }),
      withTiming(0.6, { duration: 600 }),
    );
  }, []);

  useEffect(() => {
    // Header fades in immediately
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });

    // Avatar bounces in at 200ms
    avatarOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    avatarScale.value = withSequence(
      withTiming(0.9, { duration: 0 }),
      withSpring(1, { damping: 12, stiffness: 140 })
    );

    // Subtle ring rotation on avatar
    avatarRingRotate.value = withDelay(
      500,
      withTiming(360, { duration: 20000, easing: Easing.linear }),
    );

    // Footer fades in late
    footerOpacity.value = withDelay(2800, withTiming(1, { duration: 800 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const avatarContainerStyle = useAnimatedStyle(() => ({
    opacity: avatarOpacity.value,
    transform: [{ scale: avatarScale.value }],
  }));

  const scoreGlowStyle = useAnimatedStyle(() => ({
    opacity: scoreGlow.value * 0.6,
    transform: [{ scale: 1 + scoreGlow.value * 0.15 }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <LinearGradient
        colors={[Colors.background, '#0E0E24', Colors.surface]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerWrapper}>
          {/* Header */}
          <Animated.View style={[styles.header, headerStyle]}>
            <Text style={styles.headerText}>MATCH COMPLETE</Text>
            <View style={styles.headerDot} />
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            {/* Player Avatar */}
            <Animated.View style={[styles.avatarContainer, avatarContainerStyle]}>
              <View style={styles.avatarOuter}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {GAME_DATA.playerName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.playerName}>{GAME_DATA.playerName}</Text>
            </Animated.View>

            {/* Score Glow backdrop */}
            <Animated.View style={[styles.scoreGlow, scoreGlowStyle]} />

            {/* Score Counter */}
            <ScoreCounter
              finalScore={GAME_DATA.score}
              onComplete={handleScoreComplete}
              delay={400}
            />

            {/* Combo Streak Badge */}
            <ComboStreakBadge
              streak={GAME_DATA.comboStreak}
              delay={500}
            />

            {/* Rank Reveal - 200ms after score completes */}
            <RankReveal
              rank={GAME_DATA.rank}
              totalPlayers={GAME_DATA.totalPlayers}
              delay={scoreComplete ? 200 : 99999}
            />

            {/* Play Again Button */}
            <PlayAgainButton />
            
            {/* Share Button */}
            <ShareButton />
          </View>

          {/* Matiks Branding */}
          <Animated.View style={[styles.footer, footerStyle]}>
            <Text style={styles.footerText}>Plays on </Text>
            <Text style={styles.footerBrand}>Matiks</Text>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Confetti Burst */}
      <ConfettiBurst trigger={scoreComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    ...Platform.select({
      web: {
        minHeight: 700,
        minWidth: 380,
      },
    }),
  },
  innerWrapper: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  headerText: {
    fontSize: Fonts.headerSize,
    color: Colors.textMuted,
    letterSpacing: 3,
    fontWeight: '600',
  },
  headerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarOuter: {
    padding: 3,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.accent,
  },
  playerName: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scoreGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.accentDim,
    opacity: 0,
    top: '32%',
    zIndex: -1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  footerBrand: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
