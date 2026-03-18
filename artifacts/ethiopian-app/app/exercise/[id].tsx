import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { EXERCISES } from "@/data/fitness";
import { useTheme } from "@/hooks/useTheme";

const CATEGORY_COLORS: Record<string, string> = {
  cardio: "#1565C0",
  strength: "#E65100",
  traditional: "#6A1B9A",
  flexibility: "#2E7D32",
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { logWorkout, todayCaloriesBurned } = useApp();
  const isWeb = Platform.OS === "web";
  const [logged, setLogged] = useState(false);

  const exercise = EXERCISES.find((e) => e.id === id);

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.notFound, { color: theme.text }]}>Exercise not found</Text>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[exercise.category] ?? theme.tint;
  const levelColors = { beginner: "#2E7D32", intermediate: "#E65100", advanced: "#C62828" };
  const levelColor = levelColors[exercise.level];

  const handleLog = async () => {
    await logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
    });
    setLogged(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.hero,
          { backgroundColor: catColor, paddingTop: isWeb ? 67 : insets.top },
        ]}
      >
        <View style={styles.heroNav}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.25)" }]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
        </View>
        <View style={[styles.heroIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Feather name={exercise.icon as any} size={36} color="#fff" />
        </View>
        <Text style={styles.heroCategory}>{exercise.category.toUpperCase()}</Text>
        <Text style={styles.heroName}>{exercise.name}</Text>
        {exercise.amharic && (
          <Text style={styles.heroAmharic}>{exercise.amharic}</Text>
        )}
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{exercise.duration}</Text>
            <Text style={styles.heroStatLabel}>minutes</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{exercise.calories}</Text>
            <Text style={styles.heroStatLabel}>kcal</Text>
          </View>
          {exercise.sets && (
            <>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{exercise.sets}x{exercise.reps}</Text>
                <Text style={styles.heroStatLabel}>sets/reps</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: isWeb ? 34 : insets.bottom + 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoBadge, { backgroundColor: levelColor + "20" }]}>
              <Text style={[styles.infoLabel, { color: levelColor }]}>
                {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
              </Text>
            </View>
            <View style={[styles.infoBadge, { backgroundColor: catColor + "20" }]}>
              <Text style={[styles.infoLabel, { color: catColor }]}>
                {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
              </Text>
            </View>
            <View style={[styles.infoBadge, { backgroundColor: theme.tagBg }]}>
              <Feather name="package" size={11} color={theme.subtitle} style={{ marginRight: 3 }} />
              <Text style={[styles.infoLabel, { color: theme.subtitle }]}>{exercise.equipment}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.descCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.descTitle, { color: theme.text }]}>About this exercise</Text>
          <Text style={[styles.descText, { color: theme.subtitle }]}>{exercise.description}</Text>
        </View>

        {exercise.sets && (
          <View style={[styles.descCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.descTitle, { color: theme.text }]}>Structure</Text>
            <View style={styles.structureRow}>
              <View style={styles.structureItem}>
                <Text style={[styles.structureValue, { color: catColor }]}>{exercise.sets}</Text>
                <Text style={[styles.structureLabel, { color: theme.muted }]}>Sets</Text>
              </View>
              <View style={styles.structureItem}>
                <Text style={[styles.structureValue, { color: catColor }]}>{exercise.reps}</Text>
                <Text style={[styles.structureLabel, { color: theme.muted }]}>Reps</Text>
              </View>
              <View style={styles.structureItem}>
                <Text style={[styles.structureValue, { color: catColor }]}>60s</Text>
                <Text style={[styles.structureLabel, { color: theme.muted }]}>Rest</Text>
              </View>
            </View>
          </View>
        )}

        <Pressable
          onPress={handleLog}
          disabled={logged}
          style={({ pressed }) => [
            styles.logBtn,
            {
              backgroundColor: logged ? "#2E7D32" : catColor,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name={logged ? "check-circle" : "plus-circle"} size={20} color="#fff" />
          <Text style={styles.logBtnText}>
            {logged ? "Workout Logged!" : "Log This Workout"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  heroNav: { paddingVertical: 8 },
  navBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  heroIcon: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: 8 },
  heroCategory: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, marginTop: 12 },
  heroName: { color: "#fff", fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 4 },
  heroAmharic: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "Inter_500Medium", marginTop: 2 },
  heroStats: { flexDirection: "row", alignItems: "center", marginTop: 16, gap: 20 },
  heroStat: { alignItems: "center" },
  heroStatValue: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold" },
  heroStatLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Inter_400Regular" },
  heroDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.3)" },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  infoRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  infoBadge: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  infoLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  descCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  descTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  descText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  structureRow: { flexDirection: "row", gap: 24 },
  structureItem: { alignItems: "center" },
  structureValue: { fontSize: 24, fontFamily: "Inter_700Bold" },
  structureLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
  },
  logBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
  notFound: { fontSize: 18, textAlign: "center", marginTop: 100, fontFamily: "Inter_400Regular" },
});
