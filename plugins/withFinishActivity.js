const {
  withDangerousMod,
  withMainApplication,
} = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

function withFinishActivity(config) {
  // Write the two kotlin files into the Android project
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const packageName = config.android?.package;
      const packagePath = packageName.replace(/\./g, "/");
      const dir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/java",
        packagePath
      );

      fs.writeFileSync(
        path.join(dir, "FinishActivityModule.kt"),
        [
          `package ${packageName}`,
          "",
          "import com.facebook.react.bridge.ReactApplicationContext",
          "import com.facebook.react.bridge.ReactContextBaseJavaModule",
          "import com.facebook.react.bridge.ReactMethod",
          "",
          "class FinishActivityModule(reactContext: ReactApplicationContext) :",
          "    ReactContextBaseJavaModule(reactContext) {",
          '    override fun getName() = "FinishActivity"',
          "    @ReactMethod",
          "    fun finish() { reactApplicationContext.currentActivity?.moveTaskToBack(true) }",
          "}",
          "",
        ].join("\n")
      );

      fs.writeFileSync(
        path.join(dir, "FinishActivityPackage.kt"),
        [
          `package ${packageName}`,
          "",
          "import com.facebook.react.ReactPackage",
          "import com.facebook.react.bridge.NativeModule",
          "import com.facebook.react.bridge.ReactApplicationContext",
          "import com.facebook.react.uimanager.ViewManager",
          "",
          "class FinishActivityPackage : ReactPackage {",
          "    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =",
          "        listOf(FinishActivityModule(reactContext))",
          "    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =",
          "        emptyList()",
          "}",
          "",
        ].join("\n")
      );

      return config;
    },
  ]);

  // Patch MainApplication.kt to register the package
  config = withMainApplication(config, (config) => {
    const { contents } = config.modResults;
    const packageName = config.android?.package;

    if (contents.includes("FinishActivityPackage")) return config;

    config.modResults.contents = contents
      .replace(
        /^(package .+)$/m,
        `$1\nimport ${packageName}.FinishActivityPackage`
      )
      .replace(
        /PackageList\([^)]*\)\.packages/,
        (match) => `${match}.also { it.add(FinishActivityPackage()) }`
      );

    return config;
  });

  return config;
}

module.exports = withFinishActivity;
