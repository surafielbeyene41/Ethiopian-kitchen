export interface Exercise {
  id: string;
  name: string;
  amharic?: string;
  category: "cardio" | "strength" | "flexibility" | "traditional";
  duration: number;
  calories: number;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  icon: string;
  equipment: string;
  sets?: number;
  reps?: number;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: {
    time: "breakfast" | "lunch" | "dinner" | "snack";
    dish: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
  goal: "weight-loss" | "muscle-gain" | "maintenance" | "fasting";
}

export const EXERCISES: Exercise[] = [
  {
    id: "injera-walk",
    name: "Highland Walk",
    amharic: "የኢትዮጵያ ሄደት",
    category: "cardio",
    duration: 30,
    calories: 180,
    level: "beginner",
    description: "A brisk walk inspired by Ethiopian highland terrain. Walk at a steady pace uphill if possible.",
    icon: "navigation",
    equipment: "None",
  },
  {
    id: "coffee-ceremony-squat",
    name: "Coffee Ceremony Squats",
    category: "strength",
    duration: 15,
    calories: 120,
    level: "beginner",
    description: "Bodyweight squats performed in the rhythm of Ethiopian coffee ceremony — slow and deliberate.",
    icon: "arrow-down-circle",
    equipment: "None",
    sets: 3,
    reps: 15,
  },
  {
    id: "teff-carry",
    name: "Teff Farmer Carry",
    category: "strength",
    duration: 10,
    calories: 90,
    level: "intermediate",
    description: "Inspired by Ethiopian farmers carrying grain. Walk carrying weights at your sides for core and grip strength.",
    icon: "package",
    equipment: "Dumbbells",
  },
  {
    id: "addis-run",
    name: "Addis Interval Run",
    category: "cardio",
    duration: 25,
    calories: 280,
    level: "intermediate",
    description: "Interval training inspired by Ethiopian distance runners. Alternate between jogging and sprint intervals.",
    icon: "activity",
    equipment: "None",
  },
  {
    id: "eskista-dance",
    name: "Eskista Dance",
    amharic: "እስክስታ",
    category: "traditional",
    duration: 20,
    calories: 160,
    level: "beginner",
    description: "Traditional Ethiopian dance featuring shoulder and chest movements. Excellent cardio with cultural connection.",
    icon: "music",
    equipment: "None",
  },
  {
    id: "plank-berbere",
    name: "Berbere Plank",
    category: "strength",
    duration: 10,
    calories: 70,
    level: "intermediate",
    description: "Core-strengthening plank variations. Hold each position for the duration it takes to say 'berbere' 10 times.",
    icon: "minus",
    equipment: "Mat",
    sets: 3,
    reps: 30,
  },
  {
    id: "stretching",
    name: "Morning Stretch",
    category: "flexibility",
    duration: 15,
    calories: 50,
    level: "beginner",
    description: "Full body flexibility routine perfect for morning or post-workout recovery.",
    icon: "sun",
    equipment: "Mat",
  },
  {
    id: "push-ups",
    name: "Power Push-Ups",
    category: "strength",
    duration: 12,
    calories: 100,
    level: "intermediate",
    description: "Standard push-ups with variations for chest, shoulders, and triceps.",
    icon: "chevrons-up",
    equipment: "None",
    sets: 4,
    reps: 15,
  },
];

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "traditional-balanced",
    name: "Traditional Ethiopian Diet",
    description: "A balanced meal plan using traditional Ethiopian foods providing optimal nutrition",
    goal: "maintenance",
    totalCalories: 1900,
    meals: [
      { time: "breakfast", dish: "Firfir with leftover injera & coffee", calories: 320, protein: 8, carbs: 52, fat: 9 },
      { time: "lunch", dish: "Shiro Wat with injera (2 pieces)", calories: 480, protein: 14, carbs: 76, fat: 12 },
      { time: "snack", dish: "Roasted barley (kolo) & tej (honey wine)", calories: 220, protein: 5, carbs: 38, fat: 4 },
      { time: "dinner", dish: "Tibs with gomen & 1 injera", calories: 620, protein: 42, carbs: 28, fat: 38 },
    ],
  },
  {
    id: "fasting-plan",
    name: "Fasting Day Plan",
    description: "Ethiopian Orthodox fasting diet — completely vegan and nutritionally complete",
    goal: "fasting",
    totalCalories: 1500,
    meals: [
      { time: "breakfast", dish: "Genfo (barley porridge) with flaxseed", calories: 280, protein: 6, carbs: 52, fat: 7 },
      { time: "lunch", dish: "Misir Wat (red lentil stew) with 2 injera", calories: 440, protein: 18, carbs: 70, fat: 10 },
      { time: "snack", dish: "Kolo & fresh fruit", calories: 200, protein: 4, carbs: 38, fat: 4 },
      { time: "dinner", dish: "Ye'abesha Gomen & Atkilt Wat with injera", calories: 380, protein: 12, carbs: 60, fat: 10 },
    ],
  },
  {
    id: "athlete-plan",
    name: "Ethiopian Athlete Plan",
    description: "High-protein plan inspired by Ethiopian marathon runners for performance",
    goal: "muscle-gain",
    totalCalories: 2600,
    meals: [
      { time: "breakfast", dish: "Firfir with eggs & avocado", calories: 520, protein: 22, carbs: 48, fat: 28 },
      { time: "lunch", dish: "Doro Wat with 2 injera & ayib", calories: 780, protein: 52, carbs: 60, fat: 35 },
      { time: "snack", dish: "Kolo mix & banana", calories: 320, protein: 10, carbs: 55, fat: 8 },
      { time: "dinner", dish: "Kitfo with gomen & injera", calories: 680, protein: 58, carbs: 32, fat: 38 },
    ],
  },
];

export const WATER_GOAL_ML = 2500;
export const STEP_GOAL = 8000;
