import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const A = {
  teal:   "#009CAD",
  violet: "#4495D1",
  green:  "#F48587",
  grad:   "linear-gradient(120deg, #009CAD 0%, #4495D1 100%)",
};

const BOOKING_URL = "https://calendar.app.google/L56EZxL43HpdCawa6";

function Inner({ children, style = {} }) {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px", ...style }}>
      {children}
    </div>
  );
}

function CategoryTag({ label }) {
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: A.teal,
      border: `1px solid rgba(0,156,173,0.35)`,
      padding: "3px 10px",
      display: "inline-block",
    }}>
      {label}
    </span>
  );
}

function ArticleCard({ article }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={`/thinking/${article.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        padding: "40px 44px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: hov ? "rgba(0,156,173,0.04)" : "transparent",
        transition: "background 0.25s ease",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "32px 48px",
        alignItems: "start",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <CategoryTag label={article.category} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
            }}>
              {article.published_date
                ? new Date(article.published_date).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })
                : ""}
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(20px, 2.5vw, 26px)",
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 14,
            color: hov ? "#fff" : "rgba(255,255,255,0.9)",
            transition: "color 0.2s",
          }}>
            {article.title}
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 560,
          }}>
            {article.subtitle}
          </p>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          paddingTop: 4,
          textAlign: "right",
        }}>
          {article.read_time_minutes} min read
          <div style={{
            marginTop: 16,
            color: hov ? A.teal : "rgba(255,255,255,0.2)",
            transition: "color 0.2s",
            fontSize: 18,
          }}>
            →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ThinkingPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Thinking — ValueDesigner";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Dispatches on the value gap — why AI apps lose traction, how to read user signals, and what it actually takes to close the gap between what you built and what someone needs.");
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title, subtitle, category, published_date, read_time_minutes")
        .eq("is_published", true)
        .order("published_date", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    }
    load();
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
          .thinking-card { grid-template-columns: 1fr !important; }
          .thinking-card .read-meta { display: none !important; }
        }
      `}</style>

      {/* Ambient wash */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 50% at 85% 20%, rgba(0,156,173,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 15% 80%, rgba(68,149,209,0.07) 0%, transparent 60%)
        `,
      }} />

      {/* Nav */}
      <nav style={{
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
              <Link to="/" style={{ textDecoration: "none" }}>
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
              </Link>
              <Link to="/thinking" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: A.teal,
                textDecoration: "none",
              }}>
                Thinking
              </Link>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: A.teal,
                color: "#0a0a0a",
                fontWeight: 600,
                padding: "10px 22px",
                textDecoration: "none",
              }}
            >
              Book a free call →
            </a>
          </div>
        </Inner>
      </nav>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, paddingBottom: 72 }}>
        <Inner>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: A.teal,
            marginBottom: 24,
          }}>
            Thinking
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 4.5vw, 54px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            Dispatches on the value gap.
          </h1>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 16,
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 520,
          }}>
            Why AI apps lose traction. How to read user signals. What it actually takes to close the gap between what you built and what someone needs.
          </p>
        </Inner>
      </div>

      {/* Article list */}
      <div style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(0,156,173,0.12)",
      }}>
        <Inner style={{ padding: 0 }}>
          {loading && (
            <div style={{
              padding: "80px 48px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
            }}>
              Loading...
            </div>
          )}
          {!loading && articles.length === 0 && (
            <div style={{
              padding: "80px 48px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.08em",
              lineHeight: 1.8,
            }}>
              Articles coming soon. Check back shortly.
            </div>
          )}
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Inner>
      </div>

      {/* Footer CTA */}
      <div style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(68,149,209,0.12)",
        padding: "72px 0",
      }}>
        <Inner>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15,
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.35)",
            maxWidth: 480,
            marginBottom: 32,
          }}>
            If anything here resonates — or if you want to talk through your own value gap — book a free 15-minute call.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: A.teal,
              color: "#0a0a0a",
              fontWeight: 600,
              padding: "14px 28px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Book a free 15-min call →
          </a>
        </Inner>
      </div>

      {/* Footer */}
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
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.18)",
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
