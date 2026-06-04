// Project case study page — compact grouped sidebar + wide single-column content.

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// Which sidebar group each section belongs to (echoes the reference layout).
const SIDEBAR_GROUPS = [
{ label: "Summary", ids: ["summary", "background", "overview", "problem", "solution"] },
{ label: "Process", ids: ["research", "scope", "wireframes", "exploration", "feedback", "final", "reflection"] }];


// Large case-study figure: image (or placeholder) on a soft panel, caption below.
function CaseFigure({ src, caption, label, aspect = "16 / 10" }) {
  return (
    <figure style={{ margin: "22px 0 0" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: src ? undefined : aspect,
        borderRadius: 12,
        background: "var(--gray-50)",
        border: "1px solid var(--hair)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Image driven by `src` — swap the path in the data to set it. */}
        {src ?
        <img src={src} alt={caption || ""} style={{ width: "100%", height: "auto", display: "block" }} /> :
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11, letterSpacing: "0.04em", color: "rgba(0,0,0,0.4)",
          textTransform: "uppercase"
        }}>
            {label || "image"}
          </div>
        }
      </div>
      {caption &&
      <figcaption style={{
        marginTop: 10,
        fontSize: 13,
        fontWeight: 300,
        letterSpacing: "-0.01em",
        color: "rgba(0,0,0,0.5)"
      }}>
          {caption}
        </figcaption>
      }
    </figure>);

}

function CompactSidebar({ sections, activeId, onJump, onTop }) {
  // Build groups from the section list; anything ungrouped falls into "More".
  const groups = SIDEBAR_GROUPS.
  map((g) => ({ label: g.label, items: sections.filter((s) => g.ids.includes(s.id)) })).
  filter((g) => g.items.length);
  const grouped = new Set(groups.flatMap((g) => g.items.map((s) => s.id)));
  const leftovers = sections.filter((s) => !grouped.has(s.id));
  if (leftovers.length) groups.push({ label: groups.length ? "More" : "Contents", items: leftovers });

  return (
    <nav
      aria-label="Case study sections"
      style={{
        position: "sticky",
        top: 84,
        alignSelf: "flex-start",
        width: 150,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 18
      }}>
      {groups.map((g) =>
      <div key={g.label}>
          <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
          marginBottom: 8
        }}>
            {g.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {g.items.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onJump(s.id)}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  padding: "5px 0 5px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  lineHeight: "18px",
                  letterSpacing: "-0.01em",
                  color: isActive ? "var(--accent)" : "rgba(0,0,0,0.55)",
                  fontWeight: isActive ? 600 : 400,
                  transition: "color .2s ease"
                }}>
                  <span style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 2,
                  borderRadius: 2,
                  background: isActive ? "var(--accent)" : "transparent",
                  transition: "background .2s ease"
                }} />
                  {s.title}
                </button>);

          })}
          </div>
        </div>
      )}
      <button
        onClick={onTop}
        style={{
          background: "none", border: "none", padding: "2px 0 0 12px", textAlign: "left",
          cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.4)", marginTop: 4
        }}>
        ↑ Back to top
      </button>
    </nav>);

}

function MobileTimeline({ sections, activeId, onJump }) {
  // The main site-nav compacts on scroll (its height changes), so a fixed
  // sticky offset leaves a see-through gap. Measure the live nav height and
  // stick flush to it (1px overlap kills any sub-pixel gap while scrolling).
  const [navH, setNavH] = useStateP(48);
  useEffectP(() => {
    const measure = () => {
      const nav = document.querySelector(".site-nav");
      if (nav) setNavH(nav.offsetHeight);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("scroll", measure, { passive: true, capture: true });
    window.addEventListener("resize", measure);
    // Catch the compact-transition (height animates ~0.25s after scroll stops).
    const id = setInterval(measure, 200);
    return () => {
      window.removeEventListener("scroll", measure);
      document.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
      clearInterval(id);
    };
  }, []);
  return (
    <div style={{
      position: "sticky",
      top: Math.max(0, navH - 1),
      zIndex: 20,
      background: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--hair)",
      padding: "10px 16px",
      display: "flex",
      gap: 8,
      overflowX: "auto"
    }} className="no-scrollbar">
      {sections.map((s) => {
        const isActive = s.id === activeId;
        return (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            style={{
              border: "1px solid var(--hair)",
              background: isActive ? "var(--accent)" : "var(--paper)",
              color: isActive ? "white" : "rgba(0,0,0,0.7)",
              borderRadius: 999,
              padding: "5px 11px",
              fontSize: 12,
              letterSpacing: "-0.01em",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background .2s ease, color .2s ease"
            }}>
            {s.title}
          </button>);

      })}
    </div>);

}

