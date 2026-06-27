import { NativeModules, Platform } from "react-native";

export function finishActivity() {
  if (Platform.OS === "android") {
    NativeModules.FinishActivity?.finish();
  }
}
