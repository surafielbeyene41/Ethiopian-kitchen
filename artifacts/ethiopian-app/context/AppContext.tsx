import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";

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

const STORAGE_KEYS = {
  WORKOUTS: "workouts_log",
  WATER: "water_log",
  STEPS: "steps_log",
  SAVED_RECIPES: "saved_recipes",
};

const today = () => new Date().toISOString().split("T")[0];

function useAppState() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [stepEntries, setStepEntries] = useState<StepEntry[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [workouts, water, steps, recipes] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS),
          AsyncStorage.getItem(STORAGE_KEYS.WATER),
          AsyncStorage.getItem(STORAGE_KEYS.STEPS),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES),
        ]);
        if (workouts) setWorkoutLogs(JSON.parse(workouts));
        if (water) setWaterEntries(JSON.parse(water));
        if (steps) setStepEntries(JSON.parse(steps));
        if (recipes) setSavedRecipes(JSON.parse(recipes));
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
  };
}

export const [AppContextProvider, useApp] = createContextHook(useAppState);