// Per-section figures. Real assets get reused here as they're added.
// Per-section figure LAYOUT (count, aspect, placeholder label). The actual
// image `src` comes from each project's data (section.figures[i].src) — swap
// those paths in data.jsx. Leave src blank to show the labeled placeholder.
const SECTION_FIGURES = {
  summary: [{ label: "summary image", aspect: "16 / 10" }],
  research: [{ label: "research synthesis board", aspect: "16 / 9" }],
  wireframes: [
  { label: "low-fi wireframes — round 1", aspect: "16 / 9" },
  { label: "refined flow — round 4", aspect: "16 / 9" }],

  feedback: [{ label: "usability test highlights", aspect: "16 / 9" }],
  final: [{ label: "final shipped flow", aspect: "16 / 10" }]
};

function Section({ section, registerRef, projectId }) {
  // Merge layout placeholders with any per-project figure data (by index):
  // the data supplies src/caption, the layout supplies aspect/label/count.
  const layout = SECTION_FIGURES[section.id] || [];
  const provided = section.figures || [];
  const figures = layout.length ?
  layout.map((f, i) => Object.assign({}, f, provided[i] || {})) :
  provided;
  void projectId;
  return (
    <section
      id={section.id}
      ref={(el) => registerRef(section.id, el)}
      style={{
        scrollMarginTop: 70,
        padding: "44px 0",
        borderBottom: "1px solid var(--hair-soft)"
      }}>
      <div style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--accent)",
        marginBottom: 8
      }}>
        {section.eyebrow}
      </div>
      <h2 style={{
        margin: 0,
        fontWeight: 700,
        fontSize: 23,
        lineHeight: "29px",
        letterSpacing: "-0.03em"
      }}>
        {section.title}
      </h2>

      <div style={{ maxWidth: 680, marginTop: 14 }}>
        {section.body.map((p, i) =>
        <p key={i} style={{
          margin: i === 0 ? 0 : "13px 0 0",
          fontWeight: 300,
          fontSize: 15,
          lineHeight: "24px",
          letterSpacing: "-0.01em",
          color: "rgba(0,0,0,0.78)",
          textWrap: "pretty"
        }}>
            {p}
          </p>
        )}

        {section.callout &&
        <div style={{
          marginTop: 22,
          padding: "18px 20px",
          border: "1px solid var(--hair)",
          borderRadius: 14,
          background: "var(--gray-50)",
          display: "flex",
          gap: 18,
          alignItems: "center"
        }}>
            <div style={{
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "-0.04em",
            color: "var(--accent)",
            lineHeight: 1,
            flexShrink: 0
          }}>
              {section.callout.stat}
            </div>
            <div style={{
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "20px",
            letterSpacing: "-0.01em",
            color: "rgba(0,0,0,0.7)"
          }}>
              {section.callout.label}
            </div>
          </div>
        }
      </div>

      {/* Figures span the full content width (most of the page). */}
      {figures.map((f, i) =>
      <CaseFigure key={i} src={f.src} caption={f.caption} label={f.label} aspect={f.aspect} />
      )}
    </section>);

}

// Projects requiring a password before their case study is shown.
const PROTECTED_PROJECTS = { snyk: "pixels", epic: "pixels" };

