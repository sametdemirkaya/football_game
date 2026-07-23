from openpyxl.descriptors.excel import Percentage
import pandas as pd
import os

# Dosya yolları (data klasörü içerisinde çalışıyoruz)
script_dir = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(script_dir, '03_Puanlanmis_Oyuncu_Verisi.csv')
output_file = os.path.join(script_dir, '04_Son_Skorlu_Veri.csv')

def main():
    print("03_Puanlanmis_Oyuncu_Verisi.csv okunuyor...")
    df = pd.read_csv(input_file)
    
    # 1. Lig Bazlı Maksimum 90s Değerinin Bulunması
    # groupby('League') ile veriyi liglere bölüyoruz. 
    # ['90s'].transform('max') ile her ligin kendi içindeki maksimum 90s değerini bulup, 
    # o ligdeki tüm oyuncuların satırlarına aynı değeri atıyoruz (Vektörel işlem)
    print("Lig bazlı maksimum 90s değerleri hesaplanıyor...")
    df['Lig_Max_90s'] = df.groupby('League')['90s'].transform('max')
    
    # 2. Toplamsal Ağırlık Skorunun Hesaplanması (oynanabilirlik_skoru)
    # Tamamen pandas'ın vektörel (sütun bazlı) aritmetik işlemlerini kullanıyoruz. Döngü yok.
    # Not: Sıfıra bölünme hatasını (olası veri hatalarına karşı) engellemek için paydada replace(0, 1) kullanmak iyi bir pratiktir.
    print("Oynanabilirlik skorları hesaplanıyor...")
    df['oynanabilirlik_skoru'] = (df['Takim_Puani'] * 0.7) + \
                                 (df['Takim_Puani'] * 0.3 * (df['90s'] / df['Lig_Max_90s'].replace(0, 1)))
                                 
    # Skoru daha güzel görünmesi için 2 ondalık basamağa yuvarlayabiliriz (Opsiyonel)
    df['oynanabilirlik_skoru'] = df['oynanabilirlik_skoru'].round(2)
    
    # Yeni veri setini kaydetme
    print(f"Yeni dosya kaydediliyor: {output_file}")
    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    
    print("\n--- İşlem Başarılı ---")
    print("Verinin Önizlemesi (İlk 5 Satır - İlgili Sütunlar):")
    print(df[['Player', 'League', 'Takim_Puani', '90s', 'Lig_Max_90s', 'oynanabilirlik_skoru']].head())
if __name__ == "__main__":
    main()

