import { useState, useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, layoutNextLineRange, materializeLineRange } from "@chenglou/pretext";

// ── Aurora palette ────────────────────────────────────────────────
const A = {
  teal:     "#00e8b8",
  violet:   "#a78bfa",
  green:    "#4ade80",
  grad:     "linear-gradient(120deg, #00e8b8 0%, #a78bfa 100%)",
  gradSoft: "linear-gradient(120deg, rgba(0,232,184,0.12) 0%, rgba(167,139,250,0.12) 100%)",
  glowT:    "0 0 24px rgba(0,232,184,0.35)",
};

const BOOKING_URL = "https://calendar.app.google/L56EZxL43HpdCawa6";

const HERO_BODY = "Vibe coding moves fast. But speed without signal is just building in the dark. Most founders can't tell the difference between what their app does and the value a user actually gets from it. That gap is why you don't have traction. I only need 15 minutes to show you where it is.";
const BODY_FONT = "17px DM Mono";
const LINE_HEIGHT = 31;
const CURSOR_RADIUS = 52;

function CursorText({ style = {} }) {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: -999, y: -999 });
  const preparedRef = useRef(null);
  const rafRef = useRef(null);
  const containerRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !preparedRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.offsetWidth;
    const totalLines = Math.ceil((canvas.offsetHeight) / LINE_HEIGHT);
    const H = totalLines * LINE_HEIGHT;

    if (canvas.offsetWidth !== W) {
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    ctx.font = BODY_FONT;
    ctx.fillStyle = "rgba(240,236,228,0.55)";
    ctx.textBaseline = "top";

    const cx = cursorRef.current.x;
    const cy = cursorRef.current.y;
    const r = CURSOR_RADIUS;

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;

    while (true) {
      // Band: y to y + LINE_HEIGHT
      // Compute horizontal exclusion of cursor circle in this band
      const bandTop = y;
      const bandMid = y + LINE_HEIGHT / 2;
      const dy = bandMid - cy;
      const underCircle = Math.abs(dy) < r;

      let leftX = 0;
      let rightX = W;
      let split = false;

      if (underCircle) {
        const halfChord = Math.sqrt(r * r - dy * dy);
        const cLeft = cx - halfChord;
        const cRight = cx + halfChord;

        // Determine layout strategy based on where cursor sits horizontally
        if (cRight <= 0 || cLeft >= W) {
          // Cursor entirely outside — full width
        } else if (cLeft <= 0) {
          // Cursor clips left edge — text starts after circle
          leftX = Math.min(cRight + 4, W);
        } else if (cRight >= W) {
          // Cursor clips right edge — text ends before circle
          rightX = Math.max(cLeft - 4, 0);
        } else {
          // Cursor in middle — render left segment then right
          split = true;
          const leftWidth = Math.max(0, cLeft - 4);
          const rightWidth = Math.max(0, W - cRight - 4);

          // Render left chunk
          if (leftWidth > 20) {
            const rangeL = layoutNextLineRange(preparedRef.current, cursor, leftWidth);
            if (rangeL === null) break;
            const lineL = materializeLineRange(preparedRef.current, rangeL);
            ctx.fillText(lineL.text, 0, y + 2);
            cursor = rangeL.end;
          }

          // Render right chunk from same cursor position (re-run)
          if (rightWidth > 20) {
            const savedCursor = { ...cursor };
            const rangeR = layoutNextLineRange(preparedRef.current, savedCursor, rightWidth);
            if (rangeR === null) break;
            const lineR = materializeLineRange(preparedRef.current, rangeR);
            ctx.fillText(lineR.text, cRight + 4, y + 2);
            // advance cursor by the longer range
            cursor = rangeR.end;
          }

          y += LINE_HEIGHT;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);
          continue;
        }
      }

      if (!split) {
        const w = rightX - leftX;
        if (w < 10) { y += LINE_HEIGHT; continue; }
        const range = layoutNextLineRange(preparedRef.current, cursor, w);
        if (range === null) break;
        const line = materializeLineRange(preparedRef.current, range);
        ctx.fillText(line.text, leftX, y + 2);
        cursor = range.end;
      }

      y += LINE_HEIGHT;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (y > H + LINE_HEIGHT * 2) break;
    }

    // Draw subtle cursor glow
    if (cx > 0 && cy > 0 && cx < W && cy < (H + 40)) {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, "rgba(0,232,184,0.10)");
      grad.addColorStop(0.5, "rgba(0,232,184,0.04)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Prepare text once fonts load
  useEffect(() => {
    const prepare = () => {
      preparedRef.current = prepareWithSegments(HERO_BODY, BODY_FONT);
      draw();
    };
    if (document.fonts) {
      document.fonts.ready.then(prepare);
    } else {
      setTimeout(prepare, 300);
    }
  }, [draw]);

  // Track global mouse, translate to canvas-local coords
  useEffect(() => {
    const onMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      cursorRef.current = { x: -999, y: -999 };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      requestAnimationFrame(draw);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} style={{ position: "relative", marginBottom: 52, ...style }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: 220 }}
      />
    </div>
  );
}

