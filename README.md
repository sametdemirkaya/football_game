# ⚽ Football Data Guessing Game

Bu proje; dünyanın en büyük 5 liginden (ve Süper Lig'den) kazınmış, temizlenmiş ve optimize edilmiş gerçek istatistikleri temel alan bir React Native (Expo) mobil tahmin oyunudur.

## ✨ Özellikler (Features)

*   **📱 Offline-First Mimari:** Backend bağımlılığı tamamen kaldırılarak "JS Game Engine" yazılmış, böylece uygulamanın internetsiz de akıcı çalışması sağlanmıştır.
*   **🔍 Fuzzy Search (Bulanık Arama):** Oyuncu isimlerini yazarken yapılan harf hatalarını veya soyadı eksikliklerini tolere eden özel Levenshtein algoritması.
*   **📊 Uçtan Uca Veri Boru Hattı (Data Pipeline):** Selenium ile verilerin çekilmesi, Pandas ile temizlenmesi ve filtreleme (oynama sürelerine göre yedeklerin elenmesi) işlemlerinin tamamı otomatize edilmiştir.
*   **🎮 Çift Mod (Single & Multi):** İster kendi bilginizi test edin, isterseniz "Altın Gol" gibi rekabetçi kurallarla aynı cihazda arkadaşlarınıza meydan okuyun.

## 🏗️ Mimari Kararlar (Architecture Decisions)

Başlangıçta bu proje klasik bir `Frontend (React Native) + Backend (FastAPI)` olarak tasarlandı. Ancak oyunun tamamen bir mobil deneyim olması gerektiğine karar vererek büyük bir mimari dönüşüm (Refactor) yaptık:

Tüm backend mantığını, eşleştirme algoritmalarını ve veri setlerini React Native tarafına taşıyıp bir **Local Game Engine (Yerel Oyun Motoru)** yarattık. Böylece oyunculara sunucu gecikmesi (latency) olmadan, anında tepki veren, tamamen internetsiz (offline) ve tek parça bir oyun sunduk. Orijinal API tasarımımız ise `backend/` klasöründe referans amaçlı tutulmaktadır.

## 🛠️ Teknoloji Yığını (Tech Stack)

### Frontend (Uygulama)
*   **React Native & Expo:** Mobil arayüz ve bileşenler.
*   **JavaScript:** Oyun motoru, Levenshtein algoritması, state yönetimi.

### Data Pipeline (Veri Mühendisliği)
*   **Python:** Veri boru hattı yönetimi.
*   **Pandas & NumPy:** Veri temizleme, istatistiksel puanlama, kategorizasyon.
*   **SeleniumBase:** Web scraping (FBref vb. kaynaklar).

---

## 🚀 Bilgisayarınızda Nasıl Çalıştırırsınız? (Installation)

Projeyi kendi ortamınızda kurmak ve test etmek için aşağıdaki adımları izleyin.

### 1. Ön Gereksinimler
*   [Node.js](https://nodejs.org/) yüklü olmalı.
*   Telefonunuzda **Expo Go** uygulaması (Android / iOS) yüklü olmalı.

### 2. Kurulum ve Çalıştırma

Terminalinizi açın ve sırasıyla şu komutları girin:

```bash
# Projeyi klonlayın
git clone https://github.com/KULLANICI_ADINIZ/football_game.git
cd football_game

# Frontend klasörüne girin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Oyunu başlatın
npx expo start
```

Terminalde beliren **QR Kodu**, telefonunuzdaki Expo Go uygulaması ile okutarak oyunu anında canlı olarak oynamaya başlayabilirsiniz!

### 3. (Opsiyonel) Veri Boru Hattını İncelemek
Eğer oyunun veritabanının sıfırdan nasıl çekildiğini ve temizlendiğini merak ediyorsanız ana dizinde:

```bash
pip install -r requirements.txt
cd data_pipeline
python veri_cekme.py
```
adımlarını izleyebilirsiniz.

---
*Geliştirici:* [Samet Demirkaya](https://github.com/sametdemirkaya)
