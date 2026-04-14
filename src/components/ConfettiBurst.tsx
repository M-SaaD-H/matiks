import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { Colors } from '../theme';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: 'circle' | 'rect';
}

interface ConfettiBurstProps {
  trigger: boolean;
}

const PARTICLE_COUNT = 70;
const DURATION = 3200;

const GRAVITY = 0.22;
const AIR_RESISTANCE = 0.985;

const TOTAL_FRAMES = 100;

function generateParticles(width: number, height: number): Particle[] {
  const centerX = width / 2;
  const centerY = height * 0.35;
  const particles: Particle[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 7 + Math.random() * 14;
    particles.push({
      id: i,
      startX: centerX + (Math.random() - 0.5) * 80,
      startY: centerY + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 8,
      color: Colors.confettiColors[Math.floor(Math.random() * Colors.confettiColors.length)],
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
    });
  }
  return particles;
}

function computeTrajectories(
  particles: Particle[],
  totalFrames: number
): { x: number; y: number }[][] {
  return particles.map((p) => {
    const frames: { x: number; y: number }[] = [];
    let x = p.startX;
    let y = p.startY;
    let vx = p.vx;
    let vy = p.vy;

    for (let f = 0; f < totalFrames; f++) {
      x += vx;
      y += vy;
      vy += GRAVITY;
      vx *= AIR_RESISTANCE;
      vy *= 0.99;
      frames.push({ x, y });
    }
    return frames;
  });
}

const ConfettiParticle: React.FC<{
  particle: Particle;
  trajectory: { x: number; y: number }[];
  progress: SharedValue<number>;
  totalFrames: number;
}> = ({ particle, trajectory, progress, totalFrames }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const frameIdx = Math.floor(progress.value * (totalFrames - 1));
    const pos = trajectory[Math.min(frameIdx, totalFrames - 1)] ?? trajectory[totalFrames - 1];

    // Scale and rotate for more dynamism
    const rotation = interpolate(progress.value, [0, 1], [0, particle.id * 45]);
    const scale = interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1.2, 0.8, 0]);
    const opacity = interpolate(progress.value, [0, 0.05, 0.8, 1], [0, 1, 1, 0]);

    return {
      transform: [
        { translateX: pos.x - particle.size / 2 },
        { translateY: pos.y - particle.size / 2 },
        { rotate: `${rotation}deg` },
        { scale },
      ],
      opacity,
      backgroundColor: particle.color,
      width: particle.size,
      height: particle.shape === 'circle' ? particle.size : particle.size * 0.6,
      borderRadius: particle.shape === 'circle' ? particle.size / 2 : 1,
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ trigger }) => {
  const { width, height } = useWindowDimensions();
  const animationProgress = useSharedValue(0);

  const particles = useMemo(
    () => (trigger ? generateParticles(width, height) : []),
    [trigger, width, height]
  );

  const trajectories = useMemo(
    () => (particles.length > 0 ? computeTrajectories(particles, TOTAL_FRAMES) : []),
    [particles]
  );

  useEffect(() => {
    if (trigger) {
      animationProgress.value = 0;
      animationProgress.value = withTiming(1, { duration: DURATION });
    } else {
      animationProgress.value = 0;
    }
  }, [trigger]);

  if (!trigger || particles.length === 0) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="none">
      {particles.map((particle, i) => (
        <ConfettiParticle
          key={particle.id}
          particle={particle}
          trajectory={trajectories[i]}
          progress={animationProgress}
          totalFrames={TOTAL_FRAMES}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
