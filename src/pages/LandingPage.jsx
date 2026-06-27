import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle, BarChart3, Users,
  ArrowRight, Cpu, Activity, Lock, MapPin, Zap,
  ChevronRight, Star, Globe, Sparkles, Bot, AlertTriangle
} from 'lucide-react';
import { useTranslation } from '@/locales/LanguageContext';
import { Button } from '@/components/ui/Button';

/* ─────────────────────────── tiny hooks ─────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return y;
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

/* ─────────────────────────── particle field ─────────────────────────── */
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.6 + 0.1,
  speed: Math.random() * 20 + 10,
  color: ['#14b8a6', '#06b6d4', '#10b981', '#818cf8', '#f472b6'][Math.floor(Math.random() * 5)],
}));

/* ─────────────────────────── floating orbs ─────────────────────────── */
const ORBS = [
  { w: 600, h: 600, top: '5%',  left: '-10%', color: 'rgba(20,184,166,0.18)',  blur: 130, delay: 0 },
  { w: 500, h: 500, top: '30%', right: '-8%', color: 'rgba(99,102,241,0.15)',  blur: 110, delay: 2 },
  { w: 400, h: 400, top: '60%', left: '20%',  color: 'rgba(236,72,153,0.12)',  blur: 100, delay: 4 },
  { w: 350, h: 350, top: '10%', right: '20%', color: 'rgba(6,182,212,0.14)',   blur: 90,  delay: 1 },
  { w: 300, h: 300, top: '80%', right: '10%', color: 'rgba(16,185,129,0.12)',  blur: 80,  delay: 3 },
];

