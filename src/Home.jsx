// Home — split-screen layout: thumbnails/emojis on left, project list on right.
// Hover a project → corresponding image fades in on left.
// Idle → emojis fade in on left. Hover an emoji → small caption card.

const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

function ProjectThumb({ project, active }) {
  // Apple-style: spring-y scale + opacity crossfade
  // A real photo: project.img (any project) or the bundled searchneu asset.
  const imgSrc = project.img || (project.thumb === "image" ? window.ASSET("searchneu", "assets/searchneu.png") : null);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(0.985)",
        transition: "opacity .55s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6%"
      }}>
      
      {imgSrc ?
      <img
        src={imgSrc}
        alt={project.title}
        style={{
          maxWidth: "118%",
          maxHeight: "92%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.12))"
        }} /> :


      <div
        aria-hidden="true"
        style={{
          width: "78%",
          aspectRatio: "4 / 3",
          borderRadius: 18,
          background: `linear-gradient(140deg, ${project.color}, color-mix(in oklab, ${project.color} 60%, white))`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: 28,
          color: "white"
        }}>
        
          <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 16px)"
        }} />
          <div style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          letterSpacing: "0.06em",
          opacity: 0.85,
          textTransform: "uppercase",
          position: "relative"
        }}>
            [ {project.title} preview ]
          </div>
        </div>
      }
    </div>);

}

function CompanyLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={{
        color: "var(--accent)",
        textDecoration: "none",
        borderBottom: "1px solid color-mix(in oklch, var(--accent) 28%, transparent)",
        paddingBottom: 1,
        transition: "border-color .2s ease, color .2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderBottomColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderBottomColor = "color-mix(in oklch, var(--accent) 28%, transparent)";
      }}>
      {children}
    </a>);
}

function EmojiCloud({ visible, hoveredId, onHover }) {
  // Scattered, organic placement — staggered both horizontally and vertically,
  // varied sizes and rotations. Per Figma the emoji frame is a tall narrow
  // column (~228 × 526), so we emulate that with a vertical stack that has
  // intentional left/right offsets to feel hand-placed.
  // Scattered (not a straight line), smaller. Positioned as % within a fixed
  // cluster box that is itself flex-centered in the panel's photo area below
  // the nav — so the whole group reads as vertically centered.
  const positions = [
  { left: "8%", top: "0%", size: 64, rot: -8 }, // upper-left
  { left: "58%", top: "2%", size: 76, rot: 6 }, // upper-right (bigger)
  { left: "30%", top: "27%", size: 70, rot: 4 }, // center
  { left: "80%", top: "33%", size: 58, rot: -5 }, // right (smaller)
  { left: "2%", top: "56%", size: 72, rot: 7 }, // lower-left (bigger)
  { left: "42%", top: "64%", size: 64, rot: -9 }, // lower-center
  { left: "78%", top: "78%", size: 60, rot: 8 }]; // lower-right

  const hoveredEmoji = hoveredId !== null ? window.EMOJIS[hoveredId] : null;
  const hoveredPos = hoveredId !== null ? positions[hoveredId] : null;

  return (
    <div
      style={{
        position: "absolute",
        // Photo area BELOW the nav bar; emojis are flex-centered within it.
        top: 84,
        left: "6%",
        right: "6%",
        bottom: "5%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity .9s cubic-bezier(.22,.61,.36,1)",
        pointerEvents: visible ? "auto" : "none"
      }}>
      {/* Fixed-aspect cluster box: emojis are positioned by % within this,
                       and the box is centered in the area above. */}
      <div style={{ position: "relative", width: "100%", maxWidth: 440, aspectRatio: "1 / 1" }}>
      {window.EMOJIS.map((e, i) => {
          const p = positions[i % positions.length];
          const isHover = hoveredId === i;
          const dim = hoveredId !== null && !isHover;
          return (
            <button
              key={i}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(i)}
              onBlur={() => onHover(null)}
              aria-label={e.title}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: p.size * 0.7,
                lineHeight: 1,
                transform: `rotate(${p.rot}deg) scale(${isHover ? 1.12 : 1})`,
                opacity: dim ? 0.35 : 1,
                transition: "transform .35s cubic-bezier(.22,.61,.36,1), opacity .35s ease",
                filter: isHover ? "drop-shadow(0 8px 18px rgba(0,0,0,0.15))" : "none",
                padding: 0,
                animation: visible ? `emojiFloat${i % 3} ${6 + i * 0.4}s ease-in-out infinite` : "none"
              }}>
            
            {e.char}
          </button>);

        })}
      {/* Caption card rendered inside the cluster box so % anchors align */}
      {hoveredEmoji && hoveredPos && <EmojiCard emoji={hoveredEmoji} anchor={hoveredPos} />}
      <style>{`
        @keyframes emojiFloat0 { 0%,100%{translate:0 0} 50%{translate:0 -6px} }
        @keyframes emojiFloat1 { 0%,100%{translate:0 0} 50%{translate:0 -10px} }
        @keyframes emojiFloat2 { 0%,100%{translate:0 0} 50%{translate:0 -4px} }
      `}</style>
      </div>
    </div>);

}

