import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
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
import { RECIPES, UnitSystem, convertIngredient } from "@/data/recipes";
import { useTheme } from "@/hooks/useTheme";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { toggleSaveRecipe, isRecipeSaved } = useApp();
  const isWeb = Platform.OS === "web";

  const recipe = RECIPES.find((r) => r.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showCulture, setShowCulture] = useState(false);

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <Feather name="arrow-left" size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.notFound, { color: theme.text }]}>Recipe not found</Text>
      </View>
    );
  }

  const saved = isRecipeSaved(recipe.id);
  const pairRecipes = recipe.pairsWith
    ? RECIPES.filter((r) => recipe.pairsWith?.includes(r.id))
    : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 : insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image source={recipe.imageUri} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={[styles.heroTop, { paddingTop: isWeb ? 67 : insets.top + 8 }]}>
            <Pressable onPress={() => router.back()} style={styles.navBtn}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => toggleSaveRecipe(recipe.id)}
              style={[styles.navBtn, saved && { backgroundColor: recipe.color }]}
            >
              <Feather name="bookmark" size={20} color={saved ? "#FDD835" : "#fff"} />
            </Pressable>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroAmharic}>{recipe.amharic}</Text>
            <Text style={styles.heroName}>{recipe.name}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroBadge}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroBadgeText}>
                  {recipe.time >= 60 ? `${Math.floor(recipe.time / 60)}h${recipe.time % 60 > 0 ? ` ${recipe.time % 60}m` : ""}` : `${recipe.time} min`}
                </Text>
              </View>
              <View style={styles.heroBadge}>
                <Feather name="users" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroBadgeText}>{recipe.servings} servings</Text>
              </View>
              <View style={[styles.heroBadge, { backgroundColor: recipe.color + "BB" }]}>
                <Text style={styles.heroBadgeText}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.nutritionWrapper}>
            <BlurView intensity={20} tint="light" style={[styles.nutritionRow, { borderColor: "rgba(255,255,255,0.1)" }]}>
              {[
                { label: "Calories", value: String(recipe.calories), unit: "kcal", color: "#FFC107" },
                { label: "Protein", value: `${recipe.protein}g`, unit: "", color: "#4CAF50" },
                { label: "Carbs", value: `${recipe.carbs}g`, unit: "", color: "#2196F3" },
                { label: "Fat", value: `${recipe.fat}g`, unit: "", color: "#E91E63" },
              ].map((n, i) => (
                <View key={n.label} style={[styles.nutritionItem, i < 3 && { borderRightWidth: 1, borderRightColor: "rgba(255,255,255,0.1)" }]}>
                  <Text style={[styles.nutritionValue, { color: n.color }]}>{n.value}</Text>
                  <Text style={[styles.nutritionLabel, { color: "rgba(255,255,255,0.5)" }]}>{n.label}</Text>
                </View>
              ))}
            </BlurView>
          </View>

          <Text style={[styles.descText, { color: theme.subtitle }]}>{recipe.description}</Text>

          <Pressable
            onPress={() => setShowCulture(!showCulture)}
            style={[styles.cultureToggle, { backgroundColor: theme.tagBg, borderColor: recipe.color + "30" }]}
          >
            <Feather name="globe" size={14} color={recipe.color} />
            <Text style={[styles.cultureToggleLabel, { color: recipe.color }]}>Ethiopian Cultural Insight</Text>
            <Feather name={showCulture ? "chevron-up" : "chevron-down"} size={14} color={recipe.color} style={{ marginLeft: "auto" }} />
          </Pressable>
          {showCulture && (
            <View style={[styles.cultureCard, { backgroundColor: recipe.color + "12", borderColor: recipe.color + "35" }]}>
              <Text style={[styles.cultureText, { color: theme.text }]}>{recipe.culturalInsight}</Text>
            </View>
          )}

          <View style={styles.servingsSection}>
            <View style={styles.servingsLeft}>
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
            <View style={[styles.unitToggle, { backgroundColor: theme.card, borderColor: theme.divider }]}>
              {(["metric", "imperial"] as UnitSystem[]).map((sys) => (
                <Pressable
                  key={sys}
                  onPress={() => setUnitSystem(sys)}
                  style={[styles.unitBtn, unitSystem === sys && { backgroundColor: theme.tint }]}
                >
                  <Text style={[styles.unitBtnText, { color: unitSystem === sys ? "#fff" : theme.subtitle }]}>
                    {sys === "metric" ? "ML/G" : "CUP/OZ"}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.ingredientsBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {recipe.ingredients.map((ing, i) => {
              const converted = convertIngredient(ing.amount, ing.unit, unitSystem, recipe.servings, servings);
              return (
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
                    {converted.value} <Text style={{ opacity: 0.7 }}>{converted.unit}</Text>
                  </Text>
                </View>
              );
            })}
          </View>

          {unitSystem === "imperial" && (
            <View style={[styles.converterNote, { backgroundColor: theme.tagBg }]}>
              <Feather name="info" size={12} color={theme.tagText} />
              <Text style={[styles.converterNoteText, { color: theme.tagText }]}>
                Amounts converted from metric to imperial units
              </Text>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Step-by-Step Instructions</Text>
          {recipe.steps.map((step) => (
            <Pressable
              key={step.step}
              onPress={() => setActiveStep(activeStep === step.step ? null : step.step)}
              style={[
                styles.stepCard,
                { backgroundColor: activeStep === step.step ? "rgba(255,193,7,0.12)" : "rgba(255,255,255,0.03)", borderColor: activeStep === step.step ? "#FFC107" : "rgba(255,255,255,0.08)" },
              ]}
            >
              <View style={[styles.stepCircle, { backgroundColor: activeStep === step.step ? "#FFC107" : "rgba(255,255,255,0.1)" }]}>
                <Text style={[styles.stepNum, { color: activeStep === step.step ? "#000" : "rgba(255,255,255,0.6)" }]}>
                  {step.step}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                  {step.duration && (
                    <View style={[styles.durationPill, { backgroundColor: "rgba(255,193,7,0.15)" }]}>
                      <Feather name="clock" size={10} color="#FFC107" />
                      <Text style={[styles.durationText, { color: "#FFC107" }]}>{step.duration}</Text>
                    </View>
                  )}
                </View>
                {activeStep === step.step && (
                  <>
                    <Text style={[styles.stepDesc, { color: theme.subtitle }]}>{step.description}</Text>
                    {step.tip && (
                      <View style={[styles.tipBox, { backgroundColor: "#FDD83520", borderColor: "#FDD83560" }]}>
                        <Feather name="star" size={11} color="#F57F17" />
                        <Text style={[styles.tipText, { color: "#F57F17" }]}>{step.tip}</Text>
                      </View>
                    )}
                  </>
                )}
                {activeStep !== step.step && (
                  <Text style={[styles.tapHint, { color: theme.muted }]}>Tap to expand</Text>
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

          {pairRecipes.length > 0 && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Pairs Well With</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                {pairRecipes.map((pair) => (
                  <Pressable
                    key={pair.id}
                    onPress={() => router.push({ pathname: "/recipe/[id]", params: { id: pair.id } })}
                    style={[styles.pairCard, { borderColor: theme.cardBorder, backgroundColor: theme.card }]}
                  >
                    <Image source={pair.imageUri} style={styles.pairImage} resizeMode="cover" />
                    <View style={[styles.pairColorBar, { backgroundColor: pair.color }]} />
                    <Text style={[styles.pairName, { color: theme.text }]}>{pair.name}</Text>
                    <Text style={[styles.pairAmharic, { color: pair.color }]}>{pair.amharic}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  heroContainer: { height: 400, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(14,8,4,0.4)" },
  heroTop: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 10 },
  navBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  heroContent: { position: "absolute", bottom: 40, left: 24, right: 24 },
  heroAmharic: { color: "#FFC107", fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4, letterSpacing: 0.5 },
  heroName: { color: "#fff", fontSize: 36, fontFamily: "Inter_700Bold", lineHeight: 40 },
  heroMeta: { flexDirection: "row", gap: 10, marginTop: 14, flexWrap: "wrap" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { color: "#FFFFFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  content: { padding: 24, gap: 20 },
  nutritionWrapper: { marginTop: -60, marginBottom: 10, zIndex: 20 },
  nutritionRow: { flexDirection: "row", borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  nutritionItem: { flex: 1, padding: 16, alignItems: "center" },
  nutritionValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  nutritionLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 4, textAlign: "center" },
  descText: { fontSize: 16, fontFamily: "Inter_400Regular", lineHeight: 26, color: "rgba(255,255,255,0.7)" },
  cultureToggle: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: "rgba(255,193,7,0.08)" },
  cultureToggleLabel: { fontSize: 15, fontFamily: "Inter_700Bold" },
  cultureCard: { borderRadius: 16, borderWidth: 1, padding: 18, marginTop: -10 },
  cultureText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24, color: "rgba(255,255,255,0.8)" },
  servingsSection: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  servingsLeft: { gap: 10 },
  sectionTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  servingsControl: { flexDirection: "row", alignItems: "center", gap: 10 },
  servingBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  servingsCount: { fontSize: 20, fontFamily: "Inter_700Bold", minWidth: 32, textAlign: "center", color: "#FFFFFF" },
  servingsLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.4)" },
  unitToggle: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden", padding: 4, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  unitBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  unitBtnText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  ingredientsBox: { borderRadius: 20, borderWidth: 1, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  ingredientRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  ingDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  ingName: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium", color: "#FFFFFF" },
  ingAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
  converterNote: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, padding: 12, backgroundColor: "rgba(33,150,243,0.1)" },
  converterNoteText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "#2196F3" },
  stepCard: { flexDirection: "row", gap: 16, borderRadius: 20, borderWidth: 1, padding: 18, alignItems: "flex-start" },
  stepCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  stepHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 },
  stepTitle: { fontSize: 17, fontFamily: "Inter_700Bold", flex: 1, color: "#FFFFFF" },
  durationPill: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4 },
  durationText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tapHint: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 4, color: "rgba(255,255,255,0.3)" },
  stepDesc: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24, marginTop: 8, color: "rgba(255,255,255,0.7)" },
  tipBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 12, backgroundColor: "rgba(255,193,7,0.1)", borderColor: "rgba(255,193,7,0.3)" },
  tipText: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 19, flex: 1, color: "#FFC107" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 },
  tag: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: "rgba(255,255,255,0.08)" },
  tagText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.6)" },
  pairCard: { width: 150, borderRadius: 20, borderWidth: 1, overflow: "hidden", marginRight: 12, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" },
  pairImage: { width: "100%", height: 100 },
  pairColorBar: { height: 4 },
  pairName: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFFFFF", padding: 12, paddingBottom: 4 },
  pairAmharic: { fontSize: 12, fontFamily: "Inter_700Bold", paddingHorizontal: 12, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", margin: 20, backgroundColor: "rgba(255,255,255,0.05)" },
  notFound: { fontSize: 20, textAlign: "center", marginTop: 80, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
});
