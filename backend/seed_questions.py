import sqlite3
import json
from config import Config

conn = sqlite3.connect(Config.DATABASE_PATH)
cursor = conn.cursor()

questions = [
    # Logical
    ("If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are Lazzies.", json.dumps(["True","False"]), "True", 3, "logical", 12, 60),
    ("Which number is the odd one out? 2, 4, 6, 7, 8", json.dumps(["2","4","6","7","8"]), "7", 2, "logical", 12, 60),
    ("If 2 cats catch 2 mice in 2 minutes, how many cats catch 100 mice in 100 minutes?", json.dumps(["2","50","100","200"]), "2", 5, "logical", 12, 60),
    ("Complete the series: 1, 4, 9, 16, ?", json.dumps(["20","25","30","36"]), "25", 4, "logical", 12, 60),
    ("A train travels 60 miles in 2 hours. Speed?", json.dumps(["20 mph","30 mph","40 mph","60 mph"]), "30 mph", 2, "logical", 12, 60),
    # Verbal
    ("Choose synonym of 'Ephemeral'", json.dumps(["Eternal","Brief","Solid","Slow"]), "Brief", 4, "verbal", 12, 60),
    ("Unscramble 'CIFAIPC' → a fruit", json.dumps(["Apple","Banana","Pineapple","Papaya"]), "Papaya", 6, "verbal", 12, 60),
    ("Which word is different? Apple, Banana, Carrot, Orange", json.dumps(["Apple","Banana","Carrot","Orange"]), "Carrot", 3, "verbal", 12, 60),
    ("'Piscine' refers to which animal?", json.dumps(["Fish","Bird","Snake","Cat"]), "Fish", 5, "verbal", 12, 60),
    ("Complete analogy: Hand is to Glove as Foot is to ?", json.dumps(["Shoe","Sock","Toe","Ankle"]), "Shoe", 3, "verbal", 12, 60),
    # Spatial
    ("Which shape completes the pattern? (Assume A,B,C,D)", json.dumps(["A","B","C","D"]), "C", 5, "spatial", 12, 60),
    ("If you fold a cube, which face is opposite red?", json.dumps(["Green","Blue","Yellow","White"]), "Blue", 6, "spatial", 12, 60),
    ("How many squares in a 4x4 grid?", json.dumps(["16","20","30","32"]), "30", 4, "spatial", 12, 60),
    ("Rotate the shape 90° clockwise", json.dumps(["A","B","C","D"]), "B", 5, "spatial", 12, 60),
    # Memory/Number
    ("What number comes next? 2, 6, 12, 20, ?", json.dumps(["28","30","32","36"]), "30", 4, "memory", 12, 60),
    ("Remember: 3, 8, 15, 24, 35, ?", json.dumps(["48","49","50","51"]), "48", 5, "memory", 12, 60),
    ("If 3*4=12, 4*5=20, what is 5*6?", json.dumps(["30","25","36","42"]), "30", 2, "memory", 12, 60),
]

cursor.executemany('''
    INSERT INTO questions (text, options, correct_answer, difficulty, subtype, age_min, age_max)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', questions)

conn.commit()
conn.close()
print(f"Seeded {len(questions)} questions.")