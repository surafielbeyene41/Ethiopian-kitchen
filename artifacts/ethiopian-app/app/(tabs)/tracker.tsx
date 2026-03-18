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

const WATER_QUICK_ADD = [200, 350, 500, 750];
const STEP_QUICK_ADD = [500, 1000, 2500, 5000];

function CircularProgress({
  value, max, size = 110, strokeWidth = 10, color, theme, center,
}: {
  value: number; max: number; size?: number; strokeWidth?: number; color: string; theme: any; center: React.ReactNode;
}) {
  const pct = Math.min(value / max, 1);
  const r = (size - strokeWidth * 2) / 2;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute", width: size, height: size, borderRadius: size / 2,
          borderWidth: strokeWidth, borderColor: theme.inputBg,
        }}
      />
      {pct > 0 && (
        <View
          style={{
            position: "absolute", width: size, height: size, borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderTopColor: pct > 0 ? color : "transparent",
            borderRightColor: pct > 0.25 ? color : "transparent",
            borderBottomColor: pct > 0.5 ? color : "transparent",
            borderLeftColor: pct > 0.75 ? color : "transparent",
            transform: [{ rotate: "-90deg" }],
          }}
        />
      )}
      <View style={{ alignItems: "center" }}>{center}</View>
    </View>
  );
}

function WeekBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const h = max > 0 ? Math.max(4, (value / max) * 60) : 4;
  const isToday = label === new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2);
  return (
    <View style={styles.weekBarCol}>
      <View style={[styles.weekBarBg, { height: 60 }]}>
        <View style={[styles.weekBarFill, { height: h, backgroundColor: isToday ? color : color + "66" }]} />
      </View>
      <Text style={[styles.weekBarLabel, { color: isToday ? color : "#888", fontFamily: isToday ? "Inter_700Bold" : "Inter_400Regular" }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TrackerScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    todayWater, todaySteps, addWater, updateSteps,
    todayCaloriesBurned, todayWorkouts, waterEntries, stepEntries, workoutLogs,
  } = useApp();
  const [stepsInput, setStepsInput] = useState(String(todaySteps));
  const [activeTab, setActiveTab] = useState<"water" | "steps" | "workouts">("water");
  const isWeb = Platform.OS === "web";

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
    };
  });

  const waterByDay = last7Days.map((d) =>
    waterEntries.filter((e) => e.date === d.date).reduce((s, e) => s + e.amount, 0)
  );
  const stepsByDay = last7Days.map((d) => stepEntries.find((e) => e.date === d.date)?.steps ?? 0);
  const caloriesByDay = last7Days.map((d) =>
    workoutLogs.filter((l) => l.date === d.date).reduce((s, l) => s + l.calories, 0)
  );

  const handleSaveSteps = () => {
    const val = parseInt(stepsInput, 10);
    if (!isNaN(val) && val >= 0) updateSteps(val);
  };

  const handleAddSteps = (amount: number) => {
    const newSteps = todaySteps + amount;
    updateSteps(newSteps);
    setStepsInput(String(newSteps));
  };

  const waterPct = Math.round((todayWater / WATER_GOAL_ML) * 100);
  const stepsPct = Math.round((todaySteps / STEP_GOAL) * 100);
  const calPct = Math.round((todayCaloriesBurned / 500) * 100);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <Text style={[styles.headerSub, { color: theme.subtitle }]}>Daily Overview</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Tracker</Text>
      </View>

      <View style={[styles.summaryRow, { marginHorizontal: 20 }]}>
        {[
          { label: "Water", value: `${todayWater}ml`, target: `${WATER_GOAL_ML}ml`, pct: waterPct, color: "#1565C0" },
          { label: "Steps", value: todaySteps.toLocaleString(), target: STEP_GOAL.toLocaleString(), pct: stepsPct, color: "#2E7D32" },
          { label: "Burned", value: `${todayCaloriesBurned}`, target: "500 kcal", pct: calPct, color: "#E65100" },
        ].map((item) => (
          <View key={item.label} style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <CircularProgress
              value={item.pct}
              max={100}
              color={item.color}
              theme={theme}
              center={
                <>
                  <Text style={[styles.ringPct, { color: item.color }]}>{Math.min(item.pct, 100)}%</Text>
                </>
              }
            />
            <Text style={[styles.summaryValue, { color: theme.text }]}>{item.value}</Text>
            <Text style={[styles.summaryLabel, { color: theme.muted }]}>{item.label}</Text>
            <Text style={[styles.summaryTarget, { color: theme.muted }]}>/ {item.target}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.tabRow, { marginHorizontal: 20 }]}>
        {(["water", "steps", "workouts"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setActiveTab(t)}
            style={[
              styles.tabBtn,
              { backgroundColor: activeTab === t ? theme.tint : theme.card, borderColor: activeTab === t ? theme.tint : theme.divider },
            ]}
          >
            <Feather
              name={t === "water" ? "droplet" : t === "steps" ? "navigation" : "activity"}
              size={13}
              color={activeTab === t ? "#fff" : theme.subtitle}
            />
            <Text style={[styles.tabBtnText, { color: activeTab === t ? "#fff" : theme.subtitle }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "water" && (
        <View style={[styles.section, { marginHorizontal: 20 }]}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconCircle, { backgroundColor: "#1565C020" }]}>
                <Feather name="droplet" size={20} color="#1565C0" />
              </View>
              <View>
                <Text style={[styles.bigValue, { color: "#1565C0" }]}>{todayWater} ml</Text>
                <Text style={[styles.goalText, { color: theme.muted }]}>Goal: {WATER_GOAL_ML} ml · {waterPct}% complete</Text>
              </View>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.inputBg }]}>
              <View style={[styles.progressFill, { backgroundColor: "#1565C0", width: `${Math.min(waterPct, 100)}%` as any }]} />
            </View>
            <Text style={[styles.quickLabel, { color: theme.subtitle }]}>Quick Add</Text>
            <View style={styles.quickRow}>
              {WATER_QUICK_ADD.map((ml) => (
                <Pressable
                  key={ml}
                  onPress={() => addWater(ml)}
                  style={({ pressed }) => [
                    styles.quickBtn,
                    { backgroundColor: "#1565C0" + (pressed ? "30" : "15"), borderColor: "#1565C040" },
                  ]}
                >
                  <Feather name="plus" size={12} color="#1565C0" />
                  <Text style={[styles.quickBtnText, { color: "#1565C0" }]}>{ml}ml</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Text style={[styles.subTitle, { color: theme.text }]}>7-Day Water History</Text>
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.barChart}>
              {last7Days.map((d, i) => (
                <WeekBar key={d.date} value={waterByDay[i]} max={WATER_GOAL_ML} color="#1565C0" label={d.label} />
              ))}
            </View>
            <Text style={[styles.chartCaption, { color: theme.muted }]}>
              7-day average: {Math.round(waterByDay.reduce((s, v) => s + v, 0) / 7)} ml/day
            </Text>
          </View>

          {waterEntries.filter((e) => e.date === today.toISOString().split("T")[0]).length > 0 && (
            <>
              <Text style={[styles.subTitle, { color: theme.text }]}>Today's Log</Text>
              {waterEntries
                .filter((e) => e.date === today.toISOString().split("T")[0])
                .slice(0, 8)
                .map((entry) => (
                  <View key={entry.id} style={[styles.logRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={[styles.logDot, { backgroundColor: "#1565C0" }]} />
                    <Text style={[styles.logText, { color: theme.text }]}>{entry.amount} ml</Text>
                    <Text style={[styles.logTime, { color: theme.muted }]}>{entry.time}</Text>
                  </View>
                ))}
            </>
          )}
        </View>
      )}

      {activeTab === "steps" && (
        <View style={[styles.section, { marginHorizontal: 20 }]}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconCircle, { backgroundColor: "#2E7D3220" }]}>
                <Feather name="navigation" size={20} color="#2E7D32" />
              </View>
              <View>
                <Text style={[styles.bigValue, { color: "#2E7D32" }]}>{todaySteps.toLocaleString()} steps</Text>
                <Text style={[styles.goalText, { color: theme.muted }]}>Goal: {STEP_GOAL.toLocaleString()} · {stepsPct}% complete</Text>
              </View>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.inputBg }]}>
              <View style={[styles.progressFill, { backgroundColor: "#2E7D32", width: `${Math.min(stepsPct, 100)}%` as any }]} />
            </View>

            <Text style={[styles.quickLabel, { color: theme.subtitle }]}>Quick Add Steps</Text>
            <View style={styles.quickRow}>
              {STEP_QUICK_ADD.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => handleAddSteps(s)}
                  style={({ pressed }) => [
                    styles.quickBtn,
                    { backgroundColor: "#2E7D32" + (pressed ? "30" : "15"), borderColor: "#2E7D3240" },
                  ]}
                >
                  <Feather name="plus" size={12} color="#2E7D32" />
                  <Text style={[styles.quickBtnText, { color: "#2E7D32" }]}>{s.toLocaleString()}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.quickLabel, { color: theme.subtitle }]}>Set Exact Count</Text>
            <View style={styles.stepInputRow}>
              <Pressable
                onPress={() => { const v = Math.max(0, (parseInt(stepsInput) || 0) - 100); setStepsInput(String(v)); updateSteps(v); }}
                style={[styles.stepAdjBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              >
                <Feather name="minus" size={16} color={theme.text} />
              </Pressable>
              <TextInput
                value={stepsInput}
                onChangeText={setStepsInput}
                onSubmitEditing={handleSaveSteps}
                keyboardType="number-pad"
                style={[styles.stepInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              />
              <Pressable
                onPress={() => { const v = (parseInt(stepsInput) || 0) + 100; setStepsInput(String(v)); updateSteps(v); }}
                style={[styles.stepAdjBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              >
                <Feather name="plus" size={16} color={theme.text} />
              </Pressable>
              <Pressable
                onPress={handleSaveSteps}
                style={[styles.saveBtn, { backgroundColor: theme.tint }]}
              >
                <Feather name="check" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          <Text style={[styles.subTitle, { color: theme.text }]}>7-Day Steps History</Text>
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.barChart}>
              {last7Days.map((d, i) => (
                <WeekBar key={d.date} value={stepsByDay[i]} max={STEP_GOAL} color="#2E7D32" label={d.label} />
              ))}
            </View>
            <Text style={[styles.chartCaption, { color: theme.muted }]}>
              7-day average: {Math.round(stepsByDay.reduce((s, v) => s + v, 0) / 7).toLocaleString()} steps/day
            </Text>
          </View>

          <View style={[styles.calorieInfo, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="zap" size={16} color="#E65100" />
            <Text style={[styles.calorieText, { color: theme.text }]}>
              ~{Math.round(todaySteps * 0.04)} kcal burned from steps today
            </Text>
          </View>
        </View>
      )}

      {activeTab === "workouts" && (
        <View style={[styles.section, { marginHorizontal: 20 }]}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconCircle, { backgroundColor: "#E6510020" }]}>
                <Feather name="zap" size={20} color="#E65100" />
              </View>
              <View>
                <Text style={[styles.bigValue, { color: "#E65100" }]}>{todayCaloriesBurned} kcal</Text>
                <Text style={[styles.goalText, { color: theme.muted }]}>{todayWorkouts.length} workout{todayWorkouts.length !== 1 ? "s" : ""} today</Text>
              </View>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.inputBg }]}>
              <View style={[styles.progressFill, { backgroundColor: "#E65100", width: `${Math.min(calPct, 100)}%` as any }]} />
            </View>
          </View>

          <Text style={[styles.subTitle, { color: theme.text }]}>7-Day Workout History</Text>
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.barChart}>
              {last7Days.map((d, i) => (
                <WeekBar key={d.date} value={caloriesByDay[i]} max={500} color="#E65100" label={d.label} />
              ))}
            </View>
            <Text style={[styles.chartCaption, { color: theme.muted }]}>
              7-day total: {caloriesByDay.reduce((s, v) => s + v, 0)} kcal burned
            </Text>
          </View>

          {todayWorkouts.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="activity" size={32} color={theme.muted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No workouts logged today</Text>
              <Text style={[styles.emptySubtext, { color: theme.muted }]}>
                Head to the Fitness tab to log your first workout
              </Text>
            </View>
          ) : (
            <View style={styles.workoutList}>
              {todayWorkouts.map((w) => (
                <View key={w.id} style={[styles.workoutRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <View style={[styles.workoutIcon, { backgroundColor: theme.tint + "20" }]}>
                    <Feather name="activity" size={16} color={theme.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.workoutName, { color: theme.text }]}>{w.exerciseName}</Text>
                    <Text style={[styles.workoutMeta, { color: theme.muted }]}>{w.duration} min · {w.calories} kcal burned</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {workoutLogs.length > 0 && (
            <>
              <Text style={[styles.subTitle, { color: theme.text }]}>Recent History</Text>
              {workoutLogs.slice(0, 10).map((w) => (
                <View key={w.id} style={[styles.logRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <View style={[styles.logDot, { backgroundColor: "#E65100" }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.logText, { color: theme.text }]}>{w.exerciseName}</Text>
                  </View>
                  <Text style={[styles.logTime, { color: theme.muted }]}>{w.date}</Text>
                  <Text style={[styles.logKcal, { color: "#E65100" }]}>{w.calories} kcal</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  summaryCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 10, alignItems: "center", gap: 4 },
  ringPct: { fontSize: 13, fontFamily: "Inter_700Bold" },
  summaryValue: { fontSize: 12, fontFamily: "Inter_700Bold", textAlign: "center" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  summaryTarget: { fontSize: 9, fontFamily: "Inter_400Regular", textAlign: "center" },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  tabBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  section: { gap: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  iconCircle: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  bigValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  goalText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 16 },
  progressFill: { height: "100%", borderRadius: 4 },
  quickLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  quickRow: { flexDirection: "row", gap: 8 },
  quickBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  quickBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  stepInputRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  stepAdjBtn: { width: 42, height: 42, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  stepInput: { flex: 1, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  saveBtn: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  subTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  chartCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  barChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 80, marginBottom: 8 },
  weekBarCol: { alignItems: "center", gap: 4, flex: 1 },
  weekBarBg: { width: "70%", borderRadius: 4, justifyContent: "flex-end", overflow: "hidden" },
  weekBarFill: { width: "100%", borderRadius: 4 },
  weekBarLabel: { fontSize: 10 },
  chartCaption: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  calorieInfo: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, borderWidth: 1, padding: 12 },
  calorieText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptySubtext: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  workoutList: { gap: 8 },
  workoutRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12 },
  workoutIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  workoutName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  workoutMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  logRow: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, borderWidth: 1, padding: 10 },
  logDot: { width: 7, height: 7, borderRadius: 3.5 },
  logText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  logTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logKcal: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginLeft: 8 },
});
