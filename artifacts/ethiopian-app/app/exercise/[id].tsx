import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#2E7D32",
  intermediate: "#E65100",
  advanced: "#C62828",
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function TimerRing({ current, total, color }: { current: number; total: number; color: string }) {
  const pct = total > 0 ? current / total : 1;
  return (
    <View style={styles.ringOuter}>
      <View style={[styles.ringBack, { borderColor: color + "30" }]} />
      <View
        style={[
          styles.ringFill,
          {
            borderTopColor: pct > 0 ? color : "transparent",
            borderRightColor: pct > 0.25 ? color : "transparent",
            borderBottomColor: pct > 0.5 ? color : "transparent",
            borderLeftColor: pct > 0.75 ? color : "transparent",
            transform: [{ rotate: "-90deg" }],
          },
        ]}
      />
      <View style={styles.ringCenter}>
        <Text style={[styles.timerDigits, { color }]}>{formatTime(current)}</Text>
        <Text style={styles.timerLabel}>remaining</Text>
      </View>
    </View>
  );
}

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { logWorkout } = useApp();
  const isWeb = Platform.OS === "web";

  const exercise = EXERCISES.find((e) => e.id === id);

  const totalSecs = (exercise?.duration ?? 0) * 60;
  const [timerSecs, setTimerSecs] = useState(totalSecs);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [logged, setLogged] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSecs((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
            setTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const resetTimer = () => {
    setTimerSecs(totalSecs);
    setTimerRunning(false);
    setTimerDone(false);
  };

  const handleLog = async () => {
    if (!exercise) return;
    await logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
    });
    setLogged(true);
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtnAlone, { backgroundColor: theme.card }]}>
          <Feather name="arrow-left" size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.notFound, { color: theme.text }]}>Exercise not found</Text>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[exercise.category] ?? theme.tint;
  const levelColor = LEVEL_COLORS[exercise.level];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.hero, { backgroundColor: catColor, paddingTop: isWeb ? 67 : insets.top }]}>
        <View style={styles.heroNav}>
          <Pressable onPress={() => router.back()} style={styles.navBtn}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <View style={[styles.catBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={styles.catBadgeText}>{exercise.category.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.heroBody}>
          <View style={[styles.heroIconBox, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name={exercise.icon as any} size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            {exercise.amharic && (
              <Text style={styles.heroAmharic}>{exercise.amharic}</Text>
            )}
            <Text style={styles.heroName}>{exercise.name}</Text>
            <View style={styles.heroBadgeRow}>
              <View style={[styles.heroBadge, { backgroundColor: levelColor + "CC" }]}>
                <Text style={styles.heroBadgeText}>{exercise.level}</Text>
              </View>
              <View style={styles.heroBadge}>
                <Feather name="clock" size={11} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroBadgeText}>{exercise.duration} min</Text>
              </View>
              <View style={styles.heroBadge}>
                <Feather name="zap" size={11} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroBadgeText}>{exercise.calories} kcal</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.heroStats}>
          {[
            { label: "Duration", value: `${exercise.duration} min` },
            { label: "Calories", value: `${exercise.calories} kcal` },
            ...(exercise.sets ? [{ label: "Sets × Reps", value: `${exercise.sets}×${exercise.reps}` }] : []),
            { label: "Equipment", value: exercise.equipment },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{s.value}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.heroDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 24, gap: 16, padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: catColor + "40" }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Workout Timer</Text>
          <Text style={[styles.timerSubtext, { color: theme.subtitle }]}>
            {timerDone ? "Great work! Workout complete 🎉" : timerRunning ? "Stay focused, keep going!" : "Press start when you're ready"}
          </Text>

          <View style={styles.timerRow}>
            <TimerRing current={timerSecs} total={totalSecs} color={catColor} />
          </View>

          <View style={styles.timerBtns}>
            {!timerDone ? (
              <Pressable
                onPress={() => setTimerRunning(!timerRunning)}
                style={[styles.timerBtn, { backgroundColor: catColor }]}
              >
                <Feather name={timerRunning ? "pause" : "play"} size={20} color="#fff" />
                <Text style={styles.timerBtnText}>{timerRunning ? "Pause" : "Start"}</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleLog}
                disabled={logged}
                style={[styles.timerBtn, { backgroundColor: logged ? "#2E7D32" : catColor }]}
              >
                <Feather name={logged ? "check-circle" : "save"} size={20} color="#fff" />
                <Text style={styles.timerBtnText}>{logged ? "Logged!" : "Log Workout"}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={resetTimer}
              style={[styles.timerResetBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
            >
              <Feather name="rotate-ccw" size={18} color={theme.subtitle} />
            </Pressable>
          </View>

          {!timerDone && (
            <Pressable
              onPress={handleLog}
              disabled={logged}
              style={[styles.skipLogBtn, { borderColor: logged ? "#2E7D32" : catColor + "50" }]}
            >
              <Feather name={logged ? "check" : "plus"} size={14} color={logged ? "#2E7D32" : catColor} />
              <Text style={[styles.skipLogText, { color: logged ? "#2E7D32" : catColor }]}>
                {logged ? "Workout logged" : "Log without timer"}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About This Exercise</Text>
          <Text style={[styles.bodyText, { color: theme.subtitle }]}>{exercise.description}</Text>
        </View>

        {exercise.steps.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Step-by-Step Guide</Text>
            <Text style={[styles.tapHint, { color: theme.muted }]}>Tap each step to expand</Text>
            {exercise.steps.map((s) => (
              <Pressable
                key={s.step}
                onPress={() => setActiveStep(activeStep === s.step ? null : s.step)}
                style={[
                  styles.stepRow,
                  {
                    backgroundColor: activeStep === s.step ? catColor + "10" : theme.inputBg,
                    borderColor: activeStep === s.step ? catColor + "40" : "transparent",
                  },
                ]}
              >
                <View style={[styles.stepCircle, { backgroundColor: activeStep === s.step ? catColor : catColor + "30" }]}>
                  <Text style={[styles.stepNum, { color: activeStep === s.step ? "#fff" : catColor }]}>{s.step}</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.text }]}
                  numberOfLines={activeStep === s.step ? undefined : 1}
                >
                  {s.instruction}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {exercise.sets && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Workout Structure</Text>
            <View style={styles.structureGrid}>
              {[
                { label: "Sets", value: String(exercise.sets), icon: "layers" },
                { label: "Reps", value: String(exercise.reps), icon: "repeat" },
                { label: "Rest", value: `${exercise.restSeconds ?? 60}s`, icon: "clock" },
                { label: "Calories", value: `${exercise.calories} kcal`, icon: "zap" },
              ].map((item) => (
                <View key={item.label} style={[styles.structureItem, { backgroundColor: catColor + "12", borderColor: catColor + "25" }]}>
                  <Feather name={item.icon as any} size={16} color={catColor} />
                  <Text style={[styles.structureValue, { color: theme.text }]}>{item.value}</Text>
                  <Text style={[styles.structureLabel, { color: theme.muted }]}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Muscles Worked</Text>
          <View style={styles.chipRow}>
            {exercise.muscles.map((m) => (
              <View key={m} style={[styles.chip, { backgroundColor: catColor + "18", borderColor: catColor + "35" }]}>
                <Feather name="target" size={11} color={catColor} />
                <Text style={[styles.chipText, { color: catColor }]}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Benefits</Text>
          {exercise.benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={[styles.benefitDot, { backgroundColor: catColor }]} />
              <Text style={[styles.benefitText, { color: theme.subtitle }]}>{b}</Text>
            </View>
          ))}
        </View>

        {exercise.culturalNote && (
          <View style={[styles.card, { backgroundColor: catColor + "10", borderColor: catColor + "30" }]}>
            <View style={styles.culturalHeader}>
              <Feather name="globe" size={16} color={catColor} />
              <Text style={[styles.sectionTitle, { color: catColor }]}>Ethiopian Connection</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.text }]}>{exercise.culturalNote}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const RING_SIZE = 160;
const RING_STROKE = 12;

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 24 },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  navBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.25)", alignItems: "center", justifyContent: "center" },
  catBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  catBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  heroBody: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginTop: 10, marginBottom: 18 },
  heroIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  heroAmharic: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 2 },
  heroName: { color: "#fff", fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 26 },
  heroBadgeRow: { flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  heroBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_500Medium" },
  heroStats: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 14, padding: 14, gap: 8 },
  heroStat: { flex: 1, alignItems: "center" },
  heroStatValue: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold", textAlign: "center" },
  heroStatLabel: { color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 1 },
  heroDivider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.25)" },
  timerCard: { borderRadius: 18, borderWidth: 1.5, padding: 20, alignItems: "center", gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  timerSubtext: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  timerRow: { alignItems: "center", justifyContent: "center", marginVertical: 8 },
  ringOuter: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  ringBack: {
    position: "absolute", width: RING_SIZE, height: RING_SIZE,
    borderRadius: RING_SIZE / 2, borderWidth: RING_STROKE,
  },
  ringFill: {
    position: "absolute", width: RING_SIZE, height: RING_SIZE,
    borderRadius: RING_SIZE / 2, borderWidth: RING_STROKE,
  },
  ringCenter: { alignItems: "center" },
  timerDigits: { fontSize: 38, fontFamily: "Inter_700Bold" },
  timerLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#888" },
  timerBtns: { flexDirection: "row", gap: 10 },
  timerBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  timerBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  timerResetBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  skipLogBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  skipLogText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  bodyText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  tapHint: { fontSize: 11, fontFamily: "Inter_400Regular" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 6 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepNum: { fontSize: 13, fontFamily: "Inter_700Bold" },
  stepText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, paddingTop: 4 },
  structureGrid: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  structureItem: { flex: 1, minWidth: "40%", borderRadius: 12, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  structureValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  structureLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  benefitRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  benefitDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 7, flexShrink: 0 },
  benefitText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  culturalHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtnAlone: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", margin: 16 },
  notFound: { fontSize: 18, textAlign: "center", marginTop: 60, fontFamily: "Inter_400Regular" },
});
