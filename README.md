# Schranz Patch Lab — Android APK bronproject

Deze repository bevat een Capacitor-wrapper voor de Beta 2 webapp. De audio-engine draait lokaal in Android WebView. De APK is een **debug-build** voor eigen gebruik, geen Play Store-release.

## Bouw APK via GitHub (geen PC nodig)
1. Upload de **inhoud** van deze ZIP naar de root van de repository `Naga303909/schranz-patch-lab`, inclusief de verborgen `.github/workflows/build-apk.yml` map. Upload niet de ZIP als één bestand.
2. Ga naar GitHub → repository → **Actions** → **Bouw Android APK** → **Run workflow** (of wacht op de automatische run na upload naar main).
3. Wacht op een groene build en open de run. Download onder **Artifacts** `Schranz-Patch-Lab-Android-debug-APK`.
4. Pak de gedownloade artifact-ZIP uit en open `app-debug.apk` op Android. Sta installatie van apps uit deze bron toe indien Android daarom vraagt.

## Lokaal bouwen met Android Studio
`npm ci`, `npx cap add android`, `npx cap sync android`, `npx cap open android`. Bouw vervolgens een debug APK in Android Studio.

## Let op
GitHub Actions kan bij wijzigingen aan Android/Capacitor of de buildomgeving aanpassing nodig hebben. De build is niet vooraf uitgevoerd. Deze app simuleert hardware bij benadering; het is geen nauwkeurige BIA-emulatie. Houd het volume laag.
