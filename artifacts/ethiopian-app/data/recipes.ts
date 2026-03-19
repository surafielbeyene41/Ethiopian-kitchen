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
    description:
      "Ethiopia's staple sourdough flatbread made from teff flour, with a unique spongy texture and slightly sour taste. Injera serves as both food and utensil.",
    culturalInsight:
      "Injera is more than food — it's a symbol of community. The act of eating from the same injera plate represents togetherness and trust. In Ethiopia, refusing to eat from someone's injera is considered deeply offensive. This ancient bread has been made the same way for over 5,000 years, pre-dating many of the world's great civilizations.",
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
      {
        step: 1,
        title: "Choose & measure your teff",
        description:
          "Use 100% pure teff flour — brown teff produces the classic dark spongy injera, while ivory teff gives a milder, lighter result. Measure 2 cups into a large ceramic or glass bowl. Avoid metal bowls as they can interfere with fermentation.",
        duration: "5 min",
        tip: "Brown teff from Ethiopia is more aromatic and nutritious. Look for it at Ethiopian or health-food stores. Check the date — fresher flour ferments better.",
      },
      {
        step: 2,
        title: "Mix the batter",
        description:
          "Slowly pour 2.5 cups of room-temperature water into the teff flour while whisking continuously. Whisk vigorously in circular motions until the batter is completely smooth and lump-free. The consistency should resemble thin pancake batter — pourable but not watery.",
        duration: "10 min",
        tip: "Use room-temperature or slightly warm water (not cold). Cold water slows fermentation dramatically. If you have lumps, strain the batter through a fine-mesh sieve.",
      },
      {
        step: 3,
        title: "Begin fermentation",
        description:
          "Cover the bowl loosely with a clean kitchen cloth — not an airtight lid, as the fermentation process releases CO₂ gas and needs to breathe. Place the bowl in a warm spot (ideally 70–80°F / 21–27°C). Leave undisturbed for 2–3 full days. You'll see bubbles form on the surface and the smell will evolve from earthy to pleasantly sour.",
        duration: "2–3 days",
        tip: "In summer or warm kitchens, fermentation takes 2 days. In cooler environments, allow 3 days. A slightly sour, yeasty smell is exactly what you want — it means the natural wild yeasts are thriving.",
      },
      {
        step: 4,
        title: "Check fermentation",
        description:
          "After 2–3 days, taste a small amount of batter. It should have a distinct, pleasant sourness — similar to buttermilk or sourdough. You'll also notice the liquid on top has separated slightly. Stir the batter gently and check the surface for small active bubbles, which confirm successful fermentation.",
        duration: "2 min",
        tip: "If it isn't sour enough after 3 days, leave it one more day. If it smells sharp or unpleasant (not sour), discard and start fresh — the environment was too warm or contaminated.",
      },
      {
        step: 5,
        title: "Make the absit (cooked starter)",
        description:
          "Remove ½ cup of the fermented batter and combine it with ½ cup fresh water in a small saucepan. Cook over medium heat, stirring constantly with a wooden spoon or silicone spatula. The mixture will thicken into a smooth paste — this is called 'absit.' Continue stirring for 5–7 minutes until it pulls away from the sides of the pan. Remove from heat and allow it to cool completely to room temperature.",
        duration: "10 min",
        tip: "The absit is the secret to perfect injera. It helps the batter spread evenly and creates the characteristic small bubbles (eyes) on the surface. Do not skip this step.",
      },
      {
        step: 6,
        title: "Combine and final rest",
        description:
          "Stir the cooled absit thoroughly back into the main fermented batter until fully incorporated. Add the salt and stir again. Cover the bowl loosely and allow this combined batter to rest at room temperature for 30 minutes to 1 hour before cooking. The batter will become slightly more bubbly during this rest.",
        duration: "30–60 min",
        tip: "This resting stage allows the absit to fully integrate and the batter to come to cooking temperature. The batter should pour smoothly from a spoon — not too thick and not watery.",
      },
      {
        step: 7,
        title: "Heat the mitad (skillet)",
        description:
          "Heat a large non-stick skillet, flat griddle, or traditional clay mitad over medium-high heat. Allow the pan to heat for at least 4–5 minutes — it must be very hot before the first pour. Test readiness by flicking a few drops of water onto the surface: they should sizzle violently and evaporate within 1–2 seconds.",
        duration: "5 min",
        tip: "Never grease the pan. Injera requires a completely dry, hot surface. If the pan is too cool, the batter will stick. If too hot, the bottom will burn before the top dries.",
      },
      {
        step: 8,
        title: "Pour the batter in a spiral",
        description:
          "Hold the bowl over the center of the pan and pour a ladleful of batter starting at the outer rim, moving inward in a confident, steady spiral toward the center. You have only 3–4 seconds to do this before the batter sets — move quickly. If gaps appear, tilt the pan gently to let batter flow into them. Do NOT spread with a spatula.",
        duration: "30 sec",
        tip: "Think of pouring like drawing a snail shell — outer edge first, spiraling inward. Practice makes it perfect. Ethiopian grandmothers pour in one continuous fluid motion without stopping.",
      },
      {
        step: 9,
        title: "Steam cook (never flip!)",
        description:
          "Immediately place a domed lid over the pan. Cook on medium heat for 1.5 to 2 minutes without lifting the lid. Watch through the edge — the injera is done when: (1) the surface is completely dry with no shiny wet spots, (2) dozens of small holes ('eyes') have formed across the entire surface, and (3) the edges have curled slightly away from the pan.",
        duration: "2 min",
        tip: "Injera is NEVER flipped — it cooks entirely from the steam trapped under the lid. Lifting the lid early lets steam escape and ruins the texture. The holes are what give injera its beautiful spongy texture.",
      },
      {
        step: 10,
        title: "Remove and rest",
        description:
          "Slide a flat spatula under the injera from one edge, lifting carefully. Place it cooked-side up on a clean cloth or cooling rack. Allow it to cool for 3–4 minutes before stacking. Between each injera, place a clean cloth or parchment to prevent sticking. Repeat the cooking process for each injera, allowing the pan to reheat between pours.",
        duration: "5 min per piece",
        tip: "Freshly made injera stores well at room temperature for 2–3 days, wrapped in cloth. Do not refrigerate — it makes it dry and brittle. Injera tastes best at room temperature.",
      },
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
    description:
      "Ethiopia's most celebrated dish — a rich, deeply spiced chicken stew simmered with berbere spice blend and niter kibbeh clarified butter. A festive staple.",
    culturalInsight:
      "Doro Wat is traditionally served at celebrations including Ethiopian Christmas (Genna) and Easter (Fasika). It is said that the quality of a cook is judged by their Doro Wat. The deep red color from berbere represents prosperity and good fortune. Orthodox families prepare it after fasting periods, making the first taste an intensely anticipated moment.",
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
      {
        step: 1,
        title: "Prepare the chicken",
        description:
          "Remove all skin from the chicken pieces. Using a very sharp knife, make 3–4 deep cuts into each piece, cutting all the way to the bone. These cuts allow the berbere sauce to penetrate deeply during cooking, infusing every bite with flavor. Rinse each piece under cold water and pat completely dry with paper towels.",
        duration: "10 min",
        tip: "Bone-in pieces (thighs and drumsticks) give the best flavor as the marrow enriches the sauce. Boneless breast can be used but tends to dry out — add it in the last 15 minutes.",
      },
      {
        step: 2,
        title: "Marinate the chicken in lemon",
        description:
          "Place the scored chicken pieces in a bowl. Squeeze the juice of 1 lemon over the chicken, add a pinch of salt, and toss well to coat. Cover and let marinate for 15–20 minutes. This lemon bath helps tenderize the meat and removes any gamey odor — a traditional Ethiopian preparation step.",
        duration: "20 min",
        tip: "You can also use white wine vinegar instead of lemon. This step is optional but makes a noticeably better final dish. Do not marinate longer than 30 minutes or the texture changes.",
      },
      {
        step: 3,
        title: "Boil and score the eggs",
        description:
          "Place eggs in cold water, bring to a boil, then simmer for exactly 10 minutes. Transfer immediately to an ice bath to stop cooking. Peel carefully. Using the tip of a sharp knife or a fork, make 8–10 deep punctures all over each egg. These scores allow the stew sauce to soak into the eggs during the final simmer.",
        duration: "15 min",
        tip: "The scored eggs are one of the signature elements of Doro Wat. In Ethiopia, each guest traditionally receives one whole egg — it's considered a mark of honor and generosity.",
      },
      {
        step: 4,
        title: "Dry-caramelize the onions",
        description:
          "This is the most critical — and most Ethiopian — technique in this recipe. In a large, heavy-bottomed pot (no oil, no butter), add the finely chopped red onions. Cook over medium-low heat, stirring frequently with a wooden spoon. After 10 minutes they'll begin to soften. Continue for a total of 25–30 minutes until deep golden, sweet, and jammy — almost like a marmalade. The onions should reduce to about one-third of their original volume.",
        duration: "30 min",
        tip: "This dry-frying technique creates a deep caramelized sweetness that is impossible to achieve with oil-sautéed onions. Do not rush it, do not add liquid, and do not turn the heat up. This is what gives Doro Wat its legendary depth.",
      },
      {
        step: 5,
        title: "Add niter kibbeh",
        description:
          "Once the onions are beautifully caramelized, add the niter kibbeh (Ethiopian spiced clarified butter). Stir well to coat all the onions evenly. The butter will sizzle and the onions will absorb it, becoming glossy and even more fragrant. Cook together for 2–3 minutes.",
        duration: "3 min",
        tip: "Niter kibbeh is not regular butter — it is infused with cardamom, fenugreek, turmeric, and other spices. It is the soul of Ethiopian cooking. If unavailable, use clarified butter (ghee) with a pinch of turmeric as a substitute.",
      },
      {
        step: 6,
        title: "Bloom the berbere",
        description:
          "Add the berbere spice blend, minced garlic, grated ginger, and ground korerima (Ethiopian cardamom) to the pot. Stir constantly over medium heat for 10 full minutes. The mixture will turn a deep, vivid red. The berbere needs to cook in the fat to bloom — releasing its full color, aroma, and flavor. The kitchen will fill with an incredible fragrance.",
        duration: "10 min",
        tip: "If the mixture looks dry and begins to stick, add 2–3 tbsp of water and stir vigorously. This 'blooming' step is where most of the flavor complexity of Doro Wat is built. More berbere = more heat and depth.",
      },
      {
        step: 7,
        title: "Sear the chicken in the sauce",
        description:
          "Add the marinated chicken pieces to the pot. Using tongs or a spoon, turn each piece thoroughly to coat it in the deep red sauce. Cook on medium heat for 10 minutes, turning the pieces every 2–3 minutes. The chicken will start to change color from pink to a beautiful deep red as the berbere permeates the cuts.",
        duration: "10 min",
        tip: "Do not add water yet. Letting the chicken cook in the concentrated sauce at this stage builds a deeper, more complex flavor than adding liquid immediately.",
      },
      {
        step: 8,
        title: "Simmer to tenderness",
        description:
          "Add 1 cup of water or chicken stock to the pot. Stir well to incorporate. Bring to a boil, then reduce heat to low. Cover with a lid and simmer gently for 30–35 minutes, turning the chicken pieces once halfway through. The chicken is done when it's completely tender and pulling away from the bone, and the sauce has thickened to a rich, glossy consistency.",
        duration: "35 min",
        tip: "Check the pot every 10 minutes and stir to prevent the bottom from scorching. If the sauce thickens too much before the chicken is done, add ¼ cup of water at a time.",
      },
      {
        step: 9,
        title: "Add eggs and finish",
        description:
          "Nestle the scored hard-boiled eggs into the stew. Spoon the rich red sauce generously over each egg. Cook uncovered for 5 more minutes, gently turning the eggs once. Taste the sauce and adjust salt. The eggs will absorb the vivid red color and spiced flavor through their scored surfaces.",
        duration: "5 min",
        tip: "The sauce should be thick enough to coat the back of a spoon and hold its shape when dished onto injera. If it's too thin, cook uncovered on medium heat for 5 more minutes, stirring constantly.",
      },
      {
        step: 10,
        title: "Rest and serve",
        description:
          "Remove the pot from heat and allow the Doro Wat to rest for 5 minutes before serving. This resting time allows the flavors to meld and the sauce to settle. Serve hot over a large piece of injera, with the eggs arranged prominently. Traditionally, the stew is spooned onto a communal injera in the center of the table and everyone eats together.",
        duration: "5 min",
        tip: "Doro Wat tastes even better the next day as the flavors continue to develop overnight. Store in the refrigerator for up to 3 days and reheat gently, adding a splash of water.",
      },
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
    description:
      "Ethiopian-style beef tartare seasoned with mitmita spice and niter kibbeh. Served raw (tire), slightly cooked (leb leb), or fully cooked (betam leb leb).",
    culturalInsight:
      "Kitfo is considered a delicacy and the ultimate sign of generosity. Serving it to a guest is one of the highest honors a host can bestow. It originates from the Gurage people of central Ethiopia, who are famous for their culinary traditions. At weddings and celebrations, running out of kitfo would be considered a serious social failure.",
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
      {
        step: 1,
        title: "Select the right beef",
        description:
          "Visit a trusted butcher and ask for very fresh, lean beef — ideally tenderloin, top round, or sirloin. The beef must be purchased the same day it will be served. Explain to the butcher that you are making kitfo and ask them to mince it fresh — do not accept pre-packaged ground beef, which is less fresh and has different fat ratios.",
        duration: "—",
        tip: "The quality and freshness of the beef is everything in kitfo. No amount of seasoning can compensate for mediocre meat. In Addis Ababa, kitfo houses source their beef from specific trusted farms daily.",
      },
      {
        step: 2,
        title: "Chill the meat",
        description:
          "Keep the beef refrigerated until the last possible moment before mixing. Cold meat holds its texture better and is safer to handle. When ready, place the minced beef in a cold mixing bowl — you can even chill the bowl in the freezer for 10 minutes beforehand. Work quickly and efficiently.",
        duration: "10 min",
        tip: "Never let raw minced beef sit at room temperature for more than 20–30 minutes. Work in a cool kitchen and keep your hands cold by rinsing them under cold water between handling.",
      },
      {
        step: 3,
        title: "Prepare the mitmita",
        description:
          "Measure out the mitmita spice blend. Authentic mitmita contains Ethiopian bird's eye chili (ye'Ethiopia berbere), cardamom (korerima), cloves, and black cumin. It is hotter and more fragrant than berbere. Measure the korerima separately if using — its floral, citrusy aroma is the signature note of kitfo.",
        duration: "2 min",
        tip: "Mitmita is very hot — adjust the quantity based on your spice tolerance. Start with 1 tsp if you are sensitive to heat and increase from there. It can be found at Ethiopian grocery stores.",
      },
      {
        step: 4,
        title: "Warm the niter kibbeh",
        description:
          "Place the niter kibbeh in a small saucepan over the lowest possible heat. Warm it just until it becomes liquid and flows smoothly — this takes about 2 minutes. It should be warm to the touch, never hot or sizzling. Overheating the butter will cook the beef on contact, which you do not want for tire (raw) kitfo.",
        duration: "2 min",
        tip: "Test the temperature of the niter kibbeh on the inside of your wrist — like testing baby formula. It should feel comfortably warm, not hot. Properly warmed niter kibbeh coats the beef beautifully without cooking it.",
      },
      {
        step: 5,
        title: "Season and hand-mix",
        description:
          "Place the cold minced beef in the bowl. Sprinkle the mitmita, korerima, and salt evenly over the surface. Drizzle the warm niter kibbeh all over. Using clean hands, mix everything together with a kneading and folding motion — work gently but thoroughly until every strand of beef is coated in the spiced butter. The mixture will become glossy and deeply aromatic.",
        duration: "3 min",
        tip: "The mixing technique is important — don't overwork the meat or it becomes dense. Mix just until combined and the color is even. The warmth of your hands and the butter will help everything meld together perfectly.",
      },
      {
        step: 6,
        title: "Choose your doneness",
        description:
          "TIRE (Raw): Serve immediately as-is — this is the traditional, most prized way.\n\nLEB LEB (Slightly cooked): Transfer to a pan over very low heat. Stir gently for 2–3 minutes, just until the beef changes from bright red to light pink throughout. Remove from heat immediately.\n\nBETAM LEB LEB (Fully cooked): Cook on medium heat for 5–7 minutes, stirring frequently, until completely cooked through and crumbly.",
        duration: "0–7 min",
        tip: "Most kitfo served in restaurants is leb leb — slightly pink in the middle. If you are serving guests unfamiliar with raw meat, leb leb is the perfect compromise. Betam leb leb has the most flavors developed but loses the characteristic silky texture.",
      },
      {
        step: 7,
        title: "Make or prepare the ayib",
        description:
          "Ayib is Ethiopian fresh cottage cheese — mild, crumbly, and slightly tangy. It balances the heat of the mitmita perfectly. To make simple ayib: heat 1 liter of whole milk until nearly boiling, add juice of 1 lemon, stir once, and let curds form for 10 minutes. Drain through cheesecloth. Alternatively, use high-quality ricotta or farmer's cheese.",
        duration: "15 min",
        tip: "Ayib is always served alongside kitfo, never mixed into it. The interplay of the hot, buttery, spiced kitfo against the cool, neutral ayib is what makes this dish so special. Never skip it.",
      },
      {
        step: 8,
        title: "Plate and serve immediately",
        description:
          "Serve the kitfo at once — temperature and freshness are critical. Mound the kitfo in the center of a piece of injera. Place the ayib on one side and gomen (Ethiopian spiced collard greens) on the other. Garnish with a small amount of additional mitmita dusted on top. Fold a piece of injera like an envelope to scoop and eat everything together.",
        duration: "2 min",
        tip: "The classic Ethiopian way to eat kitfo is to tear a small piece of injera, fold it into a pocket shape, and use it to scoop kitfo, ayib, and gomen together in one bite. All three flavors together are extraordinary.",
      },
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
    description:
      "A smooth, thick stew made from ground chickpea and bean flour seasoned with berbere and spices. A beloved everyday dish — quick, economical, and delicious.",
    culturalInsight:
      "Shiro is the cornerstone of Ethiopian fasting food. Orthodox Christians fast approximately 200 days per year, avoiding all animal products. On fasting days — Wednesday and Friday — shiro is served in virtually every home. For millions of Ethiopians, it is a daily staple. Each family has their own preferred shiro blend, often a closely guarded recipe.",
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
      {
        step: 1,
        title: "Prepare your shiro powder",
        description:
          "Use spiced shiro powder (ye'mesir shiro or ye'shimbra shiro), which already contains turmeric, fenugreek, garlic, and berbere — not plain chickpea flour. If you can only find plain chickpea flour, mix 1 cup flour with 1 tsp berbere, ½ tsp turmeric, ½ tsp cumin, and a pinch of fenugreek to approximate the flavor.",
        duration: "2 min",
        tip: "There are several types of shiro: ye'mesir shiro (lentil-based, lighter), ye'shimbra shiro (chickpea-based, richer), and key shiro (already includes berbere). The spiced versions give the most complex result.",
      },
      {
        step: 2,
        title: "Finely chop the onions",
        description:
          "Peel and finely dice the red onions — aim for small pieces, about 3–4mm. For shiro, the onions need to melt completely into the sauce, so finer chopping gives a smoother final result. Place them in a heavy-bottomed pot or saucepan.",
        duration: "5 min",
        tip: "Using a food processor to pulse the onions 5–6 times gives perfectly fine, even pieces quickly. In Ethiopia, shiro makers traditionally chop onions paper-thin by hand.",
      },
      {
        step: 3,
        title: "Slow-cook the onions",
        description:
          "Heat the oil or niter kibbeh in the pot over medium-low heat. Add the finely chopped onions and cook slowly for 15–18 minutes, stirring every 2–3 minutes. The onions should gradually turn from white to translucent to a soft golden color. They should be completely soft, sweet, and nearly melting — not browned or crispy.",
        duration: "18 min",
        tip: "Patience here makes all the difference. Under-cooked onions create bitterness in the final stew. The onions are ready when they look almost transparent and have reduced to half their original volume.",
      },
      {
        step: 4,
        title: "Add garlic and berbere",
        description:
          "Add the minced garlic and berbere spice directly to the soft onions. Stir well and cook together for 3–4 minutes. If using fresh tomato, add it now (diced small) and cook until it breaks down completely, about 3 more minutes. The oil will turn a beautiful deep red as the berbere blooms in the fat.",
        duration: "4–6 min",
        tip: "Adding the garlic at this stage (not earlier) prevents it from burning, which would make the whole stew bitter. The tomato is optional but adds a pleasant tanginess and makes the sauce slightly lighter.",
      },
      {
        step: 5,
        title: "Add water and bring to simmer",
        description:
          "Measure 2 cups of water and pour it into the pot. Stir well to deglaze any bits stuck to the bottom. Bring the liquid to a gentle simmer over medium heat. The sauce will become a spiced, fragrant broth — this is the base that the shiro powder will be added to.",
        duration: "3 min",
        tip: "For a richer shiro, use vegetable stock instead of water. You can also add a spoonful of tomato paste at this stage for extra depth and color.",
      },
      {
        step: 6,
        title: "Whisk in the shiro powder",
        description:
          "Remove the pot from heat momentarily. Begin adding the shiro powder in a slow, steady stream while whisking continuously with the other hand. Pour in thin streams and whisk vigorously as you go — similar to making a roux. Once all the powder is incorporated and the mixture looks smooth and lump-free, return to low heat.",
        duration: "4 min",
        tip: "Adding all the shiro powder at once creates stubborn lumps that are very hard to remove. The off-heat technique gives you time to whisk without the stew cooking around the lumps. A balloon whisk works best.",
      },
      {
        step: 7,
        title: "Simmer and stir",
        description:
          "Cook on low heat for 8–10 minutes, stirring almost constantly with a wooden spoon or heat-proof spatula. The stew will thicken noticeably and the surface will begin to bubble gently. Make sure to scrape the bottom of the pot regularly to prevent scorching — shiro burns easily due to its high starch content.",
        duration: "10 min",
        tip: "The bubbling during cooking can cause small eruptions of hot stew — use a long-handled spoon and keep the heat low to avoid splatters. A slight splatter guard or partial lid can help.",
      },
      {
        step: 8,
        title: "Adjust consistency",
        description:
          "The finished shiro wat should be thick and creamy — like smooth hummus or a thick porridge. If it's too thick, add water a tablespoon at a time and stir in. If too thin, cook on medium heat a few minutes more, stirring continuously. The stew thickens further as it cools, so err slightly on the thinner side.",
        duration: "2 min",
        tip: "In Ethiopian restaurants, shiro is often served 'bubbling hot' in a small clay pot called a 'jicho.' If you have one, heat it over flame and transfer the shiro — it will continue bubbling at the table for a beautiful presentation.",
      },
      {
        step: 9,
        title: "Season and serve",
        description:
          "Taste the shiro and adjust salt as needed. Drizzle a teaspoon of additional oil or niter kibbeh over the top — this gives a glossy finish and extra richness. Serve immediately on a large piece of injera, spooning it in a generous mound. Accompany with gomen (collard greens) on the side.",
        duration: "2 min",
        tip: "A final swirl of good olive oil or a piece of niter kibbeh melting on top of the shiro is how many Ethiopian homes elevate this simple dish into something extraordinary. In Ethiopian fasting tradition, this would be done with olive or sunflower oil.",
      },
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
    description:
      "Sautéed meat (beef or lamb) stir-fried with vegetables, rosemary, and spices. One of the most popular dishes in Ethiopian restaurants worldwide.",
    culturalInsight:
      "Tibs is often served in a sizzling clay pot called a mukecha and brought to the table still bubbling. Different regions have their own variations: Gored Gored (raw cubed beef, Addis Ababa style), Awaze Tibs (with spicy awaze sauce), and Zilzil Tibs (long strips of beef).",
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
      {
        step: 1,
        title: "Choose and prepare the meat",
        description:
          "Select high-quality beef tenderloin or sirloin, or lamb shoulder. Trim away any large fat deposits or sinew, but leave some marbling — it adds flavor. Cut into uniform bite-sized cubes of about 2.5–3 cm. Consistent sizing ensures all pieces cook evenly at the same time.",
        duration: "8 min",
        tip: "For Zilzil-style tibs (the restaurant version), cut the meat into long thin strips instead of cubes — about 8cm long and 1cm thick. For Gored Gored (raw cubed beef), use the freshest possible beef and skip the cooking entirely, serving with awaze on the side.",
      },
      {
        step: 2,
        title: "Dry and season the meat",
        description:
          "After cutting, spread the meat cubes on a clean cutting board and pat thoroughly dry with paper towels. Press firmly — the drier the meat, the better the sear. Season generously with salt and freshly ground black pepper on all sides. Toss to coat evenly.",
        duration: "3 min",
        tip: "Moisture is the enemy of a good sear. Any water on the surface of the meat causes it to steam in the pan instead of developing the beautiful brown crust that gives tibs its character. This step makes a huge difference.",
      },
      {
        step: 3,
        title: "Heat the pan to very high heat",
        description:
          "Use a heavy cast-iron skillet, wok, or heavy-bottomed stainless steel pan — not non-stick for this recipe. Heat it on high heat for 3–4 minutes until it is smoking hot. Add the niter kibbeh and swirl to coat the pan. The butter should immediately sizzle and foam vigorously when added — this is the correct temperature.",
        duration: "4 min",
        tip: "A properly hot pan is essential for tibs. If the pan isn't hot enough, the meat releases juice and braises instead of searing, resulting in a wet, gray, and disappointing dish instead of the golden-crusted, juicy tibs it should be.",
      },
      {
        step: 4,
        title: "Sear the meat in batches",
        description:
          "Add only half the meat to the smoking pan, spreading pieces in a single layer with space between them. Do not stir, toss, or move the meat for the first 2 minutes — this allows a golden-brown crust to form. Once a crust forms on the bottom, toss briefly and sear the other sides for 1 minute. Remove the first batch and set aside. Repeat with remaining meat.",
        duration: "8 min",
        tip: "Crowding the pan is the number one mistake in making tibs. Too much meat lowers the pan temperature, releasing steam and preventing browning. Cook in batches and the results will be dramatically better.",
      },
      {
        step: 5,
        title: "Stir-fry the aromatics",
        description:
          "In the same pan (still on high heat), add the onion cut into wedges — not rings, but chunky wedges. Stir-fry for 2 minutes. Add the whole jalapeño peppers (scored on the side so they don't burst) and continue stir-frying. Add the tomato wedges and stir-fry everything together for 2 more minutes. You want the vegetables tender but still holding their shape with some char.",
        duration: "4 min",
        tip: "Cutting onions into chunky wedges keeps them structurally intact during the high-heat stir-fry. Thin slices disintegrate and make the dish mushy. The slightly charred edges on the onion and tomato add a beautiful smoky dimension.",
      },
      {
        step: 6,
        title: "Return meat and add awaze",
        description:
          "Return all the seared meat to the pan. Add the awaze or berbere and toss everything together vigorously with the vegetables for 1–2 minutes. Add the fresh rosemary leaves (stripped from the stem) and toss again. The heat will release the essential oils from the rosemary, creating an incredibly aromatic cloud of steam.",
        duration: "2 min",
        tip: "Fresh rosemary is key to authentic tibs — dried rosemary is a poor substitute. The combination of rosemary with berbere and niter kibbeh is uniquely Ethiopian and unlike any other cuisine in the world.",
      },
      {
        step: 7,
        title: "Create the final glaze",
        description:
          "Increase heat to maximum. Add a small knob of niter kibbeh (about 1 tsp extra) to the pan. Toss everything quickly and constantly for 60 seconds — the kibbeh will coat everything in a glossy, fragrant sheen. Taste and adjust salt. The entire cooking process from first sear to this moment should take about 15 minutes total.",
        duration: "1 min",
        tip: "This final flash of high heat with butter creates a restaurant-quality glaze on the tibs. Ethiopian tibs restaurants keep their pans screaming hot throughout — the sizzling sound when the dish arrives at the table is part of the experience.",
      },
      {
        step: 8,
        title: "Serve sizzling",
        description:
          "Transfer immediately to a preheated clay pot (mukecha) or a warmed serving dish. Serve while sizzling hot with injera. The traditional way to eat tibs is to tear injera, fold it into a pocket, and scoop up pieces of meat with vegetables all at once. Have extra injera ready on the side for scooping the flavorful juices left in the pot.",
        duration: "1 min",
        tip: "To keep tibs sizzling at the table (restaurant style), heat a small clay dish or cast-iron skillet and transfer the tibs into it just before serving. Add a few drops of water around the edge — it will sizzle dramatically and keep everything hot through the meal.",
      },
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
    description:
      "Slow-cooked Ethiopian-spiced collard greens with garlic, ginger, and onions. A perfect nutritious side dish served alongside almost every Ethiopian meal.",
    culturalInsight:
      "Gomen has been cultivated in the Ethiopian highlands for centuries and is one of the oldest vegetables in continuous cultivation. Rich in iron, calcium, and vitamins A and K, it was long recognized as a medicine food by Ethiopian healers. During fasting periods, gomen provides essential nutrients. It also holds spiritual significance in some Ethiopian traditions.",
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
      {
        step: 1,
        title: "Select and clean the greens",
        description:
          "Choose fresh collard greens with dark, glossy, firm leaves and no yellowing. Avoid bunches with limp or browning leaves — they will taste bitter and have less nutritional value. Separate each leaf and wash thoroughly under cold running water, rubbing the surface to remove any dirt or pesticide residue. Shake off excess water.",
        duration: "5 min",
        tip: "Ethiopian gomen is traditionally made with a specific variety of collard green grown in the highlands — larger, darker, and more tender than most supermarket varieties. If available, Ethiopian teff stores sometimes carry authentic seed varieties.",
      },
      {
        step: 2,
        title: "Remove stems and chiffonade",
        description:
          "Lay each leaf flat on a cutting board. Using a sharp knife, cut along both sides of the central rib (the thick stem running through the middle) to remove it — the stem is too tough and fibrous. Discard the stems. Stack 4–5 de-stemmed leaves on top of each other, roll them tightly into a cylinder like a cigar, and slice crosswise into thin ribbons about 5–7mm wide. This technique is called chiffonade.",
        duration: "8 min",
        tip: "Uniform thin slices cook evenly and have the most tender texture. Irregular, chunky pieces result in some pieces being overcooked while others remain tough. A sharp knife makes this step quick.",
      },
      {
        step: 3,
        title: "Optional: blanch the greens",
        description:
          "For extra tender gomen, bring a large pot of salted water to a full rolling boil. Add the sliced collard ribbons and cook for exactly 2 minutes. Drain immediately and rinse under cold water to stop cooking and preserve the vivid green color. Squeeze gently in handfuls to remove excess water. This blanching removes bitterness and reduces the final cooking time.",
        duration: "5 min",
        tip: "Blanching is optional but highly recommended for older, tougher collard greens or kale. For young, tender leaves, you can skip this step and sauté directly. The cold water rinse is crucial to stop the cooking and keep the greens bright green.",
      },
      {
        step: 4,
        title: "Prepare the aromatics",
        description:
          "Peel and slice the onion into thin half-moons. Peel and mince the garlic cloves finely. Peel and grate (or finely mince) the fresh ginger. If using jalapeño, slice it into thin rounds — keep the seeds for more heat, remove them for milder flavor. Having everything prepped before cooking starts is essential for this quick stir-fry.",
        duration: "5 min",
        tip: "Some Ethiopian cooks add a quarter teaspoon of turmeric with the aromatics for a golden hue and extra anti-inflammatory benefit. This is more common in western Ethiopia.",
      },
      {
        step: 5,
        title: "Sauté onions until soft",
        description:
          "Heat the vegetable oil in a large, wide skillet or sauté pan over medium heat. Add the sliced onions and cook, stirring every 2 minutes, for 8–10 minutes. The onions should soften completely and become translucent, with light golden edges. They should not brown significantly — gomen is a subtler, more delicate dish than the berbere-based stews.",
        duration: "10 min",
        tip: "A wide pan helps the liquid from the greens evaporate more quickly when they are added. A narrow pot traps steam and can make the gomen watery. If only a narrow pot is available, cook in smaller batches.",
      },
      {
        step: 6,
        title: "Bloom the aromatics",
        description:
          "Add the minced garlic, grated ginger, and jalapeño slices to the soft onions. Stir and cook on medium heat for 2–3 minutes until fragrant. The garlic should sizzle gently and turn pale golden — not brown or dark, which indicates burning. The combination of garlic and ginger is the foundation flavor of Ethiopian gomen.",
        duration: "3 min",
        tip: "Add the garlic and ginger at the same time — garlic burns faster than ginger, and having both in the pan together provides balance. If the pan seems dry, add 1 tbsp of water and stir to prevent burning.",
      },
      {
        step: 7,
        title: "Add greens and toss",
        description:
          "Add all the collard greens to the pan at once. They will seem like a huge mountain at first — don't worry, they wilt dramatically. Using tongs or two large spoons, toss the greens through the onion mixture, coating every ribbon with the garlicky oil. This initial tossing ensures even distribution of flavors.",
        duration: "2 min",
        tip: "Adding all the greens at once is fine — they will wilt within 2–3 minutes, reducing to about one-third of their raw volume. If the pan is too small, add them in two batches, waiting for the first batch to wilt before adding the second.",
      },
      {
        step: 8,
        title: "Cover and steam",
        description:
          "Add 3–4 tablespoons of water to the pan and cover tightly with a lid. Reduce heat to medium-low and cook for 12–15 minutes, stirring every 3–4 minutes. The greens will steam in the moisture from the added water and their own natural liquid, becoming tender and silky. Check occasionally — if the pan looks dry, add another tablespoon of water.",
        duration: "15 min",
        tip: "The greens are perfectly cooked when they are tender but retain a slight, satisfying bite — not mushy. Overcooked collard greens lose their beautiful green color and become grey and unappetizing. Remove from heat as soon as they are just tender.",
      },
      {
        step: 9,
        title: "Season, finish, and serve",
        description:
          "Remove the lid and season with salt. Taste and adjust if needed. If there is excess liquid in the pan, increase heat to medium-high for 1–2 minutes, stirring constantly, until most liquid evaporates — gomen should be moist but not wet or soupy. Transfer to a serving dish and serve warm alongside kitfo, tibs, or any stew over injera.",
        duration: "2 min",
        tip: "Gomen is best served the same day it is made. If making ahead, slightly undercook and reheat in a pan with a splash of oil when ready to serve — this refreshes the color and flavor. Leftover gomen is excellent tossed with scrambled eggs for a quick Ethiopian-inspired breakfast.",
      },
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

export const UNIT_CONVERSIONS: Record<
  string,
  { metric: string; imperial: string; factor: number }
> = {
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

  if (
    !conv ||
    unit === "whole" ||
    unit === "large" ||
    unit === "medium" ||
    unit === "cloves"
  ) {
    const val =
      scaledAmount === Math.floor(scaledAmount)
        ? String(scaledAmount)
        : scaledAmount.toFixed(1);
    return { value: val, unit };
  }

  if (system === "imperial") {
    const converted = scaledAmount / conv.factor;
    return {
      value:
        converted < 1
          ? converted.toFixed(2)
          : converted % 1 === 0
            ? String(Math.round(converted))
            : converted.toFixed(1),
      unit: conv.imperial,
    };
  }

  if (unit === "cups" || unit === "tbsp" || unit === "tsp") {
    const ml = scaledAmount * conv.factor;
    return {
      value: ml % 1 === 0 ? String(ml) : ml.toFixed(0),
      unit: "ml",
    };
  }

  if (unit === "kg") {
    return { value: String(scaledAmount), unit: "kg" };
  }

  const val =
    scaledAmount === Math.floor(scaledAmount)
      ? String(scaledAmount)
      : scaledAmount.toFixed(1);
  return { value: val, unit: conv.metric };
}
