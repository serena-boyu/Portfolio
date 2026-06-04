// About + Playground
// NOTE: each <script type="text/babel"> shares global scope, so React hooks
// are aliased here to avoid colliding with Home.jsx / ProjectPage.jsx.
const { useState: useStateAb, useEffect: useEffectAb, useRef: useRefAb } = React;

// ───────────────────────────────────────────────────────────────────
// Reusable Image + Caption card (matches Figma "Image + Caption").
// Rectangular landscape image; a white caption box fades/slides up on hover.
// Used for every image across the About and Playground pages.
// ───────────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────────
// Image + Caption card. A landscape image with a caption box that fades
// up on hover. When `onZoom` is provided it becomes click-to-enlarge:
// the media gently scales, a darkening scrim + "expand" badge appear, and
// the cursor switches to zoom-in to signal the click opens a larger popup.
// ───────────────────────────────────────────────────────────────────
function ImageCaption({ title, caption, src, gradient, aspect = "16 / 10", label, onZoom, mobileTitleOnly }) {
  const [hover, setHover] = useStateAb(false);
  const cardRef = useRefAb(null);
  // On short cards (e.g. mobile multi-column grids) there isn't room for the
  // title AND caption without clipping — fall back to title-only in that case.
  const [titleOnly, setTitleOnly] = useStateAb(false);
  useEffectAb(() => {
    const card = cardRef.current;
    if (!card) return;
    const measure = () => {
      // Force title-only on mobile when requested (e.g. the dense gallery grid).
      if (mobileTitleOnly && typeof window !== "undefined" &&
      window.matchMedia("(max-width: 720px)").matches) {
        setTitleOnly(!!caption);
        return;
      }
      // Caption box sits inset 12px top/bottom; full title+caption needs ~78px.
      const avail = card.clientHeight - 24;
      setTitleOnly(caption ? avail < 78 : false);
    };
    measure();
    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(card);
    }
    window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [caption, mobileTitleOnly]);
  // Click-to-enlarge is active whenever an onZoom handler is provided.
  const zoomable = typeof onZoom === "function";
  // Image is driven by `src` in the data; falls back to a gradient/placeholder.
  const media = src ? `url(${src}) center / cover no-repeat` : gradient || "linear-gradient(135deg, #e8e2d9, #c8baa6)";
  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={zoomable ? () => onZoom({ title, caption, src, gradient, label }) : undefined}
      role={zoomable ? "button" : undefined}
      tabIndex={zoomable ? 0 : undefined}
      onKeyDown={zoomable ? (e) => {if (e.key === "Enter" || e.key === " ") {e.preventDefault();onZoom({ title, caption, src, gradient, label });}} : undefined}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        borderRadius: 12,
        border: "1px solid var(--hair)",
        overflow: "hidden",
        cursor: zoomable ? "zoom-in" : "pointer",
        background: "var(--gray-50)",
        boxShadow: hover ? "0 16px 38px rgba(0,0,0,0.16)" : "2px 2px 6px -1px var(--shadow-soft)",
        transform: hover && zoomable ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow .35s ease, transform .35s cubic-bezier(.22,.61,.36,1)"
      }}>
      {/* Media layer — driven by `src` (swap the path in the data). */}
      <div style={{
        position: "absolute", inset: 0,
        background: media,
        transform: hover && zoomable ? "scale(1.05)" : "scale(1)",
        transition: "transform .5s cubic-bezier(.22,.61,.36,1)"
      }} />
      {/* Placeholder marker when there's no real image yet */}
      {!src &&
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11, letterSpacing: "0.04em", color: "rgba(0,0,0,0.4)",
        textTransform: "uppercase", pointerEvents: "none"
      }}>
          {label || "photo"}
        </div>
      }
      {/* Subtle gradient scrim so the caption box reads on bright photos */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent 45%)",
        opacity: hover ? 1 : 0, transition: "opacity .3s ease", pointerEvents: "none"
      }} />
      {/* Expand badge (only on zoomable cards) — clear "click to enlarge" cue */}
      {zoomable &&
      <div style={{
        position: "absolute", top: 12, right: 12,
        width: 34, height: 34, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        border: "1px solid var(--hair)",
        display: "grid", placeItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        opacity: hover ? 1 : 0,
        transform: hover ? "scale(1)" : "scale(0.8)",
        transition: "opacity .25s ease, transform .25s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none"
      }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      }
      {/* Caption box */}
      <div style={{
        position: "absolute", left: 12, right: 12, bottom: 12,
        background: "var(--paper)",
        border: "1px solid var(--hair)",
        borderRadius: 8,
        padding: "11px 14px",
        opacity: hover ? 1 : 0,
        transform: hover ? "translateY(0)" : "translateY(10px)",
        transition: "opacity .3s ease, transform .35s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: "-0.02em", color: "var(--ink)" }}>
          {title}
        </div>
        {caption && !titleOnly &&
        <div style={{ marginTop: 2, fontWeight: 300, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.62)" }}>
            {caption}
          </div>
        }
      </div>
    </div>);

}

// Portrait with a soft custom waving-hand cursor that fades in and waves.
function WavingPortrait() {
  const [pos, setPos] = useStateAb({ x: 0, y: 0 });
  const [hover, setHover] = useStateAb(false);
  const ref = useRefAb(null);

  const onMove = (e) => {
    const r = ref.current && ref.current.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      className="about-portrait"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      style={{
        width: 240, height: 240, borderRadius: "50%",
        background: "var(--gray-50)",
        display: "grid", placeItems: "center",
        color: "rgba(0,0,0,0.4)", fontSize: 12,
        fontFamily: "ui-monospace, monospace", letterSpacing: "0.04em",
        border: "1px solid var(--hair)",
        justifySelf: "end",
        position: "relative",
        overflow: "hidden",
        cursor: hover ? "none" : "auto"
      }}>
      {/* Swap the path below to set your portrait (or leave blank for placeholder). */}
      {window.PORTRAIT_SRC ?
      <div style={{ position: "absolute", inset: 0, background: `url(${window.PORTRAIT_SRC}) center / cover no-repeat` }} /> :
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>[ portrait ]</span>
      }
      {/* Custom waving-hand cursor — soft fade + scale in, then waves. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          fontSize: 30,
          lineHeight: 1,
          pointerEvents: "none",
          opacity: hover ? 1 : 0,
          scale: hover ? "1" : "0.4",
          translate: "-30% -20%",
          transition: "scale .35s cubic-bezier(.34,1.56,.64,1)",
          willChange: "left, top, scale"
        }}>
        <span style={{
          display: "inline-block",
          transformOrigin: "70% 90%",
          animation: hover ? "handWave 1.1s ease-in-out infinite" : "none"
        }}>👋</span>
      </span>
    </div>);

}

// Fullscreen popup showing a larger version of a clicked archive image.
function Lightbox({ item, onClose }) {
  useEffectAb(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);
  if (!item) return null;
  const media = item.src ? `url(${item.src}) center / cover no-repeat` : item.gradient || "linear-gradient(135deg, #e8e2d9, #c8baa6)";
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(20,20,22,0.82)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "5vh 5vw",
        cursor: "zoom-out",
        animation: "pageFade .25s ease-out both"
      }}>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed", top: 22, right: 26,
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", cursor: "pointer", display: "grid", placeItems: "center",
          fontFamily: "inherit"
        }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      {/* Figure (stop propagation so clicking the image doesn't close) */}
      {/* Click anywhere (including the image) closes the lightbox. */}
      <figure
        style={{ margin: 0, maxWidth: 1100, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", cursor: "zoom-out" }}>
        <div style={{
          width: "100%",
          aspectRatio: "3 / 2",
          maxHeight: "78vh",
          borderRadius: 14,
          background: media,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          display: "grid", placeItems: "center"
        }}>
          {!item.src &&
          <span style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 13, letterSpacing: "0.04em", color: "rgba(0,0,0,0.45)", textTransform: "uppercase"
          }}>{item.label || "photo"}</span>
          }
        </div>
        {(item.title || item.caption) &&
        <figcaption style={{ marginTop: 16, textAlign: "center", maxWidth: 640 }}>
            {item.title &&
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 16, letterSpacing: "-0.02em" }}>{item.title}</div>
          }
            {item.caption &&
          <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 300, fontSize: 14, letterSpacing: "-0.01em", marginTop: 4 }}>{item.caption}</div>
          }
          </figcaption>
        }
      </figure>
    </div>);

}
window.Lightbox = Lightbox;

