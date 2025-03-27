import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Demo1 from './expo-notification/Demo1';
import MainFile from './expo-notification/MainFile';

export default function App() {
  return (
    <View style={styles.container}>
      <MainFile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
