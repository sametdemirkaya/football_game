import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SurfaceCard from '../components/SurfaceCard';
import { theme } from '../theme';

export default function SettingsScreen({ navigation }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('TR');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AYARLAR</Text>

      <View style={styles.listContainer}>
        
        <SurfaceCard style={styles.row}>
          <Text style={styles.rowText}>Müzik</Text>
          <Switch 
            value={musicEnabled} 
            onValueChange={setMusicEnabled}
            trackColor={{ false: theme.colors.surfaceSolid, true: theme.colors.primary }}
            thumbColor={musicEnabled ? '#FFFFFF' : theme.colors.textMuted}
            ios_backgroundColor={theme.colors.surfaceSolid}
          />
        </SurfaceCard>

        <SurfaceCard style={styles.row}>
          <Text style={styles.rowText}>Dokunma Sesi</Text>
          <Switch 
            value={soundEnabled} 
            onValueChange={setSoundEnabled}
            trackColor={{ false: theme.colors.surfaceSolid, true: theme.colors.primary }}
            thumbColor={soundEnabled ? '#FFFFFF' : theme.colors.textMuted}
            ios_backgroundColor={theme.colors.surfaceSolid}
          />
        </SurfaceCard>

        <SurfaceCard style={styles.row}>
          <Text style={styles.rowText}>Dil</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity onPress={() => setLanguage('TR')} style={styles.langButton} activeOpacity={0.7}>
              <Text style={[styles.langText, language === 'TR' && styles.langTextActive]}>TR</Text>
            </TouchableOpacity>
            
            <Text style={styles.langSeparator}>|</Text>
            
            <TouchableOpacity onPress={() => setLanguage('EN')} style={styles.langButton} activeOpacity={0.7}>
              <Text style={[styles.langText, language === 'EN' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>
        </SurfaceCard>

      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          title="GERİ DÖN" 
          onPress={() => navigation.goBack()} 
          type="secondary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
    letterSpacing: 1.5,
  },
  listContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  rowText: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  langText: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
  },
  langTextActive: {
    color: theme.colors.primary,
  },
  langSeparator: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.surfaceSolid,
    marginHorizontal: theme.spacing.xs,
  },
  footer: {
    marginBottom: theme.spacing.xl,
  }
});
