import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";

const CATEGORY_ICONS: Record<string, string> = {
  Spices: "thermometer",
  Vegetables: "sun",
  Meats: "triangle",
  Grains: "layers",
  Dairy: "droplet",
  "Oils & Liquids": "coffee",
  Other: "box",
};

const CATEGORY_COLORS: Record<string, string> = {
  Spices: "#E65100",
  Vegetables: "#2E7D32",
  Meats: "#C62828",
  Grains: "#6A1B9A",
  Dairy: "#1565C0",
  "Oils & Liquids": "#FF8F00",
  Other: "#546E7A",
};

export default function GroceryScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { groceryItems, toggleGroceryItem, removeGroceryItem, clearGrocery } = useApp();

  const grouped = useMemo(() => {
    const groups: Record<string, typeof groceryItems> = {};
    groceryItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    // Sort: unchecked first within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));
    });
    return groups;
  }, [groceryItems]);

  const categories = Object.keys(grouped).sort();
  const totalItems = groceryItems.length;
  const checkedCount = groceryItems.filter((i) => i.checked).length;

  const handleClear = () => {
    Alert.alert(
      "Clear Grocery List",
      "Remove all items from your grocery list?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearGrocery },
      ]
    );
  };

  if (totalItems === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Feather name="arrow-left" size={20} color={theme.text} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerSub, { color: theme.tint }]}>Shopping</Text>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Grocery List</Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="shopping-cart" size={40} color={theme.muted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your list is empty</Text>
          <Text style={[styles.emptySub, { color: theme.muted }]}>
            Add ingredients from any recipe to build your grocery list
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/")}
            style={[styles.browseBtn, { backgroundColor: theme.tint }]}
          >
            <Feather name="book-open" size={16} color="#fff" />
            <Text style={styles.browseBtnText}>Browse Recipes</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: isWeb ? 67 : insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Feather name="arrow-left" size={20} color={theme.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerSub, { color: theme.tint }]}>Shopping</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Grocery List</Text>
          </View>
          <Pressable onPress={handleClear} style={[styles.clearBtn, { borderColor: theme.danger + "40" }]}>
            <Feather name="trash-2" size={14} color={theme.danger} />
          </Pressable>
        </View>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: theme.subtitle }]}>
              {checkedCount} of {totalItems} items checked
            </Text>
            <Text style={[styles.progressPct, { color: theme.tint }]}>
              {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.divider }]}>
            <View style={[styles.progressFill, {
              width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` as any,
              backgroundColor: checkedCount === totalItems ? theme.success : theme.tint,
            }]} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => {
          const items = grouped[cat];
          const catColor = CATEGORY_COLORS[cat] ?? theme.tint;
          const catIcon = CATEGORY_ICONS[cat] ?? "box";

          return (
            <View key={cat} style={[styles.catCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.catHeader}>
                <View style={[styles.catIconBox, { backgroundColor: catColor + "18" }]}>
                  <Feather name={catIcon as any} size={16} color={catColor} />
                </View>
                <Text style={[styles.catTitle, { color: theme.text }]}>{cat}</Text>
                <View style={[styles.catCountBadge, { backgroundColor: catColor + "20" }]}>
                  <Text style={[styles.catCountText, { color: catColor }]}>{items.length}</Text>
                </View>
              </View>

              {items.map((item) => (
                <View key={item.id} style={[styles.itemRow, { borderTopColor: theme.divider }]}>
                  <Pressable
                    onPress={() => toggleGroceryItem(item.id)}
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: item.checked ? theme.success : "transparent",
                        borderColor: item.checked ? theme.success : theme.muted,
                      },
                    ]}
                  >
                    {item.checked && <Feather name="check" size={12} color="#fff" />}
                  </Pressable>

                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.itemName,
                      { color: item.checked ? theme.muted : theme.text },
                      item.checked && styles.itemChecked,
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.itemRecipe, { color: theme.muted }]}>{item.recipeName}</Text>
                  </View>

                  <Text style={[styles.itemAmount, { color: item.checked ? theme.muted : catColor }]}>
                    {item.amount} {item.unit}
                  </Text>

                  <Pressable onPress={() => removeGroceryItem(item.id)} style={styles.deleteBtn}>
                    <Feather name="x" size={14} color={theme.muted} />
                  </Pressable>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerSub: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  headerTitle: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 2 },
  clearBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  progressCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  progressPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  catCard: { borderRadius: 20, borderWidth: 1, padding: 16, gap: 0 },
  catHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  catIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  catTitle: { flex: 1, fontSize: 16, fontFamily: "Inter_700Bold" },
  catCountBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  catCountText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderTopWidth: 1 },
  checkbox: {
    width: 24, height: 24, borderRadius: 7, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  itemName: { fontSize: 15, fontFamily: "Inter_500Medium" },
  itemChecked: { textDecorationLine: "line-through" },
  itemRecipe: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  itemAmount: { fontSize: 13, fontFamily: "Inter_700Bold", minWidth: 60, textAlign: "right" },
  deleteBtn: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 16, marginTop: -60 },
  emptyIcon: { width: 100, height: 100, borderRadius: 28, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  browseBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 18, marginTop: 12 },
  browseBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});
