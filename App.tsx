import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { TestRunnerScreen } from './src/screens/TestRunnerScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <TestRunnerScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
