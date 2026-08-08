// Offline Oyun Motoru
import footballData from '../data/football_data.json';

// Evrensel özellikler (Her mevki için geçerli)
const UNIVERSAL_FEATURES = ['Player', 'Age', 'Team', 'League', 'Pos', 'Zorluk_Seviyesi'];

// Mevkiye özel istatistikler
const POSITION_SPECIFIC_FEATURES = {
  'FW': ['Gls', 'Ast', 'SoT', 'Age', 'CrdY'],
  'MF': ['Ast', 'Crs', 'Int', 'Age', 'CrdY', 'Gls', 'TklW', 'SoT'],
  'DF': ['TklW', 'Int', 'CrdY', 'Age'],
  'GK': ['Saves', 'CS', 'GA', 'Age']
};

// Metni normalize et
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

// Levenshtein (Benzerlik) Oranı (0 ile 1 arası, 1 = tam eşleşme)
const getSimilarityScore = (a, b) => {
  if (a.length === 0) return b.length === 0 ? 1.0 : 0.0;
  if (b.length === 0) return 0.0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  const dist = matrix[b.length][a.length];
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1.0 : (1.0 - (dist / maxLen));
};

export const searchPlayerLocal = async (playerName) => {
  await new Promise(r => setTimeout(r, 150));

  if (!playerName || playerName.trim() === "") {
    throw new Error("Lütfen bir futbolcu ismi giriniz.");
  }

  const query = normalizeText(playerName);

  // ADIM A: Birebir Eşleşme
  let exactMatches = footballData.filter(p => normalizeText(p.Player) === query);
  if (exactMatches.length > 0) {
    exactMatches.sort((a, b) => (b.oynanabilirlik_skoru || 0) - (a.oynanabilirlik_skoru || 0));
    return { match_type: "exact", players: [{ name: exactMatches[0].Player, score: exactMatches[0].oynanabilirlik_skoru }] };
  }

  // ADIM B: İçinde Geçme (Substring Match)
  let substringMatches = footballData.filter(p => normalizeText(p.Player).includes(query));
  if (substringMatches.length > 0) {
    substringMatches.sort((a, b) => (b.oynanabilirlik_skoru || 0) - (a.oynanabilirlik_skoru || 0));
    const top3 = substringMatches.slice(0, 3);
    if (top3.length === 1) {
      return { match_type: "exact", players: [{ name: top3[0].Player, score: top3[0].oynanabilirlik_skoru }] };
    }
    return { match_type: "multiple", players: top3.map(p => ({ name: p.Player, score: p.oynanabilirlik_skoru })) };
  }

  // ADIM C: Toleranslı Arama (Fuzzy Match cutoff = 0.45)
  let fuzzyMatches = [];
  for (const player of footballData) {
    const normName = normalizeText(player.Player);
    const sim = getSimilarityScore(query, normName);
    if (sim >= 0.45) {
      fuzzyMatches.push({ ...player, _sim: sim });
    }
  }

  if (fuzzyMatches.length > 0) {
    // Önce benzerliğe göre, sonra oynanabilirliğe göre sırala
    fuzzyMatches.sort((a, b) => {
      if (Math.abs(b._sim - a._sim) > 0.1) return b._sim - a._sim;
      return (b.oynanabilirlik_skoru || 0) - (a.oynanabilirlik_skoru || 0);
    });
    const top3 = fuzzyMatches.slice(0, 3);
    if (top3.length === 1) {
      return { match_type: "exact", players: [{ name: top3[0].Player, score: top3[0].oynanabilirlik_skoru }] };
    }
    return { match_type: "multiple", players: top3.map(p => ({ name: p.Player, score: p.oynanabilirlik_skoru })) };
  }

  return { match_type: "none", players: [] };
};

export const startNewGameLocal = async (difficultyLevel) => {
  await new Promise(r => setTimeout(r, 150));

  const formattedDiff = difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1).toLowerCase();
  const filteredData = footballData.filter(p => p.Zorluk_Seviyesi === formattedDiff);
  if (filteredData.length === 0) {
    throw new Error(`${formattedDiff} zorluk seviyesinde oyuncu bulunamadı.`);
  }

  const targetPlayer = filteredData[Math.floor(Math.random() * filteredData.length)];

  // Mevki Tespiti
  const rawPos = String(targetPlayer.Pos).toUpperCase();
  let primaryPos = 'MF';
  if (rawPos.includes('FW')) primaryPos = 'FW';
  else if (rawPos.includes('MF')) primaryPos = 'MF';
  else if (rawPos.includes('DF')) primaryPos = 'DF';
  else if (rawPos.includes('GK')) primaryPos = 'GK';

  const requiredFeatures = [...UNIVERSAL_FEATURES, ...(POSITION_SPECIFIC_FEATURES[primaryPos] || [])];

  const playerData = {};
  for (const feat of requiredFeatures) {
    playerData[feat] = targetPlayer[feat] !== undefined ? targetPlayer[feat] : null;
  }

  return {
    message: "Hedef oyuncu başarıyla seçildi.",
    difficulty_requested: formattedDiff,
    primary_position_detected: primaryPos,
    target_player: playerData
  };
};

export const submitRoundLocal = async (targetPlayerName, targetStatName, targetStatValue, p1Guess, p2Guess) => {
  await new Promise(r => setTimeout(r, 200));

  // Fuzzy find logic for submitting (Python backend used fuzzy_find_player which does exact -> substring -> fuzzy)
  // For simplicity, since the inputs here are already validated by searchPlayerLocal in GameScreen,
  // we can just use exact match on the exact names that searchPlayerLocal returned.
  const getPlayerDetails = (name) => {
    return footballData.find(p => normalizeText(p.Player) === normalizeText(name)) || null;
  };

  const p1Details = getPlayerDetails(p1Guess);
  const p2Details = getPlayerDetails(p2Guess);

  if (!p1Details) throw new Error(`1. Oyuncu verisi bulunamadı: ${p1Guess}`);
  if (!p2Details) throw new Error(`2. Oyuncu verisi bulunamadı: ${p2Guess}`);

  // Kurnazlık Kontrolü (Kendisini yazmayı engelle)
  const targetClean = normalizeText(targetPlayerName);
  if (normalizeText(p1Details.Player) === targetClean) {
    throw new Error("1. Oyuncu kurnazlık yapıyor! Tahtadaki hedef oyuncunun kendisini tahmin edemezsiniz.");
  }
  if (normalizeText(p2Details.Player) === targetClean) {
    throw new Error("2. Oyuncu kurnazlık yapıyor! Tahtadaki hedef oyuncunun kendisini tahmin edemezsiniz.");
  }

  const p1Val = parseFloat(p1Details[targetStatName]) || 0;
  const p2Val = parseFloat(p2Details[targetStatName]) || 0;
  const targetVal = parseFloat(targetStatValue) || 0;

  const diff1 = Math.abs(targetVal - p1Val);
  const diff2 = Math.abs(targetVal - p2Val);

  let winner = "";
  if (diff1 < diff2) winner = "Player 1";
  else if (diff2 < diff1) winner = "Player 2";
  else winner = "Tie";

  return {
    target_player: targetPlayerName,
    target_stat_name: targetStatName,
    target_stat_value: targetStatValue,
    player1: {
      name: p1Details.Player,
      stat_value: p1Val,
      difference: diff1
    },
    player2: {
      name: p2Details.Player,
      stat_value: p2Val,
      difference: diff2
    },
    round_winner: winner
  };
};
