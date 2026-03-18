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
  { id: "all", label: "All", icon: "grid" },
  { id: "cardio", label: "Cardio", icon: "activity" },
  { id: "strength", label: "Strength", icon: "zap" },
  { id: "traditional", label: "Traditional", icon: "music" },
  { id: "flexibility", label: "Flex", icon: "wind" },
];

const CATEGORY_COLORS: Record<string, string> = {
  cardio: "#1565C0",
  strength: "#E65100",
  traditional: "#6A1B9A",
  flexibility: "#2E7D32",
};

const GOAL_COLORS: Record<string, { bg: string; text: string }> = {
  "weight-loss": { bg: "#E65100", text: "#fff" },
  "muscle-gain": { bg: "#1565C0", text: "#fff" },
  maintenance: { bg: "#2E7D32", text: "#fff" },
  fasting: { bg: "#6A1B9A", text: "#fff" },
};

function ExerciseCard({ exercise, theme, onLog, justLogged }: {
  exercise: typeof EXERCISES[0]; theme: any; onLog: (ex: typeof EXERCISES[0]) => void; justLogged: boolean;
}) {
  const catColor = CATEGORY_COLORS[exercise.category] ?? theme.tint;
  const levelColors = { beginner: "#2E7D32", intermediate: "#E65100", advanced: "#C62828" };
  const levelColor = levelColors[exercise.level];

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: exercise.id } })}
      style={({ pressed }) => [
        styles.exerciseCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      <View style={[styles.exerciseIconBox, { backgroundColor: catColor + "20" }]}>
        <Feather name={exercise.icon as any} size={24} color={catColor} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.exNameRow}>
          <Text style={[styles.exerciseName, { color: theme.text }]} numberOfLines={1}>
            {exercise.name}
          </Text>
          <View style={[styles.lvlBadge, { backgroundColor: levelColor + "22" }]}>
            <Text style={[styles.lvlText, { color: levelColor }]}>{exercise.level}</Text>
          </View>
        </View>
        {exercise.amharic && (
          <Text style={[styles.amharicSmall, { color: catColor }]}>{exercise.amharic}</Text>
        )}
        <Text style={[styles.exDesc, { color: theme.subtitle }]} numberOfLines={2}>{exercise.description}</Text>
        <View style={styles.exMeta}>
          <View style={styles.exMetaItem}>
            <Feather name="clock" size={11} color={theme.muted} />
            <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.duration} min</Text>
          </View>
          <View style={styles.exMetaItem}>
            <Feather name="zap" size={11} color={theme.muted} />
            <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.calories} kcal</Text>
          </View>
          {exercise.sets && (
            <View style={styles.exMetaItem}>
              <Feather name="repeat" size={11} color={theme.muted} />
              <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.sets}×{exercise.reps}</Text>
            </View>
          )}
          <View style={styles.exMetaItem}>
            <Feather name="package" size={11} color={theme.muted} />
            <Text style={[styles.exMetaText, { color: theme.muted }]}>{exercise.equipment}</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={(e) => { e.stopPropagation(); onLog(exercise); }}
        style={[styles.logBtn, { backgroundColor: justLogged ? "#2E7D32" : catColor }]}
      >
        <Feather name={justLogged ? "check" : "plus"} size={18} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