/* ─────────────────────────── MAIN ─────────────────────────── */
export default function LandingPage() {
  const { t } = useTranslation();
  const scrollY = useScrollY();

  /* section refs for scroll-reveal */
  const statsRef  = useRef(null);
  const featRef   = useRef(null);
  const howRef    = useRef(null);
  const ctaRef    = useRef(null);
  const statsIn   = useInView(statsRef);
  const featIn    = useInView(featRef);
  const howIn     = useInView(howRef);
  const ctaIn     = useInView(ctaRef);

  /* typewriter for hero badge */
  const words = ['Smart Cities.', 'Civic Trust.', 'Real Impact.', 'Live Intel.'];
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const target = words[wordIdx];
    if (!deleting && displayed === target) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && displayed === '') {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
      return;
    }
    const speed = deleting ? 40 : 70;
    const t = setTimeout(() => {
      setDisplayed(deleting ? displayed.slice(0, -1) : target.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  });

  /* ─── STYLES (scoped) ─── */
  const S = {
    gradText: {
      background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 40%, #818cf8 70%, #f472b6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    gradText2: {
      background: 'linear-gradient(90deg, #f472b6 0%, #818cf8 50%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    heroGlow: {
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(20,184,166,0.25) 0%, rgba(99,102,241,0.12) 50%, transparent 100%)',
    },
    gridBg: {
      backgroundImage: `
        linear-gradient(rgba(20,184,166,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20,184,166,0.06) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    },
    glass: {
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    glassCard: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    navBg: {
      background: scrollY > 20
        ? 'rgba(3,7,18,0.85)'
        : 'transparent',
      backdropFilter: scrollY > 20 ? 'blur(24px)' : 'none',
      borderBottom: scrollY > 20 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    },
  };

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'Outfit, Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── ANIMATED BG ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, ...S.gridBg, maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 80%)' }} />

        {/* orbs */}
        {ORBS.map((o, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: o.w, height: o.h,
            top: o.top, left: o.left, right: o.right,
            background: o.color,
            borderRadius: '50%',
            filter: `blur(${o.blur}px)`,
            animation: `lp-float ${18 + i * 4}s ease-in-out ${o.delay}s infinite alternate`,
            mixBlendMode: 'screen',
          }} />
        ))}

        {/* particles */}
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '50%',
            opacity: p.opacity,
            animation: `lp-drift ${p.speed}s linear infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }} />
        ))}

        {/* top vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,7,18,0.6) 0%, transparent 40%, rgba(3,7,18,0.4) 80%, #030712 100%)' }} />
      </div>

      {/* ── KEYFRAMES (inline) ── */}
      <style>{`
        @keyframes lp-float {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -40px) scale(1.08); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes lp-drift {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
        @keyframes lp-slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lp-scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lp-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes lp-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes lp-pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes lp-border-flow {
          0%, 100% { border-color: rgba(20,184,166,0.4); box-shadow: 0 0 20px rgba(20,184,166,0.2); }
          33%      { border-color: rgba(99,102,241,0.4); box-shadow: 0 0 20px rgba(99,102,241,0.2); }
          66%      { border-color: rgba(244,114,182,0.4); box-shadow: 0 0 20px rgba(244,114,182,0.2); }
        }
        @keyframes lp-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes lp-bounce-slow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .lp-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .lp-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .lp-cta-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #14b8a6, #06b6d4, #818cf8);
          background-size: 200% 200%;
          animation: lp-gradient-shift 3s ease infinite;
          border: none;
          color: #030712;
          font-weight: 900;
          border-radius: 16px;
          padding: 18px 40px;
          font-size: 1.125rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 0 40px rgba(20,184,166,0.4), 0 0 80px rgba(99,102,241,0.2);
        }
        .lp-cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 60px rgba(20,184,166,0.6), 0 0 120px rgba(99,102,241,0.3);
        }
        .lp-outline-btn {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.15);
          color: #e2e8f0;
          font-weight: 700;
          border-radius: 16px;
          padding: 18px 40px;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(10px);
          animation: lp-border-flow 4s ease infinite;
        }
        .lp-outline-btn:hover {
          background: rgba(20,184,166,0.1);
          transform: translateY(-3px);
        }
        .lp-stat-card:hover .lp-stat-icon {
          transform: scale(1.2) rotate(5deg);
        }
        .lp-feat-card:hover {
          transform: translateY(-8px);
          border-color: rgba(20,184,166,0.3) !important;
          box-shadow: 0 20px 60px rgba(20,184,166,0.15), 0 0 0 1px rgba(20,184,166,0.1) !important;
        }
        .lp-step:hover .lp-step-num {
          background: linear-gradient(135deg, #14b8a6, #818cf8);
          color: white;
          transform: scale(1.1);
        }
      `}</style>

      {/* ══════════════ NAV ══════════════ */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 9999, ...S.navBg }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(20,184,166,0.5)',
            }}>
              <Shield size={18} color="#030712" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em', ...S.gradText }}>
              {t('logo')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/auth" style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#f1f5f9'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              Operator Login
            </Link>
            <Link to="/auth" className="lp-cta-btn" style={{ padding: '10px 24px', fontSize: '0.8rem', borderRadius: 10, gap: 6 }}>
              Get Started
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px' }}>

        {/* hero glow */}
        <div style={{ position: 'absolute', inset: 0, ...S.heroGlow, pointerEvents: 'none' }} />

        {/* spinning ring behind text */}
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', border: '1px solid rgba(20,184,166,0.08)', animation: 'lp-spin-slow 40s linear infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.06)', animation: 'lp-spin-slow 30s linear infinite reverse', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 920 }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.25)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#5eead4', marginBottom: 32,
            animation: 'lp-slide-up 0.6s ease both',
            boxShadow: '0 0 20px rgba(20,184,166,0.15)',
          }}>
            <Activity size={12} style={{ animation: 'lp-bounce-slow 2s ease infinite' }} />
            <span>Civic Intelligence Engine v2.0</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14b8a6', animation: 'lp-pulse-ring 1.5s ease infinite', display: 'inline-block' }} />
          </div>

          {/* typewriter line */}
          <div style={{ animation: 'lp-slide-up 0.6s 0.1s ease both', opacity: 0, animationFillMode: 'both' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', marginBottom: 16 }}>
              Building /{' '}
              <span style={{ ...S.gradText2, fontWeight: 800 }}>{displayed}<span style={{ opacity: Math.floor(Date.now() / 500) % 2 ? 1 : 0 }}>|</span></span>
            </p>
          </div>

          {/* main headline */}
          <div style={{ animation: 'lp-slide-up 0.7s 0.15s ease both', opacity: 0, animationFillMode: 'both' }}>
            <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 28 }}>
              <span style={{ color: '#f1f5f9' }}>Report. Track. </span>
              <br />
              <span style={{
                ...S.gradText,
                backgroundSize: '200% 200%',
                animation: 'lp-gradient-shift 4s ease infinite',
                display: 'inline-block',
              }}>
                Resolve Civic Issues
              </span>
              <br />
              <span style={{ color: '#f1f5f9' }}>in Real Time.</span>
            </h1>
          </div>

          {/* subtitle */}
          <div style={{ animation: 'lp-slide-up 0.7s 0.25s ease both', opacity: 0, animationFillMode: 'both' }}>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 400 }}>
              A smart civic intelligence platform powered by AI deduplication, distributed verification, and real-time community crowdsourcing.
            </p>
          </div>

          {/* CTA buttons */}
          <div style={{ animation: 'lp-slide-up 0.7s 0.35s ease both', opacity: 0, animationFillMode: 'both', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/auth" className="lp-cta-btn">
              <Sparkles size={18} />
              Deploy System
              <ArrowRight size={18} />
            </Link>
            <Link to="/map" className="lp-outline-btn">
              <MapPin size={18} />
              View Live Intel Map
            </Link>
          </div>

          {/* trust bar */}
          <div style={{ animation: 'lp-fade-in 1s 0.8s ease both', opacity: 0, animationFillMode: 'both', marginTop: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
            {[
              { icon: Shield,       label: 'End-to-End Encrypted',  color: '#14b8a6' },
              { icon: Zap,          label: 'AI-Powered Triage',      color: '#818cf8' },
              { icon: CheckCircle,  label: '99.4% Report Accuracy',  color: '#f472b6' },
              { icon: Globe,        label: 'Open Civic Protocol',    color: '#06b6d4' },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
                <Icon size={14} style={{ color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#334155', animation: 'lp-bounce-slow 2s ease infinite' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(20,184,166,0.5), transparent)' }} />
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section ref={statsRef} style={{ position: 'relative', zIndex: 10, padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { label: 'Active Nodes',     value: '4.8k+',  icon: Activity,    gradient: 'linear-gradient(135deg,#14b8a6,#06b6d4)' },
            { label: 'Issues Resolved',  value: '1,420+', icon: CheckCircle, gradient: 'linear-gradient(135deg,#818cf8,#a78bfa)' },
            { label: 'AI Accuracy',      value: '99.4%',  icon: Cpu,         gradient: 'linear-gradient(135deg,#f472b6,#fb923c)' },
            { label: 'Avg Resolution',   value: '12.5h',  icon: Zap,         gradient: 'linear-gradient(135deg,#34d399,#059669)' },
          ].map(({ label, value, icon: Icon, gradient }, i) => (
            <div key={i} className="lp-stat-card" style={{
              ...S.glassCard,
              borderRadius: 20,
              padding: '32px 24px',
              textAlign: 'center',
              transition: 'all 0.4s ease',
              opacity: statsIn ? 1 : 0,
              transform: statsIn ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: `${i * 0.1}s`,
            }}>
              <div className="lp-stat-icon" style={{
                width: 52, height: 52, borderRadius: 14, background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', transition: 'transform 0.3s',
                boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
              }}>
                <Icon size={22} color="#fff" />
              </div>
              <p style={{ fontSize: 40, fontWeight: 900, color: '#f1f5f9', lineHeight: 1, marginBottom: 8 }}>{value}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section ref={featRef} style={{ position: 'relative', zIndex: 10, padding: '120px 24px' }}>
        {/* section glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* heading */}
          <div style={{ textAlign: 'center', marginBottom: 80, opacity: featIn ? 1 : 0, transform: featIn ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: 11, fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
              <Bot size={11} /> Platform Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#f1f5f9', lineHeight: 1.1 }}>
              Three Pillars of{' '}
              <span style={{ ...S.gradText }}>Civic Intelligence</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 18, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
              Built for transparency, designed for scale.
            </p>
          </div>

          {/* cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {[
              {
                icon: Cpu, gradient: 'linear-gradient(135deg,#14b8a6,#06b6d4)',
                glow: 'rgba(20,184,166,0.2)',
                title: 'AI Deduplication Engine',
                desc: 'Automatically clusters identical reports within a 500m radius using geospatial ML. Prevents municipal spam and optimizes deployment of repair crews.',
                tag: 'ML-Powered', delay: 0,
              },
              {
                icon: Users, gradient: 'linear-gradient(135deg,#818cf8,#a78bfa)',
                glow: 'rgba(129,140,248,0.2)',
                title: 'Distributed Verification',
                desc: 'Trusted citizen verifiers review nearby reports physically. Multi-node consensus ensures every data point reaching officials is 100% reliable.',
                tag: 'Community', delay: 0.1,
              },
              {
                icon: BarChart3, gradient: 'linear-gradient(135deg,#f472b6,#fb923c)',
                glow: 'rgba(244,114,182,0.2)',
                title: 'Command Dashboard',
                desc: 'A mission-control interface for city admins. Track resolution velocities, identify hotspot districts, and dispatch resources with surgical precision.',
                tag: 'Real-time', delay: 0.2,
              },
            ].map(({ icon: Icon, gradient, glow, title, desc, tag, delay }, i) => (
              <div key={i} className="lp-feat-card" style={{
                ...S.glassCard,
                borderRadius: 24,
                padding: '36px 32px',
                transition: 'all 0.4s ease',
                opacity: featIn ? 1 : 0,
                transform: featIn ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}s`,
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 32px ${glow}`,
                  }}>
                    <Icon size={24} color="#fff" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {tag}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section ref={howRef} style={{ position: 'relative', zIndex: 10, padding: '120px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ position: 'absolute', top: 0, left: '30%', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(244,114,182,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80, opacity: howIn ? 1 : 0, transform: howIn ? 'none' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)', fontSize: 11, fontWeight: 700, color: '#f9a8d4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
              <Zap size={11} /> How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', color: '#f1f5f9', lineHeight: 1.1 }}>
              From Report to{' '}
              <span style={{ ...S.gradText2 }}>Resolution</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { num: '01', title: 'Citizen Reports', desc: 'Snap a photo, add a description, and pin the location. Our AI instantly categorizes and triages the issue.', color: '#14b8a6' },
              { num: '02', title: 'AI + Community Verify', desc: 'Nearby trusted verifiers physically confirm the report. AI clusters duplicates and calculates confidence scores.', color: '#818cf8' },
              { num: '03', title: 'Officials Dispatched', desc: 'Verified high-priority issues are routed to the right department via our command dashboard in real time.', color: '#f472b6' },
              { num: '04', title: 'Resolution & Proof', desc: 'Officials upload proof of resolution. Citizens are notified. The transparency loop is complete.', color: '#34d399' },
            ].map(({ num, title, desc, color }, i) => (
              <div key={i} className="lp-step" style={{
                display: 'flex', gap: 32, alignItems: 'flex-start', padding: '32px 0',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                opacity: howIn ? 1 : 0, transform: howIn ? 'none' : 'translateX(-30px)',
                transition: `all 0.6s ease ${i * 0.1}s`,
              }}>
                <div className="lp-step-num" style={{
                  width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 14, color,
                  transition: 'all 0.3s ease',
                }}>
                  {num}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 8, boxShadow: `0 0 12px ${color}` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SOCIAL PROOF ══════════════ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, right: '15%', width: 400, height: 300, background: 'radial-gradient(ellipse, rgba(20,184,166,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={16} style={{ fill: '#fbbf24', color: '#fbbf24' }} />)}
          </div>
          <blockquote style={{ fontSize: 'clamp(1.2rem, 3vw, 1.75rem)', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 32, fontStyle: 'italic' }}>
            "Ship2Code has fundamentally changed how our municipality responds to citizen issues. Resolution time dropped by{' '}
            <span style={{ ...S.gradText }}>60%</span> in the first quarter."
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#14b8a6,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>A</div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Arjun Mehta</p>
              <p style={{ fontSize: 12, color: '#64748b' }}>Director, Smart City Initiative · Pune Municipal Corp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section ref={ctaRef} style={{ position: 'relative', zIndex: 10, padding: '120px 24px' }}>
        {/* dramatic glow behind CTA */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,184,166,0.12) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          maxWidth: 780, margin: '0 auto', textAlign: 'center',
          ...S.glassCard,
          borderRadius: 32, padding: '80px 48px',
          opacity: ctaIn ? 1 : 0, transform: ctaIn ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.8s ease',
          boxShadow: '0 0 120px rgba(20,184,166,0.08), 0 0 60px rgba(99,102,241,0.06)',
          animation: ctaIn ? 'lp-border-flow 4s ease infinite' : 'none',
        }}>
          {/* spinning badge */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#14b8a6,#06b6d4,#818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(20,184,166,0.5)' }}>
              <Lock size={32} color="#fff" />
            </div>
            <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid rgba(20,184,166,0.3)', animation: 'lp-pulse-ring 2s ease infinite' }} />
            <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.2)', animation: 'lp-pulse-ring 2s ease 0.5s infinite' }} />
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f1f5f9', lineHeight: 1.05, marginBottom: 20 }}>
            Initialize Your{' '}
            <span style={{ ...S.gradText, backgroundSize: '200% 200%', animation: 'lp-gradient-shift 3s ease infinite', display: 'inline-block' }}>Node.</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 18, maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Join thousands of operators securing and optimizing urban infrastructure with real-time civic intelligence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/auth" className="lp-cta-btn" style={{ fontSize: '1.05rem', padding: '18px 48px' }}>
              <Sparkles size={18} />
              Access the Network
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* mini trust pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 40 }}>
            {['Free to Report', 'No Credit Card', 'Open Civic Protocol', 'Privacy First'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, color: '#475569', padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 24px', background: 'rgba(3,7,18,0.8)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={14} color="#030712" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, ...S.gradText }}>{t('logo')}</span>
          </div>

          <div style={{ display: 'flex', gap: 32 }}>
            {['About', 'Features', 'Privacy', 'Contact'].map(l => (
              <Link key={l} to="/auth" style={{ fontSize: 12, fontWeight: 600, color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#94a3b8'}
                onMouseLeave={e => e.target.style.color = '#475569'}>
                {l}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: 10, fontWeight: 600, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Protocol v2.0.4 • Hackathon Build Edition
          </p>
        </div>
      </footer>
    </div>
  );
}
