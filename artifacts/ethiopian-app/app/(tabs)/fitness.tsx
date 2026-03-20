import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
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
import { EXERCISES, MEAL_PLANS } from "@/data/fitness";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const EXERCISE_CATS = [
  { id: "all", label: "all", icon: "grid" },
  { id: "cardio", label: "cardio", icon: "activity" },
  { id: "strength", label: "strength", icon: "zap" },
  { id: "traditional", label: "traditional", icon: "music" },
  { id: "flexibility", label: "flexibility", icon: "wind" },
];

const CATEGORY_COLORS: Record<string, string> = {
  cardio: "#1565C0",
  strength: "#E65100",
  traditional: "#6A1B9A",
  flexibility: "#2E7D32",
};

const GOAL_META: Record<string, { bg: string; emoji: string; label: string }> = {
  "weight-loss": { bg: "#C62828", emoji: "🔥", label: "weight_loss" },
  "muscle-gain": { bg: "#1565C0", emoji: "💪", label: "muscle_gain" },
  maintenance: { bg: "#2E7D32", emoji: "⚖️", label: "maintenance" },
  fasting: { bg: "#6A1B9A", emoji: "🙏", label: "fasting" },
};

const MEAL_TIME_COLORS: Record<string, string> = {
  breakfast: "#E65100",
  lunch: "#1565C0",
  dinner: "#6A1B9A",
  snack: "#2E7D32",
};

