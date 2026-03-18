import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { STEP_GOAL, WATER_GOAL_ML } from "@/data/fitness";
import { useTheme } from "@/hooks/useTheme";

function ProgressRing({
  value,
  max,
  size = 100,
  color,
  theme,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  size?: number;
  color: string;
  theme: any;
  label: string;
  sublabel: string;
}) {
  const pct = Math.min(value / max, 1);
  const strokeW = 8;
  const r = (size - strokeW * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);

  return (
    <View style={[styles.ringContainer, { width: size, height: size + 40 }]}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: size - strokeW * 2,
            height: size - strokeW * 2,
            borderRadius: (size - strokeW * 2) / 2,
            backgroundColor: color + "20",
            position: "absolute",
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeW,
            borderColor: theme.card,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeW,
            borderColor: color,
            borderTopColor: "transparent",
            borderRightColor: pct > 0.25 ? color : "transparent",
            borderBottomColor: pct > 0.5 ? color : "transparent",
            borderLeftColor: pct > 0.75 ? color : "transparent",
            transform: [{ rotate: "-90deg" }],
          }}
        />
        <Text style={[styles.ringValue, { color: theme.text, fontSize: size * 0.2 }]}>
          {Math.round(pct * 100)}%
        </Text>
      </View>
      <Text style={[styles.ringLabel, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.ringSub, { color: theme.muted }]}>{sublabel}</Text>
    </View>
  );
}

const WATER_OPTIONS = [200, 300, 500, 750];

