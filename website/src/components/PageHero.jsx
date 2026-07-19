export default function PageHero({
  eyebrow,
  title,
  lede,
  children,
  rightContent,
}) {
  return (
    <section className="page-hero">
      <div
        className={`container page-hero-inner ${
          rightContent ? "has-right" : ""
        }`}
      >
        <div className="page-hero-content">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}

          <h1>{title}</h1>

          {lede && <p className="lede">{lede}</p>}

          {children}
        </div>

        {rightContent && <div className="page-hero-right">{rightContent}</div>}
      </div>

      <style>{`
        .page-hero {
          padding: 72px 0 56px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-soft);
        }

        .page-hero-inner {
          display: flex;
          flex-direction: column;
        }

        .page-hero-inner.has-right {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 460px;
          gap: 64px;
          align-items: center;
        }

        .page-hero-content h1 {
          font-size: clamp(32px, 4.5vw, 46px);
          max-width: 16ch;
        }

        .page-hero-content .lede {
          max-width: 62ch;
        }

        .page-hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 900px) {
          .page-hero-inner.has-right {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .page-hero-right {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}
