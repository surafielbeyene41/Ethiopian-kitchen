import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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
import { RECIPES } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

const UNITS = {
  cups: { to_ml: 240, label: "cups" },
  tbsp: { to_ml: 15, label: "tbsp" },
  tsp: { to_ml: 5, label: "tsp" },
  g: { to_ml: 1, label: "g" },
  kg: { to_ml: 1000, label: "kg" },
  ml: { to_ml: 1, label: "ml" },
  whole: { to_ml: 0, label: "whole" },
  large: { to_ml: 0, label: "large" },
  medium: { to_ml: 0, label: "medium" },
  cloves: { to_ml: 0, label: "cloves" },
};

function convertAmount(amount: number, unit: string, servings: number, targetServings: number): string {
  const scaled = (amount * targetServings) / servings;
  if (scaled === Math.floor(scaled)) return String(scaled);
  return scaled.toFixed(1);
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { toggleSaveRecipe, isRecipeSaved } = useApp();
  const isWeb = Platform.OS === "web";

  const recipe = RECIPES.find((r) => r.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showCulture, setShowCulture] = useState(false);

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.notFound, { color: theme.text }]}>Recipe not found</Text>
      </View>
    );
  }

  const saved = isRecipeSaved(recipe.id);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.heroBar,
          { backgroundColor: recipe.color, paddingTop: isWeb ? 67 : insets.top },
        ]}
      >
        <View style={styles.heroNav}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.25)" }]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => toggleSaveRecipe(recipe.id)}
            style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.25)" }]}
          >
            <Feather name={saved ? "bookmark" : "bookmark"} size={20} color={saved ? "#FDD835" : "#fff"} />
          </Pressable>
        </View>
        <Text style={styles.heroAmharic}>{recipe.amharic}</Text>
        <Text style={styles.heroName}>{recipe.name}</Text>
        <View style={styles.heroMeta}>
          <View style={styles.heroBadge}>
            <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroBadgeText}>
              {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h ${recipe.time % 60 > 0 ? recipe.time % 60 + "m" : ""}` : `${recipe.time} min`}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Feather name="zap" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.heroBadgeText}>{recipe.calories} kcal/serving</Text>
          </View>
          <View style={[styles.heroBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
            <Text style={styles.heroBadgeText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={[styles.nutritionRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {[
              { label: "Protein", value: `${recipe.protein}g`, color: "#1565C0" },
              { label: "Carbs", value: `${recipe.carbs}g`, color: "#E65100" },
              { label: "Fat", value: `${recipe.fat}g`, color: "#C8102E" },
            ].map((n) => (
              <View key={n.label} style={styles.nutritionItem}>
                <Text style={[styles.nutritionValue, { color: n.color }]}>{n.value}</Text>
                <Text style={[styles.nutritionLabel, { color: theme.muted }]}>{n.label}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.desc, { color: theme.subtitle }]}>{recipe.description}</Text>

          <Pressable
            onPress={() => setShowCulture(!showCulture)}
            style={[styles.cultureToggle, { backgroundColor: theme.tagBg, borderColor: theme.divider }]}
          >
            <Feather name="globe" size={14} color={theme.tint} />
            <Text style={[styles.cultureToggleText, { color: theme.tint }]}>
              Cultural Insight
            </Text>
            <Feather
              name={showCulture ? "chevron-up" : "chevron-down"}
              size={14}
              color={theme.tint}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>

          {showCulture && (
            <View style={[styles.cultureCard, { backgroundColor: theme.card, borderColor: recipe.color + "40" }]}>
              <Text style={[styles.cultureText, { color: theme.text }]}>{recipe.culturalInsight}</Text>
            </View>
          )}

          <View style={styles.servingsRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
            <View style={styles.servingsControl}>
              <Pressable
                onPress={() => setServings(Math.max(1, servings - 1))}
                style={[styles.servingBtn, { backgroundColor: theme.card, borderColor: theme.divider }]}
              >
                <Feather name="minus" size={14} color={theme.text} />
              </Pressable>
              <Text style={[styles.servingsCount, { color: theme.text }]}>{servings}</Text>
              <Pressable
                onPress={() => setServings(servings + 1)}
                style={[styles.servingBtn, { backgroundColor: theme.card, borderColor: theme.divider }]}
              >
                <Feather name="plus" size={14} color={theme.text} />
              </Pressable>
              <Text style={[styles.servingsLabel, { color: theme.muted }]}>servings</Text>
            </View>
          </View>

          <View style={[styles.ingredientsBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {recipe.ingredients.map((ing, i) => (
              <View
                key={i}
                style={[
                  styles.ingredientRow,
                  i < recipe.ingredients.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.divider },
                ]}
              >
                <View style={[styles.ingDot, { backgroundColor: recipe.color }]} />
                <Text style={[styles.ingName, { color: theme.text }]}>{ing.name}</Text>
                <Text style={[styles.ingAmount, { color: recipe.color }]}>
                  {convertAmount(ing.amount, ing.unit, recipe.servings, servings)} {ing.unit}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Steps</Text>
          {recipe.steps.map((step) => (
            <Pressable
              key={step.step}
              onPress={() => setActiveStep(activeStep === step.step ? null : step.step)}
              style={[
                styles.stepCard,
                {
                  backgroundColor: activeStep === step.step ? recipe.color + "15" : theme.card,
                  borderColor: activeStep === step.step ? recipe.color + "40" : theme.cardBorder,
                },
              ]}
            >
              <View style={[styles.stepNum, { backgroundColor: recipe.color }]}>
                <Text style={styles.stepNumText}>{step.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                  {step.duration && (
                    <View style={[styles.durationBadge, { backgroundColor: recipe.color + "20" }]}>
                      <Text style={[styles.durationText, { color: recipe.color }]}>{step.duration}</Text>
                    </View>
                  )}
                </View>
                {activeStep === step.step && (
                  <Text style={[styles.stepDesc, { color: theme.subtitle }]}>{step.description}</Text>
                )}
              </View>
            </Pressable>
          ))}

          <View style={styles.tagsRow}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.tagBg }]}>
                <Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBar: { paddingHorizontal: 20, paddingBottom: 20 },
  heroNav: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  navBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  heroAmharic: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  heroName: { color: "#fff", fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 2 },
  heroMeta: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  heroBadgeText: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontFamily: "Inter_500Medium" },
  content: { padding: 20, gap: 16 },
  nutritionRow: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  nutritionItem: { flex: 1, padding: 14, alignItems: "center" },
  nutritionValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  nutritionLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  cultureToggle: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  cultureToggleText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cultureCard: { borderRadius: 12, borderWidth: 1, padding: 14 },
  cultureText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  servingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  servingsControl: { flexDirection: "row", alignItems: "center", gap: 8 },
  servingBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  servingsCount: { fontSize: 16, fontFamily: "Inter_700Bold", minWidth: 24, textAlign: "center" },
  servingsLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ingredientsBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  ingredientRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
  ingDot: { width: 6, height: 6, borderRadius: 3 },
  ingName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  ingAmount: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  stepCard: { flexDirection: "row", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "flex-start" },
  stepNum: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepNumText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  stepHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  stepTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  durationBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  durationText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  stepDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19, marginTop: 8 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  notFound: { fontSize: 18, textAlign: "center", marginTop: 100, fontFamily: "Inter_400Regular" },
});
