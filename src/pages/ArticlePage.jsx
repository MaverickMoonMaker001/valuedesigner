import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../supabaseClient";

const A = {
  teal:   "#009CAD",
  violet: "#4495D1",
  green:  "#F48587",
};

const BOOKING_URL = "https://calendar.app.google/L56EZxL43HpdCawa6";

function Inner({ children, style = {} }) {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 48px", ...style }}>
      {children}
    </div>
  );
}

const markdownComponents = {
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(22px, 2.8vw, 30px)",
      fontWeight: 700,
      lineHeight: 1.25,
      color: "rgba(255,255,255,0.92)",
      marginTop: 64,
      marginBottom: 20,
      paddingBottom: 12,
      borderBottom: "1px solid rgba(0,156,173,0.15)",
    }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(18px, 2.2vw, 22px)",
      fontWeight: 700,
      lineHeight: 1.3,
      color: "rgba(255,255,255,0.85)",
      marginTop: 44,
      marginBottom: 14,
    }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 16,
      lineHeight: 1.9,
      color: "rgba(255,255,255,0.6)",
      marginBottom: 24,
    }}>
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: `3px solid ${A.teal}`,
      paddingLeft: 28,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 40,
      marginBottom: 40,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: "italic",
        fontSize: "clamp(18px, 2.2vw, 22px)",
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.75)",
      }}>
        {children}
      </div>
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul style={{
      marginBottom: 28,
      paddingLeft: 0,
      listStyle: "none",
    }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{
      marginBottom: 28,
      paddingLeft: 20,
    }}>
      {children}
    </ol>
  ),
  li: ({ children, ordered }) => (
    <li style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 15,
      lineHeight: 1.85,
      color: "rgba(255,255,255,0.55)",
      marginBottom: 10,
      paddingLeft: ordered ? 0 : 20,
      position: ordered ? "static" : "relative",
    }}>
      {!ordered && (
        <span style={{
          position: "absolute",
          left: 0,
          color: A.teal,
          fontWeight: 600,
        }}>—</span>
      )}
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong style={{
      color: "rgba(255,255,255,0.85)",
      fontWeight: 600,
    }}>
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: A.teal, textDecoration: "none", borderBottom: `1px solid rgba(0,156,173,0.35)` }}
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr style={{
      border: "none",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      margin: "56px 0",
    }} />
  ),
};

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        setArticle(data);
        document.title = `${data.title} — ValueDesigner`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", data.meta_description || data.subtitle);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

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
          .article-body-inner { padding: 0 24px !important; }
          .article-header { padding: 0 24px !important; }
        }
      `}</style>

      {/* Ambient wash */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 80% 15%, rgba(0,156,173,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 20% 85%, rgba(68,149,209,0.06) 0%, transparent 60%)
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
                color: "rgba(255,255,255,0.45)",
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

      {/* Loading */}
      {loading && (
        <div style={{
          position: "relative", zIndex: 1,
          paddingTop: 160,
          paddingLeft: 48,
          fontFamily: "'DM Mono', monospace",
          fontSize: 14,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
        }}>
          Loading...
        </div>
      )}

      {/* Not found */}
      {!loading && notFound && (
        <div style={{
          position: "relative", zIndex: 1,
          paddingTop: 160,
        }}>
          <Inner>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
              marginBottom: 32,
            }}>
              Article not found.
            </p>
            <Link to="/thinking" style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: A.teal,
              textDecoration: "none",
            }}>
              ← Back to Thinking
            </Link>
          </Inner>
        </div>
      )}

      {/* Article */}
      {!loading && article && (
        <>
          {/* Article header */}
          <div style={{
            position: "relative", zIndex: 1,
            paddingTop: 120,
            paddingBottom: 64,
            borderBottom: "1px solid rgba(0,156,173,0.12)",
          }}>
            <Inner className="article-header">
              <Link to="/thinking" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 48,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = A.teal}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}
              >
                ← Thinking
              </Link>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: A.teal,
                  border: `1px solid rgba(0,156,173,0.35)`,
                  padding: "3px 10px",
                }}>
                  {article.category}
                </span>
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
                  {" · "}
                  {article.read_time_minutes} min read
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 4.5vw, 52px)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}>
                {article.title}
              </h1>

              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 18,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.4)",
                maxWidth: 620,
              }}>
                {article.subtitle}
              </p>
            </Inner>
          </div>

          {/* Article body */}
          <div style={{ position: "relative", zIndex: 1, paddingTop: 72, paddingBottom: 96 }}>
            <Inner className="article-body-inner" style={{ maxWidth: 720 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {article.body}
              </ReactMarkdown>
            </Inner>
          </div>

          {/* Article footer CTA */}
          <div style={{
            position: "relative", zIndex: 1,
            borderTop: "1px solid rgba(68,149,209,0.12)",
            background: "linear-gradient(120deg, rgba(0,156,173,0.05) 0%, rgba(68,149,209,0.05) 100%)",
            padding: "72px 0",
          }}>
            <Inner>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: A.teal,
                marginBottom: 20,
              }}>
                If this resonates
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
              }}>
                Let's talk about your value gap.
              </h2>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.35)",
                maxWidth: 440,
                marginBottom: 36,
              }}>
                15 minutes. Free. You'll leave with something useful.
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
                  marginRight: 24,
                }}
              >
                Book a free call →
              </a>
              <Link to="/thinking" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
              }}>
                ← More thinking
              </Link>
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
        </>
      )}
    </div>
  );
}
