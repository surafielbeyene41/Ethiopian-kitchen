import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { RECIPES } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

export default function SavedScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { savedRecipes, toggleSaveRecipe } = useApp();
  const isWeb = Platform.OS === "web";

  const savedList = savedRecipes
    .map((sr) => RECIPES.find((r) => r.id === sr.recipeId))
    .filter(Boolean) as (typeof RECIPES)[0][];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: isWeb ? 67 : insets.top + 12, backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.headerSub, { color: theme.subtitle }]}>Your Collection</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Saved</Text>
      </View>

      <FlatList
        data={savedList}
        keyExtractor={(r) => r.id}
        contentContainerStyle={[
          styles.list,
          savedList.length === 0 && styles.emptyContainer,
          { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="bookmark" size={36} color={theme.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No saved recipes</Text>
            <Text style={[styles.emptySubtext, { color: theme.muted }]}>
              Tap the bookmark on any recipe to save it here
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/")}
              style={[styles.exploreBtn, { backgroundColor: theme.tint }]}
            >
              <Feather name="book-open" size={16} color="#fff" />
              <Text style={styles.exploreBtnText}>Browse Recipes</Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item: recipe }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })}
            style={({ pressed }) => [
              styles.savedCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
            ]}
          >
            {recipe.imageUri && (
              <Image source={recipe.imageUri} style={styles.cardImage} resizeMode="cover" />
            )}
            <View style={[styles.colorStrip, { backgroundColor: recipe.color }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.amharic, { color: recipe.color }]}>{recipe.amharic}</Text>
                  <Text style={[styles.name, { color: theme.text }]}>{recipe.name}</Text>
                </View>
                <Pressable
                  onPress={() => toggleSaveRecipe(recipe.id)}
                  style={({ pressed }) => [styles.unsaveBtn, { opacity: pressed ? 0.6 : 1, backgroundColor: recipe.color + "20", borderRadius: 8, padding: 6 }]}
                >
                  <Feather name="bookmark" size={18} color={recipe.color} />
                </Pressable>
              </View>
              <Text style={[styles.desc, { color: theme.subtitle }]} numberOfLines={2}>
                {recipe.description}
              </Text>
              <View style={styles.metaRow}>
                <Feather name="clock" size={11} color={theme.muted} />
                <Text style={[styles.metaText, { color: theme.muted }]}>
                  {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60 > 0 ? recipe.time % 60 + "m" : ""}` : `${recipe.time}m`}
                </Text>
                <Feather name="zap" size={11} color={theme.muted} style={{ marginLeft: 10 }} />
                <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.calories} kcal</Text>
                <Text style={[styles.metaText, { color: theme.muted, marginLeft: 10 }]}>·</Text>
                <Text style={[styles.metaText, { color: theme.muted }]}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.tagsRow}>
                {recipe.tags.slice(0, 3).map((tag) => (
                  <View key={tag} style={[styles.tag, { backgroundColor: recipe.color + "18" }]}>
                    <Text style={[styles.tagText, { color: recipe.color }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSub: { fontSize: 12, fontFamily: "Inter_500Medium", letterSpacing: 1, textTransform: "uppercase" },
  headerTitle: { fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 2 },
  list: { paddingHorizontal: 20, paddingTop: 4, gap: 12 },
  emptyContainer: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  emptySubtext: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 40 },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  exploreBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  savedCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 120 },
  colorStrip: { height: 4 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  amharic: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  name: { fontSize: 18, fontFamily: "Inter_700Bold" },
  desc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  unsaveBtn: { padding: 4 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
