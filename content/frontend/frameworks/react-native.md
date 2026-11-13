---
id: react-native
name: React Native
kind: framework
status: practiced
core: true
tags: [mobile, ios, android, react, native-ui]
what: "Framework that renders React components to real iOS and Android native views instead of a web view."
why: "Shares TypeScript business logic and React component patterns across iOS and Android while preserving native scrolling, gestures, and platform look-and-feel."
problem: "Building and maintaining two separate Swift and Kotlin codebases doubles feature engineering cost, while WebView wrappers often feel sluggish on mobile."
relations:
  - { to: react, label: "uses component model of" }
  - { to: react-hooks, label: "manages state via" }
  - { to: expo, label: "developed and built with" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "React Native Documentation", url: https://reactnative.dev/docs/getting-started }
alsoIn: []
source: personal
---

## Example
```tsx
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface Item {
  readonly id: string;
  readonly title: string;
}

export function TaskFeed({
  items,
  onSelect,
}: {
  readonly items: readonly Item[];
  readonly onSelect: (id: string) => void;
}) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable onPress={() => onSelect(item.id)} style={styles.card}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  card: { padding: 14, borderRadius: 10, backgroundColor: "#1e293b" },
  title: { color: "#f8fafc", fontSize: 16, fontWeight: "600" },
});
```

## Key points
- **No HTML or CSS DOM**: primitives are `<View>`, `<Text>`, `<Image>`, and `<Pressable>` (all text must live inside `<Text>`), and layout uses Yoga (Flexbox with `flexDirection: "column"` by default).
- **Virtualized lists by default**: never map large arrays inside `<ScrollView>`; use `<FlatList>` or `<SectionList>` so off-screen native views are recycled.
- **New Architecture (JSI & Fabric)**: replaces the legacy asynchronous JSON bridge with synchronous C++ JSI bindings and TurboModules for low-latency gestures and animations.

