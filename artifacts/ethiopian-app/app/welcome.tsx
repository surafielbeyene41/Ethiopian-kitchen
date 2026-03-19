import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RECIPES } from "@/data/recipes";

const useND = Platform.OS !== "web";

const { width, height } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    emoji: "🍽️",
    title: "Authentic\nEthiopian Kitchen",
    amharic: "የኢትዮጵያ ምግብ ቤት",
    description: "Explore 6 traditional recipes with step-by-step instructions, cultural insights, and smart ingredient converters.",
    accent: "#FFC107",
    features: ["Real food photos", "Amharic names", "Unit converter", "Cultural stories"],
  },
  {
    emoji: "🏃",
    title: "Ethiopian\nFitness & Wellness",
    amharic: "ጤና እና ስፖርት",
    description: "Ethiopian-inspired workouts with a live timer, step-by-step guides, and culturally connected meal plans.",
    accent: "#4CAF50",
    features: ["Live workout timer", "Exercise instructions", "Muscle groups", "Meal plans"],
  },
  {
    emoji: "📊",
    title: "Track Your\nDaily Progress",
    amharic: "የዕለት ሂደት",
    description: "Log water intake, steps, and workouts. Calculate your BMI and see your weekly progress charts.",
    accent: "#FF7043",
    features: ["Water tracker", "Step counter", "BMI calculator", "Weekly charts"],
  },
];

const FOOD_PHOTOS = RECIPES.slice(0, 4).map((r) => ({ uri: r.imageUri, name: r.name, color: r.color }));

function FloatingFoodGrid() {
  const animations = useRef(
    FOOD_PHOTOS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    FOOD_PHOTOS.forEach((_, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animations[i], { toValue: -8, duration: 2000 + i * 400, useNativeDriver: useND }),
          Animated.timing(animations[i], { toValue: 0, duration: 2000 + i * 400, useNativeDriver: useND }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.foodGrid}>
      {FOOD_PHOTOS.map((food, i) => (
        <Animated.View
          key={i}
          style={[
            styles.foodItem,
            {
              transform: [{ translateY: animations[i] }],
              borderColor: food.color + "60",
            },
          ]}
        >
          <Image source={food.uri} style={styles.foodPhoto} resizeMode="cover" />
          <View style={[styles.foodOverlay, { backgroundColor: food.color + "40" }]} />
        </Animated.View>
      ))}
    </View>
  );
}

function OnboardingPage({
  page,
  isActive,
}: {
  page: typeof ONBOARDING_PAGES[0];
  isActive: boolean;
}) {
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.94)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1 : 0.94,
      useNativeDriver: useND,
      tension: 80,
      friction: 8,
    }).start();
  }, [isActive]);

  return (
    <Animated.View style={[styles.page, { transform: [{ scale }] }]}>
      <View style={[styles.emojiBox, { backgroundColor: page.accent + "25", borderColor: page.accent + "50" }]}>
        <Text style={styles.emoji}>{page.emoji}</Text>
      </View>
      <Text style={[styles.pageAmharic, { color: page.accent }]}>{page.amharic}</Text>
      <Text style={styles.pageTitle}>{page.title}</Text>
      <Text style={styles.pageDesc}>{page.description}</Text>
      <View style={styles.featureGrid}>
        {page.features.map((f) => (
          <View key={f} style={[styles.featureChip, { backgroundColor: page.accent + "18", borderColor: page.accent + "35" }]}>
            <View style={[styles.featureDot, { backgroundColor: page.accent }]} />
            <Text style={[styles.featureText, { color: page.accent }]}>{f}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const logoSlide = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      const next = currentPage + 1;
      setCurrentPage(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/(tabs)/");
  };

  const handleScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const page = Math.round(x / width);
    setCurrentPage(page);
  };

  const accent = ONBOARDING_PAGES[currentPage].accent;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/welcome-bg.png")}
        style={styles.bg}
        resizeMode="cover"
      />
      <View style={styles.bgOverlay} />

      <View style={[styles.topSection, { paddingTop: isWeb ? 60 : insets.top + 16 }]}>
        <Animated.View style={[styles.logoRow, { opacity: logoFade, transform: [{ translateY: logoSlide }] }]}>
          <View style={styles.logoBox}>
            <Text style={styles.logoFlag}>🇪🇹</Text>
          </View>
          <View>
            <Text style={styles.appName}>Ye'Ethiopia</Text>
            <Text style={styles.appTagline}>ምግብ • ጤና • ሕይወት</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: logoFade }}>
          <FloatingFoodGrid />
        </Animated.View>
      </View>

      <View style={styles.bottomSheet}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {ONBOARDING_PAGES.map((page, i) => (
            <View key={i} style={{ width }}>
              <OnboardingPage page={page} isActive={currentPage === i} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {ONBOARDING_PAGES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => { setCurrentPage(i); scrollRef.current?.scrollTo({ x: i * width, animated: true }); }}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentPage ? accent : accent + "40",
                  width: i === currentPage ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.btnsRow, { paddingBottom: isWeb ? 34 : insets.bottom + 16 }]}>
          {currentPage < ONBOARDING_PAGES.length - 1 && (
            <Pressable onPress={handleGetStarted} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: accent, opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              currentPage === ONBOARDING_PAGES.length - 1 && styles.getStartedBtn,
            ]}
          >
            <Text style={styles.nextBtnText}>
              {currentPage === ONBOARDING_PAGES.length - 1 ? "Get Started 🍽️" : "Next →"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(14,8,4,0.78)" },
  topSection: { height: 320, paddingHorizontal: 24, paddingTop: 4, gap: 18, justifyContent: "flex-end", paddingBottom: 22 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoBox: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,193,7,0.18)",
    borderWidth: 1.5, borderColor: "rgba(255,193,7,0.4)",
    alignItems: "center", justifyContent: "center",
  },
  logoFlag: { fontSize: 26 },
  appName: { color: "#FFC107", fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  appTagline: { color: "rgba(255,193,7,0.6)", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  foodGrid: { flexDirection: "row", gap: 10, justifyContent: "flex-start" },
  foodItem: {
    width: (width - 68) / 4,
    height: (width - 68) / 4,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
  },
  foodPhoto: { width: "100%", height: "100%" },
  foodOverlay: { ...StyleSheet.absoluteFillObject },
  bottomSheet: {
    flex: 1,
    backgroundColor: "rgba(18,10,6,0.96)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,193,7,0.2)",
    overflow: "hidden",
  },
  page: { width, paddingHorizontal: 28, paddingTop: 28, paddingBottom: 4, gap: 12 },
  emojiBox: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5,
  },
  emoji: { fontSize: 30 },
  pageAmharic: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  pageTitle: { color: "#FFFFFF", fontSize: 30, fontFamily: "Inter_700Bold", lineHeight: 36 },
  pageDesc: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  featureChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  featureDot: { width: 5, height: 5, borderRadius: 2.5 },
  featureText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  dotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 16 },
  dot: { height: 8, borderRadius: 4 },
  btnsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, gap: 12 },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 14 },
  skipText: { color: "rgba(255,255,255,0.45)", fontSize: 14, fontFamily: "Inter_500Medium" },
  nextBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 16,
  },
  getStartedBtn: { flex: 1 },
  nextBtnText: { color: "#1A0E08", fontSize: 16, fontFamily: "Inter_700Bold" },
});
