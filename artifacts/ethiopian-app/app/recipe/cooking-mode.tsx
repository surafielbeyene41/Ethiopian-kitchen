import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { RECIPES, convertIngredient } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

const { width } = Dimensions.get("window");

function parseMinutes(durationStr?: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatTimer(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function CookingModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const recipe = RECIPES.find((r) => r.id === id);
  const steps = recipe?.steps ?? [];
  const totalSteps = steps.length;

  const { themeMode, defaultServings, unitSystem } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotal, setTimerTotal] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const step = steps[currentStep];
  const stepMins = step ? parseMinutes(step.duration) : 0;

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSecs((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
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

  const startStepTimer = () => {
    const total = stepMins * 60;
    setTimerTotal(total);
    setTimerSecs(total);
    setTimerRunning(true);
  };

  const animateStep = (next: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep(next);
      setTimerRunning(false);
      setTimerSecs(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) animateStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) animateStep(currentStep - 1);
  };

  if (!recipe || totalSteps === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Feather name="arrow-left" size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.notFound, { color: theme.text }]}>No steps available</Text>
      </View>
    );
  }

  const progressPct = ((currentStep + 1) / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: isWeb ? 16 : insets.top + 8, backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="x" size={20} color={theme.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{recipe.name}</Text>
            <Text style={[styles.headerSub, { color: theme.muted }]}>Step {currentStep + 1} of {totalSteps}</Text>
          </View>
          <Pressable
            onPress={() => setShowIngredients(true)}
            style={[styles.headerBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Feather name="list" size={20} color={theme.tint} />
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: theme.divider }]}>
          <View style={[styles.progressFill, { width: `${progressPct}%` as any, backgroundColor: theme.tint }]} />
        </View>
      </View>

      {/* Main Step Content */}
      <ScrollView
        contentContainerStyle={styles.stepContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
          {/* Step Number Badge */}
          <View style={[styles.stepBadge, { backgroundColor: theme.tint }]}>
            <Text style={styles.stepBadgeText}>Step {step.step}</Text>
          </View>

          {/* Step Title */}
          <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>

          {/* Step Description */}
          <Text style={[styles.stepDesc, { color: theme.subtitle }]}>{step.description}</Text>

          {/* Timer for this step */}
          {stepMins > 0 && (
            <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.timerTitle, { color: theme.muted }]}>
                {timerRunning ? "Timer Running" : timerSecs > 0 ? "Timer Paused" : `This step takes ~${step.duration}`}
              </Text>
              {timerSecs > 0 || timerRunning ? (
                <View style={styles.timerDisplay}>
                  <Text style={[styles.timerDigits, { color: timerSecs <= 10 ? theme.danger : theme.tint }]}>
                    {formatTimer(timerSecs)}
                  </Text>
                  <View style={styles.timerBtns}>
                    <Pressable
                      onPress={() => setTimerRunning(!timerRunning)}
                      style={[styles.timerBtn, { backgroundColor: theme.tint }]}
                    >
                      <Feather name={timerRunning ? "pause" : "play"} size={18} color="#fff" />
                    </Pressable>
                    <Pressable
                      onPress={() => { setTimerRunning(false); setTimerSecs(0); }}
                      style={[styles.timerResetBtn, { borderColor: theme.divider }]}
                    >
                      <Feather name="rotate-ccw" size={16} color={theme.muted} />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={startStepTimer}
                  style={[styles.startTimerBtn, { backgroundColor: theme.tint }]}
                >
                  <Feather name="clock" size={16} color="#fff" />
                  <Text style={styles.startTimerText}>Start Timer</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Tip */}
          {step.tip && (
            <View style={[styles.tipCard, { backgroundColor: theme.gold + "15", borderColor: theme.gold + "40" }]}>
              <Feather name="star" size={14} color={theme.gold} />
              <Text style={[styles.tipText, { color: theme.text }]}>{step.tip}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: isWeb ? 24 : insets.bottom + 12, backgroundColor: theme.background }]}>
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {steps.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => animateStep(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentStep ? theme.tint : i < currentStep ? theme.tint + "60" : theme.divider,
                  width: i === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.navBtns}>
          <Pressable
            onPress={goPrev}
            disabled={currentStep === 0}
            style={[styles.navBtn, {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              opacity: currentStep === 0 ? 0.4 : 1,
            }]}
          >
            <Feather name="chevron-left" size={22} color={theme.text} />
            <Text style={[styles.navBtnText, { color: theme.text }]}>Previous</Text>
          </Pressable>

          {isLastStep ? (
            <Pressable
              onPress={() => setIsCompleted(true)}
              style={[styles.navBtn, { backgroundColor: theme.success, borderColor: theme.success, flex: 1.5 }]}
            >
              <Feather name="check-circle" size={20} color="#fff" />
              <Text style={[styles.navBtnText, { color: "#fff" }]}>Done Cooking!</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={goNext}
              style={[styles.navBtn, { backgroundColor: theme.tint, borderColor: theme.tint, flex: 1.5 }]}
            >
              <Text style={[styles.navBtnText, { color: "#fff" }]}>Next Step</Text>
              <Feather name="chevron-right" size={22} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Ingredient Overlay */}
      {showIngredients && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayBg} onPress={() => setShowIngredients(false)} />
          <View style={[styles.ingredientSheet, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Ingredients</Text>
              <Pressable onPress={() => setShowIngredients(false)}>
                <Feather name="x" size={20} color={theme.muted} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              {recipe.ingredients.map((ing, i) => {
                const converted = convertIngredient(ing.amount, ing.unit, unitSystem, recipe.servings, defaultServings);
                return (
                  <View key={i} style={[styles.ingRow, { borderBottomColor: theme.divider }]}>
                    <Text style={[styles.ingAmount, { color: theme.tint }]}>{converted.value} {converted.unit}</Text>
                    <Text style={[styles.ingName, { color: theme.text }]}>{ing.name}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
      {/* Completion Overlay */}
      {isCompleted && (
        <View style={styles.overlay}>
          <View style={[styles.completionSheet, { backgroundColor: theme.background }]}>
            <View style={[styles.successIcon, { backgroundColor: theme.success + "20" }]}>
              <Feather name="check-circle" size={60} color={theme.success} />
            </View>
            <Text style={[styles.completionTitle, { color: theme.text }]}>Recipe Complete!</Text>
            <Text style={[styles.completionSub, { color: theme.subtitle }]}>
              You've successfully cooked {recipe.name}. Enjoy your authentic Ethiopian meal!
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={[styles.doneBtn, { backgroundColor: theme.tint }]}
            >
              <Text style={styles.doneBtnText}>Back to Recipe</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_500Medium" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  stepContent: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  stepBadge: { alignSelf: "flex-start", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 20 },
  stepBadgeText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },
  stepTitle: { fontSize: 28, fontFamily: "Inter_700Bold", lineHeight: 34, marginBottom: 16 },
  stepDesc: { fontSize: 18, fontFamily: "Inter_400Regular", lineHeight: 28, marginBottom: 24 },
  timerCard: { borderRadius: 20, borderWidth: 1, padding: 20, alignItems: "center", gap: 12, marginBottom: 20 },
  timerTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  timerDisplay: { alignItems: "center", gap: 12 },
  timerDigits: { fontSize: 56, fontFamily: "Inter_700Bold" },
  timerBtns: { flexDirection: "row", gap: 10 },
  timerBtn: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  timerResetBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  startTimerBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  startTimerText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  tipCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 20 },
  tipText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium", lineHeight: 22 },
  bottomNav: { paddingHorizontal: 20, paddingTop: 12, gap: 14 },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  navBtns: { flexDirection: "row", gap: 10 },
  navBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  navBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  overlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  ingredientSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, padding: 20, paddingTop: 12,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#ccc", alignSelf: "center", marginBottom: 16 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  ingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  ingAmount: { fontSize: 14, fontFamily: "Inter_700Bold", minWidth: 80 },
  ingName: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", margin: 16 },
  notFound: { fontSize: 18, textAlign: "center", marginTop: 60, fontFamily: "Inter_400Regular" },
  completionSheet: {
    width: width * 0.85,
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  completionTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  completionSub: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  doneBtn: { width: "100%", paddingVertical: 18, borderRadius: 16, alignItems: "center" },
  doneBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
