import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Key, Heart, BarChart2, Menu, X, Search, Phone, MessageCircle,
  Mail, MapPin, CheckCircle2, ChevronRight, Facebook, Instagram, Youtube,
  BedDouble, Building2, Landmark, Warehouse, Video
} from "lucide-react";

/* ---------------------------------------------------------
   Demo data — placeholder listings only, no real properties
--------------------------------------------------------- */
const LISTINGS = [
  { id: 1, title: "Villa Les Oliviers", city: "La Marsa", type: "Villa", tag: "Vente", price: "620 000 DT", rooms: 4, area: 320, hue: 0 },
  { id: 2, title: "Résidence El Bahja", city: "Hammamet", type: "Appartement", tag: "Vente", price: "215 000 DT", rooms: 2, area: 95, hue: 40 },
  { id: 3, title: "Maison Dar Zeitoun", city: "Sousse", type: "Maison", tag: "Location", price: "1 850 DT / mois", rooms: 3, area: 180, hue: 20 },
  { id: 4, title: "Loft Marina View", city: "Gammarth", type: "Appartement", tag: "Location", price: "2 400 DT / mois", rooms: 2, area: 110, hue: 340 },
  { id: 5, title: "Terrain Cap Bon", city: "Nabeul", type: "Terrain", tag: "Vente", price: "180 000 DT", rooms: 0, area: 500, hue: 10 },
  { id: 6, title: "Villa Panorama", city: "Sidi Bou Said", type: "Villa", tag: "Vente", price: "980 000 DT", rooms: 5, area: 410, hue: 355 },
];

const TYPE_ICON = { Villa: Home, Appartement: Building2, Maison: Warehouse, Terrain: Landmark };