// Shared top nav used on EVERY page — "Serena Ng" left, links right.
// Sticky; collapses to a compact translucent bar once the page is scrolled.
// `overlay` makes it float over the fixed Home split-screen (which doesn't scroll).
function SiteNav({ onNavigate, current, overlay, activeProjectId, activeArchiveSlug, contentMaxWidth = 1080 }) {
  const [compact, setCompact] = useStateAb(false);
  useEffectAb(() => {
    if (overlay) return; // Home doesn't scroll → always full-size
    const read = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    (document.scrollingElement && document.scrollingElement.scrollTop) || 0;
    // Hysteresis: turn compact ON above 56px, OFF below 8px. The dead-band
    // between the two stops the state flip-flopping (and jittering) when the
    // nav's height change nudges the scroll position back across a single
    // threshold.
    const onScroll = () => {
      const y = read();
      setCompact((prev) => prev ? y > 8 : y > 56);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [overlay]);

  return (
    <header className={"site-nav" + (overlay ? " overlay" : "") + (compact ? " is-compact" : "")}>
      <div className="site-nav-inner" style={{ maxWidth: overlay ? "none" : contentMaxWidth }}>
        <button className="nav-wordmark" onClick={(e) => {e.currentTarget.blur();onNavigate("home");}}>Serena Ng</button>
        <nav className="site-nav-links">
        <div className="nav-item">
          <button className={"nav-link" + (current === "work" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("home");}}>
            Work
            <svg className="nav-caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="nav-menu" role="menu">
            {(window.PROJECTS || []).map((p) =>
            <button key={p.id} className={"nav-menu-item" + (p.id === activeProjectId ? " is-active" : "")} role="menuitem" onClick={(e) => {e.currentTarget.blur();onNavigate("project/" + p.id);}}>
                {p.title}
              </button>
            )}
          </div>
        </div>
        <div className="nav-item">
          <button className={"nav-link" + (current === "playground" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("playground");}}>
            Playground
            <svg className="nav-caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="nav-menu" role="menu">
            {(window.ARCHIVE_ORDER || []).map((a) =>
            <button key={a.slug} className={"nav-menu-item" + (a.slug === activeArchiveSlug ? " is-active" : "")} role="menuitem" onClick={(e) => {e.currentTarget.blur();onNavigate("archive/" + a.slug);}}>
                {a.title}
              </button>
            )}
          </div>
        </div>
        <button className={"nav-link" + (current === "about" ? " is-current" : "")} onClick={(e) => {e.currentTarget.blur();onNavigate("about");}}>About</button>
      </nav>
      </div>
    </header>);

}
window.SiteNav = SiteNav;

// Shared site footer used on EVERY page. Small text pinned to the bottom.
// `marginTop: auto` lets it sink to the bottom when its parent is a flex column.
function SiteFooter({ bare, big, noResume }) {
  const style = bare ? { marginTop: "clamp(20px, 4vh, 48px)" } : { marginTop: "auto" };
  if (big) style.fontSize = 13.5;
  return (
    <footer
      className={"site-footer" + (bare ? " bare" : "")}
      style={style}>
      <span>Vibe coded with <a className="footer-link" href="https://www.anthropic.com/claude" target="_blank" rel="noreferrer noopener">Claude AI</a></span>
      <div className="site-footer-links">
        <a className="footer-link" href="mailto:serena.ng.contact@gmail.com">serena.ng.contact@gmail.com</a>
        {!noResume &&
        <a className="footer-link" href="assets/Serena-Ng-Resume.pdf" target="_blank" rel="noreferrer noopener">Resume</a>
        }
      </div>
    </footer>);

}
window.SiteFooter = SiteFooter;

// Back-compat alias — older call sites used <SubpageNav/>.
function SubpageNav(props) {return <SiteNav {...props} />;}

function MetaItem({ label, value, link }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.85)" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: "-0.02em", color: link ? "var(--accent)" : "rgba(0,0,0,0.7)" }}>
        {value}
      </div>
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Animated "My Journey" timeline.
// A gray track runs down the left; a purple fill flows down it as you
// scroll, and each card's dot lights up purple once the fill reaches it.
// ───────────────────────────────────────────────────────────────────
function Journey({ items }) {
  const containerRef = useRefAb(null);
  const itemRefs = useRefAb([]);
  const targetRef = useRefAb(0);   // scroll-driven target fill (0..1), no re-render
  const idxRef = useRefAb(-1);     // scroll-driven target active index
  const [progress, setProgress] = useStateAb(0); // smoothed 0..1 fill actually rendered
  const [trackPx, setTrackPx] = useStateAb(0); // pixel height of the track (container - insets)
  const [activeIdx, setActiveIdx] = useStateAb(-1);

  useEffectAb(() => {
    const TOP_INSET = 18,BOTTOM_INSET = 18;
    // sample() reads layout and stashes the TARGET fill/index in refs (no
    // setState) so scrolling never thrashes React. A steady ticker eases the
    // rendered value toward the target. We also call sample() inside the ticker
    // so the line keeps tracking during momentum scrolling on touch devices,
    // where scroll events fire sparsely — this is what makes it smooth on mobile.
    const sample = () => {
      const c = containerRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.55; // line head sits ~55% down the viewport
      const track = Math.max(1, rect.height - TOP_INSET - BOTTOM_INSET);
      setTrackPx((prev) => Math.abs(prev - track) > 1 ? track : prev);
      const travelled = triggerY - (rect.top + TOP_INSET);
      targetRef.current = Math.max(0, Math.min(1, travelled / track));
      // Active card = last dot the head has passed (viewport-relative).
      let idx = -1;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + 14 <= triggerY) idx = i; // dot center ≈ top + node radius
      });
      idxRef.current = idx;
    };
    window.addEventListener("scroll", sample, { passive: true });
    document.addEventListener("scroll", sample, { passive: true, capture: true });
    window.addEventListener("resize", sample);
    sample();

    // Smoothing ticker: ease the displayed fill toward the target each frame.
    let displayed = 0;
    const EASE = 0.13; // lower = floatier/smoother
    const tick = () => {
      sample(); // continuously re-track (covers sparse touch-scroll events)
      const t = targetRef.current;
      const diff = t - displayed;
      if (Math.abs(diff) > 0.0006) {
        displayed += diff * EASE;
        setProgress(displayed);
      } else if (displayed !== t) {
        displayed = t;
        setProgress(t);
      }
      setActiveIdx((prev) => prev !== idxRef.current ? idxRef.current : prev);
    };
    const intervalId = setInterval(tick, 16);

    // Re-measure shortly after mount in case fonts/images shift the layout.
    const t1 = setTimeout(sample, 100);
    const t2 = setTimeout(sample, 450);
    return () => {
      window.removeEventListener("scroll", sample);
      document.removeEventListener("scroll", sample, { capture: true });
      window.removeEventListener("resize", sample);
      clearInterval(intervalId);
      clearTimeout(t1);clearTimeout(t2);
    };
  }, [items.length]);

  return (
    <div ref={containerRef} className="journey" style={{ position: "relative" }}>
      {/* Gray track */}
      <div className="journey-track" />
      {/* Purple fill — scaleY avoids the height-transition rendering quirk */}
      <div className="journey-fill" style={{ transform: `scaleY(${progress})` }} />
      {/* Glowing head of the line */}
      <div className="journey-head" style={{
        top: 14 + progress * trackPx,
        opacity: progress > 0.01 && activeIdx < items.length - 1 ? 1 : 0
      }} />

      {items.map((j, i) => {
        const active = i <= activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <div
            key={i}
            ref={(el) => itemRefs.current[i] = el}
            className="journey-item"
            style={{ paddingBottom: i === items.length - 1 ? 0 : 28 }}>
            {/* Dot */}
            <div className={"journey-dot" + (active ? " is-active" : "")} style={{
              background: active ? "var(--accent)" : "var(--gray-50)",
              border: `1.5px solid ${active ? "var(--accent)" : "var(--muted)"}`,
              boxShadow: isCurrent ? "0 0 0 5px var(--accent-shadow)" : "0 0 0 0px var(--accent-shadow)",
              transition: "background .45s ease, border-color .45s ease, box-shadow .5s ease",
              zIndex: 2
            }} />
            {/* Card */}
            <div className="journey-card" style={{
              background: isCurrent ? "color-mix(in oklch, var(--accent) 4%, var(--paper))" : "var(--paper)",
              border: `1px solid ${isCurrent ? "color-mix(in oklch, var(--accent) 45%, var(--hair))" : "var(--hair)"}`,
              borderRadius: 16,
              padding: 18,
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 22,
              alignItems: "start",
              boxShadow: isCurrent ?
              "2px 2px 6px -1px var(--shadow-soft), 0 10px 28px var(--accent-shadow)" :
              "2px 2px 6px -1px var(--shadow-soft)",
              transform: isCurrent ? "translateX(4px)" : "translateX(0)",
              // Soft easing when a card becomes the active/highlighted one.
              transition: "background .5s ease, border-color .5s ease, box-shadow .5s ease, transform .5s cubic-bezier(.22,.61,.36,1)"
            }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "var(--accent)" : "rgba(0,0,0,0.45)", marginBottom: 6, transition: "color .5s ease" }}>{j.year}</div>
                <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", marginBottom: 6 }}>{j.title}</div>
                <div style={{ fontWeight: 300, fontSize: 14, lineHeight: "21px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>{j.body}</div>
              </div>
              <ImageCaption src={j.src} title={j.imgTitle} caption={j.imgCaption} label={j.image} aspect="16 / 10" />
            </div>
          </div>);

      })}
    </div>);

}

