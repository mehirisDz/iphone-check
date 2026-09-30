import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { TEST_REGISTRY } from '../tests/registry';
import { TestResults, TestId, TestOutcome } from '../types';
import { WelcomeScreen } from './WelcomeScreen';
import { ReportScreen } from './ReportScreen';

// Test screens
import { ColorSweepTest } from './tests/01-ColorSweep';
import { TouchGridTest } from './tests/02-TouchGrid';
import { MultiTouchTest } from './tests/03-MultiTouch';
import { AccelerometerTest } from './tests/04-Accelerometer';
import { CompassTest } from './tests/05-Compass';
import { ProximityTest } from './tests/06-Proximity';
import { FrontCameraTest } from './tests/07-FrontCamera';
import { RearCameraTest } from './tests/08-RearCamera';
import { FlashlightTest } from './tests/09-Flashlight';
import { SpeakerTest } from './tests/10-Speaker';
import { MicrophoneTest } from './tests/11-Microphone';
import { BiometricsTest } from './tests/12-Biometrics';
import { GPSTest } from './tests/13-GPS';
import { WiFiTest } from './tests/14-WiFi';
import { BluetoothTest } from './tests/15-Bluetooth';
import { StorageTest } from './tests/16-Storage';
import { VibrationTest } from './tests/17-Vibration';
import { VolumeButtonsTest } from './tests/18-VolumeButtons';
import { MuteSwitchTest } from './tests/19-MuteSwitch';
import { PowerButtonTest } from './tests/20-PowerButton';
import { TestScreenProps } from '../types';

type Screen = 'welcome' | 'test' | 'report';

const TEST_COMPONENTS: Record<TestId, React.ComponentType<TestScreenProps>> = {
  'color-sweep': ColorSweepTest,
  'touch-grid': TouchGridTest,
  'multi-touch': MultiTouchTest,
  'accelerometer': AccelerometerTest,
  'compass': CompassTest,
  'proximity': ProximityTest,
  'front-camera': FrontCameraTest,
  'rear-camera': RearCameraTest,
  'flashlight': FlashlightTest,
  'speaker': SpeakerTest,
  'microphone': MicrophoneTest,
  'biometrics': BiometricsTest,
  'gps': GPSTest,
  'wifi': WiFiTest,
  'bluetooth': BluetoothTest,
  'storage': StorageTest,
  'vibration': VibrationTest,
  'volume-buttons': VolumeButtonsTest,
  'mute-switch': MuteSwitchTest,
  'power-button': PowerButtonTest,
};

export function TestRunnerScreen() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<TestResults>({});

  const isInspecting = screen === 'test';

  // Keep screen on and lock status bar during active inspection
  useEffect(() => {
    if (isInspecting) {
      activateKeepAwakeAsync().catch(() => {});
    } else {
      deactivateKeepAwake();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [isInspecting]);

  const recordAndAdvance = (outcome: TestOutcome) => {
    const testId = TEST_REGISTRY[stepIndex].id;
    setResults((prev) => ({ ...prev, [testId]: outcome }));
    if (stepIndex + 1 >= TEST_REGISTRY.length) {
      setScreen('report');
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleRetry = (index: number) => {
    setStepIndex(index);
    setScreen('test');
  };

  const handleReset = () => {
    setResults({});
    setStepIndex(0);
    setScreen('welcome');
  };

  if (screen === 'welcome') {
    return (
      <>
        <StatusBar style="light" />
        <WelcomeScreen onStart={() => { setStepIndex(0); setScreen('test'); }} />
      </>
    );
  }

  if (screen === 'report') {
    return (
      <>
        <StatusBar style="light" />
        <ReportScreen results={results} onRetry={handleRetry} onReset={handleReset} />
      </>
    );
  }

  const currentTest = TEST_REGISTRY[stepIndex];
  const TestComponent = TEST_COMPONENTS[currentTest.id as TestId];

  return (
    <>
      {/* Hide status bar during active inspection for full-screen immersive experience */}
      <StatusBar style="light" hidden />
      <View style={{ flex: 1 }}>
        <TestComponent
          onPass={() => recordAndAdvance('pass')}
          onFail={() => recordAndAdvance('fail')}
          onSkip={() => recordAndAdvance('skip')}
        />
      </View>
    </>
  );
}