/* ---------------------------------------------------------
   Scroll-reveal helper
--------------------------------------------------------- */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   Main component
--------------------------------------------------------- */
export default function TransikoHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [category, setCategory] = useState("Acheter");
  const [tab, setTab] = useState("Récents");
  const [favIds, setFavIds] = useState(new Set());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleFav = (id) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = LISTINGS.filter((l) => tab === "Récents" ? true : l.tag === tab);

  const navItems = [
    { label: "Accueil", active: true },
    { label: "Propriétés" },
    { label: "Vente" },
    { label: "Location" },
    { label: "Contact" },
  ];

  const goToSoon = (label) => showToast(`« ${label} » arrive dans la prochaine étape du prototype`);

  return (
    <div className="tk-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&display=swap');

        .tk-root{
          --maroon-900:#3D0F16;
          --maroon-700:#7A2331;
          --maroon-600:#8F2A3B;
          --maroon-500:#A33449;
          --maroon-100:#F3E3E6;
          --slate-900:#20242A;
          --slate-800:#2B3038;
          --slate-700:#454C56;
          --slate-500:#7A828C;
          --slate-200:#E4E6E9;
          --slate-100:#EEF0F2;
          --cream:#FAF8F6;
          --white:#FFFFFF;
          font-family:'Inter',system-ui,sans-serif;
          background:var(--cream);
          color:var(--slate-900);
          -webkit-font-smoothing:antialiased;
          position:relative;
          overflow-x:hidden;
        }
        .tk-root *{ box-sizing:border-box; }
        .tk-h{ font-family:'Manrope',system-ui,sans-serif; }
        .tk-btn{
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          background:linear-gradient(135deg,var(--maroon-700),var(--maroon-500));
          color:#fff; font-weight:700; border:none; border-radius:14px;
          padding:14px 22px; cursor:pointer; transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
          box-shadow:0 6px 18px -6px rgba(122,35,49,.55);
        }
        .tk-btn:hover{ transform:translateY(-2px); filter:brightness(1.06); box-shadow:0 10px 24px -6px rgba(122,35,49,.6); }
        .tk-btn:active{ transform:translateY(0); }
        .tk-btn-outline{
          background:transparent; color:var(--slate-900); border:1.5px solid var(--slate-200);
          font-weight:700; border-radius:14px; padding:13px 22px; cursor:pointer; transition:.18s ease;
        }
        .tk-btn-outline:hover{ border-color:var(--maroon-500); color:var(--maroon-700); }
        .tk-btn-outline.active{ background:var(--maroon-700); color:#fff; border-color:var(--maroon-700); }

        .tk-header{
          position:sticky; top:0; z-index:40; background:rgba(250,248,246,.9);
          backdrop-filter:blur(10px); border-bottom:1px solid var(--slate-200);
        }
        .tk-header-inner{ max-width:1180px; margin:0 auto; padding:14px 20px; display:flex; align-items:center; justify-content:space-between; }
        .tk-logo{ display:flex; align-items:center; gap:10px; }
        .tk-logo-mark{ width:38px; height:38px; position:relative; flex-shrink:0; }
        .tk-logo-text{ line-height:1.05; }
        .tk-logo-text b{ font-family:'Manrope'; font-weight:800; font-size:17px; letter-spacing:.3px; color:var(--slate-900); display:block; }
        .tk-logo-text span{ font-size:10px; letter-spacing:1.5px; color:var(--slate-500); text-transform:uppercase; }
        .tk-nav-desktop{ display:none; gap:28px; }
        .tk-nav-desktop button{
          background:none; border:none; font-family:'Inter'; font-weight:600; font-size:14.5px;
          color:var(--slate-700); cursor:pointer; padding:6px 2px; position:relative;
        }
        .tk-nav-desktop button.active{ color:var(--maroon-700); }
        .tk-nav-desktop button.active::after{
          content:''; position:absolute; left:0; right:0; bottom:-4px; height:2px; background:var(--maroon-700); border-radius:2px;
        }
        .tk-icon-btn{
          width:38px; height:38px; border-radius:10px; border:1px solid var(--slate-200); background:#fff;
          display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--slate-700);
          transition:.15s ease; position:relative;
        }
        .tk-icon-btn:hover{ border-color:var(--maroon-500); color:var(--maroon-700); }
        .tk-icon-row{ display:flex; align-items:center; gap:10px; }
        .tk-badge{
          position:absolute; top:-6px; right:-6px; background:var(--maroon-700); color:#fff; font-size:10px;
          font-weight:700; border-radius:999px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; padding:0 4px;
        }

        .tk-mobile-menu{
          position:fixed; inset:0; z-index:60; display:flex; justify-content:flex-end;
        }
        .tk-mobile-menu-scrim{ position:absolute; inset:0; background:rgba(32,36,42,.45); }
        .tk-mobile-menu-panel{
          position:relative; width:min(78vw,320px); height:100%; background:#fff; padding:20px;
          box-shadow:-10px 0 40px rgba(0,0,0,.15); animation:tkSlideIn .28s cubic-bezier(.2,.8,.2,1);
          display:flex; flex-direction:column; gap:6px;
        }
        @keyframes tkSlideIn{ from{ transform:translateX(100%);} to{ transform:translateX(0);} }
        .tk-mobile-link{
          display:flex; align-items:center; gap:12px; padding:13px 14px; border-radius:12px; font-weight:700;
          color:var(--slate-800); cursor:pointer; border:none; background:none; text-align:left; font-size:15px;
        }
        .tk-mobile-link.active{ background:linear-gradient(135deg,var(--maroon-700),var(--maroon-500)); color:#fff; }

        .tk-hero{ position:relative; overflow:hidden; }
        .tk-hero-bg{
          position:absolute; inset:0;
          background:
            radial-gradient(ellipse at 20% 0%, rgba(163,52,73,.35), transparent 55%),
            linear-gradient(180deg,var(--slate-900) 0%, var(--slate-800) 100%);
        }
        .tk-skyline{ position:absolute; left:0; right:0; bottom:0; height:46%; opacity:.5; }
        .tk-skyline svg{ width:200%; height:100%; animation:tkDrift 40s linear infinite; }
        @keyframes tkDrift{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
        .tk-hero-content{ position:relative; z-index:2; max-width:720px; margin:0 auto; padding:56px 22px 40px; text-align:center; color:#fff; }
        .tk-eyebrow{ font-size:12px; font-weight:700; letter-spacing:2px; color:#E7A9B2; text-transform:uppercase; margin-bottom:14px; }
        .tk-h1{ font-size:34px; font-weight:800; line-height:1.15; margin:0 0 16px; }
        .tk-h1 em{ font-style:normal; color:#E7A9B2; }
        .tk-sub{ color:#C7CBD1; font-size:15.5px; line-height:1.6; margin:0 0 28px; }
        .tk-search-card{ background:#fff; border-radius:18px; padding:8px; box-shadow:0 20px 50px -12px rgba(0,0,0,.35); }
        .tk-search-input{
          width:100%; border:none; outline:none; padding:14px 16px; font-size:15px; color:var(--slate-900);
          border-radius:12px; font-family:'Inter'; background:transparent;
        }
        .tk-search-input::placeholder{ color:var(--slate-500); }
        .tk-search-btn{ width:100%; margin-top:6px; }
        .tk-toggle-row{ display:flex; gap:10px; justify-content:center; margin-top:18px; }
        .tk-toggle{
          padding:10px 22px; border-radius:12px; font-weight:700; font-size:14px; cursor:pointer; border:1.5px solid rgba(255,255,255,.25);
          background:rgba(255,255,255,.06); color:#fff; transition:.15s ease;
        }
        .tk-toggle.active{ background:linear-gradient(135deg,var(--maroon-700),var(--maroon-500)); border-color:transparent; }

        .tk-section{ max-width:1180px; margin:0 auto; padding:56px 22px; }
        .tk-section-head{ margin-bottom:28px; }
        .tk-eyebrow-dark{ color:var(--maroon-700); font-weight:700; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; }
        .tk-h2{ font-size:26px; font-weight:800; margin:0; color:var(--slate-900); }

        .tk-explore-grid{ display:grid; gap:18px; grid-template-columns:1fr; }
        .tk-explore-card{
          border:1px solid var(--slate-200); border-radius:20px; padding:26px; background:#fff;
          transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease; cursor:pointer;
        }
        .tk-explore-card:hover{ transform:translateY(-4px); box-shadow:0 18px 40px -18px rgba(32,36,42,.25); border-color:var(--maroon-500); }
        .tk-explore-icon{ width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .tk-explore-icon.buy{ background:var(--maroon-100); color:var(--maroon-700); }
        .tk-explore-icon.rent{ background:var(--slate-100); color:var(--slate-700); }
        .tk-explore-card h3{ font-family:'Manrope'; font-size:20px; font-weight:800; margin:0 0 4px; }
        .tk-explore-card p.tk-muted{ color:var(--slate-500); font-size:14px; margin:0 0 16px; }
        .tk-bullets{ list-style:none; padding:0; margin:0 0 20px; display:grid; grid-template-columns:1fr 1fr; gap:8px 14px; }
        .tk-bullets li{ font-size:14px; color:var(--slate-700); display:flex; align-items:center; gap:8px; }
        .tk-bullets li::before{ content:''; width:6px; height:6px; border-radius:50%; background:var(--maroon-500); flex-shrink:0; }
        .tk-explore-link{ display:inline-flex; align-items:center; gap:6px; font-weight:700; color:var(--maroon-700); background:none; border:none; padding:0; cursor:pointer; font-size:14.5px; }

        .tk-tabs{ display:inline-flex; background:var(--slate-100); border-radius:14px; padding:4px; gap:4px; }
        .tk-tab{ border:none; background:none; padding:9px 16px; border-radius:11px; font-weight:700; font-size:13.5px; color:var(--slate-700); cursor:pointer; }
        .tk-tab.active{ background:linear-gradient(135deg,var(--maroon-700),var(--maroon-500)); color:#fff; }

        .tk-cards-grid{ display:grid; grid-template-columns:1fr; gap:18px; margin-top:22px; }
        .tk-card{ border:1px solid var(--slate-200); border-radius:18px; overflow:hidden; background:#fff; transition:transform .2s ease, box-shadow .2s ease; }
        .tk-card:hover{ transform:translateY(-4px); box-shadow:0 20px 40px -18px rgba(32,36,42,.25); }
        .tk-card-media{ height:150px; position:relative; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.85); }
        .tk-card-tag{ position:absolute; top:10px; left:10px; background:rgba(255,255,255,.92); color:var(--slate-900); font-size:11px; font-weight:800; padding:4px 10px; border-radius:999px; }
        .tk-card-fav{ position:absolute; top:8px; right:8px; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,.92); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .tk-card-body{ padding:16px; }
        .tk-card-body h4{ font-family:'Manrope'; font-size:16px; font-weight:800; margin:0 0 3px; }
        .tk-card-loc{ display:flex; align-items:center; gap:5px; color:var(--slate-500); font-size:13px; margin-bottom:10px; }
        .tk-card-meta{ display:flex; gap:14px; color:var(--slate-500); font-size:12.5px; margin-bottom:12px; }
        .tk-card-meta span{ display:flex; align-items:center; gap:5px; }
        .tk-card-price{ font-weight:800; color:var(--maroon-700); font-size:15.5px; }

        .tk-cta-full{ text-align:center; margin-top:28px; }

        .tk-service{ background:var(--slate-100); border-radius:24px; }
        .tk-service-inner{ padding:44px 26px; }
        .tk-service p.lead{ color:var(--slate-700); font-size:15px; line-height:1.7; margin:14px 0 22px; max-width:560px; }
        .tk-check-list{ display:grid; gap:12px; }
        .tk-check-list div{ display:flex; align-items:center; gap:10px; font-weight:600; color:var(--slate-800); font-size:14.5px; }
        .tk-check-list svg{ color:var(--maroon-700); flex-shrink:0; }

        .tk-contact-card{ background:#fff; border:1px solid var(--slate-200); border-radius:22px; padding:26px; box-shadow:0 30px 60px -30px rgba(32,36,42,.2); }
        .tk-contact-card h3{ font-family:'Manrope'; font-size:20px; font-weight:800; margin:0 0 18px; }
        .tk-contact-row{
          display:flex; align-items:center; gap:14px; border:1px solid var(--slate-200); border-radius:14px; padding:14px 16px;
          margin-bottom:12px; cursor:pointer; transition:.15s ease;
        }
        .tk-contact-row:hover{ border-color:var(--maroon-500); background:var(--maroon-100); }
        .tk-contact-row .tk-ic{ width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .tk-contact-row .lbl{ font-size:12.5px; color:var(--slate-500); }
        .tk-contact-row .val{ font-weight:700; color:var(--slate-900); font-size:14.5px; }
        .tk-contact-row .chev{ margin-left:auto; color:var(--slate-500); }

        .tk-newsletter{ background:var(--slate-900); color:#fff; }
        .tk-newsletter-inner{ text-align:center; max-width:520px; margin:0 auto; padding:56px 22px; }
        .tk-newsletter h2{ font-family:'Manrope'; font-size:24px; font-weight:800; margin:0 0 10px; }
        .tk-newsletter p{ color:#C7CBD1; font-size:14.5px; margin:0 0 24px; }
        .tk-nl-form{ display:flex; flex-direction:column; gap:10px; }
        .tk-nl-input{
          border:1.5px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#fff;
          border-radius:13px; padding:13px 16px; font-size:14.5px; outline:none;
        }
        .tk-nl-input::placeholder{ color:#9AA1A8; }
        .tk-nl-success{ background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.2); border-radius:13px; padding:14px; font-weight:600; }

        .tk-footer{ background:var(--slate-900); color:#C7CBD1; border-top:1px solid rgba(255,255,255,.08); }
        .tk-footer-inner{ max-width:1180px; margin:0 auto; padding:40px 22px 28px; display:grid; gap:32px; grid-template-columns:1fr; }
        .tk-footer h5{ color:#fff; font-family:'Manrope'; font-size:12.5px; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 14px; }
        .tk-footer a, .tk-footer .tk-flink{ display:block; color:#C7CBD1; text-decoration:none; font-size:14px; padding:5px 0; cursor:pointer; }
        .tk-footer a:hover, .tk-footer .tk-flink:hover{ color:#fff; }
        .tk-footer-brand p{ font-size:13.5px; line-height:1.7; color:#9AA1A8; margin:12px 0 16px; }
        .tk-social{ display:flex; gap:10px; }
        .tk-social a{ width:34px; height:34px; border-radius:9px; border:1px solid rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; padding:0; }
        .tk-footer-contact div{ display:flex; align-items:flex-start; gap:9px; font-size:13.5px; margin-bottom:10px; color:#C7CBD1; }
        .tk-wa-btn{ display:inline-flex; align-items:center; gap:8px; background:#2AAE4E; color:#fff; font-weight:700; padding:10px 16px; border-radius:12px; font-size:13.5px; margin-top:6px; border:none; cursor:pointer; }
        .tk-footer-bottom{ border-top:1px solid rgba(255,255,255,.08); padding:16px 22px; text-align:center; font-size:12.5px; color:#8A9098; display:flex; flex-direction:column; gap:6px; }
        .tk-footer-bottom .links{ display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .tk-footer-bottom .links span{ cursor:pointer; }
        .tk-footer-bottom .links span:hover{ color:#fff; }

        .tk-chat-fab{
          position:fixed; bottom:22px; right:22px; width:56px; height:56px; border-radius:50%;
          background:#2AAE4E; border:none; display:flex; align-items:center; justify-content:center;
          box-shadow:0 12px 28px -8px rgba(42,174,78,.6); cursor:pointer; z-index:50; color:#fff;
        }
        .tk-chat-pop{
          position:fixed; bottom:88px; right:22px; width:min(88vw,300px); background:#fff; border-radius:16px;
          box-shadow:0 24px 60px -16px rgba(0,0,0,.35); z-index:50; overflow:hidden; animation:tkPop .22s ease;
        }
        @keyframes tkPop{ from{ opacity:0; transform:translateY(10px) scale(.97);} to{ opacity:1; transform:translateY(0) scale(1);} }
        .tk-chat-head{ background:#2AAE4E; color:#fff; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; }
        .tk-chat-head b{ display:block; font-size:14px; }
        .tk-chat-head span{ font-size:11.5px; opacity:.9; }
        .tk-chat-body{ padding:14px; font-size:13.5px; color:var(--slate-700); }
        .tk-chat-cta{ margin:12px 14px 14px; width:calc(100% - 28px); background:#2AAE4E; color:#fff; border:none; border-radius:11px; padding:11px; font-weight:700; cursor:pointer; }

        .tk-toast{
          position:fixed; left:50%; bottom:22px; transform:translateX(-50%); background:var(--slate-900); color:#fff;
          padding:12px 18px; border-radius:12px; font-size:13.5px; z-index:70; box-shadow:0 16px 32px -12px rgba(0,0,0,.4);
          animation:tkToastIn .25s ease;
        }
        @keyframes tkToastIn{ from{ opacity:0; transform:translate(-50%,10px);} to{ opacity:1; transform:translate(-50%,0);} }

        @media (min-width:760px){
          .tk-nav-desktop{ display:flex; }
          .tk-menu-btn-mobile{ display:none; }
          .tk-h1{ font-size:46px; }
          .tk-sub{ font-size:16.5px; }
          .tk-hero-content{ padding:84px 22px 60px; }
          .tk-explore-grid{ grid-template-columns:1fr 1fr; }
          .tk-cards-grid{ grid-template-columns:1fr 1fr 1fr; }
          .tk-section-head{ display:flex; align-items:flex-end; justify-content:space-between; }
          .tk-footer-inner{ grid-template-columns:1.4fr 1fr 1fr; }
          .tk-footer-bottom{ flex-direction:row; justify-content:space-between; }
        }
      `}</style>

      {/* ---------------- HEADER ---------------- */}
      <header className="tk-header">
        <div className="tk-header-inner">
          <div className="tk-logo">
            <svg className="tk-logo-mark" viewBox="0 0 100 100" fill="none">
              <path d="M8 100V38L38 18V100H8Z" fill="var(--maroon-700)" />
              <path d="M62 100V8L92 28V100H62Z" fill="var(--slate-700)" />
              <path d="M38 100V58L50 48L62 58V100H38Z" fill="#fff" stroke="var(--slate-200)" strokeWidth="2" />
            </svg>
            <div className="tk-logo-text">
              <b>Transiko</b>
              <span>Agence Immobilière</span>
            </div>
          </div>

          <nav className="tk-nav-desktop">
            {navItems.map((n) => (
              <button key={n.label} className={n.active ? "active" : ""} onClick={() => !n.active && goToSoon(n.label)}>
                {n.label}
              </button>
            ))}
          </nav>

          <div className="tk-icon-row">
            <button className="tk-icon-btn" title="Comparaison" onClick={() => goToSoon("Comparaison")}>
              <BarChart2 size={17} />
            </button>
            <button className="tk-icon-btn" title="Favoris" onClick={() => showToast(favIds.size ? `${favIds.size} bien(s) en favoris` : "Aucun favori pour le moment")}>
              <Heart size={17} fill={favIds.size ? "var(--maroon-700)" : "none"} color={favIds.size ? "var(--maroon-700)" : "currentColor"} />
              {favIds.size > 0 && <span className="tk-badge">{favIds.size}</span>}
            </button>
            <button className="tk-icon-btn tk-menu-btn-mobile" title="Menu" onClick={() => setMenuOpen(true)}>
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- MOBILE MENU ---------------- */}
      {menuOpen && (
        <div className="tk-mobile-menu">
          <div className="tk-mobile-menu-scrim" onClick={() => setMenuOpen(false)} />
          <div className="tk-mobile-menu-panel">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <button className="tk-icon-btn" onClick={() => setMenuOpen(false)}><X size={18} /></button>
            </div>
            {["Accueil", "Propriétés", "Vente", "Location", "Contact", "Comparaison", "Favoris"].map((l, i) => (
              <button
                key={l}
                className={`tk-mobile-link ${i === 0 ? "active" : ""}`}
                onClick={() => { if (i !== 0) goToSoon(l); setMenuOpen(false); }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- HERO ---------------- */}
      <section className="tk-hero">
        <div className="tk-hero-bg" />
        <div className="tk-skyline" aria-hidden="true">
          <svg viewBox="0 0 800 200" preserveAspectRatio="none">
            <g fill="rgba(255,255,255,0.06)">
              <rect x="0" y="90" width="60" height="110" />
              <rect x="70" y="60" width="45" height="140" />
              <rect x="125" y="110" width="70" height="90" />
              <rect x="205" y="40" width="50" height="160" />
              <rect x="265" y="80" width="60" height="120" />
              <rect x="335" y="100" width="45" height="100" />
              <rect x="400" y="90" width="60" height="110" />
              <rect x="470" y="60" width="45" height="140" />
              <rect x="525" y="110" width="70" height="90" />
              <rect x="605" y="40" width="50" height="160" />
              <rect x="665" y="80" width="60" height="120" />
              <rect x="735" y="100" width="45" height="100" />
            </g>
          </svg>
        </div>
        <div className="tk-hero-content">
          <div className="tk-eyebrow">Immobilier en Tunisie</div>
          <h1 className="tk-h1 tk-h">Votre prochaine <em>adresse</em>, en toute confiance</h1>
          <p className="tk-sub">Villas, appartements et terrains sélectionnés avec soin, du Grand Tunis au Cap Bon.</p>

          <div className="tk-search-card">
            <input
              className="tk-search-input"
              placeholder={category === "Acheter" ? "Villa, appartement, La Marsa…" : "Appartement, maison, Hammamet…"}
            />
            <button className="tk-btn tk-search-btn" onClick={() => showToast("La recherche complète arrive à l'étape suivante du prototype")}>
              <Search size={16} /> Rechercher
            </button>
          </div>

          <div className="tk-toggle-row">
            <button className={`tk-toggle ${category === "Acheter" ? "active" : ""}`} onClick={() => setCategory("Acheter")}>Acheter</button>
            <button className={`tk-toggle ${category === "Louer" ? "active" : ""}`} onClick={() => setCategory("Louer")}>Louer</button>
          </div>
        </div>
      </section>

      {/* ---------------- EXPLORE ---------------- */}
      <section className="tk-section">
        <Reveal className="tk-section-head">
          <div>
            <div className="tk-eyebrow-dark">Explorer</div>
            <h2 className="tk-h2 tk-h">Par où commencer ?</h2>
          </div>
        </Reveal>

        <div className="tk-explore-grid">
          <Reveal delay={0.05}>
            <div className="tk-explore-card" onClick={() => goToSoon("Acheter")}>
              <div className="tk-explore-icon buy"><Home size={24} /></div>
              <h3 className="tk-h">Acheter</h3>
              <p className="tk-muted">Investissez dans la durée</p>
              <ul className="tk-bullets">
                <li>Villas</li><li>Appartements</li><li>Maisons</li><li>Terrains</li>
              </ul>
              <button className="tk-explore-link">Explorer les biens <ChevronRight size={15} /></button>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="tk-explore-card" onClick={() => goToSoon("Louer")}>
              <div className="tk-explore-icon rent"><Key size={24} /></div>
              <h3 className="tk-h">Louer</h3>
              <p className="tk-muted">Installez-vous sans attendre</p>
              <ul className="tk-bullets">
                <li>Appartements</li><li>Maisons</li><li>Villas</li><li>Bureaux</li>
              </ul>
              <button className="tk-explore-link">Explorer les biens <ChevronRight size={15} /></button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SELECTION ---------------- */}
      <section className="tk-section">
        <Reveal className="tk-section-head">
          <div>
            <div className="tk-eyebrow-dark">Sélection</div>
            <h2 className="tk-h2 tk-h">Nos biens à la une</h2>
          </div>
          <div className="tk-tabs" style={{ marginTop: 16 }}>
            {["Récents", "Vente", "Location"].map((t) => (
              <button key={t} className={`tk-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </Reveal>

        <div className="tk-cards-grid">
          {filtered.map((l, i) => {
            const Icon = TYPE_ICON[l.type];
            const fav = favIds.has(l.id);
            return (
              <Reveal key={l.id} delay={i * 0.06}>
                <div className="tk-card">
                  <div className="tk-card-media" style={{ background: `linear-gradient(135deg, hsl(${l.hue} 45% 30%), hsl(${l.hue + 30} 35% 45%))` }}>
                    <Icon size={34} />
                    <span className="tk-card-tag">{l.tag}</span>
                    <button className="tk-card-fav" onClick={() => toggleFav(l.id)}>
                      <Heart size={15} fill={fav ? "var(--maroon-700)" : "none"} color={fav ? "var(--maroon-700)" : "#454C56"} />
                    </button>
                  </div>
                  <div className="tk-card-body">
                    <h4 className="tk-h">{l.title}</h4>
                    <div className="tk-card-loc"><MapPin size={13} /> {l.city}</div>
                    <div className="tk-card-meta">
                      {l.rooms > 0 && <span><BedDouble size={14} /> {l.rooms}</span>}
                      <span><Building2 size={14} /> {l.area} m²</span>
                    </div>
                    <div className="tk-card-price">{l.price}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="tk-cta-full">
          <button className="tk-btn" onClick={() => goToSoon("Toutes les propriétés")}>
            Voir toutes les propriétés <ChevronRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* ---------------- SERVICE ---------------- */}
      <section className="tk-section">
        <Reveal>
          <div className="tk-service">
            <div className="tk-service-inner">
              <div className="tk-eyebrow-dark">À votre service</div>
              <h2 className="tk-h2 tk-h">Votre partenaire immobilier, du premier contact aux clés en main</h2>
              <p className="lead">Transiko accompagne particuliers et investisseurs pour l'achat, la vente et la location de biens partout en Tunisie, avec un suivi rigoureux à chaque étape.</p>
              <div className="tk-check-list">
                <div><CheckCircle2 size={18} /> Accompagnement personnalisé à chaque étape</div>
                <div><CheckCircle2 size={18} /> Visites et reportages photo professionnels</div>
                <div><CheckCircle2 size={18} /> Biens vérifiés sur place avant publication</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- CONTACT CTA ---------------- */}
      <section className="tk-section">
        <Reveal>
          <div className="tk-contact-card">
            <h3 className="tk-h">Parlons de votre projet</h3>

            <div className="tk-contact-row" onClick={() => showToast("Appel : +216 22 900 470")}>
              <div className="tk-ic" style={{ background: "var(--maroon-100)", color: "var(--maroon-700)" }}><Phone size={18} /></div>
              <div>
                <div className="lbl">Appel direct</div>
                <div className="val">+216 22 900 470</div>
              </div>
              <ChevronRight size={16} className="chev" />
            </div>

            <div className="tk-contact-row" onClick={() => showToast("Ouverture de WhatsApp…")}>
              <div className="tk-ic" style={{ background: "#E4F7EA", color: "#2AAE4E" }}><MessageCircle size={18} /></div>
              <div>
                <div className="lbl">WhatsApp</div>
                <div className="val">Envoyer un message</div>
              </div>
              <ChevronRight size={16} className="chev" />
            </div>

            <div className="tk-contact-row" onClick={() => goToSoon("Formulaire de contact")}>
              <div className="tk-ic" style={{ background: "var(--slate-100)", color: "var(--slate-700)" }}><Mail size={18} /></div>
              <div>
                <div className="lbl">Formulaire de contact</div>
                <div className="val">Nous écrire</div>
              </div>
              <ChevronRight size={16} className="chev" />
            </div>

            <button className="tk-btn" style={{ width: "100%", marginTop: 6 }} onClick={() => goToSoon("Toutes les propriétés")}>
              Voir toutes les propriétés <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="tk-newsletter">
        <Reveal className="tk-newsletter-inner">
          <h2 className="tk-h">Restez informé</h2>
          <p>Recevez en exclusivité les nouvelles annonces et les baisses de prix.</p>
          {subscribed ? (
            <div className="tk-nl-success">Merci ! Vous recevrez bientôt nos prochaines annonces.</div>
          ) : (
            <form className="tk-nl-form" onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}>
              <input
                className="tk-nl-input"
                type="email"
                required
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="tk-btn" type="submit">S'inscrire</button>
            </form>
          )}
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="tk-footer">
        <div className="tk-footer-inner">
          <div className="tk-footer-brand">
            <div className="tk-logo">
              <svg className="tk-logo-mark" viewBox="0 0 100 100" fill="none">
                <path d="M8 100V38L38 18V100H8Z" fill="var(--maroon-500)" />
                <path d="M62 100V8L92 28V100H62Z" fill="#8A9098" />
                <path d="M38 100V58L50 48L62 58V100H38Z" fill="#fff" />
              </svg>
              <div className="tk-logo-text">
                <b style={{ color: "#fff" }}>Transiko</b>
                <span>Agence Immobilière</span>
              </div>
            </div>
            <p>Votre partenaire de confiance pour trouver la propriété de vos rêves en Tunisie. Des villas d'exception aux appartements du quotidien.</p>
            <div className="tk-social">
              <a href="#" onClick={(e) => { e.preventDefault(); goToSoon("Facebook"); }}><Facebook size={16} /></a>
              <a href="#" onClick={(e) => { e.preventDefault(); goToSoon("Instagram"); }}><Instagram size={16} /></a>
              <a href="#" onClick={(e) => { e.preventDefault(); goToSoon("YouTube"); }}><Youtube size={16} /></a>
            </div>
          </div>

          <div>
            <h5>Navigation</h5>
            <span className="tk-flink" onClick={() => showToast("Vous êtes sur l'accueil")}>Accueil</span>
            <span className="tk-flink" onClick={() => goToSoon("Favoris")}>Favoris</span>
            <span className="tk-flink" onClick={() => goToSoon("Nous contacter")}>Nous contacter</span>
            <h5 style={{ marginTop: 18 }}>Types de biens</h5>
            <span className="tk-flink" onClick={() => goToSoon("Villas")}>Villas</span>
            <span className="tk-flink" onClick={() => goToSoon("Appartements")}>Appartements</span>
            <span className="tk-flink" onClick={() => goToSoon("Maisons")}>Maisons</span>
            <span className="tk-flink" onClick={() => goToSoon("Terrains")}>Terrains</span>
          </div>

          <div className="tk-footer-contact">
            <h5>Contact</h5>
            <div><MapPin size={15} /> Tunis, Nabeul, Hammamet</div>
            <div><Phone size={15} /> +216 22 900 470</div>
            <div><Mail size={15} /> contact@transiko.tn</div>
            <button className="tk-wa-btn" onClick={() => showToast("Ouverture de WhatsApp…")}>
              <MessageCircle size={15} /> WhatsApp
            </button>
          </div>
        </div>
        <div className="tk-footer-bottom">
          <div>© 2026 Transiko. Tous droits réservés.</div>
          <div className="links">
            <span onClick={() => goToSoon("Politique de confidentialité")}>Politique de confidentialité</span>
            <span onClick={() => goToSoon("Conditions d'utilisation")}>Conditions d'utilisation</span>
          </div>
        </div>
      </footer>

      {/* ---------------- CHAT WIDGET ---------------- */}
      {chatOpen && (
        <div className="tk-chat-pop">
          <div className="tk-chat-head">
            <div>
              <b>Transiko</b>
              <span>En ligne</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
              <X size={16} />
            </button>
          </div>
          <div className="tk-chat-body">Bonjour 👋 Comment pouvons-nous vous aider avec votre recherche immobilière ?</div>
          <button className="tk-chat-cta" onClick={() => showToast("Le chat en direct arrive dans une prochaine étape")}>
            Commencer la conversation
          </button>
        </div>
      )}
      <button className="tk-chat-fab" onClick={() => setChatOpen((v) => !v)}>
        <MessageCircle size={24} />
      </button>

      {toast && <div className="tk-toast">{toast}</div>}
    </div>
  );
}
