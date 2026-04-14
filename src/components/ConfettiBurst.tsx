import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Circle,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Colors } from '../theme';

interface Particle {
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

const PARTICLE_COUNT = 65;
const DURATION = 2500;
const GRAVITY = 0.18;
const AIR_RESISTANCE = 0.985;
const TOTAL_FRAMES = 100;
const FRAME_INTERVAL = DURATION / TOTAL_FRAMES;

function generateParticles(width: number, height: number): Particle[] {
  const centerX = width / 2;
  const centerY = height * 0.28;
  const particles: Particle[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 10;
    particles.push({
      startX: centerX + (Math.random() - 0.5) * 30,
      startY: centerY + (Math.random() - 0.5) * 15,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 7,
      color: Colors.confettiColors[Math.floor(Math.random() * Colors.confettiColors.length)],
      size: 3 + Math.random() * 5,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
    });
  }
  return particles;
}

// Pre-compute all particle positions for each frame
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
      vy *= 0.995;
      frames.push({ x, y });
    }
    return frames;
  });
}

// Individual particle rendered at a specific frame
const ConfettiParticle: React.FC<{
  particle: Particle;
  trajectory: { x: number; y: number }[];
  frame: number;
  totalFrames: number;
}> = React.memo(({ particle, trajectory, frame, totalFrames }) => {
  const pos = trajectory[Math.min(frame, totalFrames - 1)] ?? {
    x: particle.startX,
    y: particle.startY,
  };
  const alpha = Math.max(0, 1 - frame / totalFrames);

  if (particle.shape === 'circle') {
    return (
      <Circle
        cx={pos.x}
        cy={pos.y}
        r={particle.size / 2}
        color={particle.color}
        opacity={alpha}
      />
    );
  }

  return (
    <RoundedRect
      x={pos.x - particle.size / 2}
      y={pos.y - particle.size * 0.3}
      width={particle.size}
      height={particle.size * 0.6}
      r={1}
      color={particle.color}
      opacity={alpha}
    />
  );
});

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ trigger }) => {
  const { width, height } = useWindowDimensions();
  const containerOpacity = useSharedValue(0);
  const [frame, setFrame] = React.useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const particles = useMemo(
    () => (trigger ? generateParticles(width, height) : []),
    [trigger, width, height]
  );

  const trajectories = useMemo(
    () => (particles.length > 0 ? computeTrajectories(particles, TOTAL_FRAMES) : []),
    [particles]
  );

  useEffect(() => {
    if (!trigger) return;

    containerOpacity.value = 1;
    containerOpacity.value = withDelay(1500, withTiming(0, { duration: 1000 }));

    setFrame(0);
    let f = 0;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      f++;
      if (f >= TOTAL_FRAMES) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setFrame(f);
    }, FRAME_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!trigger || particles.length === 0) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, containerStyle]}
      pointerEvents="none"
    >
      <Canvas style={StyleSheet.absoluteFill}>
        {particles.map((particle, i) => (
          <ConfettiParticle
            key={i}
            particle={particle}
            trajectory={trajectories[i]}
            frame={frame}
            totalFrames={TOTAL_FRAMES}
          />
        ))}
      </Canvas>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
});
