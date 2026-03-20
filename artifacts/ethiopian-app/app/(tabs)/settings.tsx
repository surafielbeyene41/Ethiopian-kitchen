import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeMode, UnitSystem, useApp, Language } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: string; emoji: string }[] = [
  { id: "system", label: "System", icon: "smartphone", emoji: "📱" },
  { id: "light", label: "Light", icon: "sun", emoji: "☀️" },
  { id: "dark", label: "Dark", icon: "moon", emoji: "🌙" },
];

const SERVING_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12];

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const {
    themeMode, setThemeMode,
    defaultServings, setDefaultServings,
    unitSystem, setUnitSystem,
    language, setLanguage,
    savedRecipes, groceryItems,
    clearGrocery,
  } = useApp();
  const { t } = useTranslation();

  const handleClearGrocery = () => {
    Alert.alert(
      t("clear_list"),
      t("clear_confirm"),
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        { text: t("clear_list"), style: "destructive", onPress: clearGrocery },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <Text style={[styles.headerSub, { color: theme.tint }]}>{t("preferences")}</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t("settings")}</Text>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="sun" size={16} color={theme.tint} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("appearance")}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: theme.subtitle }]}>{t("theme_mode")}</Text>
          <View style={styles.optionsRow}>
            {THEME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => setThemeMode(opt.id)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: themeMode === opt.id ? theme.tint + "20" : theme.inputBg,
                    borderColor: themeMode === opt.id ? theme.tint : theme.divider,
                  },
                ]}
              >
                <Text style={styles.themeEmoji}>{opt.emoji}</Text>
                <Text style={[styles.themeLabel, { color: themeMode === opt.id ? theme.tint : theme.subtitle }]}>
                  {opt.label}
                </Text>
                {themeMode === opt.id && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.tint }]} />
                )}
              </Pressable>
            ))}
          </View>
          <View style={[styles.previewStrip, { backgroundColor: isDark ? "#1A0E08" : "#FFF8F0" }]}>
            <View style={[styles.previewDot, { backgroundColor: isDark ? "#FF7043" : "#E65100" }]} />
            <Text style={[styles.previewText, { color: isDark ? "#FFF8F0" : "#1A0E08" }]}>
              {isDark ? "Dark Mode Active" : "Light Mode Active"}
            </Text>
            <Feather name={isDark ? "moon" : "sun"} size={14} color={isDark ? "#FF7043" : "#E65100"} />
          </View>
        </View>
      </View>

      {/* Cooking Defaults */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="sliders" size={16} color={theme.tint} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("cooking_defaults")}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardLabel, { color: theme.subtitle }]}>{t("servings")}</Text>
          <View style={styles.servingsRow}>
            {SERVING_OPTIONS.map((n) => (
              <Pressable
                key={n}
                onPress={() => setDefaultServings(n)}
                style={[
                  styles.servingChip,
                  {
                    backgroundColor: defaultServings === n ? theme.tint : theme.inputBg,
                    borderColor: defaultServings === n ? theme.tint : theme.divider,
                  },
                ]}
              >
                <Text style={[styles.servingText, { color: defaultServings === n ? "#fff" : theme.subtitle }]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <Text style={[styles.cardLabel, { color: theme.subtitle }]}>{t("unit_system")}</Text>
          <View style={styles.optionsRow}>
            {(["metric", "imperial"] as UnitSystem[]).map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnitSystem(u)}
                style={[
                  styles.unitOption,
                  {
                    backgroundColor: unitSystem === u ? theme.tint + "20" : theme.inputBg,
                    borderColor: unitSystem === u ? theme.tint : theme.divider,
                  },
                ]}
              >
                <Feather
                  name={u === "metric" ? "box" : "package"}
                  size={18}
                  color={unitSystem === u ? theme.tint : theme.muted}
                />
                <Text style={[styles.unitLabel, { color: unitSystem === u ? theme.tint : theme.subtitle }]}>
                  {u === "metric" ? "Metric" : "Imperial"}
                </Text>
                <Text style={[styles.unitSub, { color: theme.muted }]}>
                  {u === "metric" ? "g, ml, °C" : "oz, cups, °F"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="globe" size={16} color={theme.tint} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("language")}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.optionsRow}>
            {(["en", "am"] as Language[]).map((l) => (
              <Pressable
                key={l}
                onPress={() => setLanguage(l)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: language === l ? theme.tint + "20" : theme.inputBg,
                    borderColor: language === l ? theme.tint : theme.divider,
                  },
                ]}
              >
                <Text style={styles.themeEmoji}>{l === "en" ? "🇺🇸" : "🇪🇹"}</Text>
                <Text style={[styles.themeLabel, { color: language === l ? theme.tint : theme.subtitle }]}>
                  {l === "en" ? t("english") : t("amharic")}
                </Text>
                {language === l && (
                  <View style={[styles.activeIndicator, { backgroundColor: theme.tint }]} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Data & Storage */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="database" size={16} color={theme.tint} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("data_storage")}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {[
            { label: t("saved_recipes_count"), value: String(savedRecipes.length), icon: "bookmark", color: theme.tint },
            { label: t("grocery_items_count"), value: String(groceryItems.length), icon: "shopping-cart", color: "#4CAF50" },
          ].map((item) => (
            <View key={item.label} style={styles.dataRow}>
              <View style={[styles.dataIcon, { backgroundColor: item.color + "18" }]}>
                <Feather name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text style={[styles.dataLabel, { color: theme.text }]}>{item.label}</Text>
              <View style={[styles.dataBadge, { backgroundColor: item.color + "20" }]}>
                <Text style={[styles.dataBadgeText, { color: item.color }]}>{item.value}</Text>
              </View>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <Pressable
            onPress={handleClearGrocery}
            style={[styles.dangerBtn, { borderColor: theme.danger + "40" }]}
          >
            <Feather name="trash-2" size={14} color={theme.danger} />
            <Text style={[styles.dangerBtnText, { color: theme.danger }]}>{t("clear_list")}</Text>
          </Pressable>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="info" size={16} color={theme.tint} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("about")}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.aboutHeader}>
            <Text style={styles.aboutEmoji}>🇪🇹</Text>
            <View>
              <Text style={[styles.aboutName, { color: theme.text }]}>Ye'Ethiopia Kitchen</Text>
              <Text style={[styles.aboutVersion, { color: theme.muted }]}>{t("version")} 2.0.0</Text>
            </View>
          </View>
          <Text style={[styles.aboutDesc, { color: theme.subtitle }]}>
            A premium Ethiopian food & fitness companion with 100+ authentic recipes, culturally-inspired workouts, and smart health tracking — built with love for Ethiopian culture.
          </Text>
          <View style={[styles.aboutCredit, { backgroundColor: theme.inputBg }]}>
            <Text style={[styles.aboutCreditText, { color: theme.muted }]}>
              ምግብ • ጤና • ሕይወት{"\n"}Food • Health • Life
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 4 },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  headerTitle: { fontSize: 34, fontFamily: "Inter_700Bold", marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  card: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 16 },
  cardLabel: { fontSize: 13, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.8 },
  optionsRow: { flexDirection: "row", gap: 10 },
  themeOption: {
    flex: 1, alignItems: "center", gap: 8,
    borderRadius: 16, borderWidth: 1.5, padding: 16,
    position: "relative",
  },
  themeEmoji: { fontSize: 28 },
  themeLabel: { fontSize: 13, fontFamily: "Inter_700Bold" },
  activeIndicator: { position: "absolute", bottom: 8, width: 20, height: 3, borderRadius: 1.5 },
  previewStrip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  previewDot: { width: 8, height: 8, borderRadius: 4 },
  previewText: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  servingsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  servingChip: {
    width: 48, height: 48, borderRadius: 14, borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },
  servingText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  unitOption: {
    flex: 1, alignItems: "center", gap: 6,
    borderRadius: 16, borderWidth: 1.5, padding: 16,
  },
  unitLabel: { fontSize: 14, fontFamily: "Inter_700Bold" },
  unitSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { height: 1 },
  dataRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dataIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dataLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  dataBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  dataBadgeText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  dangerBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 14, borderWidth: 1, paddingVertical: 14,
  },
  dangerBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  aboutHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  aboutEmoji: { fontSize: 40 },
  aboutName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  aboutVersion: { fontSize: 13, fontFamily: "Inter_500Medium" },
  aboutDesc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  aboutCredit: { borderRadius: 14, padding: 16, alignItems: "center" },
  aboutCreditText: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "center", lineHeight: 22 },
});
