export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Recipe {
  id: string;
  name: string;
  amharic: string;
  category: "bread" | "stew" | "meat" | "vegetarian" | "drink";
  difficulty: "easy" | "medium" | "hard";
  time: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  culturalInsight: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];
  color: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "injera",
    name: "Injera",
    amharic: "እንጀራ",
    category: "bread",
    difficulty: "hard",
    time: 180,
    servings: 8,
    calories: 124,
    protein: 4,
    carbs: 24,
    fat: 1,
    description: "Ethiopia's staple sourdough flatbread made from teff flour, with a unique spongy texture and slightly sour taste. Injera serves as both food and utensil.",
    culturalInsight: "Injera is more than food — it's a symbol of community. The act of eating from the same injera plate represents togetherness and trust. It has been made the same way for over 5,000 years.",
    tags: ["Gluten-Free", "Vegan", "Fermented"],
    color: "#8D6E63",
    ingredients: [
      { name: "Teff flour", amount: 2, unit: "cups" },
      { name: "Water", amount: 3, unit: "cups" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Mix the batter", description: "Combine teff flour with 2.5 cups of water and mix until smooth. No lumps should remain.", duration: "10 min" },
      { step: 2, title: "Ferment", description: "Cover with a clean cloth and leave at room temperature for 2–3 days until bubbles form and the smell is slightly sour.", duration: "2-3 days" },
      { step: 3, title: "Prepare the skillet", description: "Heat a non-stick skillet or mitad (injera pan) over medium-high heat. It should be very hot.", duration: "5 min" },
      { step: 4, title: "Cook the injera", description: "Pour the batter in a spiral motion from outside to center. Cover and cook for 2 minutes until holes form and edges lift.", duration: "2 min per piece" },
      { step: 5, title: "Rest and serve", description: "Remove with a spatula and stack on a plate lined with a cloth. Serve with various stews on top.", duration: "5 min" },
    ],
  },
  {
    id: "doro-wat",
    name: "Doro Wat",
    amharic: "ዶሮ ወጥ",
    category: "stew",
    difficulty: "medium",
    time: 90,
    servings: 4,
    calories: 320,
    protein: 28,
    carbs: 12,
    fat: 18,
    description: "Ethiopia's most celebrated dish — a rich, deeply spiced chicken stew simmered with berbere spice blend and niter kibbeh clarified butter. A festive staple.",
    culturalInsight: "Doro Wat is traditionally served at celebrations, including Ethiopian Christmas (Genna) and Easter (Fasika). Preparing it is an act of love — it takes hours of slow cooking and patience.",
    tags: ["Spicy", "High-Protein", "Festive"],
    color: "#C8102E",
    ingredients: [
      { name: "Chicken pieces", amount: 1, unit: "kg" },
      { name: "Red onions", amount: 4, unit: "large" },
      { name: "Berbere spice", amount: 4, unit: "tbsp" },
      { name: "Niter kibbeh", amount: 4, unit: "tbsp" },
      { name: "Garlic cloves", amount: 6, unit: "cloves" },
      { name: "Ginger", amount: 2, unit: "tsp" },
      { name: "Hard-boiled eggs", amount: 4, unit: "whole" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Caramelize onions", description: "Cook finely chopped red onions dry (without oil) over low heat, stirring constantly for 30 minutes until golden and sweet.", duration: "30 min" },
      { step: 2, title: "Add niter kibbeh", description: "Add niter kibbeh to the caramelized onions and stir to combine.", duration: "2 min" },
      { step: 3, title: "Add berbere", description: "Stir in berbere spice, garlic, and ginger. Cook on medium heat for 10 minutes until fragrant.", duration: "10 min" },
      { step: 4, title: "Add chicken", description: "Add scored chicken pieces and cook, stirring to coat with the spice mixture.", duration: "10 min" },
      { step: 5, title: "Simmer", description: "Add a cup of water, cover, and simmer for 30 minutes until chicken is tender and sauce thickens.", duration: "30 min" },
      { step: 6, title: "Add eggs and serve", description: "Add scored hard-boiled eggs and simmer for 5 more minutes. Serve on injera.", duration: "5 min" },
    ],
  },
  {
    id: "kitfo",
    name: "Kitfo",
    amharic: "ክትፎ",
    category: "meat",
    difficulty: "easy",
    time: 20,
    servings: 2,
    calories: 290,
    protein: 32,
    carbs: 2,
    fat: 17,
    description: "Ethiopian-style beef tartare seasoned with mitmita spice and niter kibbeh. Served raw (tire), slightly cooked (leb leb), or fully cooked (betam leb leb).",
    culturalInsight: "Kitfo is considered a delicacy and sign of generosity. Serving it to a guest is one of the highest honors. It originates from the Gurage people of central Ethiopia.",
    tags: ["High-Protein", "Keto", "Traditional"],
    color: "#BF360C",
    ingredients: [
      { name: "Lean beef (minced)", amount: 400, unit: "g" },
      { name: "Mitmita spice", amount: 2, unit: "tsp" },
      { name: "Niter kibbeh", amount: 3, unit: "tbsp" },
      { name: "Korerima (cardamom)", amount: 0.5, unit: "tsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Prepare beef", description: "Finely mince fresh lean beef. For safety, use very fresh beef from a trusted source.", duration: "10 min" },
      { step: 2, title: "Warm niter kibbeh", description: "Gently warm niter kibbeh until just melted, being careful not to overheat.", duration: "2 min" },
      { step: 3, title: "Season", description: "Mix beef with mitmita, korerima, salt, and the melted niter kibbeh.", duration: "3 min" },
      { step: 4, title: "Serve", description: "Serve immediately on injera with ayib (cottage cheese) and gomen (collard greens).", duration: "2 min" },
    ],
  },
  {
    id: "shiro-wat",
    name: "Shiro Wat",
    amharic: "ሽሮ ወጥ",
    category: "vegetarian",
    difficulty: "easy",
    time: 30,
    servings: 4,
    calories: 180,
    protein: 9,
    carbs: 28,
    fat: 5,
    description: "A smooth, thick stew made from ground chickpea and bean flour seasoned with berbere and spices. A beloved everyday dish — quick, economical, and delicious.",
    culturalInsight: "Shiro is the cornerstone of Ethiopian fasting food (veganism practiced by Orthodox Christians). On fasting days — Wednesday and Friday — shiro is served in virtually every home.",
    tags: ["Vegan", "Fasting", "Quick", "Budget-Friendly"],
    color: "#F57F17",
    ingredients: [
      { name: "Shiro powder (chickpea flour)", amount: 1, unit: "cup" },
      { name: "Red onion", amount: 2, unit: "medium" },
      { name: "Berbere spice", amount: 2, unit: "tbsp" },
      { name: "Garlic", amount: 3, unit: "cloves" },
      { name: "Vegetable oil", amount: 3, unit: "tbsp" },
      { name: "Water", amount: 2, unit: "cups" },
      { name: "Salt", amount: 1, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Sauté onions", description: "Cook finely chopped onions in oil over medium heat for 15 minutes until soft and golden.", duration: "15 min" },
      { step: 2, title: "Add spices", description: "Add berbere and garlic, cook for 3 minutes.", duration: "3 min" },
      { step: 3, title: "Add shiro", description: "Gradually pour in water and whisk in shiro powder to avoid lumps. Stir constantly.", duration: "5 min" },
      { step: 4, title: "Simmer and serve", description: "Simmer on low heat for 10 minutes, stirring frequently. Season with salt. Serve on injera.", duration: "10 min" },
    ],
  },
  {
    id: "tibs",
    name: "Tibs",
    amharic: "ጥብስ",
    category: "meat",
    difficulty: "easy",
    time: 25,
    servings: 3,
    calories: 350,
    protein: 35,
    carbs: 6,
    fat: 21,
    description: "Sautéed meat (beef or lamb) stir-fried with vegetables, rosemary, and spices. One of the most popular dishes in Ethiopian restaurants worldwide.",
    culturalInsight: "Tibs is often served in a sizzling clay pot called a mukecha. Different regions have their own style — Gored Gored (cubed raw beef) is the Addis Ababa version.",
    tags: ["High-Protein", "Quick", "Crowd-Pleaser"],
    color: "#4E342E",
    ingredients: [
      { name: "Beef or lamb", amount: 500, unit: "g" },
      { name: "Onion", amount: 1, unit: "large" },
      { name: "Tomatoes", amount: 2, unit: "medium" },
      { name: "Green peppers", amount: 2, unit: "whole" },
      { name: "Niter kibbeh", amount: 2, unit: "tbsp" },
      { name: "Rosemary", amount: 1, unit: "tbsp" },
      { name: "Awaze or berbere", amount: 1, unit: "tbsp" },
    ],
    steps: [
      { step: 1, title: "Cut meat", description: "Cut beef or lamb into bite-sized cubes. Pat dry.", duration: "5 min" },
      { step: 2, title: "Sear meat", description: "Heat niter kibbeh in a pan on high heat. Add meat and sear without stirring for 3 minutes.", duration: "3 min" },
      { step: 3, title: "Add vegetables", description: "Add onions, tomatoes, and green peppers. Stir-fry on high heat.", duration: "5 min" },
      { step: 4, title: "Season and finish", description: "Add awaze, rosemary, and salt. Toss everything and cook for 2 more minutes.", duration: "5 min" },
    ],
  },
  {
    id: "gomen",
    name: "Gomen",
    amharic: "ጎመን",
    category: "vegetarian",
    difficulty: "easy",
    time: 30,
    servings: 4,
    calories: 85,
    protein: 4,
    carbs: 10,
    fat: 4,
    description: "Slow-cooked Ethiopian-spiced collard greens with garlic, ginger, and onions. A perfect nutritious side dish served alongside almost every Ethiopian meal.",
    culturalInsight: "Gomen has been cultivated in the Ethiopian highlands for centuries. It is rich in iron and vitamins, making it an essential part of the Ethiopian diet, especially during fasting periods.",
    tags: ["Vegan", "Fasting", "Iron-Rich", "Nutritious"],
    color: "#2E7D32",
    ingredients: [
      { name: "Collard greens", amount: 500, unit: "g" },
      { name: "Onion", amount: 1, unit: "large" },
      { name: "Garlic", amount: 4, unit: "cloves" },
      { name: "Ginger", amount: 1, unit: "tsp" },
      { name: "Jalapeño", amount: 1, unit: "whole" },
      { name: "Vegetable oil", amount: 2, unit: "tbsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Prep greens", description: "Wash collard greens and chop into thin strips, removing tough stems.", duration: "10 min" },
      { step: 2, title: "Cook onions", description: "Sauté onions in oil over medium heat for 8 minutes until translucent.", duration: "8 min" },
      { step: 3, title: "Add aromatics", description: "Add garlic, ginger, and jalapeño. Cook for 2 minutes.", duration: "2 min" },
      { step: 4, title: "Cook greens", description: "Add collard greens, toss to coat. Cover and cook for 15 minutes until tender.", duration: "15 min" },
    ],
  },
];

export const CATEGORIES = [
  { id: "all", label: "All", icon: "grid" },
  { id: "bread", label: "Bread", icon: "layers" },
  { id: "stew", label: "Stew", icon: "thermometer" },
  { id: "meat", label: "Meat", icon: "zap" },
  { id: "vegetarian", label: "Vegan", icon: "feather" },
];
