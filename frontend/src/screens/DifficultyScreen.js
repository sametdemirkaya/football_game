import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function DifficultyScreen({ route, navigation }) {
  // PlayerSetupScreen'den gelen verileri yakala
  const { mode, player1, player2 } = route.params || {};

  const handleDifficultySelect = (difficulty) => {
    // Tüm verilerle (mod, isimler, zorluk) birlikte oyun ekranına geçiş yap
    navigation.navigate('Game', {
      mode,
      player1,
      player2,
      difficulty
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ZORLUK SEÇİMİ</Text>

      <View style={styles.buttonContainer}>
        <CustomButton 
          title="KOLAY" 
          onPress={() => handleDifficultySelect('Kolay')} 
        />
        <CustomButton 
          title="ORTA" 
          onPress={() => handleDifficultySelect('Orta')} 
        />
        <CustomButton 
          title="ZOR" 
          onPress={() => handleDifficultySelect('Zor')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // PlayerSetup ile uyumlu arka plan
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900', 
    color: '#1F2937', 
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1.5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  }
});
