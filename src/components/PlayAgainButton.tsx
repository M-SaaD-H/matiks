import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Spacing, Radius } from '../theme';

interface PlayAgainButtonProps {
  delay?: number;
  onPress?: () => void;
}

export const PlayAgainButton: React.FC<PlayAgainButtonProps> = ({
  delay = 0,
  onPress,
}) => {
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 500 });
      buttonTranslateY.value = withSpring(0, {
        damping: 18,
        stiffness: 140,
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.93, {
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { translateY: buttonTranslateY.value },
    ],
    opacity: buttonOpacity.value,
  }));

  return (
    <Animated.View style={[styles.wrapper, buttonStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.button}
      >
        <Animated.Text style={styles.buttonText}>Play Again</Animated.Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  button: {
    paddingHorizontal: Spacing.xl + Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.surfaceLight,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: Fonts.buttonSize,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
