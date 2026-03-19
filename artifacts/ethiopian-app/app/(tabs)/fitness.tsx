import { Feather } from "@expo/vector-icons";
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

const GOAL_META: Record<string, { bg: string; emoji: string; label: string }> = {
  "weight-loss": { bg: "#C62828", emoji: "🔥", label: "Weight Loss" },
  "muscle-gain": { bg: "#1565C0", emoji: "💪", label: "Muscle Gain" },
  maintenance: { bg: "#2E7D32", emoji: "⚖️", label: "Maintenance" },
  fasting: { bg: "#6A1B9A", emoji: "🙏", label: "Fasting" },
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
  const catColor = CATEGORY_COLORS[exercise.category] ?? theme.tint;
  const levelColors: Record<string, string> = { beginner: "#2E7D32", intermediate: "#E65100", advanced: "#C62828" };

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: exercise.id } })}
      style={({ pressed }) => [
        styles.exCard,
        { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      <View style={[styles.exIconBox, { backgroundColor: catColor + "18" }]}>
        <Feather name={exercise.icon as any} size={22} color={catColor} />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.exNameRow}>
          <View style={{ flex: 1 }}>
            {exercise.amharic && <Text style={[styles.exAmharic, { color: catColor }]}>{exercise.amharic}</Text>}
            <Text style={[styles.exName, { color: theme.text }]} numberOfLines={1}>{exercise.name}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: levelColors[exercise.level] + "22" }]}>
            <Text style={[styles.levelText, { color: levelColors[exercise.level] }]}>{exercise.level}</Text>
          </View>
        </View>

        <Text style={[styles.exDesc, { color: theme.subtitle }]} numberOfLines={2}>{exercise.description}</Text>

        <View style={styles.exStats}>
          <View style={styles.exStat}>
            <Feather name="clock" size={11} color={theme.muted} />
            <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.duration} min</Text>
          </View>
          <View style={styles.exStat}>
            <Feather name="zap" size={11} color={theme.muted} />
            <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.calories} kcal</Text>
          </View>
          {exercise.sets && (
            <View style={styles.exStat}>
              <Feather name="repeat" size={11} color={theme.muted} />
              <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.sets}×{exercise.reps}</Text>
            </View>
          )}
          <View style={styles.exStat}>
            <Feather name="package" size={11} color={theme.muted} />
            <Text style={[styles.exStatText, { color: theme.muted }]}>{exercise.equipment}</Text>
          </View>
        </View>

        <View style={styles.exMuscleRow}>
          {exercise.muscles.slice(0, 3).map((m) => (
            <View key={m} style={[styles.muscleChip, { backgroundColor: catColor + "15" }]}>
              <Text style={[styles.muscleChipText, { color: catColor }]}>{m}</Text>
            </View>
          ))}
          {exercise.muscles.length > 3 && (
            <Text style={[styles.muscleMore, { color: theme.muted }]}>+{exercise.muscles.length - 3}</Text>
          )}
        </View>
      </View>

      <View style={styles.exActions}>
        <Pressable
          onPress={(e) => { e.stopPropagation(); onLog(); }}
          style={[styles.logBtn, { backgroundColor: justLogged ? "#2E7D32" : catColor }]}
        >
          <Feather name={justLogged ? "check" : "plus"} size={16} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: "/exercise/[id]", params: { id: exercise.id } })}
          style={[styles.detailBtn, { borderColor: theme.divider }]}
        >
          <Feather name="chevron-right" size={16} color={theme.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function MealPlanCard({ plan, theme }: { plan: typeof MEAL_PLANS[0]; theme: any }) {
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
              <Text style={styles.mealGoalText}>{meta.emoji} {meta.label}</Text>
            </View>
          </View>
          <Text style={[styles.mealName, { color: theme.text }]}>{plan.name}</Text>
          <Text style={[styles.mealDesc, { color: theme.subtitle }]} numberOfLines={2}>{plan.description}</Text>
        </View>
        <View style={styles.mealKcalBlock}>
          <Text style={[styles.mealKcalNum, { color: theme.tint }]}>{plan.totalCalories}</Text>
          <Text style={[styles.mealKcalUnit, { color: theme.muted }]}>kcal/day</Text>
        </View>
      </View>

      <View style={[styles.mealMacroRow, { borderColor: theme.divider }]}>
        {(() => {
          const totals = plan.meals.reduce(
            (acc, m) => ({ p: acc.p + m.protein, c: acc.c + m.carbs, f: acc.f + m.fat }),
            { p: 0, c: 0, f: 0 }
          );
          return [
            { label: "Protein", val: `${totals.p}g`, color: "#1565C0" },
            { label: "Carbs", val: `${totals.c}g`, color: "#E65100" },
            { label: "Fat", val: `${totals.f}g`, color: "#6A1B9A" },
            { label: "Meals", val: String(plan.meals.length), color: theme.tint },
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
                  {meal.time.charAt(0).toUpperCase() + meal.time.slice(1)}
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
          {expanded ? "Collapse" : `View ${plan.meals.length} meals`}
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
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Ethiopian-Inspired</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Fitness</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={[styles.statPill, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="zap" size={12} color="#E65100" />
              <Text style={[styles.statPillText, { color: "#E65100" }]}>{todayCaloriesBurned} kcal</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="check-circle" size={12} color="#2E7D32" />
              <Text style={[styles.statPillText, { color: "#2E7D32" }]}>{todayWorkouts.length} done</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tabSeg, { backgroundColor: theme.card, borderColor: theme.divider }]}>
          {(["exercises", "meals"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabSegBtn, tab === t && { backgroundColor: theme.tint }]}
            >
              <Feather name={t === "exercises" ? "activity" : "coffee"} size={14} color={tab === t ? "#fff" : theme.subtitle} />
              <Text style={[styles.tabSegText, { color: tab === t ? "#fff" : theme.subtitle }]}>
                {t === "exercises" ? "Exercises" : "Meal Plans"}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "exercises" && (
          <>
            <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Feather name="search" size={15} color={theme.muted} />
              <TextInput
                placeholder="Search by name or muscle group..."
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
                    <Text style={[styles.pillText, { color: category === cat.id ? "#fff" : theme.subtitle }]}>{cat.label}</Text>
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
                <Text style={[styles.summaryTitle, { color: theme.text }]}>{filtered.length} exercises</Text>
                <Text style={[styles.summarySubtitle, { color: theme.muted }]}>
                  {filtered.reduce((s, e) => s + e.calories, 0)} kcal potential burn
                </Text>
              </View>
              <View style={[styles.summaryRight, { backgroundColor: theme.tint + "15" }]}>
                <Feather name="trending-up" size={16} color={theme.tint} />
                <Text style={[styles.summaryTipText, { color: theme.tint }]}>Tap to start timer</Text>
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
              <Text style={[styles.emptyText, { color: theme.muted }]}>No exercises found</Text>
              <Pressable onPress={() => { setSearch(""); setCategory("all"); }}>
                <Text style={[styles.clearText, { color: theme.tint }]}>Clear filters</Text>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, gap: 10 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  headerStats: { flexDirection: "row", gap: 6, marginTop: 4 },
  statPill: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  statPillText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tabSeg: { flexDirection: "row", borderRadius: 13, borderWidth: 1, overflow: "hidden", padding: 3 },
  tabSegBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabSegText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  pillsRow: { gap: 7 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  pillCount: { borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  pillCountText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 0 },
  summaryBanner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  summaryTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  summarySubtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  summaryRight: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  summaryTipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  exCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: 16, borderWidth: 1, padding: 14 },
  exIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  exNameRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  exAmharic: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 1 },
  exName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  levelBadge: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3, flexShrink: 0 },
  levelText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  exDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  exStats: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  exStat: { flexDirection: "row", alignItems: "center", gap: 3 },
  exStatText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  exMuscleRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  muscleChip: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 },
  muscleChipText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  muscleMore: { fontSize: 11, fontFamily: "Inter_400Regular", paddingTop: 2 },
  exActions: { gap: 6, alignItems: "center", flexShrink: 0 },
  logBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  detailBtn: { width: 32, height: 32, borderRadius: 9, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  mealCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  mealTop: { flexDirection: "row", gap: 12, padding: 16, paddingBottom: 0 },
  mealTagRow: { flexDirection: "row", marginBottom: 6 },
  mealGoalTag: { borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4 },
  mealGoalText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  mealName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  mealDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, marginTop: 4 },
  mealKcalBlock: { alignItems: "flex-end" },
  mealKcalNum: { fontSize: 26, fontFamily: "Inter_700Bold" },
  mealKcalUnit: { fontSize: 11, fontFamily: "Inter_400Regular" },
  mealMacroRow: { flexDirection: "row", borderTopWidth: 1, marginTop: 14 },
  mealMacroItem: { flex: 1, alignItems: "center", paddingVertical: 10 },
  mealMacroVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  mealMacroLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 1 },
  mealBreakdown: { borderTopWidth: 1, paddingHorizontal: 16 },
  mealRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 10, borderBottomWidth: 1 },
  mealTimeBadge: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start", minWidth: 76 },
  mealTimeText: { fontSize: 10, fontFamily: "Inter_700Bold", textAlign: "center" },
  mealDish: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  mealNutRow: { flexDirection: "row", gap: 8, marginTop: 3 },
  mealNut: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  mealKcal: { fontSize: 14, fontFamily: "Inter_700Bold", flexShrink: 0 },
  expandRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", padding: 12 },
  expandText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  emptyBox: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  clearText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
