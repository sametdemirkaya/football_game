import pandas as pd
import os

# Dosya yolları (İşlemler data klasörü içerisinde yapılıyor)
script_dir = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(script_dir, '02_Cift_Oyunculari_Birlestirilmis_Veri.csv')
output_file = os.path.join(script_dir, '03_Puanlanmis_Oyuncu_Verisi.csv')

def main():
    print("Veri okunuyor...")
    # 1. Veriyi Oku
    df = pd.read_csv(input_file)

    # 2. Lig Puanları Sözlüğü (100 Üzerinden)
    # Veri setindeki 'League' sütunu değerleri kullanılarak popülariteye göre ağırlıklandırıldı.
    lig_puani_sozlugu = {
        'ENG-Premier League': 100,
        'ESP-La Liga': 95,
        'GER-Bundesliga': 90,
        'ITA-Serie A': 90,
        'FRA-Ligue 1': 85,
        'TUR-Super Lig': 90
    }

    # 3. Takım Puanları Sözlüğü (100 Üzerinden)
    # Dünya devlerine en yüksek puanlar verilirken, Süper Lig devleri de unutulmadı.
    takim_puani_sozlugu = {
        # İngiltere (Premier League)
        'Manchester City': 100,
        'Arsenal': 95,
        'Liverpool': 95,
        'Manchester Utd': 85,
        'Chelsea': 80,
        'Tottenham': 80,
        'Aston Villa': 80,
        'Brighton': 75,
        'Newcastle': 75,
        'Crystal Palace': 70,
        'Bournemouth': 70,
        'Nottingham Forest': 70,
    
        
        # İspanya (La Liga)
        'Real Madrid': 100,
        'Barcelona': 100,
        'Atlético Madrid': 92,
        'Girona': 75,
        'Real Sociedad': 75,
        'Athletic Club': 75,
        'Villarreal': 75,
        
        # Almanya (Bundesliga)
        'Bayern Munich': 100,
        'Dortmund': 95,
        'RB Leipzig': 90,
        'Leverkusen': 85,
        'Frankfurt': 75,
        'Stuttgart': 75,
       
        # İtalya (Serie A)
        'Inter': 95,
        'Juventus': 85,
        'Milan': 80,
        'Napoli': 90,
        'Atalanta': 75,
        'Roma': 75,
        'Lazio': 75,
        
        # Fransa (Ligue 1)
        'PSG': 100,
        'Marseille': 70,
        'Monaco': 70,
        'Lille': 70,
        'Lyon': 70,
        'Lens': 70,
        
        # Türkiye (Süper Lig)
        'Galatasaray': 100,
        'Fenerbahçe': 100,
        'Beşiktaş': 100,
        'Trabzonspor': 90,
        'Başakşehir': 75
    }

    # 4. Veriye Entegrasyon ve Varsayılan Değerler
    # map() fonksiyonu ile puanları eşleştiriyor ve fillna() ile eşleşmeyenlere taban puan atıyoruz.
    print("Lig ve Takım puanları hesaplanıp veri setine ekleniyor...")
    
    # Listede olmayan ligler için makul taban puan: 50
    df['Lig_Puani'] = df['League'].map(lig_puani_sozlugu).fillna(50)

    
    # Listede olmayan takımlar (Anadolu takımları, diğer liglerin alt sıra takımları vs.) için taban puan: 40
    df['Takim_Puani'] = df['Team'].map(takim_puani_sozlugu).fillna(40)

    # Puanların veri tipini ondalıklı sayıdan tam sayıya (integer) çevirerek daha temiz bir görünüm elde ediyoruz
    df['Lig_Puani'] = df['Lig_Puani'].astype(int)
    df['Takim_Puani'] = df['Takim_Puani'].astype(int)

    # 5. Yeni Veri Setini Kaydetme
    print(f"Yeni dosya kaydediliyor: {output_file}")
    df.to_csv(output_file, index=False, encoding='utf-8-sig')

    print("\n--- İşlem Başarılı ---")
    print("Verinin Önizlemesi (İlk 5 Satır - İlgili Sütunlar):")
    print(df[['Player', 'Team', 'League', 'Lig_Puani', 'Takim_Puani']].head())

if __name__ == "__main__":
    main()
