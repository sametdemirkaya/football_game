import pandas as pd
import numpy as np
import os
import sys
import io

# Terminaldeki Türkçe/Özel karakterleri (Örn: Tadić, Livaković) yazdırırken çökmemesi için
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Dosya yolları
script_dir = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(script_dir, '04_Son_Skorlu_Veri.csv')
output_file = os.path.join(script_dir, '04_Nihai_Oyun_Verisi.csv')

def main():
    print("Veri okunuyor...")
    df = pd.read_csv(input_file)
    
    # Adım 5: Kategorizasyon (Zorluk Seviyesi)
    # np.select kullanarak tamamen vektörel, döngüsüz ve son derece hızlı bir atama yapıyoruz.
    print("Zorluk seviyeleri kategorize ediliyor...")
    kosullar = [
        (df['oynanabilirlik_skoru'] > 85),
        (df['oynanabilirlik_skoru'] >= 75) & (df['oynanabilirlik_skoru'] <= 85),
        (df['oynanabilirlik_skoru'] < 75)
    ]
    secimler = ['Kolay', 'Orta', 'Zor']
    
    df['Zorluk_Seviyesi'] = np.select(kosullar, secimler, default='Bilinmiyor')
    
    # Adım 6: Doğrulama ve Kaydetme
    # Mantığın doğru çalıştığını test etmek için örneklemeler yazdırıyoruz.
    print("\n------------------------------------------------------")
    print("DOĞRULAMA TESTİ 1: Fenerbahçe (Popüler Takım)")
    print("------------------------------------------------------")
    fb_oyuncular = df[df['Team'] == 'Fenerbahçe'][['Player', 'Team', 'oynanabilirlik_skoru', 'Zorluk_Seviyesi']].head(5)
    print(fb_oyuncular.to_string(index=False))
    
    print("\n------------------------------------------------------")
    print("DOĞRULAMA TESTİ 2: Kasımpaşa (Anadolu Takımı)")
    print("------------------------------------------------------")
    kp_oyuncular = df[df['Team'] == 'Kasımpaşa'][['Player', 'Team', 'oynanabilirlik_skoru', 'Zorluk_Seviyesi']].head(5)
    print(kp_oyuncular.to_string(index=False))
    print("------------------------------------------------------\n")
    
    # Yeni veri setini kaydetme (Kullanıcının talep ettiği '04_Nihai_Oyun_Verisi.csv' adıyla)
    print(f"Nihai veri dosyası kaydediliyor: {output_file}")
    df.to_csv(output_file, index=False, encoding='utf-8-sig')
    print("İşlem başarıyla tamamlandı!")

if __name__ == "__main__":
    main()
