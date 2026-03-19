export interface ExerciseStep {
  step: number;
  instruction: string;
}

export interface Exercise {
  id: string;
  name: string;
  amharic?: string;
  category: "cardio" | "strength" | "flexibility" | "traditional";
  duration: number;
  calories: number;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  benefits: string[];
  muscles: string[];
  steps: ExerciseStep[];
  icon: string;
  equipment: string;
  sets?: number;
  reps?: number;
  restSeconds?: number;
  culturalNote?: string;
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
    description: "A brisk walk inspired by Ethiopian highland terrain. Walk at a steady, purposeful pace with good posture, mimicking the daily walks of Ethiopian highland communities.",
    benefits: ["Burns fat steadily", "Improves cardiovascular health", "Strengthens leg muscles", "Reduces stress", "Zero equipment needed"],
    muscles: ["Calves", "Quadriceps", "Glutes", "Core"],
    steps: [
      { step: 1, instruction: "Stand tall with shoulders back and chin level. This is the Ethiopian highland posture." },
      { step: 2, instruction: "Begin walking at a brisk pace — fast enough to raise your heart rate but still able to speak." },
      { step: 3, instruction: "Swing your arms naturally at about 90 degrees to increase calorie burn." },
      { step: 4, instruction: "If possible, find a hill or incline — walking uphill mimics the Ethiopian highland terrain." },
      { step: 5, instruction: "Maintain this pace for the full 30 minutes. Cool down with a 5 minute slow walk." },
    ],
    icon: "navigation",
    equipment: "None",
    culturalNote: "Ethiopian highland communities walk an average of 12,000 steps per day, which researchers believe contributes to the extraordinary longevity and cardiovascular health of the population.",
  },
  {
    id: "coffee-ceremony-squat",
    name: "Coffee Ceremony Squats",
    category: "strength",
    duration: 15,
    calories: 120,
    level: "beginner",
    description: "Bodyweight squats performed with the slow, deliberate rhythm of an Ethiopian coffee ceremony. Mindful movement meets strength training.",
    benefits: ["Builds leg and glute strength", "Improves knee stability", "Enhances core strength", "Boosts metabolism"],
    muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
    steps: [
      { step: 1, instruction: "Stand with feet shoulder-width apart, toes slightly turned out." },
      { step: 2, instruction: "Inhale and slowly lower yourself as if sitting back into a chair. Take 3 full seconds to descend." },
      { step: 3, instruction: "Go until thighs are parallel to the floor (or as low as comfortable). Keep your knees tracking over toes." },
      { step: 4, instruction: "Hold the bottom position for 1 second — like pausing to appreciate the aroma of coffee." },
      { step: 5, instruction: "Exhale and push through heels to return to standing. Take 2 seconds to rise." },
      { step: 6, instruction: "Complete 15 reps, rest 60 seconds, then repeat 2 more sets." },
    ],
    icon: "arrow-down-circle",
    equipment: "None",
    sets: 3,
    reps: 15,
    restSeconds: 60,
  },
  {
    id: "teff-carry",
    name: "Teff Farmer Carry",
    category: "strength",
    duration: 10,
    calories: 90,
    level: "intermediate",
    description: "Inspired by Ethiopian farmers carrying heavy grain. Walk while holding weights at your sides — a total body strength exercise that builds real-world functional strength.",
    benefits: ["Builds grip strength", "Strengthens core and back", "Improves posture", "Burns serious calories", "Total body functional fitness"],
    muscles: ["Forearms", "Traps", "Core", "Shoulders", "Legs"],
    steps: [
      { step: 1, instruction: "Pick up two dumbbells (or heavy bags) — choose a weight that's challenging but controllable. Start with 10–15kg per side." },
      { step: 2, instruction: "Stand tall, shoulders packed back and down. Brace your core tightly as if bracing for a punch." },
      { step: 3, instruction: "Walk at a controlled pace for 30 meters (or around a room). Keep your gaze forward and posture perfectly upright." },
      { step: 4, instruction: "Place weights down carefully. Rest 30 seconds. Pick up and repeat." },
      { step: 5, instruction: "Complete 5 round trips (10 total lengths). Increase weight when this feels easy." },
    ],
    icon: "package",
    equipment: "Dumbbells or heavy bags",
    sets: 5,
    reps: 1,
    restSeconds: 30,
    culturalNote: "Ethiopian farmers have historically carried loads of 40–60kg for miles across rough highland terrain, developing legendary functional strength and endurance.",
  },
  {
    id: "addis-run",
    name: "Addis Interval Run",
    category: "cardio",
    duration: 25,
    calories: 280,
    level: "intermediate",
    description: "High-intensity interval training inspired by the training methods of Ethiopian distance runners — widely considered the greatest runners in human history. Alternates between jogging and sprint intervals.",
    benefits: ["Extreme calorie burn", "Builds cardiovascular power", "Increases VO2 max", "Burns fat long after workout", "Builds mental toughness"],
    muscles: ["Full body", "Heart", "Calves", "Hip flexors", "Core"],
    steps: [
      { step: 1, instruction: "Warm up: jog at easy pace for 5 minutes. Your body temperature should rise and breathing quicken slightly." },
      { step: 2, instruction: "Sprint hard for 30 seconds — give 80–90% effort. Push off powerfully from each step." },
      { step: 3, instruction: "Recover: jog gently for 90 seconds to let heart rate partially recover." },
      { step: 4, instruction: "Repeat the 30-second sprint / 90-second jog cycle 8 times total." },
      { step: 5, instruction: "Cool down: walk for 5 minutes. Stretch your calves, hip flexors and quads." },
    ],
    icon: "activity",
    equipment: "None",
    culturalNote: "Ethiopian runners like Haile Gebrselassie, Kenenisa Bekele, and Eliud Kipchoge grew up running to school barefoot at altitude, building extraordinary endurance from childhood.",
  },
  {
    id: "eskista-dance",
    name: "Eskista Dance",
    amharic: "እስክስታ",
    category: "traditional",
    duration: 20,
    calories: 160,
    level: "beginner",
    description: "The traditional Ethiopian dance featuring distinctive shoulder rolls, chest pops, and undulating body movements. A joyful, full-body workout with deep cultural roots.",
    benefits: ["Improves shoulder mobility", "Strengthens upper back", "Enhances coordination", "Boosts mood and energy", "Culturally connecting"],
    muscles: ["Shoulders", "Upper back", "Core", "Neck"],
    steps: [
      { step: 1, instruction: "Stand with feet hip-width apart, knees slightly bent. Relax your whole body." },
      { step: 2, instruction: "Roll both shoulders forward together in a slow circle, then backward. Repeat 10 times each direction." },
      { step: 3, instruction: "Now do alternating shoulder rolls — right forward as left goes back, like a wave motion." },
      { step: 4, instruction: "Add chest pops: sharply push your chest forward on the beat, then contract it back." },
      { step: 5, instruction: "Combine shoulder rolls with small side-to-side steps. Let your torso undulate naturally." },
      { step: 6, instruction: "Increase the speed and energy as you get comfortable. Ethiopian music playing helps!" },
    ],
    icon: "music",
    equipment: "None",
    culturalNote: "Eskista is performed at weddings, holidays, and celebrations across Ethiopia. The dance varies by region — the Amhara style emphasizes shoulder movements while the Gurage style features more footwork.",
  },
  {
    id: "plank-berbere",
    name: "Berbere Plank",
    category: "strength",
    duration: 10,
    calories: 70,
    level: "intermediate",
    description: "Core-strengthening plank variations named after Ethiopia's iconic spice. Each variation is 'spicier' (harder) than the last, building serious core strength.",
    benefits: ["Builds deep core strength", "Improves posture", "Strengthens lower back", "Tones shoulders and arms", "Improves stability"],
    muscles: ["Core", "Transverse abdominis", "Shoulders", "Glutes", "Lower back"],
    steps: [
      { step: 1, instruction: "Classic plank: forearms on the ground, body in a straight line from head to heel. Hold 30 seconds." },
      { step: 2, instruction: "Side plank: rotate to one side, stacking feet and lifting hip. Hold 20 seconds each side." },
      { step: 3, instruction: "Plank with shoulder taps: from high plank, tap left shoulder with right hand, then right with left. 15 taps each." },
      { step: 4, instruction: "Plank with leg lifts: from forearm plank, lift one leg 6 inches, hold 2 seconds, lower. 10 each side." },
      { step: 5, instruction: "Rest 45 seconds, then repeat the sequence 2 more times." },
    ],
    icon: "minus",
    equipment: "Exercise mat",
    sets: 3,
    reps: 30,
    restSeconds: 45,
  },
  {
    id: "stretching",
    name: "Ethiopian Morning Stretch",
    category: "flexibility",
    duration: 15,
    calories: 50,
    level: "beginner",
    description: "A full-body flexibility and mobility routine designed for morning or post-workout recovery. Inspired by the traditional Ethiopian practice of gentle morning movement.",
    benefits: ["Increases flexibility", "Reduces muscle soreness", "Improves blood circulation", "Enhances joint mobility", "Reduces injury risk"],
    muscles: ["Full body", "Hip flexors", "Hamstrings", "Spine", "Shoulders"],
    steps: [
      { step: 1, instruction: "Cat-Cow: on hands and knees, arch back up on exhale (cat), drop belly on inhale (cow). 10 slow cycles." },
      { step: 2, instruction: "Child's pose: kneel, sit back on heels, reach arms forward on the floor. Hold 30 seconds." },
      { step: 3, instruction: "Hip flexor lunge stretch: step one foot forward into a lunge, back knee on floor. Hold 30 seconds each side." },
      { step: 4, instruction: "Seated hamstring stretch: legs straight, reach forward for toes. Hold 30 seconds." },
      { step: 5, instruction: "Chest opener: interlace fingers behind back, squeeze shoulder blades together and lift arms. Hold 20 seconds." },
      { step: 6, instruction: "Neck rolls: gently roll head in slow circles each direction. 5 rolls each way." },
    ],
    icon: "sun",
    equipment: "Exercise mat",
  },
  {
    id: "push-ups",
    name: "Power Push-Ups",
    category: "strength",
    duration: 12,
    calories: 100,
    level: "intermediate",
    description: "Standard push-ups with progressively challenging variations for chest, shoulders, and triceps. Build upper body pushing power with your own body weight.",
    benefits: ["Builds chest strength", "Strengthens shoulders and triceps", "Improves core stability", "Zero equipment needed", "Functional upper body power"],
    muscles: ["Chest", "Shoulders", "Triceps", "Core", "Serratus anterior"],
    steps: [
      { step: 1, instruction: "Standard push-up: hands shoulder-width apart, body straight from head to toe. Lower chest to 2cm from floor, press up powerfully. 10 reps." },
      { step: 2, instruction: "Wide push-up: hands wider than shoulders — this targets the outer chest. 10 reps." },
      { step: 3, instruction: "Diamond push-up: hands close together forming a diamond shape — targets triceps. 8 reps." },
      { step: 4, instruction: "Slow eccentric push-up: take 4 seconds to lower, 1 second to press up. 5 reps only — these are intense." },
      { step: 5, instruction: "Rest 60 seconds, then repeat the circuit 3 more times." },
    ],
    icon: "chevrons-up",
    equipment: "None",
    sets: 4,
    reps: 15,
    restSeconds: 60,
  },
  {
    id: "gojjam-jump",
    name: "Gojjam Jump Squats",
    amharic: "ጎጃም ዝላይ",
    category: "cardio",
    duration: 12,
    calories: 150,
    level: "advanced",
    description: "Explosive jump squats inspired by the athletic tradition of the Gojjam region. High-intensity plyometric movement that builds power and burns maximum calories.",
    benefits: ["Builds explosive power", "Maximum calorie burn", "Develops fast-twitch muscle", "Improves vertical jump", "Cardio and strength combined"],
    muscles: ["Quadriceps", "Glutes", "Calves", "Core"],
    steps: [
      { step: 1, instruction: "Stand with feet shoulder-width apart. Drop into a squat until thighs are parallel to the ground." },
      { step: 2, instruction: "Explosively jump straight up, extending fully at hips, knees, and ankles. Reach arms overhead." },
      { step: 3, instruction: "Land softly with bent knees, absorbing impact through legs (not joints). Immediately drop into next squat." },
      { step: 4, instruction: "Complete 10 jumps, rest 30 seconds. Repeat 4 sets." },
      { step: 5, instruction: "If too intense, do 5 regular squats + 5 jump squats alternating." },
    ],
    icon: "chevrons-up",
    equipment: "None",
    sets: 4,
    reps: 10,
    restSeconds: 30,
  },
  {
    id: "nile-swim",
    name: "Blue Nile Core Flow",
    category: "flexibility",
    duration: 18,
    calories: 65,
    level: "beginner",
    description: "A flowing core and flexibility routine inspired by the graceful flow of the Blue Nile river. Connects breath, movement, and body awareness.",
    benefits: ["Improves core strength", "Increases spinal mobility", "Reduces back tension", "Improves breathing", "Mind-body connection"],
    muscles: ["Core", "Lower back", "Hip flexors", "Obliques"],
    steps: [
      { step: 1, instruction: "Lie on your back. Knees bent, feet flat. Breathe deeply — 5 full inhale/exhale cycles." },
      { step: 2, instruction: "Dead bug: extend one arm overhead and opposite leg straight simultaneously. Alternate 10 times each side, moving slowly like flowing water." },
      { step: 3, instruction: "Bridge: drive hips to ceiling, squeeze glutes at top. Hold 3 seconds. Lower slowly. 12 reps." },
      { step: 4, instruction: "Leg raises: flat on back, raise both legs to 90°, lower slowly without touching floor. 10 reps." },
      { step: 5, instruction: "Finish: hug knees to chest and rock gently side to side for 60 seconds. The 'river flow' finish." },
    ],
    icon: "wind",
    equipment: "Exercise mat",
  },
];

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "traditional-balanced",
    name: "Traditional Ethiopian Diet",
    description: "A balanced plan using traditional Ethiopian foods providing optimal nutrition for everyday life and long-term health.",
    goal: "maintenance",
    totalCalories: 1900,
    meals: [
      { time: "breakfast", dish: "Firfir with leftover injera & macchiato coffee", calories: 320, protein: 8, carbs: 52, fat: 9 },
      { time: "lunch", dish: "Shiro Wat with injera (2 pieces) & salata", calories: 480, protein: 14, carbs: 76, fat: 12 },
      { time: "snack", dish: "Roasted barley kolo & fresh guava", calories: 180, protein: 5, carbs: 34, fat: 4 },
      { time: "dinner", dish: "Tibs with gomen & 1 injera", calories: 620, protein: 42, carbs: 28, fat: 38 },
    ],
  },
  {
    id: "fasting-plan",
    name: "Orthodox Fasting Plan",
    description: "Ethiopian Orthodox fasting diet — completely vegan and nutritionally complete. Used ~200 days per year by millions of Ethiopians.",
    goal: "fasting",
    totalCalories: 1500,
    meals: [
      { time: "breakfast", dish: "Genfo (barley porridge) with flaxseed & lemon", calories: 280, protein: 6, carbs: 52, fat: 7 },
      { time: "lunch", dish: "Misir Wat (red lentil stew) with 2 injera", calories: 440, protein: 18, carbs: 70, fat: 10 },
      { time: "snack", dish: "Kolo & fresh mango", calories: 200, protein: 4, carbs: 40, fat: 4 },
      { time: "dinner", dish: "Ye'abesha Gomen & Atkilt Wat with injera", calories: 380, protein: 12, carbs: 60, fat: 10 },
    ],
  },
  {
    id: "athlete-plan",
    name: "Ethiopian Athlete Plan",
    description: "High-performance plan inspired by Ethiopian marathon runners. Optimized for strength training, endurance, and muscle growth.",
    goal: "muscle-gain",
    totalCalories: 2600,
    meals: [
      { time: "breakfast", dish: "Firfir with 3 eggs, avocado & buna (coffee)", calories: 520, protein: 22, carbs: 48, fat: 28 },
      { time: "lunch", dish: "Doro Wat with 2 injera & ayib cottage cheese", calories: 780, protein: 52, carbs: 60, fat: 35 },
      { time: "snack", dish: "Kolo mix, banana & protein shake", calories: 380, protein: 28, carbs: 50, fat: 8 },
      { time: "dinner", dish: "Kitfo (leb leb) with gomen & injera", calories: 680, protein: 58, carbs: 32, fat: 38 },
    ],
  },
  {
    id: "weight-loss-plan",
    name: "Light Ethiopian Plan",
    description: "A calorie-conscious plan that keeps all the flavors of Ethiopian cuisine while supporting healthy, sustainable weight loss.",
    goal: "weight-loss",
    totalCalories: 1350,
    meals: [
      { time: "breakfast", dish: "Teff porridge with honey & cinnamon", calories: 280, protein: 7, carbs: 52, fat: 4 },
      { time: "lunch", dish: "Shiro Wat (small) with 1 injera & salata", calories: 360, protein: 12, carbs: 58, fat: 8 },
      { time: "snack", dish: "Ayib (cottage cheese) with tomato & cucumber", calories: 150, protein: 12, carbs: 8, fat: 6 },
      { time: "dinner", dish: "Gomen (collard greens) with 1 injera & soft-boiled egg", calories: 320, protein: 14, carbs: 44, fat: 9 },
    ],
  },
];

export const WATER_GOAL_ML = 2500;
export const STEP_GOAL = 8000;
