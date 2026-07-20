import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function GameScreen({ navigation }) {
  const [guess1, setGuess1] = useState('');
  const [guess2, setGuess2] = useState('');
  const [isResultModalVisible, setResultModalVisible] = useState(false);

  // Arka uç (backend) gelene kadar test amaçlı doğru cevabı sabitliyoruz
  const correctAnswer = 15; 

  const showHint = () => {
    Alert.alert('İpucu', 'Belçikalı, orta saha...');
  };

  const handleShowResults = () => {
    if (!guess1 || !guess2) {
      Alert.alert('Eksik Tahmin', 'Lütfen her iki oyuncu için de tahmin giriniz.');
      return;
    }
    setResultModalVisible(true);
  };

  const calculateWinner = () => {
    const diff1 = Math.abs(parseInt(guess1) - correctAnswer);
    const diff2 = Math.abs(parseInt(guess2) - correctAnswer);

    if (diff1 < diff2) return "1. OYUNCU KAZANDI!";
    if (diff2 < diff1) return "2. OYUNCU KAZANDI!";
    return "BERABERE!";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Kısım: Scoreboard */}
      <View style={styles.scoreboard}>
        <Text style={styles.scoreText}>KATEGORİ: ASİST</Text>
        <Text style={styles.scoreText}>SKOR: 1-1</Text>
      </View>

      {/* Orta Kısım: Taktik Tahtası (Oyun Alanı) */}
      <View style={styles.tacticBoard}>
        <Text style={styles.playerName}>KEVIN DE BRUYNE</Text>
      </View>

      {/* Alt Kısım: Tahmin ve İpucu Alanı */}
      <View style={styles.guessSection}>
        {/* İpucu Butonu */}
        <TouchableOpacity style={styles.hintButton} onPress={showHint} activeOpacity={0.8}>
          <Text style={styles.hintText}>LLM İPUCU</Text>
        </TouchableOpacity>

        {/* Yan Yana Tahmin Kutuları */}
        <View style={styles.inputsRow}>
          <TextInput
            style={styles.guessInput}
            placeholder="1. Tahmin"
            placeholderTextColor="#9CA3AF"
            value={guess1}
            onChangeText={setGuess1}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.guessInput}
            placeholder="2. Tahmin"
            placeholderTextColor="#9CA3AF"
            value={guess2}
            onChangeText={setGuess2}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* En Alt: Sonuçları Gör Butonu */}
      <View style={styles.footer}>
        <CustomButton 
          title="Sonuçları Gör" 
          onPress={handleShowResults} 
          style={styles.resultButton}
        />
      </View>

      {/* Sonuç Tahtası Modalı */}
      <Modal
        visible={isResultModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SONUÇ TAHTASI</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Gerçek Cevap:</Text>
              <Text style={styles.resultValue}>{correctAnswer}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>1. Oyuncu Tahmini:</Text>
              <Text style={styles.resultValue}>{guess1}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>2. Oyuncu Tahmini:</Text>
              <Text style={styles.resultValue}>{guess2}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.winnerText}>{calculateWinner()}</Text>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setResultModalVisible(false);
                setGuess1('');
                setGuess2('');
              }}
            >
              <Text style={styles.closeButtonText}>Sonraki Tura Geç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', 
  },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E3A8A', 
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  scoreText: {
    color: '#FBBF24', 
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tacticBoard: {
    flex: 1,
    backgroundColor: '#166534', 
    margin: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 10,
  },
  guessSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  hintButton: {
    backgroundColor: '#FACC15', 
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  hintText: {
    color: '#1F2937', 
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  guessInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB', 
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  resultButton: {
    width: '100%',
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E3A8A',
    marginBottom: 20,
    letterSpacing: 1,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 18,
    color: '#111827',
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },
  winnerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#166534', // Saha yeşili
    marginVertical: 15,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FBBF24',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  closeButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