function EmojiCard({ emoji, anchor }) {
  const cardRef = React.useRef(null);
  const [adj, setAdj] = useState({ dx: 0, dy: 0 });
  if (!emoji) return null;
  const anchorLeftNum = parseFloat(anchor.left);
  const anchorTopNum = parseFloat(anchor.top);
  // Default: bubble appears DIRECTLY BELOW the emoji. Flip ABOVE only when the
  // emoji sits low enough that a below-bubble would be clipped at the bottom.
  const showAbove = anchorTopNum > 60;
  // Center the card horizontally on the emoji; place above or below it.
  const cardLeft = `calc(${anchorLeftNum}% + ${anchor.size / 2}px)`;
  const cardTop = showAbove ?
  `calc(${anchorTopNum}% - 10px)` :
  `calc(${anchorTopNum}% + ${anchor.size}px + 10px)`;
  const baseTransform = showAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";

  // After mount, measure the card against the PANEL it lives in and nudge it
  // back inside if any edge would be clipped — so the bubble is never cut off.
  // The cardIn animation is opacity-only, so the inline centering transform is
  // intact during measurement and getBoundingClientRect reads the final box.
  React.useLayoutEffect(() => {
    const clamp = () => {
      const el = cardRef.current;
      if (!el) return;
      const panel = el.closest("[data-left-panel]");
      const pr = panel ?
      panel.getBoundingClientRect() :
      { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      const r = el.getBoundingClientRect();
      const m = 12;
      // r already includes any current dx/dy, so compute the additional delta.
      let ddx = 0,ddy = 0;
      if (r.left < pr.left + m) ddx += pr.left + m - r.left;
      if (r.right > pr.right - m) ddx -= r.right - (pr.right - m);
      if (r.top < pr.top + m) ddy += pr.top + m - r.top;
      if (r.bottom > pr.bottom - m) ddy -= r.bottom - (pr.bottom - m);
      if (Math.abs(ddx) > 0.5 || Math.abs(ddy) > 0.5) {
        setAdj((prev) => ({ dx: prev.dx + ddx, dy: prev.dy + ddy }));
      }
    };
    clamp();
    // Re-clamp after the opacity animation settles, as a safety net.
    const t = setTimeout(clamp, 300);
    return () => clearTimeout(t);
  }, [emoji, anchor.left, anchor.top, anchor.size]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        left: cardLeft,
        top: cardTop,
        transform: `translate(${adj.dx}px, ${adj.dy}px) ${baseTransform}`,
        width: 200,
        background: "var(--paper)",
        border: "1px solid var(--hair)",
        borderRadius: 16,
        padding: 12,
        boxShadow: "2px 2px 6px -1px var(--shadow-soft), 0 12px 28px rgba(0,0,0,0.08)",
        zIndex: 5,
        pointerEvents: "none",
        animation: "cardIn .25s cubic-bezier(.22,.61,.36,1) both"
      }}>
      
      {emoji.img ?
      <div style={{
        width: "100%",
        aspectRatio: "16 / 10",
        borderRadius: 11,
        marginBottom: 10,
        background: `url(${emoji.img}) center / cover no-repeat`
      }} /> :
      <div
        className="placeholder-stripe"
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: 11,
          marginBottom: 10
        }}>
        
        photo · {emoji.char}
      </div>
      }
      <div style={{
        fontSize: 13,
        lineHeight: "18px",
        letterSpacing: "-0.02em",
        color: "var(--ink)",
        textAlign: "center",
        fontWeight: 500
      }}>
        {emoji.title}
      </div>
      <div style={{
        marginTop: 4,
        fontSize: 12,
        lineHeight: "16px",
        letterSpacing: "-0.02em",
        color: "rgba(0,0,0,0.6)",
        textAlign: "center",
        fontWeight: 300
      }}>
        {emoji.body}
      </div>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>);

}

