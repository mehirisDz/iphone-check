export type TestOutcome = 'pass' | 'fail' | 'skip' | 'pending';

export type TestId =
  | 'color-sweep'
  | 'touch-grid'
  | 'multi-touch'
  | 'accelerometer'
  | 'compass'
  | 'proximity'
  | 'front-camera'
  | 'rear-camera'
  | 'flashlight'
  | 'speaker'
  | 'microphone'
  | 'biometrics'
  | 'gps'
  | 'wifi'
  | 'bluetooth'
  | 'storage'
  | 'vibration'
  | 'volume-buttons'
  | 'mute-switch'
  | 'power-button';

export interface TestDefinition {
  id: TestId;
  title: string;
  subtitle: string;
  icon: string; // emoji for now
  category: TestCategory;
  autoPass?: boolean; // sensor automatically confirms pass
}

export type TestCategory =
  | 'Screen & Touch'
  | 'Motion & Sensors'
  | 'Camera'
  | 'Audio'
  | 'Biometrics'
  | 'Connectivity'
  | 'Hardware';

export type TestResults = Partial<Record<TestId, TestOutcome>>;

export interface TestScreenProps {
  onPass: () => void;
  onFail: () => void;
  onSkip: () => void;
}
