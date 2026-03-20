import { useColorScheme } from "react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export function useTheme() {
  const systemScheme = useColorScheme();
  const { themeMode } = useApp();

  const isDark =
    themeMode === "system"
      ? systemScheme === "dark"
      : themeMode === "dark";

  const theme = isDark ? Colors.dark : Colors.light;
  return { theme, isDark };
}
