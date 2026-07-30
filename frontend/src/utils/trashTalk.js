// Oyun sonu Trash-Talk kütüphanesi (Sadece Multiplayer mod için)

const gameOverWinMessages = [
  "Bu oyun sana göre değil, biraz daha antrenman yap!",
  "Rakibini sahadan sildin! Gerçek bir efsane...",
  "Futbol bilgin göz kamaştırıyor, kupanın sahibi sensin!",
  "Şampiyon belli oldu! Kaybedene peçete verelim.",
  "TARİHİ BİR ZAFER! Rakibin bir daha seninle oynamaya cesaret edemeyebilir."
];

const gameOverTieMessages = [
  "DOSTLUK KAZANDI! (Veya ikiniz de yeteneksizsiniz)",
  "BERABERLİK! Rövanş maçı şart oldu.",
];

export const getGameOverTrashTalk = (isTie) => {
  if (isTie) {
    return gameOverTieMessages[Math.floor(Math.random() * gameOverTieMessages.length)];
  }
  return gameOverWinMessages[Math.floor(Math.random() * gameOverWinMessages.length)];
};
