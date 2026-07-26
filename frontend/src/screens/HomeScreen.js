import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import SurfaceCard from '../components/SurfaceCard';
import { theme } from '../theme';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.content}>
        {/* Üst Kısım: Başlık ve Logo */}
        <View style={styles.headerSection}>
          <Ionicons name="football-outline" size={80} color={theme.colors.primary} style={styles.logo} />
          <Text style={styles.title}>İSTATİSTİK ARENASI</Text>
          <Text style={styles.subtitle}>FUTBOL ZEKA OYUNU</Text>
        </View>

        {/* Alt Kısım: Menü Seçenekleri */}
        <SurfaceCard style={styles.menuCard}>
          <Text style={styles.menuTitle}>OYUN MODUNU SEÇ</Text>
          
          <PrimaryButton
            title="TEK OYUNCULU"
            onPress={() => navigation.navigate('PlayerSetup', { mode: 'single' })}
            style={styles.menuButton}
          />
          
          <PrimaryButton
            title="ÇİFT OYUNCULU"
            onPress={() => navigation.navigate('PlayerSetup', { mode: 'multi' })}
            style={styles.menuButton}
          />
          
          <PrimaryButton
            title="AYARLAR"
            onPress={() => navigation.navigate('Settings')}
            style={styles.menuButton}
          />
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
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: theme.spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  logo: {
    marginBottom: theme.spacing.md,
    textShadowColor: 'rgba(251, 191, 36, 0.3)', // Altın sarısı glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    letterSpacing: 4,
    marginTop: theme.spacing.xs,
  },
  menuCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  menuTitle: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.lg,
    letterSpacing: 1.5,
  },
  menuButton: {
    marginBottom: theme.spacing.md,
  }
});
