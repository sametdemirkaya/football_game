import pandas as pd
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, '04_Son_Skorlu_Veri.csv')

df = pd.read_csv(file_path)

score_to_check = 85
percentile = (df['oynanabilirlik_skoru'] < score_to_check).mean() * 100

print(f"--- Oynanabilirlik Skoru = {score_to_check} Yuzdelik Dilim ---")
print(f"75 puan alan bir oyuncu, veritabanindaki tum oyuncularin %{percentile:.2f}'sinden daha yuksek bir puana sahiptir.")
print(f"Baska bir deyisle, en iyi %{100-percentile:.2f}'lik dilimdedir.")

print("\n--- Genel Betimsel Istatistikler (describe) ---")
print(df['oynanabilirlik_skoru'].describe())
