'use client';

import { useState, useCallback } from 'react';
import {
  Users, Plus, GripVertical, Trash2, MessageSquare,
  Share2, CheckCircle, MapPin, Calendar, DollarSign,
  Hotel, Plane, Map, ChevronDown, ChevronUp, Send,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Collaborative Trip Board — Notion/Wanderlog-style shared planner  */
/* ------------------------------------------------------------------ */

type ItemType = 'flight' | 'hotel' | 'tour' | 'activity';

interface BoardItem {
  id: string;
  type: ItemType;
  title: string;
  date?: string;
  cost?: number;
  note?: string;
  votes: number;
  assignee?: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  ts: string;
}

const ICONS: Record<ItemType, React.ReactNode> = {
  flight: <Plane className="w-4 h-4" />,
  hotel: <Hotel className="w-4 h-4" />,
  tour: <Map className="w-4 h-4" />,
  activity: <MapPin className="w-4 h-4" />,
};

const TYPE_COLORS: Record<ItemType, string> = {
  flight: 'bg-sky-100 text-sky-700',
  hotel: 'bg-amber-100 text-amber-700',
  tour: 'bg-emerald-100 text-emerald-700',
  activity: 'bg-purple-100 text-purple-700',
};

const MOCK_ITEMS: BoardItem[] = [
  { id: '1', type: 'flight', title: 'İstanbul → Kapadokya', date: '2026-06-15', cost: 1200, votes: 3 },
  { id: '2', type: 'hotel', title: 'Cave Hotel Ürgüp', date: '2026-06-15', cost: 2800, votes: 5 },
  { id: '3', type: 'tour', title: 'Balon Turu', date: '2026-06-16', cost: 900, votes: 4 },
  { id: '4', type: 'activity', title: 'Göreme Açık Hava Müzesi', date: '2026-06-16', cost: 150, votes: 2 },
];

const MEMBERS = ['İlker', 'Ayşe', 'Mehmet', 'Zeynep'];

interface Props { locale?: string; }

export default function CollaborativeTripBoard({ locale = 'tr' }: Props) {
  const isTr = locale === 'tr';
  const [items, setItems] = useState<BoardItem[]>(MOCK_ITEMS);
  const [comments, setComments] = useState<Comment[]>([
    { id: 'c1', author: 'Ayşe', text: 'Balon turu sabah 06:00 olsun mu?', ts: '14:32' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const totalCost = items.reduce((s, i) => s + (i.cost ?? 0), 0);

  const handleVote = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleAddItem = () => {
    const newItem: BoardItem = {
      id: Date.now().toString(),
      type: 'activity',
      title: isTr ? 'Yeni Aktivite' : 'New Activity',
      votes: 0,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(), author: 'Ben', text: newComment, ts: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText('https://izgetour.com/board/abc123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Minimal drag reorder */
  const handleDragStart = (id: string) => setDragId(id);
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setItems(prev => {
      const src = prev.findIndex(i => i.id === dragId);
      const dst = prev.findIndex(i => i.id === targetId);
      const copy = [...prev]; const [moved] = copy.splice(src, 1);
      copy.splice(dst, 0, moved); return copy;
    });
    setDragId(null);
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <h2 className="text-xl font-bold">{isTr ? 'Ortak Seyahat Panosu' : 'Trip Board'}</h2>
          </div>
          <div className="flex items-center gap-2">
            {MEMBERS.map(m => (
              <span key={m} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">{m[0]}</span>
            ))}
            <button onClick={handleShare} className="ml-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm flex items-center gap-1 transition">
              <Share2 className="w-4 h-4" /> {copied ? '✓' : (isTr ? 'Paylaş' : 'Share')}
            </button>
          </div>
        </div>
        <p className="text-indigo-100 text-sm mt-1">{isTr ? 'Sürükle-bırak, oyla, planla!' : 'Drag, vote, plan together!'}</p>
      </div>

      {/* Board Items */}
      <div className="p-4 space-y-2">
        {items.map(item => (
          <div key={item.id} draggable onDragStart={() => handleDragStart(item.id)}
            onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(item.id)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition group cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${TYPE_COLORS[item.type]}`}>
              {ICONS[item.type]} {item.type}
            </span>
            <span className="font-medium text-gray-800 flex-1 truncate">{item.title}</span>
            {item.date && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>}
            {item.cost != null && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><DollarSign className="w-3 h-3" />{item.cost}₺</span>}
            <button onClick={() => handleVote(item.id)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition">
              <CheckCircle className="w-3.5 h-3.5" /> {item.votes}
            </button>
            <button onClick={() => handleDelete(item.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button onClick={handleAddItem} className="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> {isTr ? 'Yeni ekle' : 'Add item'}
        </button>
      </div>

      {/* Footer — total + chat toggle */}
      <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm font-semibold text-gray-600">{isTr ? 'Toplam:' : 'Total:'} <span className="text-indigo-600">{totalCost.toLocaleString('tr-TR')}₺</span></span>
        <button onClick={() => setShowChat(!showChat)} className="text-sm flex items-center gap-1 text-indigo-600 hover:underline">
          <MessageSquare className="w-4 h-4" /> {showChat ? (isTr ? 'Sohbeti Gizle' : 'Hide Chat') : (isTr ? 'Sohbet' : 'Chat')} {showChat ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2 text-sm">
              <span className="font-semibold text-indigo-600">{c.author}</span>
              <span className="text-gray-700 flex-1">{c.text}</span>
              <span className="text-gray-300 text-xs">{c.ts}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={newComment} onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendComment()}
              placeholder={isTr ? 'Mesaj yaz...' : 'Type a message...'}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
            <button onClick={handleSendComment} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
