import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BlurText from "./components/BlurText";
import { supabase } from "./supabaseClient";

// ── Maverick Moon palette ─────────────────────────────────────────
const A = {
  teal:     "#009CAD",
  violet:   "#4495D1",
  green:    "#F48587",
  grad:     "linear-gradient(120deg, #009CAD 0%, #4495D1 100%)",
  gradSoft: "linear-gradient(120deg, rgba(0,156,173,0.10) 0%, rgba(68,149,209,0.10) 100%)",
  glowT:    "0 0 24px rgba(0,156,173,0.4)",
};

const BOOKING_URL = "https://calendar.app.google/L56EZxL43HpdCawa6";

function Inner({ children, style = {}, className = "" }) {
  return (
    <div className={`inner-wrap ${className}`} style={{
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
  const [latestArticles, setLatestArticles] = useState([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id, slug, title, subtitle, category, published_date, read_time_minutes")
      .eq("is_published", true)
      .order("published_date", { ascending: false })
      .limit(3)
      .then(({ data }) => setLatestArticles(data || []));
  }, []);

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#000000",
      color: "#FFFFFF",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: #009CAD; }
        a { color: inherit; }
        .aurora-text {
          background: linear-gradient(120deg, #009CAD 0%, #4495D1 100%);
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
          .hero-inner { padding-top: 100px !important; padding-bottom: 72px !important; }
        }
      `}</style>

      {/* ── Ambient wash ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 85% 20%, rgba(0,156,173,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 15% 80%, rgba(68,149,209,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 60% 55%, rgba(42,76,97,0.12) 0%, transparent 55%)
        `,
      }} />

      {/* ── NAV ── */}
      <nav className="nav-inner" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(0,0,0,0.90)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,156,173,0.12)",
      }}>
        <Inner style={{ padding: "0 48px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            height: 68,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                background: "linear-gradient(120deg, #009CAD 0%, #9ED4E4 40%, #4495D1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(0,156,173,0.5))",
              }}>
                ValueDesigner
              </span>
              <Link to="/thinking" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
              }}>
                Thinking
              </Link>
            </div>
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
        <Inner className="hero-inner" style={{ paddingTop: 140, paddingBottom: 100 }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 14,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: A.teal, marginBottom: 32,
            }}>
              <BlurText
                text="For founders building with AI"
                delay={80}
                direction="top"
                stepDuration={0.3}
              />
            </div>

            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 5.5vw, 72px)",
              fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.02em", marginBottom: 36,
            }}>
              <BlurText
                text="You're shipping features fast."
                delay={60}
                direction="top"
                stepDuration={0.4}
              />
              <BlurText
                text="Are users signing up?"
                delay={60}
                direction="top"
                stepDuration={0.4}
                animationFrom={{ filter: 'blur(10px)', opacity: 0, y: -40 }}
                animationTo={[
                  { filter: 'blur(5px)', opacity: 0.5, y: 4 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 },
                ]}
                className="aurora-text"
              />
            </div>

            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 17,
              lineHeight: 1.85, color: "rgba(255,255,255,0.55)",
              marginBottom: 16,
            }}>
              <BlurText
                text="Vibe coding moves fast. But speed without signal is just building in the dark. Most founders can't tell the difference between what their app does and the value a user actually gets from it. That gap is why you don't have traction."
                delay={18}
                direction="bottom"
                stepDuration={0.3}
              />
            </div>

            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 17,
              lineHeight: 1.85, color: "rgba(255,255,255,0.55)",
              marginBottom: 52,
            }}>
              <BlurText
                text="I only need 15 minutes to show you where it is."
                delay={25}
                direction="bottom"
                stepDuration={0.3}
              />
            </div>

            <BookButton />

            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 14,
              color: "rgba(255,255,255,0.22)", marginTop: 16, letterSpacing: "0.05em",
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
          borderTop: "1px solid rgba(0,156,173,0.12)",
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
              gap: 1, background: "rgba(42,76,97,0.35)", marginBottom: 56,
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
                  background: dim ? "rgba(255,255,255,0.01)" : "rgba(0,156,173,0.06)",
                }}>
                  <p style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 13,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    color: dim ? "rgba(255,255,255,0.25)" : A.teal,
                    marginBottom: 20,
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic", fontSize: 19, lineHeight: 1.65,
                    color: dim ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                  }}>{body}</p>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 16,
              lineHeight: 1.85, color: "rgba(255,255,255,0.4)", maxWidth: 560,
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
          borderTop: "1px solid rgba(68,149,209,0.12)",
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
            {[
              { n: "01", color: A.teal,    image: "/image.png" },
              { n: "02", color: A.violet,  image: "/audit_the_gap.png" },
              { n: "03", color: A.green,   image: "/Build_a_value_story.png" },
            ].map(({ n, color, image }) => (
              <div key={n} style={{
                marginBottom: 44, paddingBottom: 44,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28, fontWeight: 900,
                    color, opacity: 0.4, lineHeight: 1, paddingTop: 4, flexShrink: 0, width: 72,
                  }}>{n}</span>
                  <img
                    src={image}
                    alt=""
                    style={{ width: "100%", maxWidth: 520, display: "block" }}
                  />
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
          borderTop: "1px solid rgba(244,133,135,0.10)",
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
              gap: 1, background: "rgba(42,76,97,0.35)", marginBottom: 48,
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
                    lineHeight: 1.8, color: "rgba(255,255,255,0.5)",
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
          borderTop: "1px solid rgba(68,149,209,0.12)",
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
              lineHeight: 1.85, color: "rgba(255,255,255,0.45)",
              maxWidth: 480, marginBottom: 44,
            }}>
              If you're building with real intent but no traction — or burning tokens on features
              nobody asked for — one conversation can change the direction.
            </p>
            <BookButton />
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 14,
              color: "rgba(255,255,255,0.2)", marginTop: 16, letterSpacing: "0.05em",
            }}>
              Or reach out directly:{" "}
              <a href="mailto:john@valuedesigner.io" style={{ color: A.teal, textDecoration: "none" }}>
                john@valuedesigner.io
              </a>
            </p>
          </Inner>
        </section>
      </Fade>

      {/* ── LATEST THINKING ── */}
      {latestArticles.length > 0 && (
        <Fade>
          <section style={{
            width: "100%", position: "relative", zIndex: 1,
            borderTop: "1px solid rgba(0,156,173,0.12)",
          }}>
            <Inner style={{ paddingTop: 100, paddingBottom: 100 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 56 }}>
                <Label>Latest thinking</Label>
                <Link to="/thinking" style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: A.teal,
                  textDecoration: "none",
                }}>
                  All articles →
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(42,76,97,0.2)" }}>
                {latestArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/thinking/${article.slug}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div style={{
                      padding: "32px 36px",
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 32,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,156,173,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: A.teal,
                          display: "block",
                          marginBottom: 10,
                        }}>
                          {article.category}
                        </span>
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 20,
                          fontWeight: 700,
                          lineHeight: 1.3,
                          marginBottom: 8,
                        }}>
                          {article.title}
                        </h3>
                        <p style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 14,
                          lineHeight: 1.7,
                          color: "rgba(255,255,255,0.35)",
                          maxWidth: 480,
                        }}>
                          {article.subtitle}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 18,
                        color: "rgba(255,255,255,0.2)",
                        paddingTop: 4,
                        flexShrink: 0,
                      }}>
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Inner>
          </section>
        </Fade>
      )}

      {/* ── THREE WAYS TO ENGAGE ── */}
      <Fade>
        <section style={{
          width: "100%", position: "relative", zIndex: 1,
          borderTop: "1px solid rgba(0,156,173,0.12)",
        }}>
          <Inner style={{ paddingTop: 100, paddingBottom: 100 }}>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 12,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: A.teal, marginBottom: 20,
            }}>How to work with me</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 3.5vw, 42px)",
              fontWeight: 700, lineHeight: 1.2, marginBottom: 56,
            }}>
              Three ways to engage.<br />Each one built around your situation.
            </h2>
            <div className="three-col" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              gap: 1, background: "rgba(42,76,97,0.35)", marginBottom: 32,
            }}>
              {[
                {
                  color: A.teal,
                  label: "The Session",
                  desc: "You're building something real. You're not sure what value it's actually delivering. Let's find out.",
                  builtFor: "Solo founders and builders who want to do the work themselves — they just need the right questions asked first.",
                  format: "One 90-min recorded session\n+ written report delivered async",
                  walkAway: [
                    "Your value gap — clearly named",
                    "The explicit & latent pains in play",
                    "A written report to act on",
                  ],
                  cta: "Book a session →",
                },
                {
                  color: A.violet,
                  label: "Trusted Adviser",
                  badge: "Most requested",
                  desc: "Someone in your corner who asks the hard questions — every week, before you build the wrong thing.",
                  builtFor: "Founders at an inflection point — early traction, a pivot, or a product that's working but not growing. You need a strategic partner, not another tool.",
                  format: "2–4 hrs / week\nOngoing retainer · Cancel anytime",
                  walkAway: [
                    "Weekly clarity on what to build next",
                    "Coaching + mentorship built in",
                    "Ongoing value prop refinement",
                    "A thinking partner with no agenda",
                  ],
                  cta: "Start the conversation →",
                },
                {
                  color: A.green,
                  label: "The Engagement",
                  desc: "Value is being created somewhere in your customer journey. It's also being lost somewhere. We find both.",
                  builtFor: "Teams and organizations that need systematic clarity — where in the customer journey value is delivered, where it leaks, and what to do about it.",
                  format: "8–16 hrs / month\nStructured project engagement",
                  walkAway: [
                    "Full customer journey value map",
                    "Identified acquisition & retention gaps",
                    "Prioritized recommendations",
                    "A team that sees what users see",
                  ],
                  cta: "Let's scope it →",
                },
              ].map(({ color, label, badge, desc, builtFor, format, walkAway, cta }) => (
                <div key={label} style={{
                  padding: "36px 28px", background: "rgba(0,0,0,0.5)",
                  display: "flex", flexDirection: "column", gap: 0,
                  position: "relative",
                  outline: color === A.violet ? `1px solid rgba(68,149,209,0.4)` : "none",
                }}>
                  {badge && (
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "#0a0a0a", background: color,
                      padding: "4px 12px", display: "inline-block",
                      alignSelf: "flex-start", marginBottom: 20,
                    }}>{badge}</span>
                  )}
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 26, fontWeight: 700,
                    color, lineHeight: 1.2, marginBottom: 16,
                  }}>{label}</h3>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic", fontSize: 16, lineHeight: 1.7,
                    color: "rgba(255,255,255,0.75)", marginBottom: 28,
                  }}>{desc}</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginBottom: 16 }}>
                    <p style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color, marginBottom: 10,
                    }}>Built for</p>
                    <p style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 14,
                      lineHeight: 1.75, color: "rgba(255,255,255,0.45)",
                    }}>{builtFor}</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color, marginBottom: 10,
                    }}>Format</p>
                    <p style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 14,
                      lineHeight: 1.75, color: "rgba(255,255,255,0.7)",
                      whiteSpace: "pre-line",
                    }}>{format}</p>
                  </div>
                  <div style={{ marginBottom: 32 }}>
                    <p style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 11,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color, marginBottom: 14,
                    }}>You walk away with</p>
                    {walkAway.map((item) => (
                      <div key={item} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                        <span style={{ color, flexShrink: 0, marginTop: 2 }}>—</span>
                        <p style={{
                          fontFamily: "'DM Mono', monospace", fontSize: 14,
                          lineHeight: 1.65, color: "rgba(255,255,255,0.55)",
                          margin: 0,
                        }}>{item}</p>
                      </div>
                    ))}
                  </div>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 13,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      background: color, color: "#0a0a0a", fontWeight: 600,
                      padding: "14px 24px", textDecoration: "none",
                      display: "inline-block", marginTop: "auto",
                    }}
                  >{cta}</a>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13,
              color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em",
            }}>
              All engagements begin with a free 15-min call. No pitch. You'll know if it's useful.
            </p>
          </Inner>
        </section>
      </Fade>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(0,156,173,0.12)",
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
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <Link to="/thinking" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}>
                Thinking
              </Link>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 13,
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase",
              }}>
                Design services that are loved &amp; trusted
              </span>
            </div>
          </div>
        </Inner>
      </footer>
    </div>
  );
}
