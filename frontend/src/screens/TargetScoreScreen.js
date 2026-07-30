import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SurfaceCard from '../components/SurfaceCard';
import { theme } from '../theme';
import { useGameContext } from '../context/GameContext';

export default function TargetScoreScreen({ route, navigation }) {
  const { mode, player1, player2, difficulty } = route.params || {};
  const { setTargetScore } = useGameContext();

  const handleScoreSelect = (score) => {
    setTargetScore(score);
    
    // Oyun ekranına geçiş yap
    navigation.navigate('Game', {
      mode,
      player1,
      player2,
      difficulty
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>HEDEF SKOR</Text>
        
        <SurfaceCard style={styles.card}>
          <Text style={styles.subtitle}>Oyun kaç puanda bitsin?</Text>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="ALTIN GOL (İlk Bilen Kazanır)" 
              onPress={() => handleScoreSelect(1)} 
              type="info"
            />
            <PrimaryButton 
              title="DERBİ MODU (3 Olan Kazanır)" 
              onPress={() => handleScoreSelect(3)} 
              type="primary"
            />
            <PrimaryButton 
              title="90 DAKİKA (5 Olan Kazanır)" 
              onPress={() => handleScoreSelect(5)} 
              type="danger" 
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
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    paddingVertical: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
  }
});
