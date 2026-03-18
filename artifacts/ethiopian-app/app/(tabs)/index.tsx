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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { CATEGORIES, RECIPES, Recipe } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

function CategoryPill({
  label,
  icon,
  selected,
  onPress,
  theme,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? theme.tint : theme.card,
          borderColor: selected ? theme.tint : theme.divider,
        },
      ]}
    >
      <Feather
        name={icon as any}
        size={14}
        color={selected ? "#fff" : theme.subtitle}
      />
      <Text
        style={[
          styles.pillText,
          { color: selected ? "#fff" : theme.subtitle },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function DifficultyBadge({ level, theme }: { level: string; theme: any }) {
  const colors: Record<string, string> = {
    easy: "#2E7D32",
    medium: "#E65100",
    hard: "#C62828",
  };
  return (
    <View style={[styles.badge, { backgroundColor: colors[level] + "22" }]}>
      <Text style={[styles.badgeText, { color: colors[level] }]}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Text>
    </View>
  );
}

function RecipeCard({ recipe, theme, isDark }: { recipe: Recipe; theme: any; isDark: boolean }) {
  const { isRecipeSaved } = useApp();
  const saved = isRecipeSaved(recipe.id);

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } })}
      style={({ pressed }) => [
        styles.recipeCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.recipeColorBar, { backgroundColor: recipe.color }]} />
      <View style={styles.recipeContent}>
        <View style={styles.recipeHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.amharic, { color: recipe.color }]}>
              {recipe.amharic}
            </Text>
            <Text style={[styles.recipeName, { color: theme.text }]}>
              {recipe.name}
            </Text>
          </View>
          {saved && (
            <Feather name="bookmark" size={16} color={theme.tint} style={{ marginLeft: 8 }} />
          )}
        </View>

        <Text style={[styles.recipeDesc, { color: theme.subtitle }]} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60 > 0 ? recipe.time % 60 + "m" : ""}` : `${recipe.time}m`}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="users" size={12} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {recipe.servings} servings
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="zap" size={12} color={theme.muted} />
            <Text style={[styles.metaText, { color: theme.muted }]}>
              {recipe.calories} kcal
            </Text>
          </View>
          <DifficultyBadge level={recipe.difficulty} theme={theme} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
        >
          {recipe.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: theme.tagBg }]}
            >
              <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Pressable>
  );
}

export default function RecipesScreen() {
  const { theme, isDark } = useTheme();
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
      <View
        style={[
          styles.header,
          {
            paddingTop: isWeb ? 67 : insets.top + 12,
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerGreeting, { color: theme.subtitle }]}>
              Ethiopian Kitchen
            </Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Recipes
            </Text>
          </View>
          <View
            style={[styles.iconBg, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Text style={styles.flagEmoji}>🇪🇹</Text>
          </View>
        </View>

        <View
          style={[styles.searchBar, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
        >
          <Feather name="search" size={16} color={theme.muted} />
          <TextInput
            placeholder="Search recipes..."
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 },
        ]}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} theme={theme} isDark={isDark} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Feather name="search" size={40} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No recipes found
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerGreeting: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flagEmoji: { fontSize: 24 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  pillsRow: { paddingRight: 20, gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  recipeCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  recipeColorBar: { width: 5 },
  recipeContent: { flex: 1, padding: 14 },
  recipeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  amharic: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 1,
  },
  recipeName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },
  recipeDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  tag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
