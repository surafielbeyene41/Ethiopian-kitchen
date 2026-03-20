import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
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
import { CATEGORIES, RECIPES, Recipe } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

function DifficultyBadge({ level }: { level: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    easy: { color: "#2E7D32", label: "easy" },
    medium: { color: "#E65100", label: "medium" },
    hard: { color: "#C62828", label: "hard" },
  };
  const { t } = useTranslation();
  const c = cfg[level] ?? cfg.easy;
  return (
    <View style={[styles.diffBadge, { backgroundColor: c.color + "25" }]}>
      <View style={[styles.diffDot, { backgroundColor: c.color }]} />
      <Text style={[styles.diffText, { color: c.color }]}>{t(c.label as any)}</Text>
    </View>
  );
}

function FeaturedCard({ recipe }: { recipe: Recipe }) {
  const { isRecipeSaved, toggleSaveRecipe } = useApp();
  const { t } = useTranslation();
  const saved = isRecipeSaved(recipe.id);
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })}
      style={({ pressed }) => [styles.featuredCard, { opacity: pressed ? 0.95 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <Image source={recipe.imageUri} style={styles.featuredImage} resizeMode="cover" />
      <View style={styles.featuredOverlay} />

      <View style={styles.featuredContent}>
        <View style={[styles.featuredTopRow]}>
          <View style={[styles.featuredLabel, { backgroundColor: "#FFC107" }]}>
            <Text style={[styles.featuredLabelText, { color: "#000" }]}>⭐ {t("authentic")}</Text>
          </View>
          <Pressable
            onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
            style={[styles.featuredBookmark, { backgroundColor: saved ? "#FFC107" : "rgba(0,0,0,0.5)" }]}
          >
            <Feather name="bookmark" size={16} color={saved ? "#000" : "#fff"} />
          </Pressable>
        </View>

        <View style={styles.featuredBottom}>
          <Text style={styles.featuredAmharic}>{recipe.amharic}</Text>
          <Text style={styles.featuredName}>{recipe.name}</Text>
          <Text style={styles.featuredDesc} numberOfLines={2}>{recipe.description}</Text>
          <View style={styles.featuredMeta}>
            {[
              { icon: "clock", text: recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h${recipe.time % 60 > 0 ? ` ${recipe.time % 60}m` : ""}` : `${recipe.time}m` },
              { icon: "users", text: `${recipe.servings} servings` },
              { icon: "zap", text: `${recipe.calories} kcal` },
            ].map((m) => (
              <View key={m.icon} style={styles.featuredMetaItem}>
                <Feather name={m.icon as any} size={13} color="#FFC107" />
                <Text style={styles.featuredMetaText}>{m.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isRecipeSaved, toggleSaveRecipe } = useApp();
  const saved = isRecipeSaved(recipe.id);
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.93 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }]
        },
      ]}
    >
      <View style={styles.cardImageContainer}>
        <Image source={recipe.imageUri} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.cardColorBar, { backgroundColor: recipe.color }]} />
        <Pressable
          onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
          style={[styles.saveBtn, { backgroundColor: saved ? theme.gold : "rgba(0,0,0,0.4)" }]}
        >
          <Feather name="bookmark" size={15} color={saved ? "#000" : "#fff"} />
        </Pressable>
        <DifficultyBadge level={recipe.difficulty} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardAmharic, { color: theme.muted }]}>{recipe.amharic}</Text>
        <Text style={[styles.cardName, { color: theme.text }]}>{recipe.name}</Text>
        <Text style={[styles.cardDesc, { color: theme.subtitle }]} numberOfLines={2}>{recipe.description}</Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.cardMetaItem}>
            <Feather name="clock" size={12} color={theme.tint} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>
              {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h${recipe.time % 60 > 0 ? ` ${recipe.time % 60}m` : ""}` : `${recipe.time}m`}
            </Text>
          </View>
          <View style={[styles.cardMetaDot, { backgroundColor: theme.divider }]} />
          <View style={styles.cardMetaItem}>
            <Feather name="zap" size={12} color={theme.tint} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>{recipe.calories} kcal</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {recipe.tags.slice(0, 5).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
              <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  );
}

export default function RecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { savedRecipes } = useApp();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "time" | "calories">("default");
  const isWeb = Platform.OS === "web";

  const todayIndex = new Date().getDate() % RECIPES.length;
  const featuredRecipe = RECIPES[todayIndex];

  const filtered = useMemo(() => {
    let list = RECIPES.filter((r) => {
      const matchesCat = selectedCategory === "all" || r.category === selectedCategory;
      const matchesSearch =
        search === "" ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.amharic?.includes(search) ||
        r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
    if (sortBy === "time") list = [...list].sort((a, b) => a.time - b.time);
    if (sortBy === "calories") list = [...list].sort((a, b) => a.calories - b.calories);
    return list;
  }, [selectedCategory, search, sortBy]);

  const showFeatured = selectedCategory === "all" && search === "";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerWrapper}>
        <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} tint="dark" style={[styles.header, { paddingTop: isWeb ? 60 : insets.top + 12 }]}>
          <View style={styles.headerTop}>
            <View>
            <Text style={[styles.headerSub, { color: "#FFC107" }]}>{t("welcome_sub")}</Text>
            <Text style={[styles.headerTitle, { color: "#FFFFFF" }]}>{t("recipes")}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              <Pressable style={[styles.statChip, { backgroundColor: "rgba(255,193,7,0.15)", borderColor: "rgba(255,193,7,0.3)" }]}>
                <Feather name="bookmark" size={14} color="#FFC107" />
                <Text style={[styles.statChipText, { color: "#FFC107" }]}>{savedRecipes.length}</Text>
              </Pressable>
              <View style={[styles.flagBox, { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={{ fontSize: 24 }}>🇪🇹</Text>
              </View>
            </View>
          </View>

          <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }]}>
            <Feather name="search" size={18} color="rgba(255,255,255,0.5)" />
            <TextInput
              placeholder={t("search_placeholder")}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: "#FFFFFF" }]}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Feather name="x-circle" size={18} color="rgba(255,255,255,0.5)" />
              </Pressable>
            )}
          </View>

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.pill,
                    selectedCategory === cat.id ? { backgroundColor: "#FFC107", borderColor: "#FFC107" } : { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" },
                  ]}
                >
                  <Feather name={cat.icon as any} size={14} color={selectedCategory === cat.id ? "#000" : "rgba(255,255,255,0.7)"} />
                  <Text style={[styles.pillText, { color: selectedCategory === cat.id ? "#000" : "rgba(255,255,255,0.7)" }]}>{t(cat.label as any)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </BlurView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showFeatured ? (
            <View style={{ marginBottom: 8 }}>
              <FeaturedCard recipe={featuredRecipe} />
              <View style={styles.allRecipesLabel}>
                <Text style={[styles.allRecipesTitle, { color: theme.text }]}>{t("latest")}</Text>
                <Text style={[styles.allRecipesCount, { color: theme.muted }]}>{RECIPES.length} {t("recipes")}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.resultsLabel}>
              <Text style={[styles.allRecipesCount, { color: theme.muted }]}>{t("results_count", { count: filtered.length, plural: filtered.length !== 1 ? "s" : "" })}</Text>
            </View>
          )
        }
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={40} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>{t("no_recipes")}</Text>
            <Pressable onPress={() => { setSearch(""); setSelectedCategory("all"); setSortBy("default"); }}>
              <Text style={[styles.clearBtn, { color: theme.tint }]}>{t("clear_filters")}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 14 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  headerTitle: { fontSize: 34, fontFamily: "Inter_700Bold", marginTop: -2 },
  statChip: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  statChipText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  flagBox: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  filterRow: { flexDirection: "row", alignItems: "center" },
  pillsRow: { gap: 8 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22, borderWidth: 1 },
  pillText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  sortBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 200 }, // Push down content below floating header
  featuredCard: { height: 260, borderRadius: 24, overflow: "hidden", marginBottom: 6, position: "relative" },
  featuredImage: { width: "100%", height: "100%" },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(14,8,4,0.55)" },
  featuredContent: { ...StyleSheet.absoluteFillObject, padding: 20, justifyContent: "space-between" },
  featuredTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredLabel: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  featuredLabelText: { color: "#fff", fontSize: 12, fontFamily: "Inter_700Bold" },
  featuredBookmark: { width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  featuredBottom: { gap: 6 },
  featuredAmharic: { color: "rgba(255,193,7,0.8)", fontSize: 12, fontFamily: "Inter_700Bold" },
  featuredName: { color: "#fff", fontSize: 30, fontFamily: "Inter_700Bold", lineHeight: 34 },
  featuredDesc: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  featuredMeta: { flexDirection: "row", gap: 16, marginTop: 8 },
  featuredMetaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  featuredMetaText: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  allRecipesLabel: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 },
  allRecipesTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  allRecipesCount: { fontSize: 14, fontFamily: "Inter_400Regular" },
  resultsLabel: { paddingBottom: 16 },
  card: { borderRadius: 22, borderWidth: 1, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)" },
  cardImageContainer: { height: 200, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  cardColorBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  saveBtn: { position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  diffBadge: { position: "absolute", bottom: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "rgba(0,0,0,0.5)" },
  diffDot: { width: 7, height: 7, borderRadius: 3.5 },
  diffText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  cardBody: { padding: 18 },
  cardAmharic: { fontSize: 12, fontFamily: "Inter_700Bold", marginBottom: 2 },
  cardName: { fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 26, marginBottom: 6 },
  cardDesc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20, marginBottom: 12 },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  cardMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMetaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)" },
  cardMetaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8, backgroundColor: "rgba(255,255,255,0.08)" },
  tagText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.6)" },
  empty: { alignItems: "center", paddingTop: 100, gap: 16 },
  emptyText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  clearBtn: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
