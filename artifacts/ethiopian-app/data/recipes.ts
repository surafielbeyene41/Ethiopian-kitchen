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
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  amharic: string;
  imageUri: any;
  category: "bread" | "stew" | "meat" | "vegetarian" | "drink";
  difficulty: "easy" | "medium" | "hard";
  time: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  description: string;
  culturalInsight: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];
  color: string;
  pairsWith?: string[];
}

export const RECIPES: Recipe[] = [
  {
    id: "injera",
    name: "Injera",
    amharic: "እንጀራ",
    imageUri: require("../assets/images/injera.png"),
    category: "bread",
    difficulty: "hard",
    time: 180,
    servings: 8,
    calories: 124,
    protein: 4,
    carbs: 24,
    fat: 1,
    fiber: 3,
    description: "Ethiopia's staple sourdough flatbread made from teff flour, with a unique spongy texture and slightly sour taste. Injera serves as both food and utensil.",
    culturalInsight: "Injera is more than food — it's a symbol of community. The act of eating from the same injera plate represents togetherness and trust. In Ethiopia, refusing to eat from someone's injera is considered deeply offensive. This ancient bread has been made the same way for over 5,000 years, pre-dating many of the world's great civilizations.",
    tags: ["Gluten-Free", "Vegan", "Fermented", "High-Fiber"],
    color: "#8D6E63",
    pairsWith: ["doro-wat", "shiro-wat", "tibs", "gomen"],
    ingredients: [
      { name: "Teff flour", amount: 2, unit: "cups" },
      { name: "Water (for batter)", amount: 2.5, unit: "cups" },
      { name: "Water (for absit)", amount: 0.5, unit: "cups" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Mix the batter", description: "Combine teff flour with 2.5 cups of water in a large bowl and whisk until completely smooth. No lumps should remain.", duration: "10 min", tip: "Use room temperature water for best fermentation results." },
      { step: 2, title: "Ferment", description: "Cover the bowl with a clean cloth and leave at room temperature for 2–3 days. You'll see bubbles form and the smell will become pleasantly sour.", duration: "2-3 days", tip: "Warmer rooms (above 70°F/21°C) ferment faster. Taste daily — it's ready when pleasantly tangy." },
      { step: 3, title: "Make absit (starter)", description: "Remove 0.5 cups of batter. Cook it with 0.5 cups water over medium heat, stirring constantly until it thickens into a paste. Let cool completely.", duration: "10 min", tip: "The absit gives injera its signature flavor and helps it spread evenly." },
      { step: 4, title: "Combine and rest", description: "Stir cooled absit back into the fermented batter. Cover and let rest for 30 minutes to 1 hour.", duration: "30-60 min" },
      { step: 5, title: "Prepare the skillet", description: "Heat a large non-stick skillet or mitad over medium-high heat. The pan must be very hot before cooking — test by flicking a drop of water (it should sizzle and evaporate instantly).", duration: "5 min" },
      { step: 6, title: "Cook the injera", description: "Pour a ladleful of batter starting from the outer edge, moving in a spiral to the center. Swirl pan quickly to spread. Cover with a lid and cook for 1.5–2 minutes until the surface is completely dry and holes form throughout.", duration: "2 min per piece", tip: "Never flip injera! It cooks from the steam only." },
      { step: 7, title: "Rest and serve", description: "Slide injera onto a cloth-lined plate using a spatula. Stack with a cloth between pieces to prevent sticking. Serve with various stews spooned on top.", duration: "5 min" },
    ],
  },
  {
    id: "doro-wat",
    name: "Doro Wat",
    amharic: "ዶሮ ወጥ",
    imageUri: require("../assets/images/doro-wat.png"),
    category: "stew",
    difficulty: "medium",
    time: 90,
    servings: 4,
    calories: 320,
    protein: 28,
    carbs: 12,
    fat: 18,
    fiber: 3,
    description: "Ethiopia's most celebrated dish — a rich, deeply spiced chicken stew simmered with berbere spice blend and niter kibbeh clarified butter. A festive staple.",
    culturalInsight: "Doro Wat is traditionally served at celebrations, including Ethiopian Christmas (Genna) and Easter (Fasika). It is said that the quality of a cook is judged by their Doro Wat. The deep red color from berbere represents prosperity and good fortune. Orthodox families prepare it after fasting periods, making the first taste an intensely anticipated moment.",
    tags: ["Spicy", "High-Protein", "Festive", "Gluten-Free"],
    color: "#C8102E",
    pairsWith: ["injera"],
    ingredients: [
      { name: "Chicken pieces (skin removed)", amount: 1, unit: "kg" },
      { name: "Red onions (finely chopped)", amount: 4, unit: "large" },
      { name: "Berbere spice blend", amount: 4, unit: "tbsp" },
      { name: "Niter kibbeh", amount: 4, unit: "tbsp" },
      { name: "Garlic cloves (minced)", amount: 6, unit: "cloves" },
      { name: "Fresh ginger (grated)", amount: 2, unit: "tsp" },
      { name: "Hard-boiled eggs (scored)", amount: 4, unit: "whole" },
      { name: "Cardamom (korerima)", amount: 0.5, unit: "tsp" },
      { name: "Salt", amount: 1, unit: "tsp" },
      { name: "Water or chicken stock", amount: 1, unit: "cups" },
    ],
    steps: [
      { step: 1, title: "Score the chicken", description: "Using a sharp knife, make 3–4 deep cuts through each piece of chicken. This allows the sauce to penetrate the meat deeply.", duration: "5 min", tip: "Also prick eggs all over with a fork before boiling for better flavor absorption." },
      { step: 2, title: "Caramelize onions (dry)", description: "In a large heavy pot, cook finely chopped red onions WITHOUT any oil over low-medium heat. Stir constantly every few minutes for 30 minutes until golden, sweet, and jammy.", duration: "30 min", tip: "This is the most critical step — the dry caramelization creates the depth of flavor. Don't rush it and don't add oil yet." },
      { step: 3, title: "Add niter kibbeh", description: "Add niter kibbeh to the caramelized onions. Stir well to coat the onions in the spiced butter.", duration: "2 min" },
      { step: 4, title: "Build the sauce", description: "Add berbere, garlic, ginger, and korerima. Stir constantly on medium heat for 10 minutes. The sauce will turn deep red and incredibly fragrant.", duration: "10 min", tip: "The berbere needs to 'bloom' in the fat to release its full flavor and color." },
      { step: 5, title: "Brown the chicken", description: "Add chicken pieces and stir thoroughly to coat with the sauce. Cook for 8–10 minutes, turning occasionally.", duration: "10 min" },
      { step: 6, title: "Simmer", description: "Add water or stock, bring to boil, then reduce to low heat. Cover and simmer for 30–35 minutes until chicken is tender and sauce has thickened beautifully.", duration: "30 min", tip: "The sauce should be thick enough to coat the back of a spoon." },
      { step: 7, title: "Add eggs and finish", description: "Add the scored hard-boiled eggs. Simmer uncovered for 5 more minutes, spooning sauce over eggs. Adjust salt. Serve over injera.", duration: "5 min" },
    ],
  },
  {
    id: "kitfo",
    name: "Kitfo",
    amharic: "ክትፎ",
    imageUri: require("../assets/images/kitfo.png"),
    category: "meat",
    difficulty: "easy",
    time: 20,
    servings: 2,
    calories: 290,
    protein: 32,
    carbs: 2,
    fat: 17,
    fiber: 0,
    description: "Ethiopian-style beef tartare seasoned with mitmita spice and niter kibbeh. Served raw (tire), slightly cooked (leb leb), or fully cooked (betam leb leb).",
    culturalInsight: "Kitfo is considered a delicacy and the ultimate sign of generosity and hospitality. Serving it to a guest represents one of the highest honors a host can bestow. It originates from the Gurage people of central Ethiopia, who are famous for their culinary traditions. At weddings and major celebrations, running out of kitfo would be considered a serious social failure.",
    tags: ["High-Protein", "Keto", "Traditional", "Low-Carb"],
    color: "#BF360C",
    pairsWith: ["injera"],
    ingredients: [
      { name: "Lean beef (very fresh, minced)", amount: 400, unit: "g" },
      { name: "Mitmita spice blend", amount: 2, unit: "tsp" },
      { name: "Niter kibbeh", amount: 3, unit: "tbsp" },
      { name: "Korerima (Ethiopian cardamom)", amount: 0.5, unit: "tsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
      { name: "Ayib (Ethiopian cottage cheese, to serve)", amount: 100, unit: "g" },
    ],
    steps: [
      { step: 1, title: "Source quality beef", description: "Use only very fresh, high-quality lean beef (ideally from a trusted butcher). Ask for it to be minced fresh, not pre-packaged.", duration: "—", tip: "Tenderloin or top round gives the best texture and flavor for kitfo." },
      { step: 2, title: "Mince finely", description: "If mincing at home, use a very sharp knife or food processor briefly. The texture should be fine but not paste-like.", duration: "10 min" },
      { step: 3, title: "Warm the niter kibbeh", description: "Gently melt niter kibbeh in a small pan over very low heat until just liquid. Do not overheat — it should be warm, not hot.", duration: "2 min" },
      { step: 4, title: "Season and mix", description: "Combine the beef with mitmita, korerima, salt, and warm niter kibbeh. Mix thoroughly by hand until everything is evenly incorporated.", duration: "3 min", tip: "For 'leb leb' (slightly cooked), briefly warm in a pan over low heat while stirring — 2-3 minutes only." },
      { step: 5, title: "Serve immediately", description: "Serve at once on injera with a generous portion of ayib (cottage cheese) alongside. Gomen (collard greens) is the traditional accompaniment.", duration: "2 min" },
    ],
  },
  {
    id: "shiro-wat",
    name: "Shiro Wat",
    amharic: "ሽሮ ወጥ",
    imageUri: require("../assets/images/shiro-wat.png"),
    category: "vegetarian",
    difficulty: "easy",
    time: 30,
    servings: 4,
    calories: 180,
    protein: 9,
    carbs: 28,
    fat: 5,
    fiber: 6,
    description: "A smooth, thick stew made from ground chickpea and bean flour seasoned with berbere and spices. A beloved everyday dish — quick, economical, and delicious.",
    culturalInsight: "Shiro is the cornerstone of Ethiopian fasting food (veganism practiced by Orthodox Christians, who fast about 200 days per year). On fasting days — Wednesday and Friday — shiro is served in virtually every home across Ethiopia. For millions, it's a daily staple. Shiro powder can be spiced or plain, and each family has their own preferred blend.",
    tags: ["Vegan", "Fasting Food", "Quick", "Budget-Friendly", "High-Fiber"],
    color: "#F57F17",
    pairsWith: ["injera", "gomen"],
    ingredients: [
      { name: "Shiro powder (spiced chickpea flour)", amount: 1, unit: "cups" },
      { name: "Red onion", amount: 2, unit: "medium" },
      { name: "Berbere spice", amount: 2, unit: "tbsp" },
      { name: "Garlic cloves", amount: 3, unit: "cloves" },
      { name: "Vegetable oil or niter kibbeh", amount: 3, unit: "tbsp" },
      { name: "Water", amount: 2, unit: "cups" },
      { name: "Salt", amount: 1, unit: "tsp" },
      { name: "Fresh tomato (optional)", amount: 1, unit: "medium" },
    ],
    steps: [
      { step: 1, title: "Sauté onions", description: "Cook finely chopped red onions in oil over medium-low heat for 15 minutes, stirring frequently, until soft, translucent, and beginning to turn golden.", duration: "15 min", tip: "Patience here makes a big difference — undercooked onions make the stew bitter." },
      { step: 2, title: "Add spices", description: "Add berbere, minced garlic, and diced tomato if using. Stir well and cook for 3–4 minutes until fragrant and the fat turns red.", duration: "4 min" },
      { step: 3, title: "Add water", description: "Pour in the water and bring to a gentle simmer.", duration: "2 min" },
      { step: 4, title: "Whisk in shiro", description: "Gradually sprinkle in shiro powder while whisking constantly to prevent lumps. Add slowly — the mixture will thicken quickly.", duration: "3 min", tip: "Add shiro powder off the heat first, then return to heat for a smoother result." },
      { step: 5, title: "Simmer and finish", description: "Cook on low heat for 8–10 minutes, stirring frequently to prevent scorching on the bottom. The stew should be thick and smooth. Season with salt and serve on injera.", duration: "10 min" },
    ],
  },
  {
    id: "tibs",
    name: "Tibs",
    amharic: "ጥብስ",
    imageUri: require("../assets/images/tibs.png"),
    category: "meat",
    difficulty: "easy",
    time: 25,
    servings: 3,
    calories: 350,
    protein: 35,
    carbs: 6,
    fat: 21,
    fiber: 1,
    description: "Sautéed meat (beef or lamb) stir-fried with vegetables, rosemary, and spices. One of the most popular dishes in Ethiopian restaurants worldwide.",
    culturalInsight: "Tibs is often served in a sizzling clay pot called a mukecha and brought to the table still bubbling, creating an exciting dining experience. Different regions have their variations — Gored Gored (Addis Ababa style with raw cubed beef), Awaze Tibs (spicier, with awaze sauce), and Zilzil Tibs (strip-cut beef, usually from Addis restaurant culture).",
    tags: ["High-Protein", "Quick", "Crowd-Pleaser", "Gluten-Free"],
    color: "#4E342E",
    pairsWith: ["injera", "gomen"],
    ingredients: [
      { name: "Beef tenderloin or lamb", amount: 500, unit: "g" },
      { name: "Onion", amount: 1, unit: "large" },
      { name: "Tomatoes", amount: 2, unit: "medium" },
      { name: "Green jalapeño peppers", amount: 2, unit: "whole" },
      { name: "Niter kibbeh", amount: 2, unit: "tbsp" },
      { name: "Fresh rosemary", amount: 1, unit: "tbsp" },
      { name: "Awaze or berbere", amount: 1, unit: "tbsp" },
      { name: "Salt and black pepper", amount: 1, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Cut the meat", description: "Cut beef or lamb into bite-sized cubes (2–3 cm). Pat completely dry with paper towels — moisture prevents browning.", duration: "5 min", tip: "For Zilzil style, cut into long thin strips instead." },
      { step: 2, title: "Sear the meat", description: "Heat niter kibbeh in a heavy pan on high heat until smoking. Add meat in a single layer WITHOUT crowding. Do not stir for 2–3 minutes — let it form a crust.", duration: "5 min", tip: "Cook in batches if needed. Overcrowding causes steaming, not searing." },
      { step: 3, title: "Add vegetables", description: "Push meat to sides. Add onion wedges, tomato chunks, and whole jalapeños. Stir-fry everything together on high heat.", duration: "4 min" },
      { step: 4, title: "Season and finish", description: "Add awaze/berbere, fresh rosemary, salt, and pepper. Toss everything vigorously for 2 minutes. Serve sizzling on injera.", duration: "3 min", tip: "For extra smoky flavor, let the tibs sit undisturbed for 30 seconds after the last stir." },
    ],
  },
  {
    id: "gomen",
    name: "Gomen",
    amharic: "ጎመን",
    imageUri: require("../assets/images/gomen.png"),
    category: "vegetarian",
    difficulty: "easy",
    time: 30,
    servings: 4,
    calories: 85,
    protein: 4,
    carbs: 10,
    fat: 4,
    fiber: 5,
    description: "Slow-cooked Ethiopian-spiced collard greens with garlic, ginger, and onions. A perfect nutritious side dish served alongside almost every Ethiopian meal.",
    culturalInsight: "Gomen has been cultivated in the Ethiopian highlands for centuries and is one of the oldest vegetables in continuous cultivation. Rich in iron, calcium, and vitamins A and K, it was long recognized as a medicine food by Ethiopian healers. During fasting periods, gomen provides essential nutrients that might otherwise be missed. It is also said to have spiritual significance in some Ethiopian traditions.",
    tags: ["Vegan", "Fasting Food", "Iron-Rich", "Nutrient-Dense", "Keto"],
    color: "#2E7D32",
    pairsWith: ["injera", "kitfo", "tibs"],
    ingredients: [
      { name: "Collard greens or kale", amount: 500, unit: "g" },
      { name: "Red or white onion", amount: 1, unit: "large" },
      { name: "Garlic cloves", amount: 4, unit: "cloves" },
      { name: "Fresh ginger", amount: 1, unit: "tsp" },
      { name: "Jalapeño (optional)", amount: 1, unit: "whole" },
      { name: "Vegetable oil", amount: 2, unit: "tbsp" },
      { name: "Salt", amount: 0.5, unit: "tsp" },
    ],
    steps: [
      { step: 1, title: "Prepare the greens", description: "Wash collard greens thoroughly in cold water. Remove and discard tough stems. Stack leaves and slice into thin ribbons (chiffonade).", duration: "10 min", tip: "For more tender gomen, blanch the greens in boiling salted water for 2 minutes before sautéing." },
      { step: 2, title: "Cook onions", description: "Sauté sliced onions in oil over medium heat for 8–10 minutes until softened and beginning to color.", duration: "10 min" },
      { step: 3, title: "Add aromatics", description: "Add minced garlic, ginger, and sliced jalapeño. Stir and cook for 2–3 minutes until fragrant.", duration: "3 min" },
      { step: 4, title: "Add greens and cook", description: "Add the collard greens and toss well to coat with the onion mixture. Cover with a lid and cook on medium-low heat for 15 minutes, stirring occasionally.", duration: "15 min", tip: "A splash of water (2-3 tbsp) helps steam the greens if the pan looks dry." },
      { step: 5, title: "Season and serve", description: "Season with salt. The greens should be tender but retain a slight bite. Serve as a side dish on injera.", duration: "2 min" },
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

export type UnitSystem = "metric" | "imperial";

export const UNIT_CONVERSIONS: Record<string, { metric: string; imperial: string; factor: number }> = {
  cups: { metric: "ml", imperial: "cups", factor: 240 },
  tbsp: { metric: "ml", imperial: "tbsp", factor: 15 },
  tsp: { metric: "ml", imperial: "tsp", factor: 5 },
  g: { metric: "g", imperial: "oz", factor: 28.35 },
  kg: { metric: "kg", imperial: "lb", factor: 0.453592 },
  ml: { metric: "ml", imperial: "fl oz", factor: 29.574 },
  whole: { metric: "whole", imperial: "whole", factor: 1 },
  large: { metric: "large", imperial: "large", factor: 1 },
  medium: { metric: "medium", imperial: "medium", factor: 1 },
  cloves: { metric: "cloves", imperial: "cloves", factor: 1 },
};

export function convertIngredient(
  amount: number,
  unit: string,
  system: UnitSystem,
  recipeServings: number,
  targetServings: number
): { value: string; unit: string } {
  const scaledAmount = (amount * targetServings) / recipeServings;
  const conv = UNIT_CONVERSIONS[unit];

  if (!conv || unit === "whole" || unit === "large" || unit === "medium" || unit === "cloves") {
    const val = scaledAmount === Math.floor(scaledAmount) ? String(scaledAmount) : scaledAmount.toFixed(1);
    return { value: val, unit };
  }

  if (system === "imperial") {
    const converted = scaledAmount / conv.factor;
    return {
      value: converted < 1 ? converted.toFixed(2) : converted % 1 === 0 ? String(Math.round(converted)) : converted.toFixed(1),
      unit: conv.imperial,
    };
  }

  if (unit === "cups" || unit === "tbsp" || unit === "tsp") {
    const ml = scaledAmount * conv.factor;
    return { value: ml % 1 === 0 ? String(ml) : ml.toFixed(0), unit: "ml" };
  }

  if (unit === "kg") {
    return { value: String(scaledAmount), unit: "kg" };
  }

  const val = scaledAmount === Math.floor(scaledAmount) ? String(scaledAmount) : scaledAmount.toFixed(1);
  return { value: val, unit: conv.metric };
}
