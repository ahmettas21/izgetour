import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/Checkout.module.css';

// Types
interface CartItem {
  id: string;
  title: string;
  price: number; // in TL
  quantity: number;
}
interface PaymentMethod {
  id: string;
  label: string;
  icon: string; // emoji or src
}

// Dummy payment methods – extend with real integrations (Stripe, PayPal, ApplePay)
const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Kredi Kartı', icon: '💳' },
  { id: 'apple', label: 'Apple Pay', icon: '' },
  { id: 'google', label: 'Google Pay', icon: '🅖' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<string>('card');
  const [loading, setLoading] = useState(false);

  // Fetch cart from localStorage (guest checkout) – could be Supabase for logged users
  React.useEffect(() => {
    const stored = localStorage.getItem('izgetour_cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert('Sepet boş');
    setLoading(true);
    // Simulate order creation – replace with real API call
    const { data, error } = await supabase.from('orders').insert({
      items: cart,
      total,
      payment_method: payment,
      status: 'pending',
    });
    setLoading(false);
    if (error) {
      console.error(error);
      return alert('Sipariş oluşturulamadı');
    }
    // Clear cart & redirect to success page
    localStorage.removeItem('izgetour_cart');
    const orderId = (data as any)?.[0]?.id;
    if (!orderId) return alert('Sipariş oluşturuldu ama order_id alınamadı');
    router.push(`/checkout/success?order_id=${orderId}`);
  };

  return (
    <div className={styles.container}>
      <h1>Sepet &amp; Checkout</h1>
      {cart.length === 0 ? (
        <p>Sepetiniz boş. <a href="/tours">Turları keşfet</a></p>
      ) : (
        <>
          <section className={styles.summary}>
            <h2>Sipariş Özeti</h2>
            <ul>
              {cart.map(item => (
                <li key={item.id} className={styles.item}>
                  <span>{item.title}</span>
                  <span>{item.quantity}× {item.price.toLocaleString('tr-TR')} TL</span>
                </li>
              ))}
            </ul>
            <p className={styles.total}>Toplam: <strong>{total.toLocaleString('tr-TR')} TL</strong></p>
          </section>

          <section className={styles.payment}>
            <h2>Ödeme Yöntemi</h2>
            <div className={styles.methods}>
              {PAYMENT_METHODS.map(m => (
                <label key={m.id} className={styles.method}>
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                  />
                  <span>{m.icon} {m.label}</span>
                </label>
              ))}
            </div>
          </section>

          <button
            className={styles.checkoutBtn}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'İşleniyor…' : 'Siparişi Tamamla'}
          </button>
        </>
      )}
    </div>
  );
}

// Success page (simple) – can be placed in /pages/checkout/success.tsx
export const SuccessPage = ({ orderId }: { orderId: string }) => (
  <div className={styles.container}>
    <h1>✅ Siparişiniz Alındı!</h1>
    <p>Sipariş numaranız: <strong>{orderId}</strong></p>
    <p>Detayları e‑posta adresinize gönderildi.</p>
    <a href="/">Ana Sayfaya Dön</a>
  </div>
);

// Note: Add corresponding CSS in src/styles/Checkout.module.css and wire up Supabase client in lib/supabase.ts
