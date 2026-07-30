import { searchPlayerLocal, startNewGameLocal, submitRoundLocal } from './services/localGameEngine';

/**
 * Oyuncu araması yapar
 * @param {string} playerName - Aranan oyuncu ismi
 * @returns {Promise<Object>} Arama sonuçları
 */
export const searchPlayer = async (playerName) => {
  return await searchPlayerLocal(playerName);
};

/**
 * Yeni oyun başlatır ve zorluk seviyesine göre rastgele hedef oyuncu belirler
 * @param {string} difficulty - Zorluk seviyesi ('Kolay', 'Orta', 'Zor')
 * @returns {Promise<Object>} Hedef oyuncu ve istatistikleri
 */
export const startNewGame = async (difficulty = 'Orta') => {
  return await startNewGameLocal(difficulty);
};

/**
 * Kullanıcıların tahminlerini yerel oyun motoruna gönderir ve fark hesaplamalarını/kazananı döndürür.
 * @param {string} targetPlayerName - Oynanan (Tahtadaki) hedef oyuncunun ismi
 * @param {string} targetStatName - İstatistik adı (Örn: 'Ast', 'Gls')
 * @param {number} targetStatValue - Gerçek istatistik değeri
 * @param {string} p1Guess - 1. Oyuncunun tahmin ettiği futbolcu ismi
 * @param {string} p2Guess - 2. Oyuncunun tahmin ettiği futbolcu ismi
 * @returns {Promise<Object>} Yerel motordan dönen sonuç hesaplaması
 */
export const submitRound = async (targetPlayerName, targetStatName, targetStatValue, p1Guess, p2Guess) => {
  return await submitRoundLocal(targetPlayerName, targetStatName, targetStatValue, p1Guess, p2Guess);
};
