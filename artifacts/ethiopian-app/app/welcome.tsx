import { BlurView } from "expo-blur";
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
import { useTranslation } from "@/hooks/useTranslation";
import { useApp } from "@/context/AppContext";

import { RECIPES } from "@/data/recipes";

const useND = Platform.OS !== "web";

const { width, height } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    emoji: "🍽️",
    titleKey: "welcome_title",
    amharicKey: "authentic",
    descriptionKey: "welcome_desc",
    accent: "#FFC107",
    featuresKeys: ["feat_photos", "feat_amharic", "feat_converter", "feat_stories"],
  },
  {
    emoji: "🏃",
    titleKey: "fitness_title",
    amharicKey: "fitness_sub",
    descriptionKey: "fitness_sub",
    accent: "#4CAF50",
    featuresKeys: ["feat_timer", "feat_guide", "feat_muscles", "feat_plans"],
  },
  {
    emoji: "📊",
    titleKey: "tracker_title",
    amharicKey: "today_glance",
    descriptionKey: "bmi_desc",
    accent: "#FF7043",
    featuresKeys: ["feat_water", "feat_steps", "feat_bmi", "feat_charts"],
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

  const { t } = useTranslation();

  return (
    <Animated.View style={[styles.page, { transform: [{ scale }] }]}>
      <View style={[styles.emojiBox, { backgroundColor: page.accent + "25", borderColor: page.accent + "50" }]}>
        <Text style={styles.emoji}>{page.emoji}</Text>
      </View>
      <Text style={[styles.pageAmharic, { color: page.accent }]}>{t(page.amharicKey as any)}</Text>
      <Text style={styles.pageTitle}>{t(page.titleKey as any)}</Text>
      <Text style={styles.pageDesc}>{t(page.descriptionKey as any)}</Text>
      <View style={styles.featureGrid}>
        {page.featuresKeys.map((fKey) => (
          <View key={fKey} style={[styles.featureChip, { backgroundColor: page.accent + "18", borderColor: page.accent + "35" }]}>
            <View style={[styles.featureDot, { backgroundColor: page.accent }]} />
            <Text style={[styles.featureText, { color: page.accent }]}>{t(fKey as any)}</Text>
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
  const { t, language, setLanguage } = useTranslation();

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
            <Text style={styles.appName}>{t("welcome_title")}</Text>
            <Text style={styles.appTagline}>ምግብ • ጤና • ሕይወት</Text>
          </View>
        </Animated.View>

        <View style={styles.langSwitch}>
          <Pressable
            onPress={() => setLanguage("en")}
            style={[styles.langBtn, language === "en" && { backgroundColor: "#FFC107" }]}
          >
            <Text style={[styles.langBtnText, language === "en" && { color: "#000" }]}>EN</Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage("am")}
            style={[styles.langBtn, language === "am" && { backgroundColor: "#FFC107" }]}
          >
            <Text style={[styles.langBtnText, language === "am" && { color: "#000" }]}>አማ</Text>
          </Pressable>
        </View>

        <Animated.View style={{ opacity: logoFade }}>
          <FloatingFoodGrid />
        </Animated.View>
      </View>

      <BlurView intensity={25} tint="dark" style={styles.bottomSheet}>
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
              <Text style={styles.skipText}>{t("back").toUpperCase()}</Text>
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
              {currentPage === ONBOARDING_PAGES.length - 1 ? `${t("get_started")} 🍽️` : `${t("next_step")} →`}
            </Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0804" },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(14,8,4,0.72)" },
  topSection: { height: 340, paddingHorizontal: 24, paddingTop: 4, gap: 18, justifyContent: "flex-end", paddingBottom: 32 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  logoBox: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: "rgba(255,193,7,0.12)",
    borderWidth: 1.5, borderColor: "rgba(255,193,7,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  logoFlag: { fontSize: 30 },
  appName: { color: "#FFC107", fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  appTagline: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 2, letterSpacing: 1 },
  foodGrid: { flexDirection: "row", gap: 12, justifyContent: "flex-start" },
  foodItem: {
    width: (width - 76) / 4,
    height: (width - 76) / 4,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
  },
  foodPhoto: { width: "100%", height: "100%" },
  foodOverlay: { ...StyleSheet.absoluteFillObject },
  langSwitch: { flexDirection: "row", gap: 8, marginTop: -8 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  langBtnText: { color: "#FFF", fontSize: 12, fontFamily: "Inter_700Bold" },
  bottomSheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  page: { width, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 4, gap: 16 },
  emojiBox: {
    width: 68, height: 68, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5,
  },
  emoji: { fontSize: 32 },
  pageAmharic: { fontSize: 13, fontFamily: "Inter_700Bold", letterSpacing: 0.8, textTransform: "uppercase" },
  pageTitle: { color: "#FFFFFF", fontSize: 34, fontFamily: "Inter_700Bold", lineHeight: 40 },
  pageDesc: { color: "rgba(255,255,255,0.6)", fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24 },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  featureChip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  featureDot: { width: 6, height: 6, borderRadius: 3 },
  featureText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 20 },
  dot: { height: 9, borderRadius: 4.5 },
  btnsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 32, gap: 16 },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 14 },
  skipText: { color: "rgba(255,255,255,0.35)", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  nextBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 18, borderRadius: 20,
  },
  getStartedBtn: { flex: 1 },
  nextBtnText: { color: "#000000", fontSize: 17, fontFamily: "Inter_700Bold" },
});
