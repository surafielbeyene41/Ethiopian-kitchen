import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { RECIPES } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const SORT_OPTIONS = [
  { id: "recent", label: "recently_saved" },
  { id: "time", label: "quickest" },
  { id: "calories", label: "lowest_calorie" },
];

export default function SavedScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { savedRecipes, toggleSaveRecipe } = useApp();
  const [sortId, setSortId] = useState("recent");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const isWeb = Platform.OS === "web";
  const { t } = useTranslation();

  const savedList = savedRecipes
    .map((sr) => ({ ...sr, recipe: RECIPES.find((r) => r.id === sr.recipeId) }))
    .filter((s) => !!s.recipe) as { recipeId: string; savedAt: string; recipe: typeof RECIPES[0] }[];

  const sorted = [...savedList].sort((a, b) => {
    if (sortId === "recent") return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    if (sortId === "time") return a.recipe.time - b.recipe.time;
    if (sortId === "calories") return a.recipe.calories - b.recipe.calories;
    return 0;
  });

  if (sorted.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
          <Text style={[styles.headerSub, { color: theme.subtitle }]}>{t("your_collection")}</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t("saved_title")}</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="bookmark" size={40} color={theme.muted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t("nothing_saved")}</Text>
          <Text style={[styles.emptySub, { color: theme.muted }]}>
            {t("save_later_hint")}
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/")}
            style={[styles.exploreBtn, { backgroundColor: theme.tint }]}
          >
            <Feather name="book-open" size={16} color="#fff" />
            <Text style={styles.exploreBtnText}>{t("explore_recipes")}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>{t("your_collection").toUpperCase()}</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t("saved_recipes")}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Feather name={viewMode === "list" ? "grid" : "list"} size={18} color={theme.tint} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.statsBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.statsBannerBlur}>
            {[
              { label: t("saved"), value: String(sorted.length), icon: "bookmark", color: theme.tint },
              { label: t("avg_time"), value: `${Math.round(sorted.reduce((s, r) => s + r.recipe.time, 0) / sorted.length)}m`, icon: "clock", color: theme.tint },
              { label: t("avg_kcal"), value: `${Math.round(sorted.reduce((s, r) => s + r.recipe.calories, 0) / sorted.length)}`, icon: "zap", color: theme.tint },
            ].map((s, i) => (
              <View key={s.label} style={[styles.statItem, i < 2 && { borderRightWidth: 1, borderRightColor: theme.divider }]}>
                <Feather name={s.icon as any} size={14} color={s.color} />
                <Text style={[styles.statValue, { color: theme.text }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: theme.muted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setSortId(opt.id)}
              style={[
                styles.sortPill,
                {
                  backgroundColor: sortId === opt.id ? theme.tint : theme.tagBg,
                  borderColor: sortId === opt.id ? theme.tint : theme.divider,
                },
              ]}
            >
              <Text style={[styles.sortPillText, { color: sortId === opt.id ? "#FFFFFF" : theme.muted }]}>{t(opt.label as any)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {viewMode === "grid" ? (
        <FlatList
          data={sorted}
          keyExtractor={(s) => s.recipeId}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: s }) => (
            <Pressable
              onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: s.recipeId } })}
              style={({ pressed }) => [
                styles.gridCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder, flex: 1, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <Image source={s.recipe.imageUri} style={styles.gridImage} resizeMode="cover" />
              <View style={[styles.gridColorBar, { backgroundColor: s.recipe.color }]} />
              <View style={styles.gridBody}>
                <Text style={[styles.gridAmharic, { color: s.recipe.color }]}>{s.recipe.amharic}</Text>
                <Text style={[styles.gridName, { color: theme.text }]} numberOfLines={1}>{s.recipe.name}</Text>
                <View style={styles.gridMeta}>
                  <Feather name="clock" size={10} color={theme.muted} />
                  <Text style={[styles.gridMetaText, { color: theme.muted }]}>
                    {s.recipe.time >= 60 ? `${Math.floor(s.recipe.time / 60)}h` : `${s.recipe.time}m`}
                  </Text>
                  <Feather name="zap" size={10} color={theme.muted} />
                  <Text style={[styles.gridMetaText, { color: theme.muted }]}>{s.recipe.calories}kcal</Text>
                </View>
              </View>
              <Pressable
                onPress={() => toggleSaveRecipe(s.recipeId)}
                style={styles.gridUnsave}
              >
                <Feather name="x" size={14} color={theme.muted} />
              </Pressable>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(s) => s.recipeId}
          contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: s }) => (
            <Pressable
              onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: s.recipeId } })}
              style={({ pressed }) => [
                styles.listCard,
                { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
              ]}
            >
              <Image source={s.recipe.imageUri} style={styles.listImage} resizeMode="cover" />
              <View style={[styles.listColorBar, { backgroundColor: s.recipe.color }]} />
              <View style={styles.listBody}>
                <View style={styles.listTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listAmharic, { color: s.recipe.color }]}>{s.recipe.amharic}</Text>
                    <Text style={[styles.listName, { color: theme.text }]}>{s.recipe.name}</Text>
                  </View>
                  <Pressable
                    onPress={() => toggleSaveRecipe(s.recipeId)}
                    style={[styles.unsaveBtn, { backgroundColor: s.recipe.color + "18" }]}
                  >
                    <Feather name="bookmark" size={16} color={s.recipe.color} />
                  </Pressable>
                </View>
                <Text style={[styles.listDesc, { color: theme.subtitle }]} numberOfLines={2}>
                  {s.recipe.description}
                </Text>
                <View style={styles.listMetaRow}>
                  <View style={styles.listMetaItem}>
                    <Feather name="clock" size={11} color={theme.muted} />
                    <Text style={[styles.listMetaText, { color: theme.muted }]}>
                      {s.recipe.time >= 60 ? `${Math.floor(s.recipe.time / 60)}h${s.recipe.time % 60 > 0 ? ` ${s.recipe.time % 60}m` : ""}` : `${s.recipe.time}m`}
                    </Text>
                  </View>
                  <View style={styles.listMetaItem}>
                    <Feather name="zap" size={11} color={theme.muted} />
                    <Text style={[styles.listMetaText, { color: theme.muted }]}>{s.recipe.calories} kcal</Text>
                  </View>
                  <View style={styles.listMetaItem}>
                    <Feather name="heart" size={11} color={theme.muted} />
                    <Text style={[styles.listMetaText, { color: theme.muted }]}>{t("protein_g", { count: s.recipe.protein })}</Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {s.recipe.tags.slice(0, 4).map((tag) => (
                    <View key={tag} style={[styles.tag, { backgroundColor: s.recipe.color + "18" }]}>
                      <Text style={[styles.tagText, { color: s.recipe.color }]}>{tag}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFC107", letterSpacing: 1 },
  headerTitle: { fontSize: 34, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, overflow: "hidden" },
  iconBtnBlur: { flex: 1, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statsBanner: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statsBannerBlur: { flexDirection: "row", paddingVertical: 14 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  sortRow: { gap: 10, paddingRight: 20 },
  sortPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, borderWidth: 1 },
  sortPillText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  listCard: { borderRadius: 24, borderWidth: 1, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  listImage: { width: "100%", height: 160 },
  listColorBar: { height: 4 },
  listBody: { padding: 18, gap: 10 },
  listTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  listAmharic: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  listName: { fontSize: 24, fontFamily: "Inter_700Bold" },
  listDesc: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)", lineHeight: 22 },
  listMetaRow: { flexDirection: "row", gap: 16, flexWrap: "wrap", marginTop: 4 },
  listMetaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  listMetaText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  unsaveBtn: { borderRadius: 12, padding: 10, flexShrink: 0 },
  tag: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  tagText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  gridCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  gridImage: { width: "100%", height: 120 },
  gridColorBar: { height: 4 },
  gridBody: { padding: 14, gap: 4 },
  gridAmharic: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  gridName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  gridMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  gridMetaText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  gridUnsave: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10, padding: 6 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16, marginTop: -60 },
  emptyIconBox: { width: 100, height: 100, borderRadius: 28, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 8, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  emptyTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  emptySub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24, color: "rgba(255,255,255,0.5)" },
  exploreBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 18, marginTop: 12, backgroundColor: "#FFC107" },
  exploreBtnText: { color: "#000000", fontFamily: "Inter_700Bold", fontSize: 16 },
});
