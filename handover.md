# iPhone Check — AI Handover Document

## Project Context
This is an Expo/React Native mobile application for a used iPhone pre-purchase inspection (MVP).
It includes 20 hardware tests that run locally on the device (no backend, no EAS required for MVP).
The design language is a sleek dark neon theme (black backgrounds `#0D0D0D`, dark surfaces `#1C1C1E`, with neon lime green `#C6FF00` accents for metrics and progress). 
All tests are wrapped in a central `TestRunnerScreen.tsx` that iterates through them sequentially and ends in a `ReportScreen.tsx`.

## Current State & Completed Work
- **Expo Project**: Scaffolded using `blank-typescript` template.
- **Dependencies Installed**: `expo-sensors`, `expo-camera`, `expo-av`, `expo-local-authentication`, `expo-location`, `expo-network`, `expo-file-system`, `expo-haptics`, `expo-brightness`, `@react-navigation/native`, `@react-navigation/native-stack`, and standard React Native dependencies.
- **Core Architecture & Types**:
  - `src/theme.ts`: Fully updated with the dark/neon green visual style.
  - `src/types.ts`: All test IDs and outcomes defined.
  - `src/tests/registry.ts`: The ordered array of all 20 tests with metadata.
- **Components**:
  - `TestShell.tsx`: The wrapper for all tests (progress bar, pass/fail/skip buttons).
  - `LiveMeter.tsx`: Animated spring meter for live sensor readouts.
  - `MetricCard.tsx`: Reusable dark card with large neon text for metrics.
- **Screens**:
  - `TestRunnerScreen.tsx`: The orchestrator state machine.
  - `WelcomeScreen.tsx`: Completed.
  - `ReportScreen.tsx`: Completed.
  - Test `01-ColorSweep.tsx`: Completed.
  - Test `02-TouchGrid.tsx`: Completed.
  - Test `03-MultiTouch.tsx`: Completed.

## What Failed Just Now
I was trying to write the files for tests `04` to `20` by delegating to subagents, but the subagents hit a `RESOURCE_EXHAUSTED` (Quota) error. You need to write the remaining test files sequentially.

## Your Immediate Next Steps

1. **Write the remaining test screens** in `src/screens/tests/`. Note that you must use `write_to_file`. Ensure you import the shell, theme, and types properly.
   Here are the files you need to write:
   - `04-Accelerometer.tsx` (Use `expo-sensors`)
   - `05-Compass.tsx` (Use `Magnetometer` from `expo-sensors`)
   - `06-Proximity.tsx` (Guided test, no direct API)
   - `07-FrontCamera.tsx` (Use `expo-camera`)
   - `08-RearCamera.tsx` (Use `expo-camera`)
   - `09-Flashlight.tsx` (Use `expo-camera` torch mode, or just guided UI)
   - `10-Speaker.tsx` (Use `expo-av` to play a tone)
   - `11-Microphone.tsx` (Use `expo-av` recording to get live metering)
   - `12-Biometrics.tsx` (Use `expo-local-authentication`)
   - `13-GPS.tsx` (Use `expo-location`)
   - `14-WiFi.tsx` (Use `expo-network`)
   - `15-Bluetooth.tsx` (Managed workflow friendly UI)
   - `16-Storage.tsx` (Use `expo-file-system`)
   - `17-Vibration.tsx` (Use `expo-haptics`)
   - `18-VolumeButtons.tsx` (Guided test)
   - `19-MuteSwitch.tsx` (Guided test or check volume)
   - `20-PowerButton.tsx` (Guided test)

2. **Update App.tsx**: Currently it's the default Expo boilerplate. Update it to render the `TestRunnerScreen` as the root component.

3. **Verify the App**: Once all files are written, inform the user they can start the app via `npm run start` or `npx expo start` to test it on their device using Expo Go.

*Note on styling: Keep everything aligned with `src/theme.ts`. Dark backgrounds, large numbers, pill buttons.*
