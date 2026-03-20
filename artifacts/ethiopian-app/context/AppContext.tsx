import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type UnitSystem = "metric" | "imperial";

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  duration: number;
  calories: number;
  date: string;
}

export interface WaterEntry {
  id: string;
  amount: number;
  time: string;
  date: string;
}

export interface StepEntry {
  date: string;
  steps: number;
}

export interface SavedRecipe {
  recipeId: string;
  savedAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  recipeId: string;
  recipeName: string;
  checked: boolean;
}

const INGREDIENT_CATEGORIES: Record<string, string> = {
  berbere: "Spices", mitmita: "Spices", turmeric: "Spices", cumin: "Spices",
  cinnamon: "Spices", cardamom: "Spices", coriander: "Spices", fenugreek: "Spices",
  ginger: "Spices", garlic: "Spices", pepper: "Spices", salt: "Spices", korerima: "Spices",
  onion: "Vegetables", tomato: "Vegetables", potato: "Vegetables", carrot: "Vegetables",
  cabbage: "Vegetables", spinach: "Vegetables", kale: "Vegetables", collard: "Vegetables",
  "green pepper": "Vegetables", jalapeño: "Vegetables",
  beef: "Meats", chicken: "Meats", lamb: "Meats", meat: "Meats", fish: "Meats",
  teff: "Grains", flour: "Grains", rice: "Grains", lentil: "Grains", chickpea: "Grains",
  wheat: "Grains", barley: "Grains", oat: "Grains",
  butter: "Dairy", cheese: "Dairy", milk: "Dairy", yogurt: "Dairy", cream: "Dairy",
  oil: "Oils & Liquids", water: "Oils & Liquids", honey: "Oils & Liquids", lemon: "Oils & Liquids",
};

function categorizeIngredient(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (lower.includes(keyword)) return category;
  }
  return "Other";
}

const STORAGE_KEYS = {
  WORKOUTS: "workouts_log",
  WATER: "water_log",
  STEPS: "steps_log",
  SAVED_RECIPES: "saved_recipes",
  THEME_MODE: "theme_mode",
  DEFAULT_SERVINGS: "default_servings",
  UNIT_SYSTEM: "unit_system",
  GROCERY: "grocery_items",
};

const today = () => new Date().toISOString().split("T")[0];

function useAppState() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [defaultServings, setDefaultServingsState] = useState(4);
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric");
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [workouts, water, steps, recipes, theme, servings, units, grocery] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
          AsyncStorage.getItem(STORAGE_KEYS.WATER),
          AsyncStorage.getItem(STORAGE_KEYS.STEPS),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES),
          AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SERVINGS),
          AsyncStorage.getItem(STORAGE_KEYS.UNIT_SYSTEM),
          AsyncStorage.getItem(STORAGE_KEYS.GROCERY),
        ]);
        if (workouts) setWorkoutLogs(JSON.parse(workouts));
        if (water) setWaterEntries(JSON.parse(water));
        if (steps) setStepEntries(JSON.parse(steps));
        if (recipes) setSavedRecipes(JSON.parse(recipes));
        if (theme) setThemeModeState(theme as ThemeMode);
        if (servings) setDefaultServingsState(parseInt(servings, 10));
        if (units) setUnitSystemState(units as UnitSystem);
        if (grocery) setGroceryItems(JSON.parse(grocery));
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const logWorkout = useCallback(async (log: Omit<WorkoutLog, "id" | "date">) => {
    const newLog: WorkoutLog = {
      ...log,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: today(),
    };
    setWorkoutLogs((prev) => {
      const updated = [newLog, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addWater = useCallback(async (amount: number) => {
    const entry: WaterEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      amount,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: today(),
    };
    setWaterEntries((prev) => {
      const updated = [entry, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSteps = useCallback(async (steps: number) => {
    setStepEntries((prev) => {
      const date = today();
      const existing = prev.find((e) => e.date === date);
      let updated: StepEntry[];
      if (existing) {
        updated = prev.map((e) => (e.date === date ? { ...e, steps } : e));
      } else {
        updated = [{ date, steps }, ...prev];
      }
      AsyncStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleSaveRecipe = useCallback((recipeId: string) => {
    setSavedRecipes((prev) => {
      const exists = prev.find((r) => r.recipeId === recipeId);
      let updated: SavedRecipe[];
      if (exists) {
        updated = prev.filter((r) => r.recipeId !== recipeId);
      } else {
        updated = [{ recipeId, savedAt: new Date().toISOString() }, ...prev];
      }
      AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isRecipeSaved = useCallback(
    (recipeId: string) => savedRecipes.some((r) => r.recipeId === recipeId),
    [savedRecipes]
  );

  // --- Preference setters ---
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }, []);

  const setDefaultServings = useCallback((n: number) => {
    setDefaultServingsState(n);
    AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_SERVINGS, String(n));
  }, []);

  const setUnitSystem = useCallback((u: UnitSystem) => {
    setUnitSystemState(u);
    AsyncStorage.setItem(STORAGE_KEYS.UNIT_SYSTEM, u);
  }, []);

  // --- Grocery list helpers ---
  const addRecipeToGrocery = useCallback((recipeId: string, recipeName: string, ingredients: { name: string; amount: number; unit: string }[]) => {
    setGroceryItems((prev) => {
      const newItems: GroceryItem[] = ingredients.map((ing) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + ing.name,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        category: categorizeIngredient(ing.name),
        recipeId,
        recipeName,
        checked: false,
      }));
      // Merge duplicates: if same ingredient name + unit exists, add amounts
      const merged = [...prev];
      newItems.forEach((ni) => {
        const existing = merged.find((m) => m.name.toLowerCase() === ni.name.toLowerCase() && m.unit === ni.unit && !m.checked);
        if (existing) {
          existing.amount += ni.amount;
          existing.recipeName = existing.recipeName.includes(recipeName)
            ? existing.recipeName
            : `${existing.recipeName}, ${recipeName}`;
        } else {
          merged.push(ni);
        }
      });
      AsyncStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryItems((prev) => {
      const updated = prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
      AsyncStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeGroceryItem = useCallback((id: string) => {
    setGroceryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      AsyncStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearGrocery = useCallback(() => {
    setGroceryItems([]);
    AsyncStorage.setItem(STORAGE_KEYS.GROCERY, JSON.stringify([]));
  }, []);

  const todayWater = waterEntries
    .filter((e) => e.date === today())
    .reduce((sum, e) => sum + e.amount, 0);

  const todaySteps = stepEntries.find((e) => e.date === today())?.steps ?? 0;

  const todayWorkouts = workoutLogs.filter((l) => l.date === today());
  const todayCaloriesBurned = todayWorkouts.reduce((s, l) => s + l.calories, 0);

  return {
    workoutLogs,
    waterEntries,
    stepEntries,
    savedRecipes,
    loaded,
    logWorkout,
    addWater,
    updateSteps,
    toggleSaveRecipe,
    isRecipeSaved,
    todayWater,
    todaySteps,
    todayCaloriesBurned,
    todayWorkouts,
    // Preferences
    themeMode,
    setThemeMode,
    defaultServings,
    setDefaultServings,
    unitSystem,
    setUnitSystem,
    // Grocery
    groceryItems,
    addRecipeToGrocery,
    toggleGroceryItem,
    removeGroceryItem,
    clearGrocery,
  };
}

export const [AppContextProvider, useApp] = createContextHook(useAppState);
