from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import pandas as pd
import numpy as np
import difflib
import os
import unicodedata

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    # NFKD ile karakterleri ve aksanları ayır, sonra aksanları sil
    nfkd_form = unicodedata.normalize('NFKD', text)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)]).lower().strip()

# Veri setini hızlıca erişebilmek için tutacağımız global değişken (In-Memory)
game_data = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI uygulaması başlarken ve kapanırken çalışacak olayları yönetir (Startup/Shutdown events).
    """
    global game_data
    
    print("🚀 Backend başlatılıyor...")
    
    # Dinamik dosya yolu: backend klasöründen bir üst dizine (..) çıkıp data klasörüne giriyoruz
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'data', '05_Temiz_Nihai_Oyun_Verisi.csv')
    
    print(f"📁 Oyun verisi aranıyor: {data_path}")
    
    try:
        # Veri halihazırda tamamen temizlenmiş ve oynamaya hazır olduğu için
        # hiçbir ekstra temizlik, filtreleme veya NaN doldurma işlemi yapmıyoruz.
        game_data = pd.read_csv(data_path)
        print(f"✅ Veri başarıyla yüklendi! Toplam {len(game_data)} futbolcu bellekte hazır durumda.")
    except Exception as e:
        print(f"❌ Veri yüklenirken kritik bir hata oluştu: {e}")
        
    yield  # Uygulamanın istekleri kabul etmesine izin ver
    
    print("🛑 Backend kapatılıyor, bellek temizleniyor...")
    game_data = None

# FastAPI temel iskeletini başlat
app = FastAPI(title="Futbol Tahmin Oyunu API", version="1.0.0", lifespan=lifespan)

# --- CORS Ayarları ---
# React Native (Expo) genelde farklı portlardan (örn: 8081) veya mobil cihazların yerel IP'lerinden
# istek atacağı için geliştirme aşamasında CORS'u olabildiğince esnek (allow_origins=["*"]) tutuyoruz.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Temel bir test rotası (Endpoint)
@app.get("/")
def read_root():
    return {"message": "Futbol Tahmin Oyunu Backend'i Sorunsuz Çalışıyor!"}

# Verinin bellekte (In-Memory) global olarak tutulduğunu kanıtlayan kontrol rotası
@app.get("/api/health")
def health_check():
    """
    Uygulamanın genel sağlık durumunu ve verinin belleğe inip inmediğini döndürür.
    İlerleyen aşamalarda bu global 'game_data' DataFrame'ini rotalarda rahatça kullanacağız.
    """
    if game_data is not None:
        return {
            "status": "ok", 
            "message": "Veri bellekte erişime hazır.",
            "total_players": len(game_data)
        }
    return {"status": "error", "message": "Veri belleğe yüklenemedi!"}

# --- 2. ADIM: OYUN MOTORU VE ZORLUK SEÇİMİ ---

from fastapi import HTTPException
import random

# Her oyuncu için mutlaka kullanıcıya gösterilecek/frontend'e gönderilecek evrensel veriler.
# Veri setimizde takım sütunu 'Team' olarak geçtiği için 'Team' kullandık.
UNIVERSAL_FEATURES = ['Player', 'Age', 'Team', 'League', 'Pos', 'Zorluk_Seviyesi']

# Futboldaki ana mevkilere göre seçilen oyuncunun öne çıkan spesifik istatistikleri.
POSITION_SPECIFIC_FEATURES = {
    'FW': ['Gls', 'Ast', 'SoT','Age','CrdY'],   # Forvet (Gol, Asist, İsabetli Şut)
    'MF': ['Ast', 'Crs', 'Int','Age','CrdY','Gls','TklW','SoT'],   # Orta Saha (Asist, Orta, Pas Arası)
    'DF': ['TklW', 'Int', 'CrdY','Age'], # Defans (Kazanılan İkili Mücadele, Pas Arası, Sarı Kart)
    'GK': ['Saves', 'CS', 'GA','Age']    # Kaleci (Kurtarış, Gol Yememe, Yenilen Gol)
}

@app.get("/start-game")
def start_game(difficulty: str):
    """
    Frontend'den gelen zorluk seviyesine (KOLAY, ORTA, ZOR) göre rastgele bir hedef oyuncu belirler
    ve o oyuncunun mevkisine (Pos) uygun istatistiklerini döndürür.
    Örn: /start-game?difficulty=KOLAY
    """
    global game_data
    
    if game_data is None:
        raise HTTPException(status_code=500, detail="Oyun verisi henüz yüklenmedi.")
        
    # URL'den gelen zorluk değerini veri setimizdeki formata uygun hale getirme (Örn: 'KOLAY' -> 'Kolay')
    difficulty_formatted = difficulty.capitalize()
    
    # 1. Adım: Veri havuzunu sadece istenen zorluk seviyesine göre filtreleme
    filtered_pool = game_data[game_data['Zorluk_Seviyesi'] == difficulty_formatted]
    
    if filtered_pool.empty:
        raise HTTPException(status_code=404, detail=f"{difficulty_formatted} zorluk seviyesinde oyuncu bulunamadı.")
        
    # 2. Adım: Filtrelenmiş havuzdan tamamen rastgele (sample) 1 oyuncu seçimi
    target_player = filtered_pool.sample(n=1).iloc[0]
    
    # 3. Adım: Mevki Tespiti
    # Bazı oyuncuların birden fazla mevkisi olabilir (Örn: "FW,MF"). En baskın olanı tespit ediyoruz.
    raw_pos = str(target_player['Pos']).upper()
    if 'FW' in raw_pos:
        primary_pos = 'FW'
    elif 'MF' in raw_pos:
        primary_pos = 'MF'
    elif 'DF' in raw_pos:
        primary_pos = 'DF'
    elif 'GK' in raw_pos:
        primary_pos = 'GK'
    else:
        primary_pos = 'MF' # Beklenmedik bir durumda varsayılan
        
    # 4. Adım: Evrensel özellikler ile mevkiye özel özellikleri birleştirme
    required_features = UNIVERSAL_FEATURES + POSITION_SPECIFIC_FEATURES.get(primary_pos, [])
    
    # 5. Adım: Sadece istenen bu özellikleri sözlük (dict) formatına çevirip frontend'e gönderme
    # Numpy int/float tiplerini standart Python tiplerine çevirmek JSON hatasını (Serialization) önler.
    player_data = {}
    for feat in required_features:
        val = target_player.get(feat, None)
        # JSON'a dönüştürürken NaN veya float problemleri olmaması için basit bir tip dönüşümü
        if pd.isna(val):
            player_data[feat] = None
        elif isinstance(val, (np.integer, int)):
            player_data[feat] = int(val)
        elif isinstance(val, (np.floating, float)):
            player_data[feat] = float(val)
        else:
            player_data[feat] = val
            
    return {
        "message": "Hedef oyuncu başarıyla seçildi.",
        "difficulty_requested": difficulty_formatted,
        "primary_position_detected": primary_pos,
        "target_player": player_data
    }

# --- 3. ADIM: GİRDİ İŞLEME VE PUANLAMA (KARŞILAŞTIRMA) ---

# Frontend'den gelecek JSON yapısını Pydantic modeli ile tanımlıyoruz
class RoundSubmit(BaseModel):
    target_player_name: str
    target_stat_name: str
    target_stat_value: float
    player1_guess: str
    player2_guess: str

@app.get("/search-player")
def search_player(query: str):
    """
    Kullanıcının yazdığı metne göre oyuncuyu arar.
    Tam eşleşirse direkt oyuncuyu döndürür. Kısmi veya harf hatalı eşleşirse en yüksek skorlu 3 oyuncuyu önerir.
    """
    global game_data
    if game_data is None:
        raise HTTPException(status_code=500, detail="Oyun verisi henüz yüklenmedi.")
        
    cleaned_guess = normalize_text(query)
    normalized_names = game_data['Player'].apply(normalize_text)
    
    # ADIM A: Birebir Eşleşme
    exact_match = game_data[normalized_names == cleaned_guess]
    if not exact_match.empty:
        best_player = exact_match.sort_values(by='oynanabilirlik_skoru', ascending=False).iloc[0]
        return {"match_type": "exact", "players": [{"name": best_player['Player'], "score": best_player['oynanabilirlik_skoru']}]}
        
    # ADIM B: İçinde Geçme (Substring Match)
    substring_match = game_data[normalized_names.str.contains(cleaned_guess, regex=False, na=False)]
    if not substring_match.empty:
        top_candidates = substring_match.sort_values(by='oynanabilirlik_skoru', ascending=False).head(3)
        if len(top_candidates) == 1:
            return {"match_type": "exact", "players": [{"name": top_candidates.iloc[0]['Player'], "score": top_candidates.iloc[0]['oynanabilirlik_skoru']}]}
        return {
            "match_type": "multiple",
            "players": [{"name": row['Player'], "score": row['oynanabilirlik_skoru']} for _, row in top_candidates.iterrows()]
        }
        
    # ADIM C: Toleranslı Arama (Fuzzy Match)
    all_players_list = normalized_names.tolist()
    matches = difflib.get_close_matches(cleaned_guess, all_players_list, n=5, cutoff=0.45)
    
    if matches:
        fuzzy_df = game_data[normalized_names.isin(matches)]
        top_candidates = fuzzy_df.sort_values(by='oynanabilirlik_skoru', ascending=False).head(3)
        if len(top_candidates) == 1:
            return {"match_type": "exact", "players": [{"name": top_candidates.iloc[0]['Player'], "score": top_candidates.iloc[0]['oynanabilirlik_skoru']}]}
        return {
            "match_type": "multiple",
            "players": [{"name": row['Player'], "score": row['oynanabilirlik_skoru']} for _, row in top_candidates.iterrows()]
        }
        
    return {"match_type": "none", "players": []}

def fuzzy_find_player(guess_name: str, df: pd.DataFrame):
    """
    Kullanıcının girdiği oyuncu adını 3 aşamalı (Tam -> İçinde Geçme -> Toleranslı)
    bir hiyerarşi ile veritabanında arar. Birden fazla aday bulunursa en popüler olanı seçer.
    """
    cleaned_guess = normalize_text(guess_name)
    normalized_names = df['Player'].apply(normalize_text)
    
    # --- ADIM A: Birebir Eşleşme (Exact Match) ---
    exact_match = df[normalized_names == cleaned_guess]
    if not exact_match.empty:
        return exact_match.sort_values(by='oynanabilirlik_skoru', ascending=False).iloc[0]
        
    # --- ADIM B: İçinde Geçme (Substring Match) ---
    substring_match = df[normalized_names.str.contains(cleaned_guess, regex=False, na=False)]
    if not substring_match.empty:
        return substring_match.sort_values(by='oynanabilirlik_skoru', ascending=False).iloc[0]
        
    # --- ADIM C: Toleranslı Arama (Fuzzy Match) ---
    all_players_list = normalized_names.tolist()
    matches = difflib.get_close_matches(cleaned_guess, all_players_list, n=5, cutoff=0.45)
    
    if matches:
        fuzzy_df = df[normalized_names.isin(matches)]
        return fuzzy_df.sort_values(by='oynanabilirlik_skoru', ascending=False).iloc[0]
        
    return None

@app.post("/submit-round")
def submit_round(data: RoundSubmit):
    """
    Kullanıcıların tahmin ettiği oyuncuların istenen istatistik değerlerini bulur,
    hedef değere ne kadar yakın olduklarını (mutlak fark) hesaplar ve raundun kazananını belirler.
    """
    global game_data
    
    if game_data is None:
        raise HTTPException(status_code=500, detail="Oyun verisi henüz yüklenmedi.")
        
    stat_name = data.target_stat_name
    
    # 1. Toleranslı (Fuzzy) isim araması ile oyuncuları bul
    p1_data = fuzzy_find_player(data.player1_guess, game_data)
    p2_data = fuzzy_find_player(data.player2_guess, game_data)
    
    # Tahmin edilen oyunculardan biri bulunamazsa hata döndür
    if p1_data is None:
        raise HTTPException(status_code=404, detail=f"1. Oyuncunun tahmini olan '{data.player1_guess}' veri setinde (yakın isim olarak bile) bulunamadı!")
    if p2_data is None:
        raise HTTPException(status_code=404, detail=f"2. Oyuncunun tahmini olan '{data.player2_guess}' veri setinde (yakın isim olarak bile) bulunamadı!")
        
    # Kurnazlık Kontrolü: Hedef oyuncunun kendisini yazmayı engelle (Büyük/Küçük harf duyarsız)
    target_player_clean = data.target_player_name.strip().lower()
    if p1_data['Player'].strip().lower() == target_player_clean:
        raise HTTPException(status_code=400, detail="1. Oyuncu kurnazlık yapıyor! Tahtadaki hedef oyuncunun kendisini tahmin edemezsiniz.")
    if p2_data['Player'].strip().lower() == target_player_clean:
        raise HTTPException(status_code=400, detail="2. Oyuncu kurnazlık yapıyor! Tahtadaki hedef oyuncunun kendisini tahmin edemezsiniz.")
        
    # Hedef istatistik veri setinde var mı kontrolü
    if stat_name not in p1_data or stat_name not in p2_data:
        raise HTTPException(status_code=400, detail=f"Hatalı istatistik adı: '{stat_name}' veri setinde mevcut değil.")
        
    # JSON serileştirme hatası olmaması ve matematiksel işlem için float'a çevirme
    try:
        p1_stat_val = float(p1_data[stat_name])
        p2_stat_val = float(p2_data[stat_name])
    except ValueError:
        raise HTTPException(status_code=400, detail=f"İstenen istatistik ({stat_name}) sayısal bir değer değil.")
        
    # 2. Mutlak Fark (Absolute Difference) Hesaplama
    target_val = data.target_stat_value
    p1_diff = abs(target_val - p1_stat_val)
    p2_diff = abs(target_val - p2_stat_val)
    
    # 3. Kazananı Belirleme
    if p1_diff < p2_diff:
        winner = "Player 1"
    elif p2_diff < p1_diff:
        winner = "Player 2"
    else:
        winner = "Tie"  # İkisi de aynı derecede yakınsa berabere
        
    # 4. JSON Formatında Çıktı Döndürme
    return {
        "round_winner": winner,
        "target_stat_name": stat_name,
        "target_stat_value": target_val,
        "player1": {
            "name": p1_data['Player'],        # Veri setindeki orijinal ismini döndür (büyük/küçük harf düzeltilmiş hali)
            "stat_value": p1_stat_val,
            "difference": round(p1_diff, 2)   # Okunabilirlik için virgülden sonra 2 basamak
        },
        "player2": {
            "name": p2_data['Player'],
            "stat_value": p2_stat_val,
            "difference": round(p2_diff, 2)
        }
    }


# --- 4. ADIM: OYUN SONUCU VE KAZANAN BELİRLEME ---

# Frontend'den gelecek oyun sonu skorlarını tutacak Pydantic modeli
class GameResultRequest(BaseModel):
    player1_score: int
    player2_score: int
    difficulty: str

@app.post("/game-result")
def game_result(data: GameResultRequest):
    """
    Oyun (veya maç) bittiğinde toplam skorları alır, kazananı hesaplar
    ve statik bir bitiş mesajı döndürür. (LLM/Trashtalk entegrasyonu Faz 2'ye bırakılmıştır.)
    """
    p1 = data.player1_score
    p2 = data.player2_score
    diff = data.difficulty.capitalize()
    
    # Kazananı belirleme mantığı
    if p1 > p2:
        winner = "Player 1"
        final_message = f"Oyun tamamlandı, kazanan: Player 1! (Tebrikler!)"
    elif p2 > p1:
        winner = "Player 2"
        final_message = f"Oyun tamamlandı, kazanan: Player 2! (Tebrikler!)"
    else:
        winner = "Tie"
        final_message = f"Oyun tamamlandı, inanılmaz bir beraberlik!"
        
    # JSON formatında temiz bir çıktı (Response)
    return {
        "status": "game_over",
        "difficulty_played": diff,
        "final_scores": {
            "player1": p1,
            "player2": p2
        },
        "winner": winner,
        "message": final_message
    }