// Contact form with true silent background submission via Formspree.
// ┌─────────────────────────────────────────────────────────────────┐
// │ SETUP: create a free form at https://formspree.io (use the inbox │
// │ serena.ng.contact@gmail.com), then paste its form ID below.       │
// │ e.g. an endpoint of https://formspree.io/f/xdoqlabc → "xdoqlabc". │
// │ Until that's done the form runs in DEMO mode (shows success       │
// │ without actually delivering).                                     │
// └─────────────────────────────────────────────────────────────────┘
const FORMSPREE_ID = "xgoqgklj";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/" + FORMSPREE_ID;
const FORMSPREE_CONFIGURED = FORMSPREE_ID !== "your_form_id";

function ContactForm() {
  const [email, setEmail] = useStateAb("");
  const [subject, setSubject] = useStateAb("");
  const [message, setMessage] = useStateAb("");
  const [status, setStatus] = useStateAb("idle"); // idle | sending | sent | error
  const EMAIL = "serena.ng.contact@gmail.com";

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    // Demo mode: no endpoint configured yet → simulate a successful send.
    if (!FORMSPREE_CONFIGURED) {
      setTimeout(() => {setStatus("sent");setEmail("");setSubject("");setMessage("");}, 700);
      return;
    }
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, _replyto: email, subject, message })
      });
      if (res.ok) {
        setStatus("sent");setEmail("");setSubject("");setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const onEdit = (setter) => (e) => {setter(e.target.value);if (status === "sent" || status === "error") setStatus("idle");};
  const sending = status === "sending";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: 48, alignItems: "start" }} className="contact-grid">
      <div>
        <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
          Get in touch
        </div>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, letterSpacing: "-0.03em" }}>
          Let's talk.
        </h2>
        <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", maxWidth: 360 }}>
          Have a project, a question, or just want to say hi? Drop a note and it'll land straight in my inbox.
        </p>
        <a className="footer-link" href={"mailto:" + EMAIL} style={{ display: "inline-block", marginTop: 16, fontSize: 14 }}>
          {EMAIL}
        </a>
      </div>

      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="cf-email">Your email</label>
          <input
            id="cf-email"
            className="field-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={onEdit(setEmail)}
            required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="field-label" htmlFor="cf-subject">Subject</label>
          <input
            id="cf-subject"
            className="field-input"
            type="text"
            placeholder="What's this about?"
            value={subject}
            onChange={onEdit(setSubject)}
            required />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label" htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            className="field-input"
            placeholder="Tell me a little about what you have in mind…"
            value={message}
            onChange={onEdit(setMessage)}
            required />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <button className="pill-btn" type="submit" disabled={sending} style={{ fontSize: 14, padding: "11px 20px", opacity: sending ? 0.7 : 1, cursor: sending ? "default" : "pointer" }}>
            {sending ? "Sending…" : <>Send message <span className="arr">→</span></>}
          </button>
          {status === "sent" &&
          <div
            role="status"
            aria-live="polite"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 14, letterSpacing: "-0.01em", color: "#1F8A4D",
              pointerEvents: "none"
            }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%", background: "#1F8A4D",
              display: "grid", placeItems: "center", flexShrink: 0
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Message sent — thank you!
          </div>
          }
          {status === "error" &&
          <div role="status" aria-live="polite" style={{ fontSize: 14, letterSpacing: "-0.01em", color: "#C0392B" }}>
            Couldn't send — please email me directly at {EMAIL}.
          </div>
          }
        </div>
      </form>
    </div>);

}

