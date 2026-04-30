import { useState, useEffect, useRef } from "react";

// ── Aurora palette ────────────────────────────────────────────────
const A = {
  teal:     "#00e8b8",
  violet:   "#a78bfa",
  green:    "#4ade80",
  grad:     "linear-gradient(120deg, #00e8b8 0%, #a78bfa 100%)",
  gradSoft: "linear-gradient(120deg, rgba(0,232,184,0.15) 0%, rgba(167,139,250,0.15) 100%)",
  glowT:    "0 0 24px rgba(0,232,184,0.35)",
};

// ── TODO: Replace with your real Calendly (or other) booking URL ──
const BOOKING_URL = "https://calendar.app.google/L56EZxL43HpdCawa6";

function BookButton({ label = "Book a free 15-min call →", style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 14,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: hov ? A.grad : A.teal,
        color: "#0a0a0a",
        fontWeight: 600,
        padding: "15px 30px",
        textDecoration: "none",
        display: "inline-block",
        transition: "box-shadow 0.3s, background 0.3s",
        boxShadow: hov ? A.glowT : "none",
        ...style,
      }}
    >
      {label}
    </a>
  );
}

function Label({ children, color }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: color || A.teal,
      marginBottom: 20,
    }}>
      {children}
    </p>
  );
}

