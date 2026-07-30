import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import CustomInput from '../components/CustomInput';
import SurfaceCard from '../components/SurfaceCard';
import LoadingComponent from '../components/LoadingComponent';
import ErrorModal from '../components/ErrorModal';
import { theme } from '../theme';
import { startNewGame, submitRound, searchPlayer } from '../api';
import { useGameContext } from '../context/GameContext';
import { getGameOverTrashTalk } from '../utils/trashTalk'; // Sadece oyun sonu eklendi

export default function GameScreen({ route, navigation }) {
  const { mode, player1, player2, difficulty } = route.params || {};
  const { targetScore } = useGameContext(); // Hedef skor (sadece multi için)
  
  const [localP1Score, setLocalP1Score] = useState(0);
  const [localP2Score, setLocalP2Score] = useState(0);

  const [guess1, setGuess1] = useState('');
  const [guess2, setGuess2] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorConfig, setErrorConfig] = useState({ visible: false, title: '', message: '' });
  
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [targetStat, setTargetStat] = useState(null);
  const [roundResultData, setRoundResultData] = useState(null);
  const [isResultModalVisible, setResultModalVisible] = useState(false);

  // Game Over State (Sadece Multi için)
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverTrashTalk, setGameOverTrashTalk] = useState('');
  const [winnerName, setWinnerName] = useState('');

  const [selectionConfig, setSelectionConfig] = useState({ visible: false, playerKey: '', title: '', options: [] });
  const [validatedP1, setValidatedP1] = useState(null);

  useEffect(() => {
    fetchNewRound();
  }, []);

  const showError = (title, message) => {
    setErrorConfig({ visible: true, title, message });
  };

  const fetchNewRound = async () => {
    setIsLoading(true);
    setGuess1('');
    setGuess2('');
    setRoundResultData(null);
    try {
      const response = await startNewGame(difficulty || 'Orta');
      const player = response.target_player;
      setTargetPlayer(player);
      
      const universalFeatures = ['Player', 'Age', 'Team', 'League', 'Pos', 'Zorluk_Seviyesi'];
      const availableStats = Object.keys(player).filter(k => !universalFeatures.includes(k) && player[k] !== null);
      
      if (availableStats.length > 0) {
        const randomStat = availableStats[Math.floor(Math.random() * availableStats.length)];
        const statNames = {
          'Gls': 'GOL', 'Ast': 'ASİST', 'SoT': 'İSABETLİ ŞUT',
          'Crs': 'ORTA', 'Int': 'PAS ARASI', 'TklW': 'KAZANILAN İKİLİ MÜCADELE',
          'CS': 'GOL YEMEME', 'Saves': 'KURTARIŞ', 'GA': 'YENİLEN GOL'
        };
        
        setTargetStat({
          name: randomStat,
          value: player[randomStat],
          display: statNames[randomStat] || randomStat.toUpperCase()
        });
      }
    } catch (error) {
      showError('Bağlantı Hatası', error.message || 'Sunucudan oyuncu getirilemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const showHint = () => {
    if (targetPlayer) {
      showError('İpucu', `Takım: ${targetPlayer.Team}\nLig: ${targetPlayer.League}\nYaş: ${targetPlayer.Age}\nMevki: ${targetPlayer.Pos}`);
    }
  };

  const executeSubmit = async (p1Name, p2Name) => {
    try {
      const result = await submitRound(targetPlayer.Player, targetStat.name, targetStat.value, p1Name, p2Name);
      
      setRoundResultData(result);
      
      let newP1Score = localP1Score;
      let newP2Score = localP2Score;

      if (result.round_winner === "Player 1") {
        newP1Score += 1;
        setLocalP1Score(newP1Score);
      } else if (result.round_winner === "Player 2" && mode === 'multi') {
        newP2Score += 1;
        setLocalP2Score(newP2Score);
      }
      
      setResultModalVisible(true);

      // Hedef skora ulaşıldı mı kontrolü (SADECE MULTI MOD İÇİN)
      if (mode === 'multi' && (newP1Score >= targetScore || newP2Score >= targetScore)) {
        let overWinner = '';
        if (newP1Score >= targetScore && newP2Score >= targetScore) {
          overWinner = 'Tie';
        } else if (newP1Score >= targetScore) {
          overWinner = player1 || '1. OYUNCU';
        } else {
          overWinner = player2 || '2. OYUNCU';
        }
        
        setWinnerName(overWinner);
        setGameOverTrashTalk(getGameOverTrashTalk(overWinner === 'Tie'));
        setIsGameOver(true);
      }

    } catch (error) {
      showError('Tahmin Hatası', error.message || 'Tahminler sunucuya gönderilirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelection = async (selectedName) => {
    setSelectionConfig({ ...selectionConfig, visible: false });
    setIsLoading(true);
    
    try {
      if (selectionConfig.playerKey === 'p1') {
        const p1Final = selectedName;
        let p2Final = p1Final;
        
        if (mode === 'multi') {
          const p2Search = await searchPlayer(guess2);
          if (p2Search.match_type === 'none') {
            throw new Error(`2. Oyuncu tahmini '${guess2}' veri setinde bulunamadı.`);
          } else if (p2Search.match_type === 'multiple') {
            setValidatedP1(p1Final);
            setSelectionConfig({
              visible: true,
              playerKey: 'p2',
              title: '2. Oyuncu: Kimi kastettiniz?',
              options: p2Search.players
            });
            setIsLoading(false);
            return;
          }
          p2Final = p2Search.players[0].name;
        }
        await executeSubmit(p1Final, p2Final);
        
      } else if (selectionConfig.playerKey === 'p2') {
        await executeSubmit(validatedP1, selectedName);
      }
    } catch (error) {
      showError('Tahmin Hatası', error.message);
      setIsLoading(false);
    }
  };

  const handleShowResults = async () => {
    if (mode === 'single' && !guess1) {
      showError('Eksik Tahmin', 'Lütfen tahmin ettiğiniz futbolcu ismini giriniz.');
      return;
    }
    if (mode === 'multi' && (!guess1 || !guess2)) {
      showError('Eksik Tahmin', 'Lütfen her iki oyuncu için de tahmin giriniz.');
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Oyuncu Kontrolü
      const p1Search = await searchPlayer(guess1);
      if (p1Search.match_type === 'none') {
        throw new Error(`1. Oyuncu tahmini '${guess1}' veri setinde bulunamadı.`);
      } else if (p1Search.match_type === 'multiple') {
        setSelectionConfig({
          visible: true,
          playerKey: 'p1',
          title: '1. Oyuncu: Kimi kastettiniz?',
          options: p1Search.players
        });
        setIsLoading(false);
        return;
      }
      
      const p1Final = p1Search.players[0].name;
      let p2Final = p1Final;
      
      // 2. Oyuncu Kontrolü
      if (mode === 'multi') {
        const p2Search = await searchPlayer(guess2);
        if (p2Search.match_type === 'none') {
          throw new Error(`2. Oyuncu tahmini '${guess2}' veri setinde bulunamadı.`);
        } else if (p2Search.match_type === 'multiple') {
          setValidatedP1(p1Final);
          setSelectionConfig({
            visible: true,
            playerKey: 'p2',
            title: '2. Oyuncu: Kimi kastettiniz?',
            options: p2Search.players
          });
          setIsLoading(false);
          return;
        }
        p2Final = p2Search.players[0].name;
      }
      
      await executeSubmit(p1Final, p2Final);
      
    } catch (error) {
      showError('Tahmin Hatası', error.message || 'Tahminler kontrol edilirken hata oluştu.');
      setIsLoading(false);
    }
  };
  
  const handleNextRound = () => {
    setResultModalVisible(false);
    if (!isGameOver) {
      fetchNewRound();
    }
  };

  const handleRematch = () => {
    setLocalP1Score(0);
    setLocalP2Score(0);
    setIsGameOver(false);
    setResultModalVisible(false);
    fetchNewRound();
  };

  const handleGoHome = () => {
    setResultModalVisible(false);
    setIsGameOver(false);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ErrorModal 
        visible={errorConfig.visible} 
        title={errorConfig.title} 
        message={errorConfig.message} 
        onClose={() => setErrorConfig({ ...errorConfig, visible: false })} 
      />

      <KeyboardAvoidingView style={styles.flex1} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            
            {/* Scoreboard */}
            <View style={styles.scoreboard}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.categoryText} numberOfLines={2}>
                  HEDEF: {isLoading || !targetStat ? 'YÜKLENİYOR...' : targetStat.display}
                </Text>
                {mode === 'multi' && (
                  <Text style={styles.targetScoreText}>({targetScore} Olan Kazanır)</Text>
                )}
              </View>
              {mode === 'multi' && (
                <Text style={styles.scoreText}>SKOR: {localP1Score}-{localP2Score}</Text>
              )}
              {mode === 'single' && (
                <Text style={styles.scoreText}>DOĞRU: {localP1Score}</Text>
              )}
            </View>

            {/* Oyun Alanı */}
            <SurfaceCard style={styles.playArea}>
              {isLoading ? (
                <LoadingComponent message="Oyuncu Seçiliyor..." />
              ) : (
                <Text style={styles.playerName}>
                  {targetPlayer ? targetPlayer.Player.toUpperCase() : 'OYUNCU BULUNAMADI'}
                </Text>
              )}
            </SurfaceCard>

            {/* Tahmin Alanı */}
            <View style={styles.guessSection}>
              <PrimaryButton 
                title="İPUCU AL" 
                onPress={showHint} 
                disabled={isLoading} 
                type="primary"
                style={styles.hintButton}
              />

              <View style={styles.inputsContainer}>
                {mode === 'single' ? (
                  <CustomInput
                    placeholder="Tahmininiz..."
                    value={guess1}
                    onChangeText={setGuess1}
                    editable={!isLoading}
                  />
                ) : (
                  <>
                    <CustomInput
                      label={`${player1 || '1. Oyuncu'} Tahmini`}
                      placeholder="1. Oyuncu Tahmini"
                      value={guess1}
                      onChangeText={setGuess1}
                      editable={!isLoading}
                    />
                    <CustomInput
                      label={`${player2 || '2. Oyuncu'} Tahmini`}
                      placeholder="2. Oyuncu Tahmini"
                      value={guess2}
                      onChangeText={setGuess2}
                      editable={!isLoading}
                    />
                  </>
                )}
              </View>
            </View>

            {/* Alt Buton */}
            <View style={styles.footer}>
              <PrimaryButton 
                title={isLoading ? "BEKLEYİNİZ..." : "SONUÇLARI GÖR"} 
                onPress={handleShowResults}
                disabled={isLoading}
              />
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Oyuncu Seçim Modalı */}
      <Modal visible={selectionConfig.visible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <SurfaceCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectionConfig.title}</Text>
            <Text style={styles.modalSubtitle}>Birden fazla eşleşme bulundu. Hangisini kastettiniz?</Text>
            
            <View style={{ width: '100%', marginVertical: 10 }}>
              {selectionConfig.options.map((opt, index) => (
                <PrimaryButton 
                  key={index}
                  title={`${opt.name}`}
                  onPress={() => handleSelection(opt.name)}
                  type="info"
                  style={{ marginBottom: 10 }}
                />
              ))}
            </View>
            
            <PrimaryButton 
              title="İPTAL" 
              onPress={() => setSelectionConfig({ ...selectionConfig, visible: false })}
              type="danger" 
              style={{ marginTop: 10 }} 
            />
          </SurfaceCard>
        </View>
      </Modal>

      {/* Sonuç Modalı */}
      <Modal visible={isResultModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <SurfaceCard style={styles.modalCard}>
            
            {isGameOver ? (
              <Text style={styles.gameOverTitle}>ŞAMPİYON</Text>
            ) : (
              <Text style={styles.modalTitle}>SONUÇ TAHTASI</Text>
            )}
            
            {roundResultData && (
              <View style={styles.modalContent}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Hedef ({roundResultData.target_stat_name}):</Text>
                  <Text style={styles.resultValue}>{roundResultData.target_stat_value}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{player1 || '1. Oyuncu'} ({roundResultData.player1.name}):</Text>
                  <Text style={styles.resultValue}>{roundResultData.player1.stat_value} (Fark: {roundResultData.player1.difference})</Text>
                </View>

                {mode === 'multi' && (
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>{player2 || '2. Oyuncu'} ({roundResultData.player2.name}):</Text>
                    <Text style={styles.resultValue}>{roundResultData.player2.stat_value} (Fark: {roundResultData.player2.difference})</Text>
                  </View>
                )}

                <View style={styles.divider} />

                {!isGameOver && (
                  <Text style={styles.winnerText}>
                    {mode === 'single' ? (
                      roundResultData.round_winner === "Player 1" ? "TEBRİKLER, BİLDİNİZ!" : "MAALESEF, BİLEMEDİNİZ."
                    ) : (
                      roundResultData.round_winner === "Tie" ? "BERABERE!" : 
                      roundResultData.round_winner === "Player 1" ? `${player1 || '1. OYUNCU'} KAZANDI!` : 
                      `${player2 || '2. OYUNCU'} KAZANDI!`
                    )}
                  </Text>
                )}
              </View>
            )}

            {isGameOver && (
              <View style={styles.modalContent}>
                <Text style={styles.winnerText}>{winnerName === 'Tie' ? 'BERABERE' : `${winnerName} KAZANDI!`}</Text>
                <Text style={styles.trashTalkText}>"{gameOverTrashTalk}"</Text>
                <Text style={styles.finalScoreText}>Maç Sonucu: {localP1Score} - {localP2Score}</Text>
              </View>
            )}

            {isGameOver ? (
              <View style={{ width: '100%', marginTop: theme.spacing.lg }}>
                <PrimaryButton title="RÖVANŞ OYNA" onPress={handleRematch} type="info" />
                <PrimaryButton title="ANA MENÜYE DÖN" onPress={handleGoHome} style={{ marginTop: 10 }} type="primary" />
              </View>
            ) : (
              <PrimaryButton title="SONRAKİ TUR" onPress={handleNextRound} style={styles.nextButton} />
            )}
            
          </SurfaceCard>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  flex1: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'space-between' },
  scoreboard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme.colors.surfaceSolid, paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.lg, color: theme.colors.textLight },
  targetScoreText: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: theme.typography.sizes.sm, color: '#38BDF8', marginTop: 2 },
  scoreText: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.xxl, color: theme.colors.primary },
  playArea: { margin: theme.spacing.lg, height: 150, justifyContent: 'center', alignItems: 'center', borderColor: theme.colors.primary, borderWidth: 1 },
  playerName: {
    fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.xxl,
    color: theme.colors.primary, textAlign: 'center', letterSpacing: 2,
    textShadowColor: 'rgba(251, 191, 36, 0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
  },
  guessSection: { paddingHorizontal: theme.spacing.lg, alignItems: 'center' },
  hintButton: { width: '50%', marginBottom: theme.spacing.md },
  inputsContainer: { width: '100%' },
  footer: { padding: theme.spacing.lg, marginTop: theme.spacing.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
  modalCard: { width: '100%', padding: theme.spacing.xl, alignItems: 'center' },
  modalTitle: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.xxl, color: theme.colors.primary, marginBottom: theme.spacing.lg },
  gameOverTitle: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.xxxl, color: theme.colors.primary, marginBottom: theme.spacing.sm, textShadowColor: 'rgba(251, 191, 36, 0.6)', textShadowRadius: 15 },
  modalSubtitle: { fontFamily: theme.typography.fontFamily.body, color: theme.colors.textLight, textAlign: 'center', marginBottom: 15 },
  modalContent: { width: '100%' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: theme.spacing.xs },
  resultLabel: { fontFamily: theme.typography.fontFamily.body, fontSize: theme.typography.sizes.md, color: theme.colors.textMuted, flex: 1 },
  resultValue: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textLight, flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: theme.spacing.md },
  winnerText: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.success, textAlign: 'center', marginVertical: theme.spacing.md },
  trashTalkText: { fontFamily: theme.typography.fontFamily.bodyBold, fontSize: theme.typography.sizes.md, color: '#38BDF8', textAlign: 'center', fontStyle: 'italic', marginTop: theme.spacing.sm, marginBottom: theme.spacing.sm },
  finalScoreText: { fontFamily: theme.typography.fontFamily.heading, fontSize: theme.typography.sizes.lg, color: theme.colors.textLight, textAlign: 'center', marginTop: theme.spacing.md },
  nextButton: { marginTop: theme.spacing.lg }
});
