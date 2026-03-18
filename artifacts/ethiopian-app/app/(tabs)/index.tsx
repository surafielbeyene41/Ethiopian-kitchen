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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { CATEGORIES, RECIPES, Recipe } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

function DifficultyDot({ level }: { level: string }) {
  const colors: Record<string, string> = { easy: "#2E7D32", medium: "#E65100", hard: "#C62828" };
  return <View style={[styles.dot, { backgroundColor: colors[level] }]} />;
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
      <View style={styles.imageContainer}>
        <Image source={recipe.imageUri} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.colorAccent, { backgroundColor: recipe.color }]} />
        <Pressable
          onPress={(e) => { e.stopPropagation(); toggleSaveRecipe(recipe.id); }}
          style={[styles.saveBtn, { backgroundColor: saved ? recipe.color : "rgba(0,0,0,0.35)" }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="bookmark" size={14} color="#fff" />
        </Pressable>
        <View style={[styles.difficultyBadge, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
          <DifficultyDot level={recipe.difficulty} />
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.amharic, { color: recipe.color }]}>{recipe.amharic}</Text>
        <Text style={[styles.recipeName, { color: theme.text }]}>{recipe.name}</Text>
        <Text style={[styles.recipeDesc, { color: theme.subtitle }]} numberOfLines={2}>
          {recipe.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={11} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h${recipe.time % 60 > 0 ? ` ${recipe.time % 60}m` : ""}` : `${recipe.time}m`}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Feather name="users" size={11} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Feather name="zap" size={11} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.calories} kcal</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {recipe.tags.slice(0, 4).map((tag) => (
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const isWeb = Platform.OS === "web";

  const filtered = RECIPES.filter((r) => {
    const matchesCat = selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.amharic?.includes(search);
    return matchesCat && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSub, { color: theme.subtitle }]}>Ethiopian Kitchen</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Recipes</Text>
          </View>
          <View style={[styles.flagBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={{ fontSize: 24 }}>🇪🇹</Text>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <Feather name="search" size={16} color={theme.muted} />
          <TextInput
            placeholder="Search recipes or Amharic name..."
            placeholderTextColor={theme.muted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={theme.muted} />
            </Pressable>
          )}
        </View>

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
              <Feather name={cat.icon as any} size={13} color={selectedCategory === cat.id ? "#fff" : theme.subtitle} />
              <Text style={[styles.pillText, { color: selectedCategory === cat.id ? "#fff" : theme.subtitle }]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={[styles.list, { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }]}
        renderItem={({ item }) => <RecipeCard recipe={item} theme={theme} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={40} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>No recipes found</Text>
            <Pressable onPress={() => { setSearch(""); setSelectedCategory("all"); }}>
              <Text style={[styles.clearBtn, { color: theme.tint }]}>Clear filters</Text>
            </Pressable>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.2, textTransform: "uppercase" },
  headerTitle: { fontSize: 32, fontFamily: "Inter_700Bold", marginTop: 2 },
  flagBox: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  pillsRow: { gap: 8 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },
  card: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  imageContainer: { height: 180, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  colorAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  saveBtn: { position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  difficultyBadge: { position: "absolute", bottom: 10, left: 10, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  difficultyText: { color: "#fff", fontSize: 11, fontFamily: "Inter_500Medium" },
  cardBody: { padding: 14 },
  amharic: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  recipeName: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 24, marginBottom: 5 },
  recipeDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaDivider: { width: 1, height: 10, backgroundColor: "#ccc" },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  clearBtn: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
