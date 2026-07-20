import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function PlayerSetupScreen({ route, navigation }) {
  // HomeScreen'den gelen mod parametresini yakala (varsayılan: multi)
  const mode = route.params?.mode || 'multi';

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>OYUNCULARI BELİRLE</Text>

      {/* İsim Giriş Kutuları */}
      <View style={styles.inputContainer}>
        {mode === 'single' ? (
          // Tek Oyunculu Mod
          <TextInput
            style={styles.input}
            placeholder="Oyuncu İsmi (Örn: Samet)"
            placeholderTextColor="#9CA3AF"
            value={player1}
            onChangeText={setPlayer1}
          />
        ) : (
          // Çift Oyunculu Mod
          <>
            <TextInput
              style={styles.input}
              placeholder="1. Oyuncu (Örn: Samet)"
              placeholderTextColor="#9CA3AF"
              value={player1}
              onChangeText={setPlayer1}
            />
            <TextInput
              style={styles.input}
              placeholder="2. Oyuncu (Örn: Furkan)"
              placeholderTextColor="#9CA3AF"
              value={player2}
              onChangeText={setPlayer2}
            />
          </>
        )}
      </View>

      {/* Buton Alanı */}
      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Kaydet ve Sahaya Çık" 
          onPress={() => navigation.navigate('Game')} 
          style={styles.button}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900', // Sportif kalınlık
    color: '#1F2937', // Koyu gri metin
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1.5,
  },
  inputContainer: {
    width: '100%',
    gap: 20, // İki kutu arası boşluk
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E3A8A', // Şık lacivert kenarlık vurgusu
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  }
});
