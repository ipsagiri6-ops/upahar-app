import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

const styles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: "#FFF8F0", minHeight: "100vh" },
  screen: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  splashBg: { background: "linear-gradient(160deg, #5a1212 0%, #7B1A1A 60%, #a02222 100%)", alignItems: "center", justifyContent: "center", gap: 20 },
  logo: { fontFamily: "Georgia, serif", fontSize: 72, color: "#C9A84C", margin: 0 },
  tagline: { fontFamily: "Georgia, serif", fontStyle: "italic", color: "rgba(255,248,240,0.85)", fontSize: 17 },
  goldBtn: { background: "#C9A84C", color: "#5a1212", border: "none", padding: "16px 48px", borderRadius: 50, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 40 },
  authBg: { background: "linear-gradient(160deg, #5a1212 0%, #7B1A1A 100%)", alignItems: "center", justifyContent: "center", padding: 40 },
  card: { background: "#FFF8F0", borderRadius: 20, padding: 32, width: "100%", maxWidth: 380 },
  cardTitle: { fontFamily: "Georgia, serif", color: "#7B1A1A", fontSize: 28, marginBottom: 8, textAlign: "center" },
  cardSub: { color: "#a08080", fontSize: 14, textAlign: "center", marginBottom: 24 },
  input: { width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e8d5c4", fontSize: 15, marginBottom: 14, background: "#fff", boxSizing: "border-box" },
  primaryBtn: { width: "100%", background: "#7B1A1A", color: "#FFF8F0", border: "none", padding: "14px", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 4 },
  linkBtn: { background: "none", border: "none", color: "#C9A84C", cursor: "pointer", fontSize: 14, marginTop: 12, textDecoration: "underline" },
  homeHeader: { background: "#7B1A1A", padding: "20px 24px", color: "#FFF8F0" },
  homeTitle: { fontFamily: "Georgia, serif", color: "#C9A84C", fontSize: 28, margin: 0 },
  homeSubtitle: { color: "rgba(255,248,240,0.7)", fontSize: 14, margin: "4px 0 0" },
  section: { padding: "24px 20px" },
  sectionTitle: { color: "#7B1A1A", fontFamily: "Georgia, serif", fontSize: 20, marginBottom: 16 },
  giftGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  giftCard: { background: "#fff", borderRadius: 14, padding: 16, textAlign: "center", border: "1.5px solid #f0e0d0", cursor: "pointer" },
  giftEmoji: { fontSize: 36 },
  giftName: { color: "#2c1a1a", fontWeight: 600, fontSize: 14, margin: "8px 0 4px" },
  giftPrice: { color: "#C9A84C", fontWeight: 700, fontSize: 15 },
  navBar: { display: "flex", justifyContent: "space-around", background: "#7B1A1A", padding: "12px 0", marginTop: "auto" },
  navBtn: { background: "none", border: "none", color: "rgba(255,248,240,0.6)", cursor: "pointer", fontSize: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  navBtnActive: { color: "#C9A84C" },
  navLabel: { fontSize: 10 },
  qHeader: { background: "#7B1A1A", padding: "20px 24px", color: "#FFF8F0" },
  bubble: { background: "#7B1A1A", color: "#FFF8F0", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", maxWidth: "80%", fontSize: 15, marginBottom: 16 },
  optionBtn: { background: "#fff", border: "1.5px solid #C9A84C", color: "#7B1A1A", borderRadius: 20, padding: "10px 20px", fontSize: 14, cursor: "pointer", margin: "6px 4px", fontWeight: 500 },
  cartHeader: { background: "#7B1A1A", padding: "20px 24px", color: "#FFF8F0" },
  cartItem: { background: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 14, border: "1.5px solid #f0e0d0" },
  cartEmoji: { fontSize: 40 },
  successBg: { background: "linear-gradient(160deg, #5a1212 0%, #7B1A1A 100%)", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 },
  successEmoji: { fontSize: 80, marginBottom: 16 },
  successTitle: { fontFamily: "Georgia, serif", color: "#C9A84C", fontSize: 32, margin: "0 0 8px" },
  successSub: { color: "rgba(255,248,240,0.85)", fontSize: 16, marginBottom: 24 },
  successOrderId: { background: "rgba(201,168,76,0.2)", border: "1px solid #C9A84C", borderRadius: 10, padding: "10px 20px", color: "#C9A84C", fontSize: 14, marginBottom: 32 },
};

const gifts = [
  { emoji: "🍫", name: "Mithai Box", price: "AUD 45" },
  { emoji: "🧣", name: "Pashmina Shawl", price: "AUD 89" },
  { emoji: "🪔", name: "Diya Set", price: "AUD 35" },
  { emoji: "📿", name: "Mala Beads", price: "AUD 55" },
  { emoji: "🍵", name: "Himalayan Tea", price: "AUD 28" },
  { emoji: "🎁", name: "Mystery Box", price: "AUD 99" },
];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [cart, setCart] = useState([]);
  const [qStep, setQStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/register`, { full_name: form.full_name, email: form.email, phone: form.phone });
      setError("");
      setScreen("login");
    } catch { setError("Registration failed. Email may already exist."); }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email: form.email });
      setUser(res.data.user);
      setError("");
      setScreen("home");
    } catch { setError("User not found. Please register first."); }
  };

  const handleOrder = async (gift) => {
    const oid = "UPH-" + Math.random().toString(36).substr(2, 8).toUpperCase();
    try {
      await axios.post(`${API}/order`, {
        user_email: user.email,
        recipient_name: answers.who || "Friend",
        occasion: answers.occasion || "General",
        budget: answers.budget || "Any",
        gift_name: gift.name,
        gift_price: gift.price,
        order_id: oid,
      });
      setOrderId(oid);
      setScreen("success");
    } catch { setError("Order failed. Please try again."); }
  };

  const qQuestions = [
    { key: "who", q: "Who are you gifting? 🎁", options: ["Parent", "Partner", "Friend", "Sibling", "Colleague"] },
    { key: "occasion", q: "What is the occasion? 🎉", options: ["Birthday", "Wedding", "Dashain", "Tihar", "Anniversary"] },
    { key: "budget", q: "What is your budget? 💰", options: ["Under AUD 30", "AUD 30–60", "AUD 60–100", "AUD 100+"] },
  ];

  const handleAnswer = (key, val) => {
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (qStep < 2) { setQStep(qStep + 1); }
    else { setRecommendations(gifts.slice(0, 3)); setScreen("recs"); }
  };

  if (screen === "splash") return (
    <div style={{ ...styles.screen, ...styles.splashBg }}>
      <p style={styles.logo}>UPAHAR</p>
      <p style={styles.tagline}>Memories, beautifully packaged</p>
      <button style={styles.goldBtn} onClick={() => setScreen("authselect")}>Get Started</button>
    </div>
  );

  if (screen === "authselect") return (
    <div style={{ ...styles.screen, ...styles.authBg }}>
      <div style={styles.card}>
        <p style={styles.cardTitle}>UPAHAR</p>
        <p style={styles.cardSub}>Welcome to personalised gifting</p>
        <button style={styles.primaryBtn} onClick={() => setScreen("login")}>Login</button>
        <br />
        <button style={{ ...styles.primaryBtn, background: "transparent", border: "2px solid #7B1A1A", color: "#7B1A1A", marginTop: 12 }} onClick={() => setScreen("register")}>Create Account</button>
      </div>
    </div>
  );

  if (screen === "register") return (
    <div style={{ ...styles.screen, ...styles.authBg }}>
      <div style={styles.card}>
        <p style={styles.cardTitle}>Create Account</p>
        <p style={styles.cardSub}>Join the UPAHAR community</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <input style={styles.input} placeholder="Full Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.primaryBtn} onClick={handleRegister}>Create Account</button>
        <div style={{ textAlign: "center" }}>
          <button style={styles.linkBtn} onClick={() => setScreen("login")}>Already have an account? Login</button>
        </div>
      </div>
    </div>
  );

  if (screen === "login") return (
    <div style={{ ...styles.screen, ...styles.authBg }}>
      <div style={styles.card}>
        <p style={styles.cardTitle}>Welcome Back</p>
        <p style={styles.cardSub}>Sign in to your account</p>
        {error && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <input style={styles.input} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.primaryBtn} onClick={handleLogin}>Login</button>
        <div style={{ textAlign: "center" }}>
          <button style={styles.linkBtn} onClick={() => setScreen("register")}>New here? Create Account</button>
        </div>
      </div>
    </div>
  );

  if (screen === "home") return (
    <div style={styles.screen}>
      <div style={styles.homeHeader}>
        <p style={styles.homeTitle}>UPAHAR 🎁</p>
        <p style={styles.homeSubtitle}>Welcome back, {user?.full_name} 👋</p>
      </div>
      <div style={styles.section}>
        <p style={styles.sectionTitle}>Browse Gifts</p>
        <div style={styles.giftGrid}>
          {gifts.map((g, i) => (
            <div key={i} style={styles.giftCard} onClick={() => { setCart([g]); setScreen("cart"); }}>
              <div style={styles.giftEmoji}>{g.emoji}</div>
              <div style={styles.giftName}>{g.name}</div>
              <div style={styles.giftPrice}>{g.price}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.navBar}>
        {[["🏠","Home"],["🔍","Search"],["💬","Quiz"],["🛒","Cart"],["👤","Profile"]].map(([icon, label], i) => (
          <button key={i} style={{ ...styles.navBtn, ...(i === 0 ? styles.navBtnActive : {}) }}
            onClick={() => i === 2 && setScreen("questionnaire")}>
            <span>{icon}</span><span style={styles.navLabel}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (screen === "questionnaire") return (
    <div style={styles.screen}>
      <div style={styles.qHeader}>
        <p style={{ ...styles.homeTitle, fontSize: 22 }}>Gift Finder 💬</p>
        <p style={styles.homeSubtitle}>Answer 3 quick questions</p>
      </div>
      <div style={styles.section}>
        {qQuestions.slice(0, qStep + 1).map((q, i) => (
          <div key={i}>
            <div style={styles.bubble}>{q.q}</div>
            {i === qStep && (
              <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
                {q.options.map(opt => (
                  <button key={opt} style={styles.optionBtn} onClick={() => handleAnswer(q.key, opt)}>{opt}</button>
                ))}
              </div>
            )}
            {i < qStep && answers[q.key] && (
              <div style={{ ...styles.bubble, background: "#C9A84C", color: "#5a1212", borderRadius: "18px 18px 4px 18px", marginLeft: "auto", marginBottom: 16 }}>
                {answers[q.key]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "recs") return (
    <div style={styles.screen}>
      <div style={styles.qHeader}>
        <p style={{ ...styles.homeTitle, fontSize: 22 }}>Your Recommendations ✨</p>
        <p style={styles.homeSubtitle}>Curated just for you</p>
      </div>
      <div style={styles.section}>
        {recommendations.map((g, i) => (
          <div key={i} style={{ ...styles.cartItem, flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={styles.cartEmoji}>{g.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#2c1a1a" }}>{g.name}</div>
                <div style={{ color: "#C9A84C", fontWeight: 700 }}>{g.price}</div>
              </div>
            </div>
            <button style={{ ...styles.primaryBtn, marginTop: 12 }} onClick={() => handleOrder(g)}>Order This Gift</button>
          </div>
        ))}
        <button style={{ ...styles.goldBtn, width: "100%", marginTop: 8, padding: "14px" }} onClick={() => setScreen("home")}>Back to Home</button>
      </div>
    </div>
  );

  if (screen === "cart") return (
    <div style={styles.screen}>
      <div style={styles.cartHeader}>
        <p style={{ ...styles.homeTitle, fontSize: 22 }}>Your Cart 🛒</p>
      </div>
      <div style={styles.section}>
        {cart.map((g, i) => (
          <div key={i} style={styles.cartItem}>
            <span style={styles.cartEmoji}>{g.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#2c1a1a" }}>{g.name}</div>
              <div style={{ color: "#C9A84C", fontWeight: 700 }}>{g.price}</div>
            </div>
          </div>
        ))}
        <button style={styles.primaryBtn} onClick={() => { setQStep(0); setAnswers({}); setScreen("questionnaire"); }}>Personalise with Quiz</button>
        <button style={{ ...styles.goldBtn, width: "100%", marginTop: 12, padding: 14 }} onClick={() => handleOrder(cart[0])}>Confirm Order</button>
      </div>
    </div>
  );

  if (screen === "success") return (
    <div style={{ ...styles.screen, ...styles.successBg }}>
      <div style={styles.successEmoji}>🎁</div>
      <p style={styles.successTitle}>Order Placed!</p>
      <p style={styles.successSub}>Your gift is on its way to {answers.who || "your loved one"} 💕</p>
      <div style={styles.successOrderId}>Order ID: {orderId}</div>
      <button style={styles.goldBtn} onClick={() => { setScreen("home"); setCart([]); setAnswers({}); setQStep(0); }}>Back to Home</button>
    </div>
  );
}
