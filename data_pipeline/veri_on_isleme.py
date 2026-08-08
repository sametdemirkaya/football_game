import pandas as pd
import numpy as np

# ==============================================================================
# 2. ADIM: DİNAMİK VERİ ÖN İŞLEME VE BİRLEŞTİRME
# ==============================================================================

input_path = "data/01_Ham_Birlestirilmis_Veri.csv"
output_path = "data/02_Cift_Oyunculari_Birlestirilmis_Veri.csv"

print("1. Veri Okunuyor...")
df = pd.read_csv(input_path)

# Eksik olan 'nation' veya 'pos' varsa dolduralım
if 'nation' in df.columns:
    df['nation'] = df['nation'].fillna("Unknown")
if 'pos' in df.columns:
    df['pos'] = df['pos'].fillna("Unknown")

print("\n2. Çift (Transfer Olan) Oyuncu Kayıtları Birleştiriliyor...")
initial_players = len(df)

# Gruplama dışında bırakılacak kimlik (ID) ve metin sütunları
exclude_cols = ['rk', 'player', 'nation', 'pos', 'team', 'squad', 'age', 'born', 'league', 'data_source', 'matches']

# Tüm potansiyel istatistikleri sayısala çevir
for col in df.columns:
    if col not in exclude_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

stats_to_sum = [
    col for col in df.columns 
    if col not in exclude_cols 
    and pd.api.types.is_numeric_dtype(df[col])
    and '%' not in col 
    and '90' not in col
]

# 1. Her oyuncu için 'Ana Takım'ı bul (En çok dakika aldığı takım)
def get_main_team(group):
    if 'playing time_min' in group.columns and not group['playing time_min'].isna().all():
        idx = group['playing time_min'].idxmax()
        if pd.isna(idx):
            return group['team'].iloc[0]
        return group.loc[idx, 'team']
    return group['team'].iloc[0]

teams_df = df.groupby(['player', 'nation'], dropna=False).apply(get_main_team).reset_index(name='team')

# 2. İstatistikleri (Gol, Asist, Pas, Kurtarış vs.) topla
stats_df = df.groupby(['player', 'nation'], dropna=False)[stats_to_sum].sum().reset_index()

# 3. Yaş, Pozisyon, Lig gibi temel bilgileri oyuncunun ilk kaydından al
first_vals = [c for c in ['pos', 'age', 'born', 'league', 'data_source'] if c in df.columns]
first_df = df.groupby(['player', 'nation'], dropna=False)[first_vals].first().reset_index()

# Parçaları birleştir
df_clean = pd.merge(teams_df, stats_df, on=['player', 'nation'])
df_clean = pd.merge(df_clean, first_df, on=['player', 'nation'])

final_players = len(df_clean)
print(f"[DÜZELTME] Transfer yapan oyuncuların verileri birleştirildi. {initial_players - final_players} kopya satır tek satıra indirgendi.")

print("\n3. Per 90 (Maç Başına) İstatistikler Yeniden Hesaplanıyor...")
if 'playing time_min' in df_clean.columns:
    df_clean['playing time_90s'] = (df_clean['playing time_min'] / 90.0).round(2)
    safe_90s = df_clean['playing time_90s'].replace(0, np.nan)
    
    if 'performance_gls' in df_clean.columns:
        df_clean['per_90_Gls'] = (df_clean['performance_gls'] / safe_90s).fillna(0).round(2)
    if 'performance_ast' in df_clean.columns:
        df_clean['per_90_Ast'] = (df_clean['performance_ast'] / safe_90s).fillna(0).round(2)

# Sütun İsimlerini Temizleme
rename_dict = {
    'player': 'Player',
    'nation': 'Nation',
    'pos': 'Pos',
    'age': 'Age',
    'team': 'Team',
    'league': 'League',
    'playing time_min': 'Min',
    'playing time_90s': '90s',
    'performance_gls': 'Gls',
    'performance_ast': 'Ast',
    'performance_crdy': 'CrdY',
    'performance_crdr': 'CrdR',
    'performance_tklw': 'TklW',
    'performance_int': 'Int',
    'performance_crs': 'Crs',
    'standard_sot': 'SoT',
    'performance_saves': 'Saves',
    'performance_ga': 'GA',
    'performance_cs': 'CS'
}
df_clean.rename(columns=rename_dict, inplace=True)

# Nation (Ülke) sütunundaki "ar ARG", "eng ENG" gibi FBref kısaltmalarını temizle
if 'Nation' in df_clean.columns:
    df_clean['Nation'] = df_clean['Nation'].str.split(' ').str[-1]

# Sütunları Estetik ve Mantıklı Bir Sıraya Sokma
desired_order = [
    'Player', 'Nation', 'Pos', 'Age', 'Team', 'League', 
    'Min', '90s', 'Gls', 'Ast', 'per_90_Gls', 'per_90_Ast',
    'SoT', 'Crs', 'TklW', 'Int', 'CrdY', 'CrdR', 
    'Saves', 'CS', 'GA'
]

# Sadece var olan sütunları sıralamaya dahil et (hata almamak için)
final_order = [col for col in desired_order if col in df_clean.columns]

# Listede olmayan fazlalık sütunlar varsa sona ekle
for col in df_clean.columns:
    if col not in final_order:
        final_order.append(col)

df_clean = df_clean[final_order]

# ==============================================================================
# 4. EKSİK DEĞERLERİ MANUEL DOLDURMA (IMPUTATION)
# ==============================================================================
# Mallorca forması giyen 
df_clean.loc[df_clean['Player'] == 'Luis Orejuela', 'Age'] = 18.0
df_clean.loc[df_clean['Player'] == 'Luis Orejuela', 'Nation'] = 'ESP'
# Yael Trepy yaşı 20 olarak biliniyor.
df_clean.loc[df_clean['Player'] == 'Yael Trepy', 'Age'] = 20.0
# Furkan Ayaz mevkisi Forvet (FW) olarak biliniyor.
df_clean.loc[df_clean['Player'] == 'Furkan Ayaz', 'Pos'] = 'FW'

# Uyruk Doldurmaları:
df_clean.loc[df_clean['Player'] == 'Nathan Mbala', 'Nation'] = 'FRA'
df_clean.loc[df_clean['Player'] == 'Yael Trepy', 'Nation'] = 'FRA'
# Kalan tüm "Unknown" uyrukları Türk (TUR) olarak kabul et (Rayyan Baniya vd.)
df_clean.loc[df_clean['Nation'] == 'Unknown', 'Nation'] = 'TUR'

df_clean.to_csv(output_path, index=False)
print(f"\n[OK] Temizlenmiş ve Kapsamlı veri şuraya kaydedildi: {output_path}")
print(f"Son Tablo Boyutu: {df_clean.shape[0]} Oyuncu, {df_clean.shape[1]} Sütun")

# ==============================================================================
# 5. EKSİK DEĞER KONTROLÜ
# ==============================================================================
print("\n" + "="*50)
print("5. EKSİK DEĞER ANALİZİ KONTROLÜ (DOLDURMA SONRASI)")
print("="*50)

missing_data = df_clean.isnull().sum()
missing_columns = missing_data[missing_data > 0]

if not missing_columns.empty:
    print("Aşağıdaki sütunlarda hala eksik (NaN) değerler var:")
    for col, count in missing_columns.items():
        print(f" -> {col}: {count} eksik veri")
else:
    print("HİÇBİR SÜTUNDA EKSİK (NaN) VERİ BULUNAMADI! Yüzde Yüz Tertemiz.")
print("="*50)
