# Matiks

Matiks is a post-game score reveal screen for a multiplayer math duel app. I built this to focus on smooth, production-quality animations using React Native and Reanimated 3.

## Main Features

- **Animated Score Counter**: The score ticks up from zero to the final value with a slight overshoot to give it a more natural, physical feel.
- **Combo Streak Badge**: This entry animation uses a bounce effect and includes a looping pulse on the flame to keep it dynamic.
- **Rank Reveal**: Once the score finishes counting, the player's rank slides up and fades in.
- **Share Button**: An interactive button with a subtle shimmer effect and scale feedback when you press it.
- **Confetti Burst**: As a bonus, I added a randomized particle burst using Skia that triggers when the score is revealed.
- **Modern UI**: The layout is clean and responsive, using a dark theme with vibrant accents.

## Tech Stack

- Framework: Expo (React Native)
- Animations: React Native Reanimated 3
- Graphics: React Native Skia (for the confetti)
- Icons: Expo Vector Icons

## Getting Started

### Prerequisites

You'll need Node.js installed and either the Expo Go app on your phone or an emulator set up.

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

3. Open the app:
   - Scan the QR code with Expo Go (Android) or your camera (iOS).
   - Or press 'a' for Android or 'i' for iOS if you're using an emulator.

## Project Context

This project was built as part of a UI Developer assignment. The goal was to create an immersive post-game experience with specific animation requirements:

- **Score Reveal**: Ticking numbers with overshoot.
- **Combo Badge**: Scale and bounce entry with a pulsing flame.
- **Rank Display**: Staggered reveal after the score completes.
- **Interactive Share**: Shimmer effect and tactile feedback on press.
- **Bonus**: Confetti burst using Skia for extra polish.

The focus was on keeping animations on the UI thread and avoiding third-party animation libraries where possible (except for Skia in the bonus task), ensuring high performance on both Android and iOS.