function About({ onNavigate }) {
  const journey = [
  { year: "2018", title: "Started designing in high school", body: "Made a Tumblr theme that, somehow, 12,000 people used. First time I realized other people interact with the things I make.", image: "high school", imgTitle: "First portfolio site", imgCaption: "The Tumblr theme that started it all — built in a dorm room." },
  { year: "2020", title: "Northeastern, College of Arts, Media & Design", body: "Studied design with a co-op program. Year one in Boston, year two pivoting between research and visual.", image: "Boston", imgTitle: "Studio nights at Ryder Hall", imgCaption: "Most of design school happened between midnight and 3am." },
  { year: "2022", title: "Co-op at Ronik Design Agency", body: "Six months on brand systems for cultural clients. Learned that good brand work is mostly listening.", image: "Ronik", imgTitle: "NYC, Ronik studio", imgCaption: "My desk during the JFK Airport T4 rebrand sprint." },
  { year: "2023", title: "Product Design Intern at Snyk", body: "Summer on the developer-experience team. Shipped the SBOM dashboard from research through launch.", image: "Snyk", imgTitle: "Snyk intern demo day", imgCaption: "Presenting the SBOM dashboard to the whole DevEx org." },
  { year: "2024", title: "Lead designer on SearchNEU mobile", body: "Volunteer redesign that ended up in 32,000 students' pockets for fall registration.", image: "SearchNEU", imgTitle: "Registration-day testing", imgCaption: "Shadowing students as they registered on their phones." },
  { year: "2025—", title: "Patient experience at Epic Systems", body: "Currently designing the parts of healthcare nobody wants to think about — until they have to.", image: "Epic", imgTitle: "Epic campus, Verona WI", imgCaption: "The famous treehouse workspace on the Epic campus." }];


  // Images for the "What I've been up to..." section
  const recent = [
  { label: "marathon", imgTitle: "Bank of America 13.1", imgCaption: "Finished my first half-marathon this October." },
  { label: "matcha", imgTitle: "Matcha tasting, Cambridge", imgCaption: "Ranking ceremonial-grade matcha with friends." },
  { label: "pottery", imgTitle: "Wheel-throwing class", imgCaption: "Six weeks in and my bowls are almost symmetrical." },
  { label: "severance", imgTitle: "Finally finished Severance S2", imgCaption: "No spoilers — but the design direction is unreal." },
  { label: "trail", imgTitle: "Middlesex Fells hike", imgCaption: "Sunday reset loop, leaves just starting to turn." },
  { label: "film", imgTitle: "New roll of Portra 400", imgCaption: "Shot around the North End on a borrowed Contax." }];


  const contactRef = useRefAb(null);
  const scrollToContact = () => {
    const el = contactRef.current;
    if (!el) return;
    const scroller = document.scrollingElement || document.documentElement;
    const startY = window.scrollY || scroller && scroller.scrollTop || 0;
    const targetY = el.getBoundingClientRect().top + startY - 72;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    const dur = 480;
    const clock = () => window.performance && performance.now ? performance.now() : Date.now();
    const t0 = clock();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const setY = (v) => {window.scrollTo(0, v);if (scroller) scroller.scrollTop = v;};
    const iv = setInterval(() => {
      const t = Math.min(1, (clock() - t0) / dur);
      setY(startY + dist * ease(t));
      if (t >= 1) clearInterval(iv);
    }, 16);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <SubpageNav onNavigate={onNavigate} current="about" />

      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", padding: "60px 40px 100px" }}>
        {/* Hero — text + photo */}
        <div className="about-hero" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 48, alignItems: "start" }}>
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, letterSpacing: "-0.03em" }}>
              Howdy, I'm Serena! <span className="howdy-wave" style={{ display: "inline-block" }}>👋</span>
            </h1>
            <p style={{ margin: "14px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.78)", maxWidth: 540, textWrap: "pretty" }}>
              I'm a product-obsessed designer based in Boston. I care about the boring middle of products — the parts where the user already knows what they want and design just has to get out of the way. Currently working on patient experience at Epic Systems.
            </p>
            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="pill-btn" onClick={scrollToContact}>
                ✉️ Contact
              </button>
            </div>
          </div>
          <WavingPortrait />
        </div>

        {/* Two columns: Experience + Client work */}
        <div className="about-two-col" style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Experience</div>
            <MetaItem label="Patient Experience Quality Manager" value="Epic Systems · 2025—Present" />
            <MetaItem label="UX Designer" value="SearchNEU · 2024—2025" />
            <MetaItem label="UX Designer" value="Ronik Design Agency · 2024" />
            <MetaItem label="Product Researcher + Designer" value="Snyk Cybersecurity · 2023" />
            <MetaItem label="UX Designer" value="Sandbox Software Consultancy · 2022" />
            <MetaItem label="BFA UX Design" value="Northeastern University" />
            <MetaItem label="Currently learning" value="vibe coding · photography · sleight of hand" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Client work</div>
            <p style={{ margin: 0, fontWeight: 300, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              I've worked on projects with clients including 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> Reuters</strong>,
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> JFK Airport T4</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> NBCUniversal</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> Ogilvy</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> Ecolab</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> PGIM (formerly Prudential Investment)</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> Leading Edge</strong>, 
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}> Flo. Marketing</strong>, 
              and more.
            </p>
            <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              Open to freelance — drop a line at <a href="mailto:serena.ng.contact@gmail.com" style={{ color: "var(--accent)" }}>serena.ng.contact@gmail.com</a>.
            </p>
          </div>
        </div>

        {/* My Journey — animated timeline */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 24 }}>My Journey</div>
          <Journey items={journey} />
        </div>

        {/* What I've been up to */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>What I've been up to...</div>
          <div style={{ fontSize: 14, fontWeight: 300, color: "rgba(0,0,0,0.6)", letterSpacing: "-0.02em", marginBottom: 24 }}>
            recently: matcha-tasting in Cambridge, a half-marathon in October, finally finishing <em>Severance</em> S2.
          </div>
          <div className="recent-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {recent.map((r, i) =>
            <ImageCaption key={i} src={r.src} title={r.imgTitle} caption={r.imgCaption} label={r.label} aspect="4 / 3" mobileTitleOnly={true} />
            )}
          </div>
        </div>

        {/* Contact — separated section with its own form */}
        <div ref={contactRef} style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid var(--hair)" }}>
          <ContactForm />
        </div>
      </div>
      <window.SiteFooter />
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Playground
// ───────────────────────────────────────────────────────────────────
// Category data lives at module scope so the Archive pages can reuse it.
const PLAYGROUND_CATEGORIES = {
  photography: {
    emoji: "📷",
    title: "Photography",
    archiveTitle: "Photography Archive",
    archiveIntro: "Mostly shot on a Canon EOS R50. Catch me exploring new places and occasionally taking graduation pictures.",
    body: "Mostly shot on a Canon EOS R50. Catch me exploring new places and occasionally taking graduation pictures.",
    archiveLabel: "Photo Archive",
    items: [
    { label: "autumn", imgTitle: "Autumn in Wisconsin", imgCaption: "The view of Wisconsin's colorful trees in autumn.", src: "assets/playground/photography/autumn.png" },
    { label: "chinatown", imgTitle: "Boston's Chinatown", imgCaption: "Captured after the annual Chinese New Year Lion Dance parade.", src: "assets/playground/photography/boston_chinatown_gate.webp" },
    { label: "foggyTreeBranch", imgTitle: "A foggy night", imgCaption: "Every foggy night is optimal photography time.", src: "assets/playground/photography/tree_branch_foggy_night.png" },
    { label: "dayTreeBranch", imgTitle: "Right before the leaves change color", imgCaption: "I go on many walks to watch the leaves change color in autumn.", src: "assets/playground/photography/tree_branch_day.png" },
    { label: "fenway", imgTitle: "Fenway in Boston", imgCaption: "An iconic neighborhood in Boston and also where I had my college graduation!", src: "assets/playground/photography/boston_fenway.avif" },
    { label: "foggyNight", imgTitle: "A foggy night", imgCaption: "Every foggy night is optimal photography time.", src: "assets/playground/photography/foggy_streetlight.png" },
    { label: "fog", imgTitle: "Esplanade in the fog", imgCaption: "A 6am run that turned into a photo walk." },
    { label: "market", imgTitle: "Haymarket Saturday", imgCaption: "The loudest, most colorful corner of the city." }]

  },
  cooking: {
    emoji: "👩‍🍳",
    title: "Cooking + Drinks",
    archiveTitle: "Cooking + Drinks Archive",
    archiveIntro: "Inherited family recipes, stubborn sourdough, and an ongoing search for the perfect matcha-to-milk ratio.",
    body: "Inherited recipes, half-failed sourdough, and the matcha latte ratios I keep tweaking.",
    archiveLabel: "Recipe Archive",
    items: [
    { gradient: "linear-gradient(135deg,#f0e6d2,#d8c4a0)", label: "matcha", imgTitle: "The perfect matcha ratio", imgCaption: "2g matcha, 60ml water at 80°C, 150ml oat milk." },
    { gradient: "linear-gradient(135deg,#e8d9c5,#c9a87a)", label: "sourdough", imgTitle: "Loaf #14", imgCaption: "Finally got an open crumb. Took fourteen tries." },
    { gradient: "linear-gradient(135deg,#efe2d0,#cdb78f)", label: "dumplings", imgTitle: "Sunday dumplings", imgCaption: "Three generations, one big bowl of filling." },
    { gradient: "linear-gradient(135deg,#e3d6c0,#c2a574)", label: "negroni", imgTitle: "Negroni experiments", imgCaption: "Swapping gin for mezcal — verdict: yes." },
    { gradient: "linear-gradient(135deg,#ece0cc,#cbb083)", label: "ramen", imgTitle: "20-hour tonkotsu", imgCaption: "An entire weekend for one bowl. No regrets." },
    { gradient: "linear-gradient(135deg,#e7dac4,#c6aa7c)", label: "mooncake", imgTitle: "Homemade mooncakes", imgCaption: "Custard filling, lotus-leaf molds from my grandma." }]

  },
  branding: {
    emoji: "🎨",
    title: "Branding + Graphic Design",
    archiveTitle: "Branding + Graphic Design Archive",
    archiveIntro: "Identity systems, type explorations, and posters — mostly for friends' projects and the occasional self-initiated zine.",
    body: "Logo doodles, type explorations, and identity systems for friends' side projects.",
    archiveLabel: "Design Archive",
    items: [
    { gradient: "linear-gradient(135deg,#dfe0f5,#b9bcf0)", label: "logo", imgTitle: "Mark for a tea brand", imgCaption: "A leaf that doubles as a steam curl." },
    { gradient: "linear-gradient(135deg,#e6e2f7,#c3bdf2)", label: "type", imgTitle: "Type specimen study", imgCaption: "Exploring a variable serif for a zine." },
    { gradient: "linear-gradient(135deg,#dde0f6,#b4b8ee)", label: "poster", imgTitle: "Lion-dance event poster", imgCaption: "Risograph two-color for the NEU troupe." },
    { gradient: "linear-gradient(135deg,#e7e3f8,#c6c0f3)", label: "identity", imgTitle: "Café identity system", imgCaption: "Full brand for a friend's pop-up." },
    { gradient: "linear-gradient(135deg,#dee1f6,#b7bbef)", label: "pattern", imgTitle: "Generative pattern set", imgCaption: "Made in p5.js, exported for packaging." },
    { gradient: "linear-gradient(135deg,#e5e1f7,#c0baf1)", label: "icons", imgTitle: "Icon system sketches", imgCaption: "A 40-glyph set drawn on the grid." }]

  },
  tinkering: {
    emoji: "🛠️",
    title: "Tinkering",
    archiveTitle: "Tinkering Archive",
    archiveIntro: "Hardware projects and code experiments — the kind of thing that takes a whole weekend and a lot of solder.",
    body: "Code experiments, hardware projects, and the occasional Arduino-controlled houseplant.",
    archiveLabel: "Project Archive",
    items: [
    { gradient: "linear-gradient(135deg,#d6ece4,#a7d3c2)", label: "plant", imgTitle: "Self-watering planter", imgCaption: "Arduino + moisture sensor. The basil survived." },
    { gradient: "linear-gradient(135deg,#dcefe6,#aed8c7)", label: "clock", imgTitle: "Split-flap clock", imgCaption: "3D-printed, way louder than I expected." },
    { gradient: "linear-gradient(135deg,#d3eae1,#a2d0be)", label: "synth", imgTitle: "Pocket synth build", imgCaption: "A weekend of soldering and bleep-bloops." },
    { gradient: "linear-gradient(135deg,#def0e8,#b1dac9)", label: "led", imgTitle: "Sunrise alarm lamp", imgCaption: "WLED strip that fakes a Boston-less sunrise." },
    { gradient: "linear-gradient(135deg,#d8ede4,#aad5c4)", label: "keyboard", imgTitle: "Hand-wired keyboard", imgCaption: "36 keys, far too many hours." },
    { gradient: "linear-gradient(135deg,#d1e9e0,#9fcfbc)", label: "robot", imgTitle: "Line-following bot", imgCaption: "A leftover from a hackathon I still love." }]

  },
  misc: {
    emoji: "🐉",
    title: "Miscellaneous",
    archiveTitle: "Miscellaneous Archive",
    archiveIntro: "Everything that doesn't fit a neat box — sketchbook spreads, party invites, zines, and assorted paper experiments.",
    body: "Things that don't fit anywhere else — sketchbook spreads, party invites, random GIFs.",
    archiveLabel: "View Archive",
    items: [
    { gradient: "linear-gradient(135deg,#f1e0e6,#dfb6c4)", label: "sketch", imgTitle: "Sketchbook spread", imgCaption: "Travel pages from a trip up the coast." },
    { gradient: "linear-gradient(135deg,#f3e2e8,#e3bcc8)", label: "invite", imgTitle: "Dumpling-party invite", imgCaption: "Hand-lettered, photocopied, taped to doors." },
    { gradient: "linear-gradient(135deg,#f0dfe5,#dcb2c0)", label: "gif", imgTitle: "Loop study", imgCaption: "A 12-frame walk cycle that took all night." },
    { gradient: "linear-gradient(135deg,#f4e3e9,#e6becb)", label: "zine", imgTitle: "Mini-zine: 'Trains'", imgCaption: "Eight pages, one sheet, zero budget." },
    { gradient: "linear-gradient(135deg,#efdee4,#dab0be)", label: "stickers", imgTitle: "Sticker pack", imgCaption: "Drawn for friends, printed at a kiosk." },
    { gradient: "linear-gradient(135deg,#f2e1e7,#e1b8c5)", label: "collage", imgTitle: "Paper collage", imgCaption: "Made entirely from old MBTA maps." }]

  }
};

