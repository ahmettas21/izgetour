import os
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# Google Doc ID (Bu ID'yi kullanıcıdan almak gerekebilir veya yeni bir tane oluşturulabilir)
# Şimdilik örnek bir ID veya yeni dosya oluşturma mantığı kullanalım.
# Eğer belgelenmemişse yeni bir tane oluşturup ID'sini memory'ye kaydedebiliriz.

TOKEN_PATH = '/home/turk/.credentials/google/token.json'

def get_service():
    with open(TOKEN_PATH, 'r') as token:
        info = json.load(token)
    creds = Credentials.from_authorized_user_info(info)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return build('docs', 'v1', credentials=creds)

def append_to_doc(doc_id, text):
    service = get_service()
    requests = [
        {
            'insertText': {
                'location': {'index': 1},
                'text': text + "\n\n"
            }
        }
    ]
    service.documents().batchUpdate(documentId=doc_id, body={'requests': requests}).execute()

if __name__ == "__main__":
    # Örnek bir kayıt işlemi
    log_text = """
    ## Geliştirme Logu - 2026-05-09
    - Task: Faz 11 - Predictive Trip Bundler Geliştirme
    - Detay: Kullanıcının uçuş seçimine göre AI tabanlı otel ve transfer paketleme UI'ı oluşturuldu.
    - Dosya: /home/turk/projects/izgetour/components/features/PredictiveTripBundler.tsx
    - Durum: ✅ Tamamlandı
    """
    # Buraya gerçek bir doc_id eklenmeli. Şimdilik print ile simüle edelim veya 
    # USER.md/MEMORY.md'den bir ID arayalım.
    print("Log hazırlandı, Google Doc entegrasyonu için ID bekleniyor veya yerel memory'ye yazılıyor.")
    print(log_text)
