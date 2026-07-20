import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function SettingsScreen({ navigation }) {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('TR');

  return (
    <SafeAreaView style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>AYARLAR</Text>

      {/* Ayar Satırları (List View) */}
      <View style={styles.listContainer}>
        
        {/* Müzik Ayarı */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Müzik</Text>
          <Switch 
            value={musicEnabled} 
            onValueChange={setMusicEnabled}
            trackColor={{ false: '#D1D5DB', true: '#1E3A8A' }} // Lacivert aktif renk
            thumbColor={musicEnabled ? '#FFFFFF' : '#F3F4F6'}
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Dokunma Sesi Ayarı */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Dokunma Sesi</Text>
          <Switch 
            value={soundEnabled} 
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#D1D5DB', true: '#1E3A8A' }}
            thumbColor={soundEnabled ? '#FFFFFF' : '#F3F4F6'}
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Dil Ayarı */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Dil</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity 
              onPress={() => setLanguage('TR')}
              style={styles.langButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, language === 'TR' && styles.langTextActive]}>TR</Text>
            </TouchableOpacity>
            
            <Text style={styles.langSeparator}>|</Text>
            
            <TouchableOpacity 
              onPress={() => setLanguage('EN')}
              style={styles.langButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, language === 'EN' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Geri Dönüş Butonu */}
      <View style={styles.footer}>
        <CustomButton 
          title="Ana Sayfaya Dön" 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Açık gri arka plan
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900', // Sportif ve kalın
    color: '#1F2937', // Koyu gri başlık
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
    letterSpacing: 1.5,
  },
  listContainer: {
    flex: 1,
    gap: 16, // Satırlar arası boşluk
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Beyaz arka plan
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16, // Hafif oval köşeler
    shadowColor: '#000', // Hafif gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  langText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF', // Pasif renk
  },
  langTextActive: {
    color: '#1E3A8A', // Aktif lacivert
    fontWeight: 'bold',
  },
  langSeparator: {
    fontSize: 18,
    color: '#D1D5DB',
    marginHorizontal: 4,
  },
  footer: {
    marginBottom: 40, // En altta boşluk
  },
  backButton: {
    width: '100%',
  }
});