function PlaygroundSection({ slug, category, onNavigate }) {
  const { emoji, title, body, items, archiveLabel } = category;
  return (
    <section style={{ marginBottom: 84 }}>
      <div className="pg-section-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 16 }}>
        <div style={{ maxWidth: 540 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
            {title} <span>{emoji}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 300, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
            {body}
          </div>
        </div>
        <button
          className="pill-btn"
          style={{ flexShrink: 0 }}
          onClick={() => onNavigate("archive/" + slug)}>
          {archiveLabel} <span className="arr">→</span>
        </button>
      </div>
      <div className="pg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.slice(0, 6).map((it, i) =>
        <ImageCaption key={i} src={it.src} title={it.imgTitle} caption={it.imgCaption} label={it.label} gradient={it.gradient} aspect="16 / 10" />
        )}
      </div>
    </section>);

}

function Playground({ onNavigate }) {
  // Scattered hero emojis (absolute, varied size/rotation) — not a straight row.
  const heroEmojis = [
  { char: "🐉", left: "4%", top: "8%", size: 38, rot: -10 },
  { char: "🍵", left: "44%", top: "0%", size: 46, rot: 8 },
  { char: "🎧", left: "78%", top: "12%", size: 34, rot: -6 },
  { char: "🧋", left: "22%", top: "52%", size: 42, rot: 6 },
  { char: "📷", left: "60%", top: "56%", size: 40, rot: -8 },
  { char: "🧩", left: "88%", top: "62%", size: 32, rot: 12 }];

  const order = ["photography", "cooking", "branding", "tinkering", "misc"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" />
      <div className="pg-container" style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 40px 100px" }}>
        <div className="pg-hero" style={{ marginBottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, letterSpacing: "-0.03em" }}>
              Welcome to my playground! <span>🛝</span>
            </h1>
            <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
              A space for the side things — photography, cooking experiments, branding doodles, and whatever else I'm tinkering with.
            </p>
            <button className="pill-btn" style={{ marginTop: 16 }} onClick={() => onNavigate("about")}>
              About Me <span className="arr">→</span>
            </button>
          </div>
          {/* Scattered emojis */}
          <div className="pg-emoji-cloud" style={{ position: "relative", width: 280, height: 150, flexShrink: 0 }}>
            {heroEmojis.map((e, i) =>
            <span key={i} style={{
              position: "absolute", left: e.left, top: e.top,
              fontSize: e.size, lineHeight: 1, transform: `rotate(${e.rot}deg)`,
              animation: `pgFloat${i % 3} ${5 + i * 0.5}s ease-in-out infinite`
            }}>{e.char}</span>
            )}
          </div>
        </div>

        {order.map((slug) =>
        <PlaygroundSection key={slug} slug={slug} category={PLAYGROUND_CATEGORIES[slug]} onNavigate={onNavigate} />
        )}

        <div style={{
          marginTop: 8,
          fontSize: 16,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "rgba(0,0,0,0.6)"
        }}>
          And plenty more to come…
        </div>
      </div>
      <style>{`
        @keyframes pgFloat0 { 0%,100%{translate:0 0} 50%{translate:0 -7px} }
        @keyframes pgFloat1 { 0%,100%{translate:0 0} 50%{translate:0 -11px} }
        @keyframes pgFloat2 { 0%,100%{translate:0 0} 50%{translate:0 -5px} }
      `}</style>
      <window.SiteFooter />
    </div>);

}

