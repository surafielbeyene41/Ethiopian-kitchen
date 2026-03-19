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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { CATEGORIES, RECIPES, Recipe } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

function DifficultyBadge({ level }: { level: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    easy: { color: "#2E7D32", label: "Easy" },
    medium: { color: "#E65100", label: "Medium" },
    hard: { color: "#C62828", label: "Hard" },
  };
  const c = cfg[level] ?? cfg.easy;
  return (
    <View style={[styles.diffBadge, { backgroundColor: c.color + "25" }]}>
      <View style={[styles.diffDot, { backgroundColor: c.color }]} />
      <Text style={[styles.diffText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

function FeaturedCard({ recipe, theme }: { recipe: Recipe; theme: any }) {
  const { isRecipeSaved, toggleSaveRecipe } = useApp();
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
          <View style={[styles.featuredLabel, { backgroundColor: recipe.color }]}>
            <Text style={styles.featuredLabelText}>⭐ Today's Featured</Text>
          </View>
          <Pressable
            onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
            style={[styles.featuredBookmark, saved && { backgroundColor: recipe.color }]}
          >
            <Feather name="bookmark" size={14} color="#fff" />
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
                <Feather name={m.icon as any} size={12} color="rgba(255,255,255,0.85)" />
                <Text style={styles.featuredMetaText}>{m.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function RecipeCard({ recipe, theme }: { recipe: Recipe; theme: any }) {
  const { isRecipeSaved, toggleSaveRecipe } = useApp();
  const saved = isRecipeSaved(recipe.id);

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.93 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
    >
      <View style={styles.cardImageContainer}>
        <Image source={recipe.imageUri} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.cardColorBar, { backgroundColor: recipe.color }]} />
        <Pressable
          onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
          style={[styles.saveBtn, { backgroundColor: saved ? recipe.color : "rgba(0,0,0,0.35)" }]}
        >
          <Feather name="bookmark" size={13} color={saved ? "#FDD835" : "#fff"} />
        </Pressable>
        <DifficultyBadge level={recipe.difficulty} />
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardAmharic, { color: recipe.color }]}>{recipe.amharic}</Text>
        <Text style={[styles.cardName, { color: theme.text }]}>{recipe.name}</Text>
        <Text style={[styles.cardDesc, { color: theme.subtitle }]} numberOfLines={2}>{recipe.description}</Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.cardMetaItem}>
            <Feather name="clock" size={11} color={theme.muted} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>
              {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h${recipe.time % 60 > 0 ? ` ${recipe.time % 60}m` : ""}` : `${recipe.time}m`}
            </Text>
          </View>
          <View style={styles.cardMetaDot} />
          <View style={styles.cardMetaItem}>
            <Feather name="users" size={11} color={theme.muted} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>{recipe.servings} serv</Text>
          </View>
          <View style={styles.cardMetaDot} />
          <View style={styles.cardMetaItem}>
            <Feather name="zap" size={11} color={theme.muted} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>{recipe.calories} kcal</Text>
          </View>
          <View style={styles.cardMetaDot} />
          <View style={styles.cardMetaItem}>
            <Feather name="heart" size={11} color={theme.muted} />
            <Text style={[styles.cardMetaText, { color: theme.muted }]}>{recipe.protein}g P</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
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
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Ethiopian Kitchen</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Recipes</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
            <View style={[styles.statChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="bookmark" size={12} color={theme.tint} />
              <Text style={[styles.statChipText, { color: theme.tint }]}>{savedRecipes.length} saved</Text>
            </View>
            <View style={[styles.flagBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={{ fontSize: 22 }}>🇪🇹</Text>
            </View>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <Feather name="search" size={16} color={theme.muted} />
          <TextInput
            placeholder="Search recipes, tags, or Amharic..."
            placeholderTextColor={theme.muted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={16} color={theme.muted} />
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
                  { backgroundColor: selectedCategory === cat.id ? theme.tint : theme.card, borderColor: selectedCategory === cat.id ? theme.tint : theme.divider },
                ]}
              >
                <Feather name={cat.icon as any} size={12} color={selectedCategory === cat.id ? "#fff" : theme.subtitle} />
                <Text style={[styles.pillText, { color: selectedCategory === cat.id ? "#fff" : theme.subtitle }]}>{cat.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={() => setSortBy(sortBy === "default" ? "time" : sortBy === "time" ? "calories" : "default")}
            style={[styles.sortBtn, { backgroundColor: theme.card, borderColor: theme.divider }]}
          >
            <Feather name="sliders" size={14} color={sortBy !== "default" ? theme.tint : theme.subtitle} />
            <Text style={[styles.sortBtnText, { color: sortBy !== "default" ? theme.tint : theme.subtitle }]}>
              {sortBy === "time" ? "Time" : sortBy === "calories" ? "Kcal" : "Sort"}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          showFeatured ? (
            <View style={{ marginBottom: 8 }}>
              <FeaturedCard recipe={featuredRecipe} theme={theme} />
              <View style={styles.allRecipesLabel}>
                <Text style={[styles.allRecipesTitle, { color: theme.text }]}>All Recipes</Text>
                <Text style={[styles.allRecipesCount, { color: theme.muted }]}>{RECIPES.length} dishes</Text>
              </View>
            </View>
          ) : (
            <View style={styles.resultsLabel}>
              <Text style={[styles.allRecipesCount, { color: theme.muted }]}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</Text>
            </View>
          )
        }
        renderItem={({ item }) => <RecipeCard recipe={item} theme={theme} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={40} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>No recipes found</Text>
            <Pressable onPress={() => { setSearch(""); setSelectedCategory("all"); setSortBy("default"); }}>
              <Text style={[styles.clearBtn, { color: theme.tint }]}>Clear all filters</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10, gap: 12 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  statChip: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  statChipText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  flagBox: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 13, paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pillsRow: { gap: 7 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  sortBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  featuredCard: { height: 240, borderRadius: 20, overflow: "hidden", marginBottom: 4, position: "relative" },
  featuredImage: { width: "100%", height: "100%" },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.48)" },
  featuredContent: { ...StyleSheet.absoluteFillObject, padding: 16, justifyContent: "space-between" },
  featuredTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredLabel: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  featuredLabelText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  featuredBookmark: { width: 32, height: 32, borderRadius: 9, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  featuredBottom: { gap: 4 },
  featuredAmharic: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  featuredName: { color: "#fff", fontSize: 24, fontFamily: "Inter_700Bold", lineHeight: 28 },
  featuredDesc: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  featuredMeta: { flexDirection: "row", gap: 12, marginTop: 6, flexWrap: "wrap" },
  featuredMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  featuredMetaText: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Inter_500Medium" },
  allRecipesLabel: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 10 },
  allRecipesTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  allRecipesCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  resultsLabel: { paddingBottom: 12 },
  card: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  cardImageContainer: { height: 180, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  cardColorBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  saveBtn: { position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  diffBadge: { position: "absolute", bottom: 10, left: 10, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  diffDot: { width: 6, height: 6, borderRadius: 3 },
  diffText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardBody: { padding: 14 },
  cardAmharic: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  cardName: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 24, marginBottom: 5 },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 8 },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  cardMetaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#ccc" },
  cardMetaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  tag: { borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4, marginRight: 6 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  clearBtn: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
