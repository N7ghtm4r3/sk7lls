# Target layouts and edit boundaries

Read only the sections for targets present in the project. Paths below illustrate a split multiplatform application; module names, resource names, source sets, and dimensions must match the actual project. Reuse an established valid layout. Do not create every listed target or migrate an existing asset pipeline to reproduce these examples.

Platform format requirements apply independently of the user's choice of colors, font, symbol, or style. Explain a real format constraint and adapt the export while preserving the chosen identity. The file categories below become an exact allowlist only after the project is inspected.

## Android

Example resource ownership:

```text
androidApp/src/main/
  res/
    drawable/ic_launcher_background.xml
    drawable-v24/ic_launcher_foreground.xml
    drawable-xxxhdpi/app_launcher_foreground.png
    mipmap-anydpi-v26/ic_launcher.xml
    mipmap-anydpi-v26/ic_launcher_round.xml
    mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/
      ic_launcher.png
      ic_launcher_round.png
  AndroidManifest.xml                         # conditional wiring only
```

| Files | Allowed changes |
| --- | --- |
| Existing launcher density assets | Replace the icons, retaining resource names where possible. A conventional 48 dp launcher set is 48, 72, 96, 144, and 192 px across these densities. |
| Adaptive background and foreground resources | Supply the selected background and transparent foreground using supported vector or raster resources. The raster file and XML wrapper shown above are one option, not a required structure. |
| Adaptive-icon XML | Connect background, foreground, and a suitable monochrome resource. Preserve existing qualifier conventions and compatibility with the project's SDKs. |
| Manifest | Change only `android:icon` / `android:roundIcon` if existing references cannot be retained. |

Adaptive icons supply separate layers and let the launcher apply its mask. Keep essential artwork within the platform safe area; do not export the launcher mask as part of the foreground. A monochrome layer supplies the shape for system tinting and may reuse the foreground when its alpha silhouette is suitable. Inspect circular and non-circular masks and the themed result. Legacy round images are separate rendered assets.