// ───────────────────────────────────────────────────────────────────
// Archive — a dedicated page for one playground category.
// Large title + intro, then a generous grid of landscape Image+Caption
// cards (the full set, not just the 6-card preview shown on Playground).
// ───────────────────────────────────────────────────────────────────
function Archive({ slug, onNavigate }) {
  const order = ["photography", "cooking", "branding", "tinkering", "misc"];
  const category = PLAYGROUND_CATEGORIES[slug] || PLAYGROUND_CATEGORIES.photography;
  const idx = order.indexOf(slug in PLAYGROUND_CATEGORIES ? slug : "photography");
  const next = PLAYGROUND_CATEGORIES[order[(idx + 1) % order.length]];
  const nextSlug = order[(idx + 1) % order.length];
  const activeSlug = slug in PLAYGROUND_CATEGORIES ? slug : "photography";
  const [zoomed, setZoomed] = useStateAb(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <SubpageNav onNavigate={onNavigate} current="playground" activeArchiveSlug={activeSlug} />
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", padding: "48px 40px 100px" }}>
        {/* Back to Playground */}
        <button
          className="nav-link"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 28 }}
          onClick={() => onNavigate("playground")}>
          <span style={{ display: "inline-block" }}>←</span> Playground
        </button>

        {/* Header */}
        <header style={{ marginBottom: 44, maxWidth: 720 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
            Archive
          </div>
          <h1 className="archive-title" style={{ margin: 0, fontWeight: 700, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            {category.title} <span style={{ fontWeight: 400 }}>{category.emoji}</span>
          </h1>
          <p style={{ margin: "18px 0 0", fontWeight: 300, fontSize: 17, lineHeight: "27px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)", textWrap: "pretty" }}>
            {category.archiveIntro}
          </p>
          <div style={{ marginTop: 18, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)" }}>
            {category.items.length} pieces · click any image to enlarge
          </div>
        </header>

        {/* Full grid — large landscape cards, click to enlarge */}
        <div className="archive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {category.items.map((it, i) =>
          <div key={i}>
            <ImageCaption title={it.imgTitle} caption={it.imgCaption} label={it.label} src={it.src} gradient={it.gradient} aspect="3 / 2" onZoom={setZoomed} />
            {/* Static caption — shown on mobile (no hover) */}
            <div className="archive-static-caption">
              <div style={{ fontWeight: 500, fontSize: 15, lineHeight: "20px", letterSpacing: "-0.02em", color: "var(--ink)" }}>
                {it.imgTitle}
              </div>
              {it.imgCaption &&
              <div style={{ marginTop: 2, fontWeight: 300, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.62)" }}>
                {it.imgCaption}
              </div>
              }
            </div>
          </div>
          )}
        </div>

        {/* Next archive */}
        <div style={{
          marginTop: 72, paddingTop: 32, borderTop: "1px solid var(--hair)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap"
        }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>
              Next archive
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em" }}>
              {next.title} <span style={{ fontWeight: 400 }}>{next.emoji}</span>
            </div>
          </div>
          <button className="pill-btn" onClick={() => onNavigate("archive/" + nextSlug)}>
            View {next.title} <span className="arr">→</span>
          </button>
        </div>
      </div>
      <window.SiteFooter />
      {zoomed && <Lightbox item={zoomed} onClose={() => setZoomed(null)} />}
    </div>);

}

window.About = About;
window.Playground = Playground;
window.Archive = Archive;
// Ordered archive list for the Playground nav dropdown.
window.ARCHIVE_ORDER = ["photography", "cooking", "branding", "tinkering", "misc"].
map((slug) => ({ slug, title: PLAYGROUND_CATEGORIES[slug].title }));
