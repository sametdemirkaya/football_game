import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import { startNewGame, submitRound } from '../api'; // API import

export default function GameScreen({ route, navigation }) {
  const { mode, player1, player2, difficulty } = route.params || {};

  const [guess1, setGuess1] = useState('');
  const [guess2, setGuess2] = useState('');
  const [isResultModalVisible, setResultModalVisible] = useState(false);
  
  // API State'leri
  const [isLoading, setIsLoading] = useState(true);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [targetStat, setTargetStat] = useState(null); // { name: 'Ast', value: 15, display: 'ASİST' }
  const [roundResultData, setRoundResultData] = useState(null); // Backend dönen sonuç objesi
  
  // Skorlar
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  // Ekrana ilk girildiğinde yeni bir raunt (oyuncu) çeker
  useEffect(() => {
    fetchNewRound();
  }, []);

  const fetchNewRound = async () => {
    setIsLoading(true);
    setGuess1('');
    setGuess2('');
    setRoundResultData(null);
    try {
      const response = await startNewGame(difficulty || 'Orta');
      const player = response.target_player;
      setTargetPlayer(player);
      
      // Sadece sayısıl / maç içi istatistikleri filtreleyelim
      const universalFeatures = ['Player', 'Age', 'Team', 'League', 'Pos', 'Zorluk_Seviyesi'];
      const availableStats = Object.keys(player).filter(k => !universalFeatures.includes(k) && player[k] !== null);
      
      if (availableStats.length > 0) {
        // Rastgele bir istatistik seç
        const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
        
        // Frontend'de güzel görünmesi için Türkçe isim sözlüğü
        const statNames = {
          'Gls': 'GOL', 'Ast': 'ASİST', 'SoT': 'İSABETLİ ŞUT',
          'Crs': 'ORTA', 'Int': 'PAS ARASI', 'TklW': 'KAZANILAN İKİLİ MÜCADELE',
          'CS': 'GOL YEMEME (CLEAN SHEET)', 'Saves': 'KURTARIŞ', 'GA': 'YENİLEN GOL'
        };
        
        setTargetStat({
          name: randomStat,
          value: player[randomStat],
          display: statNames[randomStat] || randomStat.toUpperCase()
        });
      }
    } catch (error) {
      Alert.alert('Bağlantı Hatası', error.message || 'Sunucudan oyuncu getirilemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const showHint = () => {
    if (targetPlayer) {
      Alert.alert('İpucu', `Takım: ${targetPlayer.Team}\nLig: ${targetPlayer.League}\nYaş: ${targetPlayer.Age}`);
    }
  };

  const handleShowResults = async () => {
    if (!guess1 || !guess2) {
      Alert.alert('Eksik Tahmin', 'Lütfen her iki oyuncu için de tahmin ettiğiniz futbolcu isimlerini giriniz.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Backend'e istatistik adı, değeri ve oyuncuların tahminlerini gönderiyoruz
      const result = await submitRound(targetStat.name, targetStat.value, guess1, guess2);
      
      setRoundResultData(result);
      
      // Skoru Güncelle
      if (result.round_winner === "Player 1") setP1Score(prev => prev + 1);
      else if (result.round_winner === "Player 2") setP2Score(prev => prev + 1);
      
      setResultModalVisible(true);
    } catch (error) {
      Alert.alert('Tahmin Hatası', error.message || 'Tahminler sunucuya gönderilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNextRound = () => {
    setResultModalVisible(false);
    fetchNewRound();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst Kısım: Scoreboard */}
      <View style={styles.scoreboard}>
        <Text style={styles.scoreText}>
          KATEGORİ: {isLoading || !targetStat ? 'YÜKLENİYOR...' : targetStat.display}
        </Text>
        <Text style={styles.scoreText}>SKOR: {p1Score}-{p2Score}</Text>
      </View>

      {/* Orta Kısım: Taktik Tahtası (Oyun Alanı) */}
      <View style={styles.tacticBoard}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Text style={styles.playerName}>
            {targetPlayer ? targetPlayer.Player.toUpperCase() : 'OYUNCU BULUNAMADI'}
          </Text>
        )}
      </View>

      {/* Alt Kısım: Tahmin ve İpucu Alanı */}
      <View style={styles.guessSection}>
        {/* İpucu Butonu */}
        <TouchableOpacity style={styles.hintButton} onPress={showHint} activeOpacity={0.8} disabled={isLoading}>
          <Text style={styles.hintText}>İPUCU AL</Text>
        </TouchableOpacity>

        {/* Yan Yana Tahmin Kutuları */}
        <View style={styles.inputsRow}>
          <TextInput
            style={styles.guessInput}
            placeholder={`${player1 || '1. Oyuncu'} Tahmini`}
            placeholderTextColor="#9CA3AF"
            value={guess1}
            onChangeText={setGuess1}
            editable={!isLoading}
          />
          <TextInput
            style={styles.guessInput}
            placeholder={`${player2 || '2. Oyuncu'} Tahmini`}
            placeholderTextColor="#9CA3AF"
            value={guess2}
            onChangeText={setGuess2}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* En Alt: Sonuçları Gör Butonu */}
      <View style={styles.footer}>
        <CustomButton 
          title={isLoading ? "BEKLEYİNİZ..." : "SONUÇLARI GÖR"} 
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
            
            {roundResultData && (
              <>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Hedef ({roundResultData.target_stat_name}):</Text>
                  <Text style={styles.resultValue}>{roundResultData.target_stat_value}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{player1 || '1. Oyuncu'} ({roundResultData.player1.name}):</Text>
                  <Text style={styles.resultValue}>{roundResultData.player1.stat_value} (Fark: {roundResultData.player1.difference})</Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{player2 || '2. Oyuncu'} ({roundResultData.player2.name}):</Text>
                  <Text style={styles.resultValue}>{roundResultData.player2.stat_value} (Fark: {roundResultData.player2.difference})</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.winnerText}>
                  {roundResultData.round_winner === "Tie" ? "BERABERE!" : 
                   roundResultData.round_winner === "Player 1" ? `${player1 || '1. OYUNCU'} KAZANDI!` : 
                   `${player2 || '2. OYUNCU'} KAZANDI!`}
                </Text>
              </>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleNextRound}
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scoreboard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1E3A8A', paddingVertical: 16, paddingHorizontal: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6,
  },
  scoreText: { color: '#FBBF24', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  tacticBoard: {
    flex: 1, backgroundColor: '#166534', margin: 20, borderRadius: 16, borderWidth: 3, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  playerName: {
    color: '#FFFFFF', fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4, paddingHorizontal: 10,
  },
  guessSection: { paddingHorizontal: 20, marginBottom: 30, alignItems: 'center' },
  hintButton: {
    backgroundColor: '#FACC15', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  hintText: { color: '#1F2937', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  inputsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  guessInput: {
    flex: 1, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 12, textAlign: 'center', fontSize: 16, color: '#1F2937', fontWeight: '600',
  },
  footer: { paddingHorizontal: 20, marginBottom: 40, alignItems: 'center' },
  resultButton: { width: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '90%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 15,
  },
  modalTitle: { fontSize: 26, fontWeight: '900', color: '#1E3A8A', marginBottom: 20, letterSpacing: 1 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 8 },
  resultLabel: { fontSize: 14, color: '#4B5563', fontWeight: '600', flex: 1 },
  resultValue: { fontSize: 16, color: '#111827', fontWeight: 'bold', flex: 1, textAlign: 'right' },
  divider: { width: '100%', height: 1, backgroundColor: '#E5E7EB', marginVertical: 15 },
  winnerText: { fontSize: 22, fontWeight: 'bold', color: '#166534', marginVertical: 15, textAlign: 'center' },
  closeButton: { marginTop: 10, backgroundColor: '#FBBF24', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, width: '100%' },
  closeButtonText: { color: '#1E3A8A', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});
