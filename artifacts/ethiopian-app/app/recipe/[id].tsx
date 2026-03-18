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
          <View style={[styles.nutritionRow, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {[
              { label: "Calories", value: String(recipe.calories), unit: "kcal", color: recipe.color },
              { label: "Protein", value: `${recipe.protein}g`, unit: "", color: "#1565C0" },
              { label: "Carbs", value: `${recipe.carbs}g`, unit: "", color: "#E65100" },
              { label: "Fat", value: `${recipe.fat}g`, unit: "", color: "#6A1B9A" },
              { label: "Fiber", value: `${recipe.fiber}g`, unit: "", color: "#2E7D32" },
            ].map((n, i) => (
              <View key={n.label} style={[styles.nutritionItem, i < 4 && { borderRightWidth: 1, borderRightColor: theme.divider }]}>
                <Text style={[styles.nutritionValue, { color: n.color }]}>{n.value}</Text>
                <Text style={[styles.nutritionLabel, { color: theme.muted }]}>{n.label}</Text>
              </View>
            ))}
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
                { backgroundColor: activeStep === step.step ? recipe.color + "12" : theme.card, borderColor: activeStep === step.step ? recipe.color + "50" : theme.cardBorder },
              ]}
            >
              <View style={[styles.stepCircle, { backgroundColor: activeStep === step.step ? recipe.color : theme.inputBg }]}>
                <Text style={[styles.stepNum, { color: activeStep === step.step ? "#fff" : theme.subtitle }]}>
                  {step.step}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.stepHeader}>
                  <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                  {step.duration && (
                    <View style={[styles.durationPill, { backgroundColor: recipe.color + "20" }]}>
                      <Feather name="clock" size={10} color={recipe.color} />
                      <Text style={[styles.durationText, { color: recipe.color }]}>{step.duration}</Text>
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
  container: { flex: 1 },
  heroContainer: { height: 300, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  heroTop: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8 },
  navBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  heroContent: { position: "absolute", bottom: 20, left: 20, right: 20 },
  heroAmharic: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  heroName: { color: "#fff", fontSize: 30, fontFamily: "Inter_700Bold", lineHeight: 34 },
  heroMeta: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  heroBadgeText: { color: "rgba(255,255,255,0.92)", fontSize: 12, fontFamily: "Inter_500Medium" },
  content: { padding: 20, gap: 16 },
  nutritionRow: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  nutritionItem: { flex: 1, padding: 12, alignItems: "center" },
  nutritionValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  nutritionLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },
  descText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  cultureToggle: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 11 },
  cultureToggleLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cultureCard: { borderRadius: 12, borderWidth: 1, padding: 14 },
  cultureText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  servingsSection: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  servingsLeft: { gap: 8 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  servingsControl: { flexDirection: "row", alignItems: "center", gap: 8 },
  servingBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  servingsCount: { fontSize: 18, fontFamily: "Inter_700Bold", minWidth: 28, textAlign: "center" },
  servingsLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  unitToggle: { flexDirection: "row", borderRadius: 10, borderWidth: 1, overflow: "hidden", padding: 3 },
  unitBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  unitBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  ingredientsBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  ingredientRow: { flexDirection: "row", alignItems: "center", padding: 13, gap: 10 },
  ingDot: { width: 7, height: 7, borderRadius: 3.5, flexShrink: 0 },
  ingName: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  ingAmount: { fontSize: 14, fontFamily: "Inter_700Bold" },
  converterNote: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, padding: 10 },
  converterNoteText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  stepCard: { flexDirection: "row", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "flex-start" },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepNum: { fontSize: 14, fontFamily: "Inter_700Bold" },
  stepHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 },
  stepTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  durationPill: { flexDirection: "row", alignItems: "center", gap: 3, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  durationText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  tapHint: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  stepDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginTop: 6 },
  tipBox: { flexDirection: "row", alignItems: "flex-start", gap: 6, borderRadius: 8, borderWidth: 1, padding: 10, marginTop: 8 },
  tipText: { fontSize: 12, fontFamily: "Inter_500Medium", lineHeight: 17, flex: 1 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  pairCard: { width: 130, borderRadius: 14, borderWidth: 1, overflow: "hidden", marginRight: 10 },
  pairImage: { width: "100%", height: 80 },
  pairColorBar: { height: 3 },
  pairName: { fontSize: 13, fontFamily: "Inter_600SemiBold", padding: 8, paddingBottom: 2 },
  pairAmharic: { fontSize: 11, fontFamily: "Inter_500Medium", paddingHorizontal: 8, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", margin: 16 },
  notFound: { fontSize: 18, textAlign: "center", marginTop: 60, fontFamily: "Inter_400Regular" },
});
