# İzgetour Development Rules

## 1. Local Development & Preview
- Projeyi test ederken sadece `npm run dev` kullanmayın. 
- Eğer OpenCode veya ajanlar projeyi ayağa kaldıracaksa, eşzamanlı (background) olarak **Cloudflare Tunnel** kullanarak localhost:3000'i internete açmalısınız:
  `cloudflared tunnel --url http://localhost:3000`
- Tünel ayağa kalktığında ekrana düşen `https://<random>.trycloudflare.com` adresini okuyup kullanıcıya bildirin ki telefondan/harici cihazdan canlı test edebilsin.

## 2. Frontend Development (Kayak.com Style)
- Max 200 satır kuralına uyun (Kompleks componentleri sub-componentlere bölün).
- UI için Tailwind CSS ve Lucide-react ikonları kullanın.
- Her geliştirme adımında eksiklikleri Plan'a (PLAN.md) veya NotebookLM'e işleyin.