function Inner({ children, style = {} }) {
  return (
    <div className="inner-wrap" style={{
      maxWidth: 920,
      margin: "0 auto",
      padding: "0 48px",
      ...style,
    }}>
      {children}
    </div>
  );
}

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
        @media (max-width: 768px) {
          .inner-wrap { padding: 0 24px !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .nav-inner { padding: 18px 24px !important; }
          .work-item { grid-template-columns: 48px 1fr !important; }
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
        background: "rgba(7,8,15,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,232,184,0.08)",
      }}>
        <Inner style={{ padding: "0 48px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            height: 68,
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
          </div>
        </Inner>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", width: "100%",
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <Inner style={{ paddingTop: 140, paddingBottom: 100 }}>
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(24px)",
            transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s",
            maxWidth: 680,
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
              fontSize: "clamp(40px, 5.5vw, 72px)",
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.02em", marginBottom: 36,
            }}>
              You're shipping features.<br />
              <em className="aurora-text">Not solving problems.</em>
            </h1>

            <CursorText />

            <BookButton />

            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 14,
              color: "rgba(240,236,228,0.22)", marginTop: 16, letterSpacing: "0.05em",
            }}>
              Free. No pitch. You'll leave with something useful.
            </p>
          </div>
        </Inner>
      </section>

      {/* ── THE PROBLEM ── */}
      <Fade>
        <section style={{
          width: "100%", position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(0,232,184,0.08)",
        }}>
          <Inner style={{ paddingTop: 100, paddingBottom: 100 }}>
            <Label>The problem</Label>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 46px)",
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
                    fontStyle: "italic", fontSize: 19, lineHeight: 1.65,
                    color: dim ? "rgba(240,236,228,0.3)" : "rgba(240,236,228,0.85)",
                  }}>{body}</p>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 16,
              lineHeight: 1.85, color: "rgba(240,236,228,0.4)", maxWidth: 560,
            }}>
              This isn't a failure of execution. It's a missing conversation — between what you're
              building and what someone actually needs. That's a solvable problem.
              It just requires the right tools and the right questions.
            </p>
          </Inner>
        </section>
      </Fade>

      {/* ── THE WORK ── */}
      <Fade>
        <section style={{
          width: "100%", position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(167,139,250,0.08)",
        }}>
          <Inner style={{ paddingTop: 100, paddingBottom: 100 }}>
            <Label color={A.violet}>The work</Label>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700, lineHeight: 1.15, marginBottom: 20,
            }}>
              Identify the gap.<br />Design to close it.
            </h2>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 16,
              lineHeight: 1.85, color: "rgba(240,236,228,0.4)",
              maxWidth: 520, marginBottom: 60,
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
              <div key={n} className="work-item" style={{
                display: "grid", gridTemplateColumns: "72px 1fr",
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
          </Inner>
        </section>
      </Fade>

      {/* ── THE FREE CALL ── */}
      <Fade>
        <section style={{
          width: "100%", position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(74,222,128,0.08)",
          background: A.gradSoft,
        }}>
          <Inner style={{ paddingTop: 100, paddingBottom: 100 }}>
            <Label>The free call</Label>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 3.5vw, 42px)",
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
          </Inner>
        </section>
      </Fade>

      {/* ── FINAL CTA ── */}
      <Fade>
        <section style={{
          width: "100%", position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(167,139,250,0.08)",
        }}>
          <Inner style={{ paddingTop: 100, paddingBottom: 120 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(30px, 4.5vw, 52px)",
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: "-0.02em", marginBottom: 24,
            }}>
              Stop shipping into the void.
            </h2>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 16,
              lineHeight: 1.85, color: "rgba(240,236,228,0.45)",
              maxWidth: 480, marginBottom: 44,
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
          </Inner>
        </section>
      </Fade>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(0,232,184,0.07)",
        zIndex: 1, position: "relative",
      }}>
        <Inner style={{ padding: "0 48px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12, height: 72,
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
          </div>
        </Inner>
      </footer>
    </div>
  );
}
