import { Feather } from "@expo/vector-icons";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { RECIPES } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

const SORT_OPTIONS = [
  { id: "recent", label: "Recently Saved" },
  { id: "time", label: "Quickest" },
  { id: "calories", label: "Lowest Calorie" },
];

export default function SavedScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { savedRecipes, toggleSaveRecipe } = useApp();
  const [sortId, setSortId] = useState("recent");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const isWeb = Platform.OS === "web";

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
          <Text style={[styles.headerSub, { color: theme.subtitle }]}>Your Collection</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Saved</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="bookmark" size={40} color={theme.muted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nothing saved yet</Text>
          <Text style={[styles.emptySub, { color: theme.muted }]}>
            Tap the bookmark on any recipe to save it for later
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/")}
            style={[styles.exploreBtn, { backgroundColor: theme.tint }]}
          >
            <Feather name="book-open" size={16} color="#fff" />
            <Text style={styles.exploreBtnText}>Explore Recipes</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Your Collection</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Saved</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              style={[styles.iconBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Feather name={viewMode === "list" ? "grid" : "list"} size={16} color={theme.subtitle} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.statsBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {[
            { label: "Saved", value: String(sorted.length), icon: "bookmark", color: theme.tint },
            { label: "Avg Time", value: `${Math.round(sorted.reduce((s, r) => s + r.recipe.time, 0) / sorted.length)} min`, icon: "clock", color: "#1565C0" },
            { label: "Avg Kcal", value: `${Math.round(sorted.reduce((s, r) => s + r.recipe.calories, 0) / sorted.length)}`, icon: "zap", color: "#E65100" },
          ].map((s, i) => (
            <View key={s.label} style={[styles.statItem, i < 2 && { borderRightWidth: 1, borderRightColor: theme.divider }]}>
              <Feather name={s.icon as any} size={13} color={s.color} />
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => setSortId(opt.id)}
              style={[
                styles.sortPill,
                { backgroundColor: sortId === opt.id ? theme.tint : theme.card, borderColor: sortId === opt.id ? theme.tint : theme.divider },
              ]}
            >
              <Text style={[styles.sortPillText, { color: sortId === opt.id ? "#fff" : theme.subtitle }]}>{opt.label}</Text>
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
                    <Text style={[styles.listMetaText, { color: theme.muted }]}>{s.recipe.protein}g protein</Text>
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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, gap: 12 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  statsBanner: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12, gap: 2 },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  sortRow: { gap: 8 },
  sortPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  sortPillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  listCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  listImage: { width: "100%", height: 130 },
  listColorBar: { height: 4 },
  listBody: { padding: 14, gap: 6 },
  listTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  listAmharic: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  listName: { fontSize: 19, fontFamily: "Inter_700Bold" },
  listDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  listMetaRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  listMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  listMetaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  unsaveBtn: { borderRadius: 8, padding: 7, flexShrink: 0 },
  tag: { borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4, marginRight: 6 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  gridCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  gridImage: { width: "100%", height: 100 },
  gridColorBar: { height: 3 },
  gridBody: { padding: 10, gap: 2 },
  gridAmharic: { fontSize: 10, fontFamily: "Inter_500Medium" },
  gridName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  gridMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  gridMetaText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  gridUnsave: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 6, padding: 4 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 12, marginTop: -60 },
  emptyIconBox: { width: 90, height: 90, borderRadius: 22, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  exploreBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 14, marginTop: 8 },
  exploreBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
