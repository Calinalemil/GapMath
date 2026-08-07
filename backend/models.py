import json
from database import get_connection

def save_session(exercise: str, grade: str, score:int, summary: str, gaps: list, next_steps: list):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO sessions (exercise, grade, score, summary, gaps, next_steps)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        exercise,
        grade,
        score,
        summary,
        json.dumps(gaps),        #convert list to JSON string
        json.dumps(next_steps) 

    ))

    conn.commit()
    conn.close()

def get_all_sessions():
    conn = get_connection()
    cursor = conn.cursor

    cursor.execute('SELECT * FROM sessions ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]