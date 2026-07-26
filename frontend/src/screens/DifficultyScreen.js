import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SurfaceCard from '../components/SurfaceCard';
import { theme } from '../theme';
import { useGameContext } from '../context/GameContext';

export default function DifficultyScreen({ route, navigation }) {
  const { mode, player1, player2 } = route.params || {};
  const { setDifficulty } = useGameContext();

  const handleDifficultySelect = (selectedDifficulty) => {
    // Context'i güncelle
    setDifficulty(selectedDifficulty);
    
    // Oyun ekranına geçiş yap
    navigation.navigate('Game', {
      mode,
      player1,
      player2,
      difficulty: selectedDifficulty
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>ZORLUK SEÇİMİ</Text>
        
        <SurfaceCard style={styles.card}>
          <Text style={styles.subtitle}>Oyun zorluğunu belirleyin. Zor seviyelerde daha az bilinen oyuncular sorulacaktır.</Text>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="KOLAY" 
              onPress={() => handleDifficultySelect('Kolay')} 
              type="info"
            />
            <PrimaryButton 
              title="ORTA" 
              onPress={() => handleDifficultySelect('Orta')} 
              type="primary"
            />
            <PrimaryButton 
              title="ZOR" 
              onPress={() => handleDifficultySelect('Zor')} 
              type="danger" // Kırmızı/Hata rengi ile daha zor olduğunu vurgulamak için
            />
          </View>
        </SurfaceCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  card: {
    paddingVertical: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
  }
});