Use [Android adaptive-icon guidance](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive) and the [AdaptiveIconDrawable contract](https://developer.android.com/reference/android/graphics/drawable/AdaptiveIconDrawable) for current layer, safe-area, and API requirements. Do not treat a store-listing icon as a launcher layer.

## iOS and iPadOS asset catalogs

For a project already using a raster AppIcon set:

```text
iosApp/iosApp/Assets.xcassets/AppIcon.appiconset/
  Contents.json
  app-icon-1024.png
  app-icon-dark-1024.png
  app-icon-tinted-1024.png
```

| Files | Allowed changes |
| --- | --- |
| AppIcon image files | Replace the default icon and supply requested appearance variants supported by the target. |
| `Contents.json` | Update filenames and appropriate appearance/size entries, preserving unrelated catalog metadata. |
| Xcode project or owning configuration | Change the selected app-icon set only when it is not already configured correctly. |

For supported single-size asset catalogs, use 1024×1024 exports. The default raster icon is square and opaque; let the system apply its shape. Apple's asset-catalog guidance calls for a transparent background for Dark and a grayscale image for Tinted. An opaque square filled with the app's dark primary color is not the native Dark treatment. The user still chooses the artwork and palette within those format constraints; do not require a particular primary color for the dark glyph.

Read [Apple's asset-catalog configuration](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) and [app-icon design guidance](https://developer.apple.com/design/human-interface-guidelines/app-icons) for the current target and Xcode version. These raster rules do not replace an existing Icon Composer workflow. Do not add appearance slots, convert to a different pipeline, or add tvOS/watchOS/visionOS assets merely because another platform supports them.

Compile the relevant asset catalog when Xcode is available. A successful asset-catalog compilation is not a full signed app build.

## Compose Desktop

For a separate Kotlin/JVM desktop module with no existing icon convention, this is a useful default:

```text
desktopApp/
  icons/
    app.icns
    app.ico
    app.png
  src/main/composeResources/drawable/app_icon.png
  src/main/kotlin/<package>/main.kt
  build.gradle.kts
```

For a multiplatform module, resolve the desktop source set, such as `jvmMain`, instead of assuming `main`. Do not modify generated resource accessors.

| Files | Allowed changes |
| --- | --- |
| Dedicated packaging icon files | Add `.icns` for macOS, `.ico` for Windows, and `.png` for Linux. |
| Desktop build script | Set `nativeDistributions.macOS/windows/linux.iconFile` to the corresponding files. Add resource-library support only if needed, using the existing version catalog/toolchain. |
| Runtime drawable | Supply the icon loaded by the application's window. |
| Desktop entry point | Add the resource imports and `Window(icon = ...)` assignment, or the equivalent supported by the existing API. |

The separation is by consumer: packaging tools read filesystem assets, while the running window reads an app resource. `icons/` is a project convention, not a Compose requirement. JetBrains' [ImageViewer example](https://github.com/JetBrains/compose-multiplatform/blob/master/examples/imageviewer/desktopApp/build.gradle.kts) uses `desktop-icons/`. An existing module-root `resources/icons/` can also work; its name does not automatically put it on the JVM classpath. In contrast, `src/main/resources/` normally becomes JAR content. Avoid including packaging-only OS variants there without a runtime reason.

The [native distribution configuration](https://kotlinlang.org/docs/multiplatform/compose-native-distribution.html#application-icon) accepts explicit icon paths. Preserve package names, versions, signing, target formats, and other distribution settings during an icon import.

Use the supported resource-loading API for the actual window entry point. For composable `Window`, a Compose resource painter is suitable; do not transplant it into an API that evaluates its arguments outside composition. The [desktop image guide](https://kotlinlang.org/docs/multiplatform/compose-desktop-images.html#setting-the-window-icon) distinguishes these APIs and the OS behavior: Windows/Linux window icons and the macOS Dock icon have different consumers. The Dock icon comes from the packaged app bundle.

Validate each representation in the ICNS/ICO container. Use platform-appropriate padding and silhouette; don't reuse an Android adaptive foreground as a finished desktop icon. Microsoft's [icon construction guidance](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-construction) covers Windows sizes. Package formats can require their host OS, so report which packaging checks were actually possible.

## Web

Use the directory actually served by the build, for example a Kotlin web resource source set:

```text
webApp/src/webMain/resources/
  favicon.ico
  favicon-32.png
  apple-touch-icon.png
  index.html
```

| Files | Allowed changes |
| --- | --- |
| Favicon and touch-icon assets | Supply the chosen artwork at the declared sizes; a compact set can use ICO entries at 16/32/48 px, a 32 px PNG, and a 180 px touch icon. |
| HTML head or framework metadata owner | Add or update `rel="icon"` and `rel="apple-touch-icon"` references with accurate types and sizes. |
| Existing web-app manifest | Update icon entries only when the requested scope includes installed/PWA identity. |

These dimensions describe a practical set, not a universal requirement to create every file. Frameworks may use file-based metadata or a public asset directory instead of a hand-edited HTML document. Avoid duplicate icon declarations across mechanisms. Resolve URLs against the actual deployment base path and check that resource processing includes the files.

Use [HTML icon-link semantics](https://html.spec.whatwg.org/multipage/links.html#rel-icon) and [Apple's Web Clip icon reference](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html). Leave touch-icon masking to the system. Do not add a service worker, PWA manifest, new application mode, or splash-screen assets as an incidental part of adding favicons.

## Framework-managed or other targets

When a framework generates native resources, locate its configuration and source assets first. Treat generated native files as outputs unless the project deliberately owns them. Extend the map with that framework's actual asset/configuration paths and official requirements. The same scope rules apply; the example module names and trees above are not portable instructions to edit generated Android or Xcode projects.