function Fade({ children }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#07080f",
      color: "#f0ece4",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: #00e8b8; }
        a { color: inherit; }
        .aurora-text {
          background: linear-gradient(120deg, #00e8b8 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (max-width: 640px) {
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 18px 24px !important; }
          .section-pad { padding: 72px 24px !important; }
        }
      `}</style>

      {/* ── Ambient aurora wash ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 85% 20%, rgba(0,232,184,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 15% 80%, rgba(167,139,250,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 60% 55%, rgba(74,222,128,0.04) 0%, transparent 55%)
        `,
      }} />

      {/* ── NAV ── */}
      <nav className="nav-inner" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "22px 48px",
        background: "rgba(7,8,15,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,232,184,0.08)",
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "linear-gradient(120deg, #00e8b8 0%, #38bdf8 40%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 8px rgba(0,232,184,0.5))",
        }}>
          ValueDesigner
        </span>
        <BookButton label="Book a free call →" style={{ padding: "10px 22px", fontSize: 13 }} />
      </nav>

      {/* ── HERO ── */}
      <section className="section-pad" style={{
        minHeight: "100vh", position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 48px 80px",
        maxWidth: 860,
      }}>
        <div style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(24px)",
          transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 14,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: A.teal, marginBottom: 32,
          }}>
            For founders building with AI
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 900, lineHeight: 1.08,
            letterSpacing: "-0.02em", marginBottom: 36,
          }}>
            You're shipping features.<br />
            <em className="aurora-text">Not solving problems.</em>
          </h1>

          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 17,
            lineHeight: 1.85, color: "rgba(240,236,228,0.55)",
            maxWidth: 500, marginBottom: 16,
          }}>
            Vibe coding moves fast. But speed without signal is just building in the dark.
            Most founders can't tell the difference between what their app does
            and the value a user actually gets from it. That gap is why you don't have traction.
          </p>

          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 17,
            lineHeight: 1.85, color: "rgba(240,236,228,0.55)",
            maxWidth: 500, marginBottom: 52,
          }}>
            I only need 15 minutes to show you where it is.
          </p>

          <BookButton />

          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 14,
            color: "rgba(240,236,228,0.22)", marginTop: 16, letterSpacing: "0.05em",
          }}>
            Free. No pitch. You'll leave with something useful.
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <Fade>
        <section className="section-pad" style={{
          padding: "100px 48px", maxWidth: 860,
          borderTop: "1px solid rgba(0,232,184,0.08)",
          position: "relative", zIndex: 1,
        }}>
          <Label>The problem</Label>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 700, lineHeight: 1.15, marginBottom: 48,
          }}>
            Features are not value.
          </h2>

          <div className="two-col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 1, background: "rgba(0,232,184,0.06)", marginBottom: 56,
          }}>
            {[
              {
                label: "What you think you built",
                body: "An AI tool that automates X. A dashboard that shows Y. A feature that does Z faster.",
                dim: true,
              },
              {
                label: "What your user actually needs",
                body: "To feel confident in a decision. To stop losing money on a problem. To do their job without thinking about your tool.",
                dim: false,
              },
            ].map(({ label, body, dim }) => (
              <div key={label} style={{
                padding: "40px 36px",
                background: dim ? "rgba(240,236,228,0.01)" : "rgba(0,232,184,0.04)",
              }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 13,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: dim ? "rgba(240,236,228,0.25)" : A.teal,
                  marginBottom: 20,
                }}>{label}</p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic", fontSize: 18, lineHeight: 1.65,
                  color: dim ? "rgba(240,236,228,0.3)" : "rgba(240,236,228,0.85)",
                }}>{body}</p>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 16,
            lineHeight: 1.85, color: "rgba(240,236,228,0.4)", maxWidth: 500,
          }}>
            This isn't a failure of execution. It's a missing conversation — between what you're
            building and what someone actually needs. That's a solvable problem.
            It just requires the right tools and the right questions.
          </p>
        </section>
      </Fade>

      {/* ── THE WORK ── */}
      <Fade>
        <section className="section-pad" style={{
          padding: "100px 48px", maxWidth: 860,
          borderTop: "1px solid rgba(167,139,250,0.08)",
          position: "relative", zIndex: 1,
        }}>
          <Label color={A.violet}>The work</Label>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            fontWeight: 700, lineHeight: 1.15, marginBottom: 20,
          }}>
            Identify the gap.<br />Design to close it.
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 16,
            lineHeight: 1.85, color: "rgba(240,236,228,0.4)",
            maxWidth: 480, marginBottom: 60,
          }}>
            Less guessing. Less wasted tokens. Less building in circles.
            A clear value proposition changes what you prioritize, what you ship,
            and how users talk about you.
          </p>

          {[
            {
              n: "01", color: A.teal,
              title: "Surface the real pain",
              body: "Separate what users say from what they actually feel. Explicit pains get you acquired. Latent pains keep users around. Most founders only see one.",
            },
            {
              n: "02", color: A.violet,
              title: "Audit the gap",
              body: "Map what your product delivers against what users are actually getting. This is the exercise most teams never run — and it's exactly where lost traction hides.",
            },
            {
              n: "03", color: A.green,
              title: "Build a value story worth shipping toward",
              body: "A clear, testable proposition that your roadmap can point to. Before the next feature. Before the next sprint.",
            },
          ].map(({ n, color, title, body }) => (
            <div key={n} style={{
              display: "grid", gridTemplateColumns: "60px 1fr",
              gap: 24, marginBottom: 44, paddingBottom: 44,
              borderBottom: "1px solid rgba(240,236,228,0.05)",
            }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28, fontWeight: 900,
                color, opacity: 0.4, lineHeight: 1, paddingTop: 4,
              }}>{n}</span>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22, fontWeight: 700, marginBottom: 12, color,
                }}>{title}</h3>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 16,
                  lineHeight: 1.8, color: "rgba(240,236,228,0.45)",
                }}>{body}</p>
              </div>
            </div>
          ))}
        </section>
      </Fade>

      {/* ── THE FREE CALL ── */}
      <Fade>
        <section className="section-pad" style={{
          padding: "100px 48px", maxWidth: 860,
          borderTop: "1px solid rgba(74,222,128,0.08)",
          background: A.gradSoft,
          position: "relative", zIndex: 1,
        }}>
          <Label>The free call</Label>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: 48,
          }}>
            15 minutes.<br />You'll leave with clarity.
          </h2>

          <div className="three-col" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 1, background: "rgba(0,232,184,0.06)", marginBottom: 48,
          }}>
            {[
              {
                step: "On the call", color: A.teal,
                body: "We talk about what you're building, who it's for, and what you think they're getting from it. I ask the questions most people skip.",
              },
              {
                step: "After the call", color: A.violet,
                body: "You get a written report — a plain-language breakdown of where your value gap is and what to think about next.",
              },
              {
                step: "What it costs", color: A.green,
                body: "Nothing. This is how I work. If it's useful, you'll know. No pressure to continue.",
              },
            ].map(({ step, color, body }) => (
              <div key={step} style={{ padding: "36px 28px" }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 13,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color, marginBottom: 16,
                }}>{step}</p>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 16,
                  lineHeight: 1.8, color: "rgba(240,236,228,0.5)",
                }}>{body}</p>
              </div>
            ))}
          </div>

          <BookButton />
        </section>
      </Fade>

      {/* ── FINAL CTA ── */}
      <Fade>
        <section className="section-pad" style={{
          padding: "100px 48px 120px", maxWidth: 860,
          borderTop: "1px solid rgba(167,139,250,0.08)",
          position: "relative", zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4.5vw, 52px)",
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: "-0.02em", marginBottom: 24,
          }}>
            Stop shipping into the void.
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 16,
            lineHeight: 1.85, color: "rgba(240,236,228,0.45)",
            maxWidth: 440, marginBottom: 44,
          }}>
            If you're building with real intent but no traction — or burning tokens on features
            nobody asked for — one conversation can change the direction.
          </p>
          <BookButton />
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 14,
            color: "rgba(240,236,228,0.2)", marginTop: 16, letterSpacing: "0.05em",
          }}>
            Or reach out directly:{" "}
            <a href="mailto:john@valuedesigner.io" style={{ color: A.teal, textDecoration: "none" }}>
              john@valuedesigner.io
            </a>
          </p>
        </section>
      </Fade>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(0,232,184,0.07)",
        padding: "28px 48px", zIndex: 1, position: "relative",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13 }}>
          Value<span className="aurora-text">Designer</span>
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 13,
          letterSpacing: "0.1em", color: "rgba(240,236,228,0.18)",
          textTransform: "uppercase",
        }}>
          Design services that are loved &amp; trusted
        </span>
      </footer>
    </div>
  );
}
