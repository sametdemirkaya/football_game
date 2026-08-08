import pandas as pd
from seleniumbase import SB
from io import StringIO
import time
import os

print("="*50)
print("KAPSAMLI VERİ ÇEKME İŞLEMİ BAŞLADI (SELENIUM)")
print("="*50)

# Tüm ligler ve FBref kodları
leagues = {
    'ENG-Premier League': ('9', 'Premier-League-Stats'),
    'ESP-La Liga': ('12', 'La-Liga-Stats'),
    'ITA-Serie A': ('11', 'Serie-A-Stats'),
    'GER-Bundesliga': ('20', 'Bundesliga-Stats'),
    'FRA-Ligue 1': ('13', 'Ligue-1-Stats'),
    'TUR-Super Lig': ('26', 'Super-Lig-Stats')
}

# Sadece hedef veri için gerekli olan FBref tabloları
stat_types = ['stats', 'misc', 'shooting', 'keepers']

all_players = []

with SB(uc=True, headless=True) as sb:
    for league_name, (comp_id, slug) in leagues.items():
        print(f"\n---> {league_name} kazınıyor...")
        league_dfs = {}
        
        for stat in stat_types:
            url = f"https://fbref.com/en/comps/{comp_id}/{stat}/{slug}"
            print(f"     Tablo: {stat}...")
            
            tables = None
            for attempt in range(3):
                sb.open(url)
                try:
                    sb.wait_for_element('table', timeout=15)
                except:
                    sb.sleep(5)
                    
                html = sb.get_page_source()
                # Yorum satırlarını temizle (Gizli tablolar için)
                html_clean = html.replace('<!--', '').replace('-->', '')
                
                try:
                    tables = pd.read_html(StringIO(html_clean))
                    break # Başarılıysa döngüden çık
                except ValueError:
                    print(f"     [UYARI] {stat} tablosu bulunamadı, tekrar deneniyor ({attempt+1}/3)...")
                    sb.sleep(3)
            
            if tables is None:
                print(f"     [HATA] {stat} tablosu okunamadı!")
                continue
                
            df_raw = None
            for t in tables:
                if t.columns.nlevels > 1 and 'Player' in t.columns.get_level_values(1):
                    df_raw = t
                    break
            
            if df_raw is None:
                print(f"     [HATA] {stat} için geçerli tablo bulunamadı.")
                continue
                
            # Sütun isimlerini tek seviyeye indir ve temizle
            df_raw.columns = ['_'.join(col).strip() if "Unnamed" not in col[0] else col[1] for col in df_raw.columns]
            df_raw.columns = [str(c).lower().strip() for c in df_raw.columns]
            
            # Sadece 'Player' başlık satırlarını temizle
            df_raw = df_raw[df_raw['player'] != 'player'].copy()
            df_raw = df_raw[df_raw['player'] != 'Player'].copy()
            
            if 'squad' in df_raw.columns:
                df_raw.rename(columns={'squad': 'team'}, inplace=True)
                
            # Ortak sütunlar (Birleştirme Anahtarları)
            join_keys = ['player', 'team']
            
            # Anahtar olmayan ve daha önce eklenmiş olan sütunları sil (çakışmayı önlemek için)
            if stat != 'stats' and 'stats' in league_dfs:
                cols_to_drop = [c for c in df_raw.columns if c not in join_keys and c in league_dfs['stats'].columns]
                df_raw.drop(columns=cols_to_drop, inplace=True, errors='ignore')
                
            league_dfs[stat] = df_raw
            sb.sleep(3) 
            
        # Ligin 4 tablosunu birleştir
        if 'stats' in league_dfs:
            df_merged = league_dfs['stats']
            for stat in ['misc', 'shooting', 'keepers']:
                if stat in league_dfs:
                    df_merged = pd.merge(df_merged, league_dfs[stat], on=join_keys, how='left')
            
            df_merged['league'] = league_name
            df_merged['data_source'] = 'Selenium'
            all_players.append(df_merged)
            print(f"[OK] {league_name} başarıyla eklendi.")

print("\nTüm ligler birleştiriliyor...")
df_final = pd.concat(all_players, ignore_index=True)

# OYUN İÇİN SADECE GEREKLİ OLAN VE GARANTİLİ SÜTUNLARI SEÇİYORUZ
# FBref tablolarında bu değişkenlerin adları (flatten işleminden sonra) şöyledir:
essential_cols = [
    'player', 'nation', 'pos', 'team', 'age', 'league', 
    'playing time_min', # Oynadığı Süre (GK, DF, MF, FW)
    'performance_gls', # Gol (FW)
    'performance_ast', # Asist (MF, FW)
    'performance_crdy', # Sarı Kart (DF)
    'performance_crdr', # Kırmızı Kart (DF)
    'performance_tklw', # Top Kapma Kazanma (DF)
    'performance_int', # Pas Arası (DF, MF)
    'performance_crs', # Orta (MF)
    'standard_sot', # İsabetli Şut (FW) - Shooting tablosundan gelir
    'performance_saves', # Kurtarış (GK)
    'performance_ga', # Yediği Gol (GK)
    'performance_cs' # Clean Sheet (GK)
]

available_cols = [c for c in essential_cols if c in df_final.columns]
df_final = df_final[available_cols].copy()

output_path = "data/01_Ham_Birlestirilmis_Veri.csv"
df_final.to_csv(output_path, index=False)

print("\n" + "=" * 50)
print("VERİ ÇEKME İŞLEMİ TAMAMLANDI!")
print(f"Toplam Oyuncu Sayısı: {len(df_final)}")
print(f"Toplam Sütun Sayısı: {len(df_final.columns)}")
print("Seçilen Değişkenler:", available_cols)
print(f"Oluşturulan Dosya: {output_path}")
print("=" * 50)
