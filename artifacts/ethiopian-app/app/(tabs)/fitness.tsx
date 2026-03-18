import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { EXERCISES, MEAL_PLANS } from "@/data/fitness";
import { useTheme } from "@/hooks/useTheme";

const EXERCISE_CATS = [
  { id: "all", label: "All" },
  { id: "cardio", label: "Cardio" },
  { id: "strength", label: "Strength" },
  { id: "traditional", label: "Traditional" },
  { id: "flexibility", label: "Flex" },
];

const GOAL_COLORS: Record<string, string> = {
  "weight-loss": "#E65100",
  "muscle-gain": "#1565C0",
  maintenance: "#2E7D32",
  fasting: "#6A1B9A",
};

function MealPlanCard({ plan, theme }: { plan: typeof MEAL_PLANS[0]; theme: any }) {
  const goalColor = GOAL_COLORS[plan.goal];
  return (
    <View
      style={[
        styles.mealCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.mealCardTop}>
        <View style={[styles.goalTag, { backgroundColor: goalColor + "20" }]}>
          <Text style={[styles.goalTagText, { color: goalColor }]}>
            {plan.goal.replace("-", " ")}
          </Text>
        </View>
        <Text style={[styles.mealCalories, { color: theme.tint }]}>
          {plan.totalCalories} kcal
        </Text>
      </View>
      <Text style={[styles.mealPlanName, { color: theme.text }]}>{plan.name}</Text>
      <Text style={[styles.mealPlanDesc, { color: theme.subtitle }]} numberOfLines={2}>
        {plan.description}
      </Text>
      {plan.meals.map((meal) => (
        <View
          key={meal.time}
          style={[styles.mealRow, { borderTopColor: theme.divider }]}
        >
          <View style={styles.mealTime}>
            <Text style={[styles.mealTimeText, { color: theme.muted }]}>
              {meal.time.charAt(0).toUpperCase() + meal.time.slice(1)}
            </Text>
          </View>
          <Text style={[styles.mealDish, { color: theme.text }]} numberOfLines={1}>
            {meal.dish}
          </Text>
          <Text style={[styles.mealKcal, { color: theme.tint }]}>
            {meal.calories}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ExerciseCard({
  exercise,
  theme,
  onLog,
}: {
  exercise: typeof EXERCISES[0];
  theme: any;
  onLog: (ex: typeof EXERCISES[0]) => void;
}) {
  const levelColors = { beginner: "#2E7D32", intermediate: "#E65100", advanced: "#C62828" };
  const levelColor = levelColors[exercise.level];
  const categoryColors: Record<string, string> = {
    cardio: "#1565C0",
    strength: "#E65100",
    traditional: "#6A1B9A",
    flexibility: "#2E7D32",
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: exercise.id } })}
      style={({ pressed }) => [
        styles.exerciseCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View
        style={[
          styles.exerciseIcon,
          { backgroundColor: categoryColors[exercise.category] + "20" },
        ]}
      >
        <Feather
          name={exercise.icon as any}
          size={22}
          color={categoryColors[exercise.category]}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.exerciseNameRow}>
          <Text style={[styles.exerciseName, { color: theme.text }]} numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={[styles.lvlBadge, { backgroundColor: levelColor + "22" }]}>
            <Text style={[styles.lvlText, { color: levelColor }]}>{exercise.level}</Text>
          </View>
        </View>
        {exercise.amharic && (
          <Text style={[styles.amharicSmall, { color: categoryColors[exercise.category] }]}>
            {exercise.amharic}
          </Text>
        )}
        <View style={styles.exMeta}>
          <Feather name="clock" size={11} color={theme.muted} />
          <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.duration} min</Text>
          <Feather name="zap" size={11} color={theme.muted} style={{ marginLeft: 8 }} />
          <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.calories} kcal</Text>
          {exercise.sets && (
            <>
              <Feather name="repeat" size={11} color={theme.muted} style={{ marginLeft: 8 }} />
              <Text style={[styles.exMetaText, { color: theme.muted }]}>
                {exercise.sets}x{exercise.reps}
              </Text>
            </>
          )}
        </View>
      </View>
      <Pressable
        onPress={() => onLog(exercise)}
        style={[styles.logBtn, { backgroundColor: theme.tint }]}
      >
        <Feather name="plus" size={16} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

export default function FitnessScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { logWorkout, todayCaloriesBurned } = useApp();
  const [tab, setTab] = useState<"exercises" | "meals">("exercises");
  const [category, setCategory] = useState("all");
  const [loggedId, setLoggedId] = useState<string | null>(null);
  const isWeb = Platform.OS === "web";

  const filtered = EXERCISES.filter(
    (e) => category === "all" || e.category === category
  );

  const handleLog = async (exercise: typeof EXERCISES[0]) => {
    await logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
    });
    setLoggedId(exercise.id);
    setTimeout(() => setLoggedId(null), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Daily Burn</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Fitness</Text>
          </View>
          <View style={[styles.burnBadge, { backgroundColor: theme.tint + "20" }]}>
            <Feather name="zap" size={14} color={theme.tint} />
            <Text style={[styles.burnText, { color: theme.tint }]}>
              {todayCaloriesBurned} kcal
            </Text>
          </View>
        </View>

        <View style={[styles.segmentRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {(["exercises", "meals"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.segment,
                tab === t && { backgroundColor: theme.tint },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: tab === t ? "#fff" : theme.subtitle },
                ]}
              >
                {t === "exercises" ? "Exercises" : "Meal Plans"}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "exercises" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {EXERCISE_CATS.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: category === cat.id ? theme.tint : theme.card,
                    borderColor: category === cat.id ? theme.tint : theme.divider,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: category === cat.id ? "#fff" : theme.subtitle },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {loggedId && (
        <View style={[styles.toastBar, { backgroundColor: theme.success }]}>
          <Feather name="check-circle" size={14} color="#fff" />
          <Text style={styles.toastText}>Workout logged!</Text>
        </View>
      )}

      {tab === "exercises" ? (
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 },
          ]}
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} theme={theme} onLog={handleLog} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={MEAL_PLANS}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 },
          ]}
          renderItem={({ item }) => <MealPlanCard plan={item} theme={theme} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 12, fontFamily: "Inter_500Medium", letterSpacing: 1, textTransform: "uppercase" },
  headerTitle: { fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 2 },
  burnBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  burnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  segmentRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  pillsRow: { gap: 8 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  exerciseIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  exerciseName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  amharicSmall: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 2 },
  lvlBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  lvlText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  exMeta: { flexDirection: "row", alignItems: "center", gap: 3 },
  exMetaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toastBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
  },
  toastText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  mealCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  mealCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  goalTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  goalTagText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  mealCalories: { fontSize: 15, fontFamily: "Inter_700Bold" },
  mealPlanName: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 4 },
  mealPlanDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 8 },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 8,
    gap: 8,
  },
  mealTime: { width: 72 },
  mealTimeText: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  mealDish: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  mealKcal: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
