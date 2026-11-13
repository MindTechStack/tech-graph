---
id: expo
name: Expo
kind: platform
status: practiced
tags: [react-native, mobile, expo-router, eas, native-modules]
what: "SDK, file-based router and cloud build service (EAS) for developing, building and shipping React Native apps."
why: "Provides ~70 vetted native APIs (camera, notifications, secure storage,文件系统) and Continuous Native Generation (`prebuild`) without touching Xcode or Android Studio manually."
problem: "Raw React Native upgrades and native dependency linking frequently break `Podfile` or Gradle configs and require local macOS/Android toolchains for every developer."
relations:
  - { to: react-native, label: "platform for" }
  - { to: react, label: "uses" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "Expo Documentation", url: https://docs.expo.dev/ }
alsoIn: []
source: personal
---

## Example
```tsx
// app/(tabs)/profile.tsx — Expo Router file-based screen
import { Link, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

export default function ProfileScreen() {
  async function handleFeedback() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Stack.Screen options={{ title: "Profile" }} />
      <Pressable onPress={handleFeedback}>
        <Text>Trigger Haptic Feedback</Text>
      </Pressable>
      <Link href="/settings">Open Settings</Link>
    </View>
  );
}
```

## Key points
- **Continuous Native Generation (CNG)**: treat `ios/` and `android/` folders as build artifacts generated from `app.json` and config plugins (`npx expo prebuild`) rather than hand-editing native project files.
- **Development Builds over Expo Go**: once an app uses custom native code or config plugins, build a custom `expo-dev-client` binary so your JS bundle reloads instantly inside your own native shell.
- **Expo Router**: brings web-style file-based routing, deep linking, and typed routes directly on top of React Navigation.