function ProjectRow({ project, hovered, onHover, onOpen, isMobile }) {
  if (isMobile) {
    return (
      <button
        onClick={() => onOpen(project.id)}
        style={{
          textAlign: "left",
          background: "var(--paper)",
          border: "1px solid var(--hair)",
          borderRadius: 16,
          padding: 18,
          width: "100%",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
        
        <div>
          <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.03em" }}>
            {project.title}
          </div>
          <div style={{ fontWeight: 300, fontSize: 16, letterSpacing: "-0.02em", marginTop: 4, color: "rgba(0,0,0,0.7)" }}>
            {project.blurb}
          </div>
        </div>
        {project.img || project.thumb === "image" ?
        <img src={project.img || window.ASSET("searchneu", "assets/searchneu.png")} alt="" style={{ width: "100%", height: "auto", maxHeight: 260, objectFit: "contain" }} /> :

        <div className="placeholder-stripe" style={{
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: 12
        }}>
            [ {project.title} thumbnail ]
          </div>
        }
      </button>);

  }

  const active = hovered === project.id;
  return (
    <button
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      onClick={() => onOpen(project.id)}
      style={{
        position: "relative",
        textAlign: "left",
        background: "var(--paper)",
        border: `1px solid ${active ? "var(--hair)" : "transparent"}`,
        borderRadius: 16,

        width: "100%",
        cursor: "pointer",
        fontFamily: "inherit",
        color: active ? "var(--accent)" : "var(--ink)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: active ?
        "2px 2px 6px -1px var(--shadow-soft), 2px 2px 4px 0 var(--accent-shadow)" :
        "none",
        // Padding is CONSTANT in both states, so the text content box keeps the
        // exact same width and never reflows on hover. The indent/shift effect is
        // produced with translateX: shifted left (flush with the hero) when idle,
        // and back to 0 (indented inside the box) when active.
        padding: "clamp(13px,1.8vh,18px) 24px",
        transform: active ? "translateX(0)" : "translateX(-24px)",
        transition: "color .25s ease, box-shadow .35s ease, border-color .25s ease, transform .3s cubic-bezier(.22,.61,.36,1)"
      }}>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: "23px",
          letterSpacing: "-0.03em"
        }}>
          {project.title}
        </div>
        <div style={{
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "22px",
          letterSpacing: "-0.03em",
          marginTop: 3
        }}>
          {project.blurb}
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{
          width: 47,
          height: 47,
          borderRadius: 999,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: active ? "var(--accent)" : "transparent",
          border: active ? "none" : "1.5px solid rgba(0,0,0,0.2)",
          color: active ? "white" : "rgba(0,0,0,0.55)",
          transition: "background .3s ease, color .3s ease, border-color .3s ease, transform .35s cubic-bezier(.22,.61,.36,1)",
          // Non-hover: the whole card is shifted left 24px (translateX(-24px)),
          // which also pulls this arrow left. Counter it by +24px so the arrow
          // lines up with the column's right edge / the purple rule above.
          // Hover state stays exactly as before (translateX(2px)).
          transform: active ? "translateX(2px)" : "translateX(24px)"
        }}>
        
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>);

}