// Intermediary password screen shown before a protected case study.
function PasswordGate({ project, onUnlock, onNavigate }) {
  const [value, setValue] = useStateP("");
  const [error, setError] = useStateP(false);
  const expected = PROTECTED_PROJECTS[project.id];

  const submit = (e) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === expected) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      <window.SiteNav onNavigate={onNavigate} current="work" activeProjectId={project.id} contentMaxWidth={1180} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
          {/* Lock mark */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 24px",
            display: "grid", placeItems: "center",
            background: "color-mix(in oklch, var(--accent) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--accent) 30%, transparent)"
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="var(--accent)" strokeWidth="1.7" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
            Protected project
          </div>
          <h1 style={{ margin: 0, fontWeight: 700, fontSize: 30, letterSpacing: "-0.03em" }}>
            {project.title}
          </h1>
          <p style={{ margin: "14px 0 0", fontWeight: 300, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.02em", color: "rgba(0,0,0,0.7)" }}>
            This case study is password protected.
          </p>

          <form onSubmit={submit} style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="field-input"
              type="password"
              autoFocus
              placeholder="Password"
              value={value}
              onChange={(e) => {setValue(e.target.value);setError(false);}}
              style={{ textAlign: "center" }} />
            {error &&
            <div style={{ fontSize: 13, letterSpacing: "-0.01em", color: "#C0392B" }}>
                That password isn't right — try again.
              </div>
            }
            <button className="pill-btn" type="submit" style={{ justifyContent: "center", marginTop: 4 }}>
              Unlock <span className="arr">→</span>
            </button>
          </form>

          <p style={{ margin: "28px 0 0", fontSize: 13, lineHeight: "20px", letterSpacing: "-0.01em", color: "rgba(0,0,0,0.55)" }}>
            Need the password? Email me at{" "}
            <a className="footer-link" href={"mailto:serena.ng.contact@gmail.com?subject=" + encodeURIComponent("Password for " + project.title + " case study")}>
              serena.ng.contact@gmail.com
            </a>
          </p>
        </div>
      </div>
      <window.SiteFooter />
    </div>);

}

function ProjectPage({ projectId, onBack, onOpen, onNavigate, isMobile }) {
  // Password gate for protected projects — unlock persists for the session.
  const isProtected = projectId in PROTECTED_PROJECTS;
  const [unlocked, setUnlocked] = useStateP(() =>
  typeof sessionStorage !== "undefined" && sessionStorage.getItem("unlocked:" + projectId) === "1");
  // Re-check unlock state whenever the project changes.
  useEffectP(() => {
    setUnlocked(typeof sessionStorage !== "undefined" && sessionStorage.getItem("unlocked:" + projectId) === "1");
  }, [projectId]);

  const gateProject = window.PROJECTS.find((p) => p.id === projectId) || window.PROJECTS[0];
  if (isProtected && !unlocked) {
    return (
      <PasswordGate
        project={gateProject}
        onNavigate={onNavigate}
        onUnlock={() => {
          try {sessionStorage.setItem("unlocked:" + projectId, "1");} catch (e) {}
          setUnlocked(true);
        }} />);

  }
  return <ProjectCaseStudy projectId={projectId} onBack={onBack} onOpen={onOpen} onNavigate={onNavigate} isMobile={isMobile} />;
}

function ProjectCaseStudy({ projectId, onBack, onOpen, onNavigate, isMobile }) {
  const data = window.PROJECT_PAGE[projectId] || window.PROJECT_PAGE.searchneu;
  const project = window.PROJECTS.find((p) => p.id === projectId) || window.PROJECTS[0];
  const [activeId, setActiveId] = useStateP(data.sections[0].id);
  const refs = useRefP({});
  const registerRef = (id, el) => {if (el) refs.current[id] = el;};

  // Scroll spy
  useEffectP(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = data.sections[0].id;
      for (const s of data.sections) {
        const el = refs.current[s.id];
        if (el && el.offsetTop <= y) current = s.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [projectId]);

  // Smooth scroll that works in this embedding (behavior:"smooth" is a no-op here).
  // Eases scrollTop via a short interval loop, writing to whichever scroller is live.
  const smoothScrollTo = (targetY) => {
    const scroller = document.scrollingElement || document.documentElement;
    const getY = () => window.scrollY || scroller && scroller.scrollTop || 0;
    const setY = (v) => {window.scrollTo(0, v);if (scroller) scroller.scrollTop = v;};
    const start = getY();
    const dist = targetY - start;
    if (Math.abs(dist) < 2) {setY(targetY);return;}
    const dur = 420;
    const clock = () => window.performance && performance.now ? performance.now() : Date.now();
    const t0 = clock();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const iv = setInterval(() => {
      const t = Math.min(1, (clock() - t0) / dur);
      setY(start + dist * ease(t));
      if (t >= 1) clearInterval(iv);
    }, 16);
  };

  const jump = (id) => {
    const el = refs.current[id];
    if (!el) return;
    setActiveId(id); // reflect selection immediately (programmatic scroll fires no scroll event)
    const scroller = document.scrollingElement || document.documentElement;
    const curY = window.scrollY || scroller && scroller.scrollTop || 0;
    smoothScrollTo(el.getBoundingClientRect().top + curY - 64);
  };
  const toTop = () => smoothScrollTo(0);

  // Next project
  const idx = window.PROJECTS.findIndex((p) => p.id === projectId);
  const next = window.PROJECTS[(idx + 1) % window.PROJECTS.length];

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* Consistent shared site nav (with hover dropdowns) */}
      <window.SiteNav onNavigate={onNavigate} current="work" activeProjectId={projectId} contentMaxWidth={1180} />

      {isMobile && <MobileTimeline sections={data.sections} activeId={activeId} onJump={jump} />}

      <div style={{
        display: "flex",
        gap: isMobile ? 0 : 44,
        maxWidth: 1180,
        margin: "0 auto",
        padding: isMobile ? "16px 20px 60px" : "84px 40px 80px"
      }}>
        {!isMobile && <CompactSidebar sections={data.sections} activeId={activeId} onJump={jump} onTop={toTop} />}

        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Hero */}
          <div style={{ paddingBottom: 32, borderBottom: "1px solid var(--hair-soft)" }}>
            <div style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              marginBottom: 12
            }}>
              CASE STUDY · {data.meta[2]?.value || ""}
            </div>
            <h1 style={{
              margin: 0,
              fontWeight: 700,
              fontSize: isMobile ? 28 : 38,
              lineHeight: 1.06,
              letterSpacing: "-0.04em"
            }}>
              {data.title}
            </h1>
            <p style={{
              margin: "14px 0 0",
              fontWeight: 300,
              fontSize: isMobile ? 16 : 17,
              lineHeight: "26px",
              letterSpacing: "-0.01em",
              color: "rgba(0,0,0,0.7)",
              maxWidth: 640,
              textWrap: "pretty"
            }}>
              {data.subtitle}
            </p>

            {/* Meta row */}
            <div style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, auto)",
              gap: isMobile ? 18 : 40,
              justifyContent: "start"
            }}>
              {data.meta.map((m) =>
              <div key={m.label}>
                  <div style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.42)",
                  marginBottom: 5
                }}>{m.label}</div>
                  <div style={{
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                  fontWeight: 500
                }}>{m.value}</div>
                </div>
              )}
            </div>

            {/* Cover — swap cover src per project in PROJECT_PAGE data (coverSrc). */}
            <CaseFigure src={data.coverSrc} caption="" />
          </div>

          {/* Sections */}
          {data.sections.map((s) =>
          <Section key={s.id} section={s} registerRef={registerRef} projectId={projectId} />
          )}

          {/* Next project */}
          <div style={{
            marginTop: 44,
            paddingTop: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap"
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.42)", marginBottom: 6 }}>
                Up next
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
                {next.title}
              </div>
              <div style={{ fontSize: 14, fontWeight: 300, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.62)", marginTop: 3 }}>
                {next.blurb}
              </div>
            </div>
            <button className="pill-btn" onClick={() => onOpen(next.id)}>
              View case <span className="arr">→</span>
            </button>
          </div>
        </main>
      </div>
      <window.SiteFooter />
    </div>);

}

window.ProjectPage = ProjectPage;
