import { BlurView } from "expo-blur";
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
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { STEP_GOAL, WATER_GOAL_ML } from "@/data/fitness";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const WATER_QUICK = [150, 200, 350, 500];
const STEPS_QUICK = [500, 1000, 2500, 5000];

type ActiveTab = "summary" | "water" | "steps" | "bmi";

function ProgressBar({ value, max, color, theme }: { value: number; max: number; color: string; theme: any }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View style={[styles.pBar, { backgroundColor: theme.inputBg }]}>
      <View style={[styles.pBarFill, { backgroundColor: color, width: `${pct}%` as any }]} />
    </View>
  );
}

function WeekChart({ data, max, color, labels }: { data: number[]; max: number; color: string; labels: string[] }) {
  const todayIdx = new Date().getDay();
  return (
    <View style={styles.chartRow}>
      {data.map((val, i) => {
        const h = max > 0 ? Math.max(6, (val / max) * 64) : 6;
        const isToday = i === todayIdx;
        return (
          <View key={i} style={styles.barCol}>
            <View style={[styles.barBg, { height: 64 }]}>
              <View style={[styles.barFill, { height: h, backgroundColor: isToday ? color : color + "55" }]} />
            </View>
            <Text style={[styles.barLabel, { color: isToday ? color : "#999", fontFamily: isToday ? "Inter_700Bold" : "Inter_400Regular" }]}>
              {labels[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SummaryRing({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const capped = Math.min(pct, 100);
  return (
    <View style={styles.ringWrap}>
      <View style={[styles.ringBack, { borderColor: color + "28" }]} />
      <View
        style={[
          styles.ringFront,
          {
            borderTopColor: capped > 0 ? color : "transparent",
            borderRightColor: capped > 25 ? color : "transparent",
            borderBottomColor: capped > 50 ? color : "transparent",
            borderLeftColor: capped > 75 ? color : "transparent",
            transform: [{ rotate: "-90deg" }],
          },
        ]}
      />
      <View style={styles.ringInner}>
        <Text style={[styles.ringPct, { color }]}>{Math.round(capped)}%</Text>
        <Text style={styles.ringValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function TrackerScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    todayWater, todaySteps, addWater, updateSteps,
    todayCaloriesBurned, todayWorkouts,
    waterEntries, stepEntries, workoutLogs,
  } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");
  const [stepsInput, setStepsInput] = useState(String(todaySteps));
  const [bmiHeight, setBmiHeight] = useState("");
  const [bmiWeight, setBmiWeight] = useState("");
  const isWeb = Platform.OS === "web";

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + i);
    const ds = d.toISOString().split("T")[0];
    return {
      water: waterEntries.filter((e) => e.date === ds).reduce((s, e) => s + e.amount, 0),
      steps: stepEntries.find((e) => e.date === ds)?.steps ?? 0,
      calories: workoutLogs.filter((l) => l.date === ds).reduce((s, l) => s + l.calories, 0),
    };
  });

  const waterPct = Math.round((todayWater / WATER_GOAL_ML) * 100);
  const stepsPct = Math.round((todaySteps / STEP_GOAL) * 100);
  const calPct = Math.round((todayCaloriesBurned / 500) * 100);

  const handleAddSteps = (amount: number) => {
    const v = todaySteps + amount;
    updateSteps(v);
    setStepsInput(String(v));
  };

  const handleSaveSteps = () => {
    const v = parseInt(stepsInput, 10);
    if (!isNaN(v) && v >= 0) updateSteps(v);
  };

  const bmiResult = (() => {
    const h = parseFloat(bmiHeight) / 100;
    const w = parseFloat(bmiWeight);
    if (!h || !w || h <= 0) return null;
    const bmi = w / (h * h);
    let cat = "", color = "";
    if (bmi < 18.5) { cat = "underweight"; color = "#1565C0"; }
    else if (bmi < 25) { cat = "healthy_weight"; color = "#2E7D32"; }
    else if (bmi < 30) { cat = "overweight"; color = "#E65100"; }
    else { cat = "obese"; color = "#C62828"; }
    return { bmi: bmi.toFixed(1), cat, color };
  })();

  const { t, language } = useTranslation();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <Text style={[styles.headerSub, { color: theme.subtitle }]}>{t("daily_overview")}</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t("tracker_title")}</Text>

        <View style={[styles.dateStrip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Feather name="calendar" size={13} color={theme.tint} />
          <Text style={[styles.dateText, { color: theme.text }]}>
            {today.toLocaleDateString(language === "am" ? "am-ET" : "en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
        </View>
      </View>

      <View style={styles.ringsRow}>
        {[
          { label: "water", value: `${todayWater}ml`, pct: waterPct, color: "#2196F3" },
          { label: "steps", value: todaySteps.toLocaleString(), pct: stepsPct, color: "#4CAF50" },
          { label: "burned", value: `${todayCaloriesBurned}`, pct: calPct, color: "#FF9800" },
        ].map((r) => (
          <View key={r.label} style={styles.ringCardWrapper}>
            <View style={[styles.ringCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <SummaryRing pct={r.pct} color={r.color} label={t(r.label as any)} value={r.value} />
              <Text style={[styles.ringCardLabel, { color: theme.muted }]}>{t(r.label as any)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tabsRow}>
        {([
          { id: "summary", label: "summary", icon: "bar-chart-2" },
          { id: "water", label: "water", icon: "droplet" },
          { id: "steps", label: "steps", icon: "navigation" },
          { id: "bmi", label: "bmi", icon: "user" },
        ] as { id: ActiveTab; label: string; icon: string }[]).map((tItem) => (
          <Pressable
            key={tItem.id}
            onPress={() => setActiveTab(tItem.id)}
            style={[
              styles.tabBtn,
              {
                backgroundColor: activeTab === t.id ? "#FFC107" : "rgba(255,255,255,0.05)",
                borderColor: activeTab === t.id ? "#FFC107" : "rgba(255,255,255,0.08)",
              },
            ]}
          >
            <Feather name={tItem.icon as any} size={14} color={activeTab === tItem.id ? "#000" : "rgba(255,255,255,0.5)"} />
            <Text style={[styles.tabBtnText, { color: activeTab === tItem.id ? "#000" : "rgba(255,255,255,0.5)" }]}>{t(tItem.label as any)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionWrap}>
        {activeTab === "summary" && (
          <View style={{ gap: 16 }}>
            <View style={styles.card}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t("today_glance")}</Text>
              {[
                { label: t("water_intake"), value: `${todayWater} / ${WATER_GOAL_ML} ml`, pct: waterPct, color: "#2196F3", icon: "droplet" },
                { label: t("steps"), value: `${todaySteps.toLocaleString()} / ${STEP_GOAL.toLocaleString()}`, pct: stepsPct, color: "#4CAF50", icon: "navigation" },
                { label: t("burned"), value: `${todayCaloriesBurned} / 500 kcal`, pct: calPct, color: "#FF9800", icon: "zap" },
              ].map((item) => (
                <View key={item.label} style={styles.glanceRow}>
                  <View style={[styles.glanceIcon, { backgroundColor: item.color + "20" }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.glanceLabelRow}>
                      <Text style={[styles.glanceLabel, { color: theme.muted }]}>{item.label}</Text>
                      <Text style={[styles.glanceVal, { color: item.color }]}>{item.value}</Text>
                    </View>
                    <ProgressBar value={item.pct} max={100} color={item.color} theme={theme} />
                  </View>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>This Week</Text>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.cardTitle, { color: "#1565C0" }]}>💧 {t("water")} (ml)</Text>
              <WeekChart data={weekData.map((d) => d.water)} max={WATER_GOAL_ML} color="#1565C0" labels={dayNames} />
              <Text style={[styles.chartAvg, { color: theme.muted }]}>
                {t("weekly_avg_water", { val: Math.round(weekData.reduce((s, d) => s + d.water, 0) / 7) })}
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.cardTitle, { color: "#2E7D32" }]}>👟 {t("steps")}</Text>
              <WeekChart data={weekData.map((d) => d.steps)} max={STEP_GOAL} color="#2E7D32" labels={dayNames} />
              <Text style={[styles.chartAvg, { color: theme.muted }]}>
                {t("weekly_avg_steps", { val: Math.round(weekData.reduce((s, d) => s + d.steps, 0) / 7).toLocaleString() })}
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.cardTitle, { color: "#E65100" }]}>🔥 {t("burned")}</Text>
              <WeekChart data={weekData.map((d) => d.calories)} max={500} color="#E65100" labels={dayNames} />
              <Text style={[styles.chartAvg, { color: theme.muted }]}>
                {t("weekly_total_kcal", { val: weekData.reduce((s, d) => s + d.calories, 0) })}
              </Text>
            </View>

            {todayWorkouts.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("workouts_today")}</Text>
                {todayWorkouts.map((w) => (
                  <View key={w.id} style={[styles.workoutRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={[styles.workoutIcon, { backgroundColor: theme.tint + "20" }]}>
                      <Feather name="activity" size={16} color={theme.tint} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.workoutName, { color: theme.text }]}>{w.exerciseName}</Text>
                      <Text style={[styles.workoutMeta, { color: theme.muted }]}>{w.duration} min · {w.calories} kcal</Text>
                    </View>
                    <Text style={[styles.workoutKcal, { color: "#E65100" }]}>{w.calories} kcal</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "water" && (
          <View style={{ gap: 14 }}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.mainStatRow}>
                <View style={[styles.mainStatIcon, { backgroundColor: "#1565C020" }]}>
                  <Feather name="droplet" size={22} color="#1565C0" />
                </View>
                <View>
                  <Text style={[styles.mainStatVal, { color: "#1565C0" }]}>{todayWater} ml</Text>
                  <Text style={[styles.mainStatLabel, { color: theme.muted }]}>{t("results_count", { count: WATER_GOAL_ML, plural: "" })} ml goal · {waterPct}%</Text>
                </View>
              </View>
              <ProgressBar value={todayWater} max={WATER_GOAL_ML} color="#1565C0" theme={theme} />
              <Text style={[styles.quickLabel, { color: theme.subtitle }]}>{t("quick_add")}</Text>
              <View style={styles.quickRow}>
                {WATER_QUICK.map((ml) => (
                  <Pressable
                    key={ml}
                    onPress={() => addWater(ml)}
                    style={({ pressed }) => [styles.quickBtn, { backgroundColor: "#1565C0" + (pressed ? "35" : "15"), borderColor: "#1565C050" }]}
                  >
                    <Feather name="plus" size={12} color="#1565C0" />
                    <Text style={[styles.quickBtnText, { color: "#1565C0" }]}>{ml}ml</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("today_log")}</Text>
            {waterEntries.filter((e) => e.date === todayStr).length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <Feather name="droplet" size={28} color={theme.muted} />
                <Text style={[styles.emptyText, { color: theme.muted }]}>{t("no_water_logged")}</Text>
              </View>
            ) : (
              waterEntries.filter((e) => e.date === todayStr).map((e) => (
                <View key={e.id} style={[styles.logRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <View style={[styles.logDot, { backgroundColor: "#1565C0" }]} />
                  <Text style={[styles.logMain, { color: theme.text }]}>{e.amount} ml</Text>
                  <Text style={[styles.logTime, { color: theme.muted }]}>{e.time}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === "steps" && (
          <View style={{ gap: 14 }}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.mainStatRow}>
                <View style={[styles.mainStatIcon, { backgroundColor: "#2E7D3220" }]}>
                  <Feather name="navigation" size={22} color="#2E7D32" />
                </View>
                <View>
                  <Text style={[styles.mainStatVal, { color: "#2E7D32" }]}>{todaySteps.toLocaleString()}</Text>
                  <Text style={[styles.mainStatLabel, { color: theme.muted }]}>{t("results_count", { count: STEP_GOAL, plural: "" })} goal · {stepsPct}%</Text>
                </View>
              </View>
              <ProgressBar value={todaySteps} max={STEP_GOAL} color="#2E7D32" theme={theme} />

              <Text style={[styles.quickLabel, { color: theme.subtitle }]}>{t("quick_add_steps")}</Text>
              <View style={styles.quickRow}>
                {STEPS_QUICK.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => handleAddSteps(s)}
                    style={({ pressed }) => [styles.quickBtn, { backgroundColor: "#2E7D32" + (pressed ? "35" : "15"), borderColor: "#2E7D3250" }]}
                  >
                    <Feather name="plus" size={12} color="#2E7D32" />
                    <Text style={[styles.quickBtnText, { color: "#2E7D32" }]}>{s.toLocaleString()}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.quickLabel, { color: theme.subtitle }]}>{t("set_exact_steps")}</Text>
              <View style={styles.stepsInputRow}>
                <Pressable
                  onPress={() => { const v = Math.max(0, (parseInt(stepsInput) || 0) - 100); setStepsInput(String(v)); updateSteps(v); }}
                  style={[styles.adjBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
                >
                  <Feather name="minus" size={16} color={theme.text} />
                </Pressable>
                <TextInput
                  value={stepsInput}
                  onChangeText={setStepsInput}
                  onSubmitEditing={handleSaveSteps}
                  keyboardType="number-pad"
                  style={[styles.stepsInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                />
                <Pressable
                  onPress={() => { const v = (parseInt(stepsInput) || 0) + 100; setStepsInput(String(v)); updateSteps(v); }}
                  style={[styles.adjBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
                >
                  <Feather name="plus" size={16} color={theme.text} />
                </Pressable>
                <Pressable onPress={handleSaveSteps} style={[styles.saveBtn, { backgroundColor: theme.tint }]}>
                  <Feather name="check" size={18} color="#fff" />
                </Pressable>
              </View>

              <View style={[styles.calorieEstimate, { backgroundColor: theme.inputBg }]}>
                <Feather name="zap" size={14} color="#E65100" />
                <Text style={[styles.calorieEstimateText, { color: theme.text }]}>
                  {t("est_burn_steps", { val: Math.round(todaySteps * 0.04) })}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "bmi" && (
          <View style={{ gap: 14 }}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.bmiHeader}>
                <Feather name="user" size={20} color={theme.tint} />
                <Text style={[styles.cardTitle, { color: theme.text }]}>{t("bmi_calc")}</Text>
              </View>
              <Text style={[styles.bmiSubtext, { color: theme.subtitle }]}>
                {t("bmi_desc")}
              </Text>

              <View style={styles.bmiInputsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bmiInputLabel, { color: theme.subtitle }]}>{t("height_cm")}</Text>
                  <TextInput
                    value={bmiHeight}
                    onChangeText={setBmiHeight}
                    placeholder="e.g. 170"
                    placeholderTextColor={theme.muted}
                    keyboardType="decimal-pad"
                    style={[styles.bmiInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bmiInputLabel, { color: theme.subtitle }]}>{t("weight_kg")}</Text>
                  <TextInput
                    value={bmiWeight}
                    onChangeText={setBmiWeight}
                    placeholder="e.g. 65"
                    placeholderTextColor={theme.muted}
                    keyboardType="decimal-pad"
                    style={[styles.bmiInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                  />
                </View>
              </View>

              {bmiResult && (
                <View style={[styles.bmiResult, { backgroundColor: bmiResult.color + "10", borderColor: bmiResult.color + "30" }]}>
                  <Text style={[styles.bmiScore, { color: bmiResult.color }]}>{t("bmi_score_label", { score: bmiResult.bmi })}</Text>
                  <Text style={[styles.bmiCat, { color: bmiResult.color }]}>{t(bmiResult.cat as any)}</Text>
                </View>
              )}
            </View>

            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t("bmi_scale")}</Text>
              {[
                { range: "Below 18.5", cat: t("underweight"), color: "#1565C0" },
                { range: "18.5 – 24.9", cat: t("healthy_weight"), color: "#2E7D32" },
                { range: "25.0 – 29.9", cat: t("overweight"), color: "#E65100" },
                { range: "30.0 and above", cat: t("obese"), color: "#C62828" },
              ].map((r) => (
                <View key={r.range} style={styles.bmiScaleRow}>
                  <View style={[styles.bmiScaleDot, { backgroundColor: r.color }]} />
                  <Text style={[styles.bmiScaleRange, { color: theme.subtitle }]}>{r.range}</Text>
                  <Text style={[styles.bmiScaleCat, { color: r.color }]}>{r.cat}</Text>
                </View>
              ))}
              <Text style={[styles.bmiDisclaimer, { color: theme.muted }]}>
                {t("bmi_disclaimer")}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 4 },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFC107", letterSpacing: 0.8 },
  headerTitle: { fontSize: 34, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  dateStrip: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", marginTop: 10 },
  dateText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  ringsRow: { flexDirection: "row", gap: 12, marginHorizontal: 20, marginBottom: 20 },
  ringCardWrapper: { flex: 1, borderRadius: 20, overflow: "hidden" },
  ringCard: { flex: 1, borderWidth: 1, padding: 12, alignItems: "center", gap: 8 },
  ringWrap: { width: 80, height: 80, alignItems: "center", justifyContent: "center", position: "relative" },
  ringBack: { position: "absolute", width: 80, height: 80, borderRadius: 40, borderWidth: 9 },
  ringFront: { position: "absolute", width: 80, height: 80, borderRadius: 40, borderWidth: 9 },
  ringInner: { alignItems: "center" },
  ringPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  ringValue: { fontSize: 10, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)", textAlign: "center" },
  ringCardLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  tabsRow: { flexDirection: "row", gap: 8, marginHorizontal: 20, marginBottom: 20 },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  tabBtnText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  sectionWrap: { marginHorizontal: 20, gap: 16 },
  card: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 16, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  cardTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginTop: 4 },
  glanceRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  glanceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  glanceLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  glanceLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  glanceVal: { fontSize: 14, fontFamily: "Inter_700Bold" },
  pBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  pBarFill: { height: "100%", borderRadius: 4 },
  chartRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100, marginTop: 10 },
  barCol: { alignItems: "center", gap: 6, flex: 1 },
  barBg: { width: "70%", borderRadius: 6, justifyContent: "flex-end", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.05)" },
  barFill: { width: "100%", borderRadius: 6 },
  barLabel: { fontSize: 11, marginTop: 4 },
  chartAvg: { fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 10 },
  workoutRow: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 10, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  workoutIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  workoutName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  workoutMeta: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  workoutKcal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  mainStatRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  mainStatIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  mainStatVal: { fontSize: 32, fontFamily: "Inter_700Bold" },
  mainStatLabel: { fontSize: 14, fontFamily: "Inter_500Medium", marginTop: 2, color: "rgba(255,255,255,0.4)" },
  quickLabel: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: 1 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  quickBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  stepsInputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  adjBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  stepsInput: { flex: 1, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center", backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  saveBtn: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  calorieEstimate: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, padding: 14, backgroundColor: "rgba(255,255,255,0.05)" },
  calorieEstimateText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1, color: "rgba(255,255,255,0.7)" },
  logRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  logDot: { width: 8, height: 8, borderRadius: 4 },
  logMain: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  logTime: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  emptyBox: { borderRadius: 20, borderWidth: 1, padding: 40, alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.3)" },
  bmiHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  bmiSubtext: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, color: "rgba(255,255,255,0.6)" },
  bmiInputsRow: { flexDirection: "row", gap: 16 },
  bmiInputLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8, color: "rgba(255,255,255,0.5)" },
  bmiInput: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 18, fontFamily: "Inter_700Bold", backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  bmiResult: { borderRadius: 20, borderWidth: 1, padding: 20, alignItems: "center", gap: 6, marginTop: 10 },
  bmiScore: { fontSize: 36, fontFamily: "Inter_700Bold" },
  bmiCat: { fontSize: 18, fontFamily: "Inter_700Bold" },
  bmiScaleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  bmiScaleDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  bmiScaleRange: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.5)" },
  bmiScaleCat: { fontSize: 14, fontFamily: "Inter_700Bold" },
  bmiDisclaimer: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, color: "rgba(255,255,255,0.3)", marginTop: 10 },
});