function FitColumn({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  // Scale down ONLY when the content truly can't fit the panel — and only after
  // webfonts have settled. Measuring with the fallback font (taller metrics)
  // was causing a brief shrink-then-restore flash on load; gating on fonts.ready
  // keeps the panel at its natural size (scale 1) unless it genuinely overflows.
  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;
    const measure = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) return;
      const panel = el.closest("[data-fit-panel]");
      if (!panel) return;
      const cs = getComputedStyle(panel);
      const avail = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const natural = el.scrollHeight; // unscaled (transform doesn't affect layout)
      // Guard against measuring before layout has settled (panel not yet at
      // full height) — a zero/tiny panel would wrongly compute scale < 1.
      if (avail < 80) return;
      // small tolerance so borderline cases don't toggle
      const s = natural > avail + 4 ? Math.max(0.6, avail / natural) : 1;
      setScale((prev) => Math.abs(prev - s) > 0.004 ? s : prev);
    };
    // Measure on the next frame(s) so layout + first paint have happened.
    const measureSoon = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    };
    // Defer the first fit decision until fonts are ready (avoids fallback-metric flicker).
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {if (!cancelled) measureSoon();});
    } else {
      setTimeout(measureSoon, 300);
    }
    // Re-measure once everything (images/layout) has fully loaded.
    window.addEventListener("load", measureSoon);
    window.addEventListener("resize", measure);
    // A ResizeObserver catches late layout changes (the same settle a manual
    // zoom toggle forces) so the initial scale is correct without user action.
    let ro = null;
    const el0 = ref.current;
    const panel0 = el0 && el0.closest("[data-fit-panel]");
    if (typeof ResizeObserver !== "undefined" && panel0) {
      ro = new ResizeObserver(measureSoon);
      ro.observe(panel0);
      ro.observe(el0);
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", measureSoon);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, []);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div
        ref={ref}
        style={{
          transformOrigin: "top left",
          transform: scale < 1 ? `scale(${scale})` : "none",
          width: scale < 1 ? `${(100 / scale).toFixed(3)}%` : "100%"
        }}>
        {children}
      </div>
    </div>);
}

function HomeDesktop({ onOpen, onNavigate }) {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(null);

  // Idle detection — emojis fade in after no project hover for N seconds
  const resetIdle = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 3500);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimer.current);
  }, [resetIdle]);

  useEffect(() => {
    if (hoveredProject) {
      setIdle(false);
      clearTimeout(idleTimer.current);
    } else {
      resetIdle();
    }
  }, [hoveredProject, resetIdle]);

  const showEmojis = idle && !hoveredProject;
  const showThumb = !!hoveredProject;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1.1fr 1fr"
    }}>
      
      <window.SiteNav onNavigate={onNavigate} current="work" overlay={true} />

      {/* LEFT — gradient panel for thumbnails / emojis */}
      <div data-left-panel="true" style={{
        position: "relative",
        background: "linear-gradient(180deg, rgb(255,255,255) 0%, rgb(226,226,226) 100%)",
        overflow: "hidden",
        height: "100vh"
      }}>
        {/* Project thumbnails (cross-fade) */}
        {window.PROJECTS.map((p) =>
        <ProjectThumb key={p.id} project={p} active={hoveredProject === p.id} />
        )}

        {/* Emojis (idle) */}
        <EmojiCloud visible={showEmojis && !showThumb} hoveredId={hoveredEmoji} onHover={setHoveredEmoji} />

        {/* Emoji caption card is rendered inside <EmojiCloud /> above */}

        {/* Idle hint — appears with the emojis */}
        <div style={{
          position: "absolute",
          left: 40,
          bottom: 30,
          fontSize: 13,
          color: "rgba(0,0,0,0.45)",
          letterSpacing: "-0.01em",
          opacity: showEmojis && hoveredEmoji === null ? 1 : 0,
          transition: "opacity .6s ease"
        }}>
          ↑ hover the emojis — these are a few things I'm into
        </div>
      </div>

      {/* RIGHT — content panel */}
      <div style={{
        position: "relative",
        background: "var(--paper)",
        borderLeft: "1px solid var(--hair)",
        padding: "clamp(88px, 11vh, 124px) clamp(36px, 5vw, 80px) clamp(20px, 3vh, 48px)",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Centered content region — footer is pinned to the panel bottom below it */}
        <div data-fit-panel="true" style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
        <FitColumn>
        <div style={{ maxWidth: 620 }}>
          {/* Hero */}
          <h1 style={{
                margin: 0,
                fontWeight: 300,
                fontSize: 28,

                letterSpacing: "-0.03em",
                color: "var(--ink)", lineHeight: "1.32", padding: "0px 0px 4px"
              }}>
            <span style={{ fontWeight: 700 }}>Serena Ng</span> is a product-obsessed designer who believes good design is never finished.
          </h1>

          <div style={{
                marginTop: "clamp(12px, 2.2vh, 22px)",
                fontWeight: 300,
                fontSize: 18,
                lineHeight: "28px",
                letterSpacing: "-0.02em",
                color: "rgba(0,0,0,0.78)"
              }}>
            <div>Currently patient experience @ <CompanyLink href="https://www.epic.com">Epic Systems</CompanyLink></div>
            <div>Formerly @ <CompanyLink href="https://www.ronik.com">Ronik Design Agency</CompanyLink>, <CompanyLink href="https://snyk.io">Snyk Cybersecurity</CompanyLink></div>
          </div>

          <div className="accent-rule" style={{ marginTop: "clamp(18px, 3.5vh, 36px)", margin: "34px 0px 0px" }} />

          {/* Project list */}
          <div style={{
                marginTop: "clamp(14px, 2.6vh, 28px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(11px, 2vh, 20px)"
              }}>
            {window.PROJECTS.map((p) =>
                <ProjectRow
                  key={p.id}
                  project={p}
                  hovered={hoveredProject}
                  onHover={setHoveredProject}
                  onOpen={onOpen} />

                )}
          </div>
        </div>

        {/* Footer pinned to the bottom of the panel */}
        </FitColumn>
        </div>
        <window.SiteFooter bare={true} noResume={true} />
      </div>
    </div>);
}