function MealPlanCard({ plan, theme }: { plan: typeof MEAL_PLANS[0]; theme: any }) {
  const [expanded, setExpanded] = useState(false);
  const goalStyle = GOAL_COLORS[plan.goal];

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={[styles.mealCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
    >
      <View style={styles.mealCardTop}>
        <View style={styles.mealCardTopLeft}>
          <View style={[styles.goalTag, { backgroundColor: goalStyle.bg }]}>
            <Text style={[styles.goalTagText, { color: goalStyle.text }]}>
              {plan.goal.replace("-", " ").toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.mealPlanName, { color: theme.text }]}>{plan.name}</Text>
          <Text style={[styles.mealPlanDesc, { color: theme.subtitle }]} numberOfLines={2}>
            {plan.description}
          </Text>
        </View>
        <View style={styles.mealKcalBox}>
          <Text style={[styles.mealKcalBig, { color: theme.tint }]}>{plan.totalCalories}</Text>
          <Text style={[styles.mealKcalLabel, { color: theme.muted }]}>kcal/day</Text>
        </View>
      </View>

      {expanded && (
        <View style={[styles.mealMeals, { borderTopColor: theme.divider }]}>
          {plan.meals.map((meal) => (
            <View key={meal.time} style={[styles.mealMealRow, { borderBottomColor: theme.divider }]}>
              <View style={[styles.mealTimeTag, { backgroundColor: theme.tagBg }]}>
                <Text style={[styles.mealTimeText, { color: theme.tagText }]}>
                  {meal.time}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.mealDish, { color: theme.text }]} numberOfLines={2}>{meal.dish}</Text>
                <View style={styles.mealNutrRow}>
                  <Text style={[styles.mealNutR, { color: "#1565C0" }]}>{meal.protein}g P</Text>
                  <Text style={[styles.mealNutR, { color: "#E65100" }]}>{meal.carbs}g C</Text>
                  <Text style={[styles.mealNutR, { color: "#6A1B9A" }]}>{meal.fat}g F</Text>
                </View>
              </View>
              <Text style={[styles.mealMealKcal, { color: theme.tint }]}>{meal.calories} kcal</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.expandRow}>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={theme.muted} />
        <Text style={[styles.expandText, { color: theme.muted }]}>
          {expanded ? "Hide meals" : `See ${plan.meals.length} meals`}
        </Text>
      </View>
    </Pressable>
  );
}

export default function FitnessScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { logWorkout, todayCaloriesBurned, todayWorkouts } = useApp();
  const [tab, setTab] = useState<"exercises" | "meals">("exercises");
  const [category, setCategory] = useState("all");
  const [loggedIds, setLoggedIds] = useState<Record<string, boolean>>({});
  const isWeb = Platform.OS === "web";

  const filtered = EXERCISES.filter((e) => category === "all" || e.category === category);

  const handleLog = async (exercise: typeof EXERCISES[0]) => {
    await logWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
    });
    setLoggedIds((prev) => ({ ...prev, [exercise.id]: true }));
    setTimeout(() => setLoggedIds((prev) => ({ ...prev, [exercise.id]: false })), 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Daily Burn</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Fitness</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.statVal, { color: theme.tint }]}>{todayCaloriesBurned}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>kcal</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.statVal, { color: "#2E7D32" }]}>{todayWorkouts.length}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>done</Text>
            </View>
          </View>
        </View>

        <View style={[styles.segmentRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {(["exercises", "meals"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.segment, tab === t && { backgroundColor: theme.tint }]}
            >
              <Feather
                name={t === "exercises" ? "activity" : "coffee"}
                size={14}
                color={tab === t ? "#fff" : theme.subtitle}
              />
              <Text style={[styles.segmentText, { color: tab === t ? "#fff" : theme.subtitle }]}>
                {t === "exercises" ? "Exercises" : "Meal Plans"}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "exercises" && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {EXERCISE_CATS.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.pill,
                  { backgroundColor: category === cat.id ? theme.tint : theme.card, borderColor: category === cat.id ? theme.tint : theme.divider },
                ]}
              >
                <Feather name={cat.icon as any} size={12} color={category === cat.id ? "#fff" : theme.subtitle} />
                <Text style={[styles.pillText, { color: category === cat.id ? "#fff" : theme.subtitle }]}>{cat.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {tab === "exercises" ? (
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              theme={theme}
              onLog={handleLog}
              justLogged={!!loggedIds[item.id]}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={MEAL_PLANS}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
          renderItem={({ item }) => <MealPlanCard plan={item} theme={theme} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  segmentRow: { flexDirection: "row", borderRadius: 12, borderWidth: 1, overflow: "hidden", padding: 3 },
  segment: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: 10 },
  segmentText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  pillsRow: { gap: 8 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  exerciseCard: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  exerciseIconBox: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  exNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  exerciseName: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  amharicSmall: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 3 },
  exDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17, marginBottom: 6 },
  lvlBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, flexShrink: 0 },
  lvlText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  exMeta: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  exMetaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  exMetaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  mealCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", padding: 16 },
  mealCardTop: { flexDirection: "row", gap: 12, marginBottom: 8 },
  mealCardTopLeft: { flex: 1, gap: 6 },
  goalTag: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  goalTagText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  mealPlanName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  mealPlanDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  mealKcalBox: { alignItems: "flex-end" },
  mealKcalBig: { fontSize: 24, fontFamily: "Inter_700Bold" },
  mealKcalLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  mealMeals: { borderTopWidth: 1, paddingTop: 12, gap: 10 },
  mealMealRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottomWidth: 1 },
  mealTimeTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", minWidth: 70 },
  mealTimeText: { fontSize: 10, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  mealDish: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, flex: 1 },
  mealNutrRow: { flexDirection: "row", gap: 8, marginTop: 3 },
  mealNutR: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  mealMealKcal: { fontSize: 13, fontFamily: "Inter_700Bold", flexShrink: 0 },
  expandRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingTop: 10 },
  expandText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});