function ExerciseCard({ exercise, theme, onLog, justLogged }: {
  exercise: typeof EXERCISES[0]; theme: any; onLog: () => void; justLogged: boolean;
}) {
  const { t } = useTranslation();
  const catColor = "#FFC107";
  const levelColors: Record<string, string> = { beginner: "#4CAF50", intermediate: "#FF9800", advanced: "#F44336" };

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: exercise.id } })}
      style={({ pressed }) => [
        styles.exCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={styles.exCardBlur}>
        <View style={[styles.exIconBox, { backgroundColor: theme.tint + "20" }]}>
          <Feather name={exercise.icon as any} size={24} color={theme.tint} />
        </View>

        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.exNameRow}>
            <View style={{ flex: 1 }}>
              {exercise.amharic && <Text style={[styles.exAmharic, { color: theme.tint }]}>{exercise.amharic}</Text>}
              <Text style={[styles.exName, { color: theme.text }]} numberOfLines={1}>{exercise.name}</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: levelColors[exercise.level] + "20" }]}>
              <Text style={[styles.levelText, { color: levelColors[exercise.level] }]}>
                {(exercise.level as string).charAt(0).toUpperCase() + exercise.level.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={[styles.exDesc, { color: theme.subtitle }]} numberOfLines={2}>{exercise.description}</Text>

          <View style={styles.exStats}>
            <View style={styles.exStat}>
              <Feather name="clock" size={12} color={theme.muted} />
              <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.duration} min</Text>
            </View>
            <View style={styles.exStat}>
              <Feather name="zap" size={12} color={theme.tint} />
              <Text style={[styles.exStatText, { color: theme.tint }]}>{exercise.calories} kcal</Text>
            </View>
            {exercise.sets && (
              <View style={styles.exStat}>
                <Feather name="repeat" size={12} color={theme.muted} />
                <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.sets}×{exercise.reps}</Text>
              </View>
            )}
          </View>

          <View style={styles.exMuscleRow}>
            {exercise.muscles.slice(0, 3).map((m) => (
              <View key={m} style={[styles.muscleChip, { backgroundColor: theme.tagBg }]}>
                <Text style={[styles.muscleChipText, { color: theme.tagText }]}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.exActions}>
          <Pressable
            onPress={(e) => { e.stopPropagation(); onLog(); }}
            style={[styles.logBtn, { backgroundColor: justLogged ? "#4CAF50" : theme.tint }]}
          >
            <Feather name={justLogged ? "check" : "plus"} size={18} color="#000" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function MealPlanCard({ plan, theme }: { plan: typeof MEAL_PLANS[0]; theme: any }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const meta = GOAL_META[plan.goal];

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={[styles.mealCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
    >
      <View style={styles.mealTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.mealTagRow}>
            <View style={[styles.mealGoalTag, { backgroundColor: meta.bg }]}>
              <Text style={styles.mealGoalText}>{meta.emoji} {t(meta.label as any)}</Text>
            </View>
          </View>
          <Text style={[styles.mealName, { color: theme.text }]}>{plan.name}</Text>
          <Text style={[styles.mealDesc, { color: theme.subtitle }]} numberOfLines={2}>{plan.description}</Text>
        </View>
        <View style={styles.mealKcalBlock}>
          <Text style={[styles.mealKcalNum, { color: theme.tint }]}>{plan.totalCalories}</Text>
          <Text style={[styles.mealKcalUnit, { color: theme.muted }]}>{t("kcal_day")}</Text>
        </View>
      </View>

      <View style={[styles.mealMacroRow, { borderColor: theme.divider }]}>
        {(() => {
          const totals = plan.meals.reduce(
            (acc, m) => ({ p: acc.p + m.protein, c: acc.c + m.carbs, f: acc.f + m.fat }),
            { p: 0, c: 0, f: 0 }
          );
          return [
            { label: t("protein"), val: `${totals.p}g`, color: "#1565C0" },
            { label: t("carbs"), val: `${totals.c}g`, color: "#E65100" },
            { label: t("fat"), val: `${totals.f}g`, color: "#6A1B9A" },
            { label: t("recipes"), val: String(plan.meals.length), color: theme.tint },
          ].map((m, i) => (
            <View key={m.label} style={[styles.mealMacroItem, i < 3 && { borderRightWidth: 1, borderRightColor: theme.divider }]}>
              <Text style={[styles.mealMacroVal, { color: m.color }]}>{m.val}</Text>
              <Text style={[styles.mealMacroLabel, { color: theme.muted }]}>{m.label}</Text>
            </View>
          ));
        })()}
      </View>

      {expanded && (
        <View style={[styles.mealBreakdown, { borderTopColor: theme.divider }]}>
          {plan.meals.map((meal) => (
            <View key={meal.time} style={[styles.mealRow, { borderBottomColor: theme.divider }]}>
              <View style={[styles.mealTimeBadge, { backgroundColor: MEAL_TIME_COLORS[meal.time] + "20" }]}>
                <Text style={[styles.mealTimeText, { color: MEAL_TIME_COLORS[meal.time] }]}>
                  {t(meal.time as any)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.mealDish, { color: theme.text }]}>{meal.dish}</Text>
                <View style={styles.mealNutRow}>
                  <Text style={[styles.mealNut, { color: "#1565C0" }]}>{meal.protein}g P</Text>
                  <Text style={[styles.mealNut, { color: "#E65100" }]}>{meal.carbs}g C</Text>
                  <Text style={[styles.mealNut, { color: "#6A1B9A" }]}>{meal.fat}g F</Text>
                </View>
              </View>
              <Text style={[styles.mealKcal, { color: theme.tint }]}>{meal.calories}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.expandRow}>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={theme.muted} />
        <Text style={[styles.expandText, { color: theme.muted }]}>
          {expanded ? t("collapse") : t("view_meals", { count: plan.meals.length })}
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
  const [search, setSearch] = useState("");
  const [loggedIds, setLoggedIds] = useState<Record<string, boolean>>({});
  const isWeb = Platform.OS === "web";
  const { t } = useTranslation();

  const filtered = useMemo(() =>
    EXERCISES.filter((e) =>
      (category === "all" || e.category === category) &&
      (search === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.muscles.some((m) => m.toLowerCase().includes(search.toLowerCase())))
    ), [category, search]);

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

  const totalKcalAll = EXERCISES.reduce((s, e) => s + e.calories, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>{t("fitness_sub")}</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t("fitness_title")}</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={[styles.statPill, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="zap" size={12} color="#E65100" />
              <Text style={[styles.statPillText, { color: "#E65100" }]}>{todayCaloriesBurned} {t("kcal_burned")}</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="check-circle" size={12} color="#2E7D32" />
              <Text style={[styles.statPillText, { color: "#2E7D32" }]}>{todayWorkouts.length} {t("workouts_done")}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tabSeg, { backgroundColor: theme.card, borderColor: theme.divider }]}>
          {(["exercises", "meals"] as const).map((tabItem) => (
            <Pressable
              key={tabItem}
              onPress={() => setTab(tabItem)}
              style={[styles.tabSegBtn, tab === tabItem && { backgroundColor: theme.tint }]}
            >
              <Feather name={tabItem === "exercises" ? "activity" : "coffee"} size={14} color={tab === tabItem ? "#fff" : theme.subtitle} />
              <Text style={[styles.tabSegText, { color: tab === tabItem ? "#fff" : theme.subtitle }]}>
                {tabItem === "exercises" ? t("exercises") : t("meal_plans")}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "exercises" && (
          <>
            <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Feather name="search" size={15} color={theme.muted} />
              <TextInput
                placeholder={t("search_muscle")}
                placeholderTextColor={theme.muted}
                value={search}
                onChangeText={setSearch}
                style={[styles.searchInput, { color: theme.text }]}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Feather name="x-circle" size={15} color={theme.muted} />
                </Pressable>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
              {EXERCISE_CATS.map((cat) => {
                const count = cat.id === "all" ? EXERCISES.length : EXERCISES.filter((e) => e.category === cat.id).length;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[
                      styles.pill,
                      { backgroundColor: category === cat.id ? theme.tint : theme.card, borderColor: category === cat.id ? theme.tint : theme.divider },
                    ]}
                  >
                    <Feather name={cat.icon as any} size={12} color={category === cat.id ? "#fff" : theme.subtitle} />
                    <Text style={[styles.pillText, { color: category === cat.id ? "#fff" : theme.subtitle }]}>{t(cat.label as any)}</Text>
                    <View style={[styles.pillCount, { backgroundColor: category === cat.id ? "rgba(255,255,255,0.25)" : theme.inputBg }]}>
                      <Text style={[styles.pillCountText, { color: category === cat.id ? "#fff" : theme.muted }]}>{count}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}
      </View>

      {tab === "exercises" ? (
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={[styles.summaryBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View>
                <Text style={[styles.summaryTitle, { color: theme.text }]}>{filtered.length} {t("exercises")}</Text>
                <Text style={[styles.summarySubtitle, { color: theme.muted }]}>
                  {t("kcal_potential", { count: filtered.reduce((s, e) => s + e.calories, 0) })}
                </Text>
              </View>
              <View style={[styles.summaryRight, { backgroundColor: theme.tint + "15" }]}>
                <Feather name="trending-up" size={16} color={theme.tint} />
                <Text style={[styles.summaryTipText, { color: theme.tint }]}>{t("start_timer_hint")}</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              theme={theme}
              onLog={() => handleLog(item)}
              justLogged={!!loggedIds[item.id]}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyBox}>
              <Feather name="search" size={36} color={theme.muted} />
              <Text style={[styles.emptyText, { color: theme.muted }]}>{t("no_exercises")}</Text>
              <Pressable onPress={() => { setSearch(""); setCategory("all"); }}>
                <Text style={[styles.clearText, { color: theme.tint }]}>{t("clear_filters")}</Text>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={MEAL_PLANS}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
          renderItem={({ item }) => <MealPlanCard plan={item} theme={theme} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFC107", letterSpacing: 1 },
  headerTitle: { fontSize: 34, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginTop: 2 },
  headerStats: { flexDirection: "row", gap: 10 },
  statPill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  statPillText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  tabSeg: { flexDirection: "row", borderRadius: 16, overflow: "hidden", padding: 4, backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  tabSegBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  tabSegText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, gap: 10, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  pillsRow: { gap: 10 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  pillCount: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  pillCountText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  summaryBanner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 24, overflow: "hidden", borderWidth: 1, padding: 18, marginBottom: 16, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  summaryTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  summarySubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2, color: "rgba(255,255,255,0.4)" },
  summaryRight: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  summaryTipText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  exCard: { borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  exCardBlur: { flexDirection: "row", alignItems: "flex-start", gap: 16, padding: 18 },
  exIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  exNameRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  exAmharic: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFC107" },
  exName: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  levelBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexShrink: 0 },
  levelText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  exDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", lineHeight: 20 },
  exStats: { flexDirection: "row", gap: 14, flexWrap: "wrap", marginTop: 2 },
  exStat: { flexDirection: "row", alignItems: "center", gap: 6 },
  exStatText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  exMuscleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  muscleChip: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "rgba(255,255,255,0.05)" },
  muscleChipText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.5)" },
  exActions: { alignItems: "center", flexShrink: 0 },
  logBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  mealCard: { borderRadius: 24, borderWidth: 1, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  mealTop: { flexDirection: "row", gap: 16, padding: 20, paddingBottom: 0 },
  mealTagRow: { flexDirection: "row", marginBottom: 6 },
  mealGoalTag: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  mealGoalText: { color: "#FFF", fontSize: 11, fontFamily: "Inter_700Bold" },
  mealName: { fontSize: 20, fontFamily: "Inter_700Bold", marginTop: 8 },
  mealDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", lineHeight: 22, marginTop: 6 },
  mealKcalBlock: { alignItems: "flex-end" },
  mealKcalNum: { fontSize: 32, fontFamily: "Inter_700Bold" },
  mealKcalUnit: { fontSize: 12, fontFamily: "Inter_500Medium" },
  mealMacroRow: { flexDirection: "row", borderTopWidth: 1, marginTop: 20, borderTopColor: "rgba(255,255,255,0.05)" },
  mealMacroItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  mealMacroVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  mealMacroLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  mealBreakdown: { borderTopWidth: 1, paddingHorizontal: 20, borderTopColor: "rgba(255,255,255,0.05)" },
  mealRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  mealTimeBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start", minWidth: 84 },
  mealTimeText: { fontSize: 11, fontFamily: "Inter_700Bold", textAlign: "center" },
  mealDish: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#FFFFFF", lineHeight: 20 },
  mealNutRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  mealNut: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  mealKcal: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFC107" },
  expandRow: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", padding: 14 },
  expandText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.4)" },
  emptyBox: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 18, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.3)" },
  clearText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFC107" },
});