export default function TrackerScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { todayWater, todaySteps, addWater, updateSteps, todayCaloriesBurned, todayWorkouts } = useApp();
  const [stepsInput, setStepsInput] = useState(String(todaySteps));
  const [stepsSaved, setStepsSaved] = useState(false);
  const isWeb = Platform.OS === "web";

  const waterPct = Math.min(todayWater / WATER_GOAL_ML, 1);
  const stepsPct = Math.min(todaySteps / STEP_GOAL, 1);

  const handleSaveSteps = () => {
    const val = parseInt(stepsInput, 10);
    if (!isNaN(val) && val >= 0) {
      updateSteps(val);
      setStepsSaved(true);
      setTimeout(() => setStepsSaved(false), 2000);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.header,
          { paddingTop: isWeb ? 67 : insets.top + 12 },
        ]}
      >
        <Text style={[styles.headerSub, { color: theme.subtitle }]}>Daily Overview</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tracker</Text>
      </View>

      <View style={styles.section}>
        <View style={[styles.ringsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Progress</Text>
          <View style={styles.ringsRow}>
            <ProgressRing
              value={todayWater}
              max={WATER_GOAL_ML}
              color="#1565C0"
              theme={theme}
              label="Water"
              sublabel={`${todayWater}/${WATER_GOAL_ML}ml`}
            />
            <ProgressRing
              value={todaySteps}
              max={STEP_GOAL}
              color="#2E7D32"
              theme={theme}
              label="Steps"
              sublabel={`${todaySteps.toLocaleString()}/${STEP_GOAL.toLocaleString()}`}
            />
            <ProgressRing
              value={todayCaloriesBurned}
              max={500}
              color="#E65100"
              theme={theme}
              label="Burned"
              sublabel={`${todayCaloriesBurned}/500 kcal`}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Water Intake</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.waterHeader}>
            <View style={[styles.waterIcon, { backgroundColor: "#1565C020" }]}>
              <Feather name="droplet" size={20} color="#1565C0" />
            </View>
            <View>
              <Text style={[styles.waterAmount, { color: "#1565C0" }]}>
                {todayWater} ml
              </Text>
              <Text style={[styles.waterGoal, { color: theme.muted }]}>
                Goal: {WATER_GOAL_ML} ml
              </Text>
            </View>
          </View>

          <View style={[styles.waterBar, { backgroundColor: theme.inputBg }]}>
            <View
              style={[
                styles.waterFill,
                { backgroundColor: "#1565C0", width: `${waterPct * 100}%` as any },
              ]}
            />
          </View>

          <Text style={[styles.quickAddTitle, { color: theme.subtitle }]}>Quick Add</Text>
          <View style={styles.waterBtns}>
            {WATER_OPTIONS.map((ml) => (
              <Pressable
                key={ml}
                onPress={() => addWater(ml)}
                style={({ pressed }) => [
                  styles.waterBtn,
                  {
                    backgroundColor: "#1565C0" + (pressed ? "33" : "15"),
                    borderColor: "#1565C0" + "40",
                  },
                ]}
              >
                <Feather name="plus" size={12} color="#1565C0" />
                <Text style={[styles.waterBtnText, { color: "#1565C0" }]}>{ml}ml</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Step Counter</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.waterHeader}>
            <View style={[styles.waterIcon, { backgroundColor: "#2E7D3220" }]}>
              <Feather name="navigation" size={20} color="#2E7D32" />
            </View>
            <View>
              <Text style={[styles.waterAmount, { color: "#2E7D32" }]}>
                {todaySteps.toLocaleString()} steps
              </Text>
              <Text style={[styles.waterGoal, { color: theme.muted }]}>
                Goal: {STEP_GOAL.toLocaleString()} steps
              </Text>
            </View>
          </View>

          <View style={[styles.waterBar, { backgroundColor: theme.inputBg }]}>
            <View
              style={[
                styles.waterFill,
                { backgroundColor: "#2E7D32", width: `${stepsPct * 100}%` as any },
              ]}
            />
          </View>

          <Text style={[styles.quickAddTitle, { color: theme.subtitle }]}>Update Steps</Text>
          <View style={styles.stepsRow}>
            <TextInput
              value={stepsInput}
              onChangeText={setStepsInput}
              keyboardType="number-pad"
              style={[
                styles.stepsInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              placeholder="Enter steps..."
              placeholderTextColor={theme.muted}
            />
            <Pressable
              onPress={handleSaveSteps}
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: stepsSaved ? "#2E7D32" : theme.tint, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name={stepsSaved ? "check" : "save"} size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Workouts</Text>
        {todayWorkouts.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="activity" size={32} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>No workouts yet today</Text>
            <Text style={[styles.emptySubtext, { color: theme.muted }]}>
              Head to the Fitness tab to log a workout
            </Text>
          </View>
        ) : (
          <View style={styles.workoutList}>
            {todayWorkouts.map((w) => (
              <View
                key={w.id}
                style={[styles.workoutRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={[styles.workoutDot, { backgroundColor: theme.tint }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workoutName, { color: theme.text }]}>{w.exerciseName}</Text>
                  <Text style={[styles.workoutMeta, { color: theme.muted }]}>
                    {w.duration} min · {w.calories} kcal
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  headerSub: { fontSize: 12, fontFamily: "Inter_500Medium", letterSpacing: 1, textTransform: "uppercase" },
  headerTitle: { fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 10 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  ringsCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginBottom: 16 },
  ringsRow: { flexDirection: "row", justifyContent: "space-around" },
  ringContainer: { alignItems: "center" },
  ringValue: { fontFamily: "Inter_700Bold" },
  ringLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  ringSub: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 2 },
  waterHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  waterIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  waterAmount: { fontSize: 22, fontFamily: "Inter_700Bold" },
  waterGoal: { fontSize: 12, fontFamily: "Inter_400Regular" },
  waterBar: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 16 },
  waterFill: { height: "100%", borderRadius: 4 },
  quickAddTitle: { fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  waterBtns: { flexDirection: "row", gap: 8 },
  waterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  waterBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  stepsRow: { flexDirection: "row", gap: 10 },
  stepsInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  workoutList: { gap: 8 },
  workoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  workoutDot: { width: 8, height: 8, borderRadius: 4 },
  workoutName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  workoutMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