function HomeMobile({ onOpen, onNavigate }) {
  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: 60,
      display: "flex",
      flexDirection: "column",
      gap: 28
    }}>
      <window.SiteNav onNavigate={onNavigate} current="work" />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Hero */}
      <div style={{ marginTop: 4 }}>
        <h1 style={{
            margin: 0,
            fontWeight: 300,
            fontSize: 22,
            lineHeight: "30px",
            letterSpacing: "-0.03em"
          }}>
          <span style={{ fontWeight: 700 }}>Serena Ng</span> is a product-obsessed designer who believes good design is never finished.
        </h1>
        <div style={{
            marginTop: 16,
            fontWeight: 300,
            fontSize: 15,
            lineHeight: "23px",
            letterSpacing: "-0.02em",
            color: "rgba(0,0,0,0.78)"
          }}>
          <div>Currently patient experience @ <CompanyLink href="https://www.epic.com">Epic Systems</CompanyLink></div>
          <div>Formerly @ <CompanyLink href="https://www.ronik.com">Ronik Design Agency</CompanyLink>, <CompanyLink href="https://snyk.io">Snyk Cybersecurity</CompanyLink></div>
        </div>
        <div className="accent-rule" style={{ marginTop: 22 }} />
      </div>

      {/* Project cards (header + info + thumbnail below) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {window.PROJECTS.map((p) =>
          <ProjectRow key={p.id} project={p} onOpen={onOpen} isMobile={true} />
          )}
      </div>

      {/* About me — quick bits (replaces emoji hover on mobile) */}
      <div>
        <div style={{ fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 12 }}>
          Outside of work
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {window.EMOJIS.map((e, i) =>
            <div key={i} style={{
              background: "var(--paper)",
              border: "1px solid var(--hair)",
              borderRadius: 999,
              padding: "6px 12px 6px 8px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              letterSpacing: "-0.01em"
            }}>
              <span style={{ fontSize: 16 }}>{e.char}</span>
              <span>{e.title.split(",")[0]}</span>
            </div>
            )}
        </div>
      </div>
      </div>
      <window.SiteFooter />
    </div>);

}

function Home({ onOpen, onNavigate, isMobile }) {
  return isMobile ? <HomeMobile onOpen={onOpen} onNavigate={onNavigate} /> : <HomeDesktop onOpen={onOpen} onNavigate={onNavigate} />;
}

window.Home = Home;