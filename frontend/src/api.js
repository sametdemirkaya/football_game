// API Konfigürasyonu
// IP adresi .env dosyasından EXPO_PUBLIC_ prefixi sayesinde otomatik çekilir.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Backend üzerinden yeni bir oyun başlatır ve zorluk seviyesine göre rastgele hedef oyuncu çeker.
 * @param {string} difficulty - Zorluk seviyesi ('Kolay', 'Orta', 'Zor')
 * @returns {Promise<Object>} Backend'den dönen oyuncu verisi
 */
export const startNewGame = async (difficulty) => {
  try {
    const response = await fetch(`${BASE_URL}/start-game?difficulty=${difficulty}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Oyun başlatılamadı');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (startNewGame):', error);
    throw error;
  }
};

/**
 * Kullanıcıların tahminlerini backend'e gönderir ve fark hesaplamalarını/kazananı döndürür.
 * @param {string} targetStatName - İstatistik adı (Örn: 'Ast', 'Gls')
 * @param {number} targetStatValue - Gerçek istatistik değeri
 * @param {string} p1Guess - 1. Oyuncunun tahmin ettiği futbolcu ismi
 * @param {string} p2Guess - 2. Oyuncunun tahmin ettiği futbolcu ismi
 * @returns {Promise<Object>} Backend'den dönen sonuç hesaplaması
 */
export const submitRound = async (targetStatName, targetStatValue, p1Guess, p2Guess) => {
  try {
    const response = await fetch(`${BASE_URL}/submit-round`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target_stat_name: targetStatName,
        target_stat_value: targetStatValue,
        player1_guess: p1Guess,
        player2_guess: p2Guess,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Tahminler değerlendirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (submitRound):', error);
    throw error;
  }
};

/**
 * Oyun bittiğinde son skorları backend'e gönderir ve maçın nihai sonucunu alır.
 * @param {number} p1Score - 1. Oyuncu skoru
 * @param {number} p2Score - 2. Oyuncu skoru
 * @param {string} difficulty - Oynanan zorluk seviyesi
 * @returns {Promise<Object>} Nihai oyun sonucu
 */
export const finishGame = async (p1Score, p2Score, difficulty) => {
  try {
    const response = await fetch(`${BASE_URL}/game-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player1_score: p1Score,
        player2_score: p2Score,
        difficulty: difficulty,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Oyun sonucu hesaplanamadı');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (finishGame):', error);
    throw error;
  }
};
