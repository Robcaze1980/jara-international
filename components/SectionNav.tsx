'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * SectionNav — per ADR-034 (Round 10 A1, 5-0 unanimous).
 *
 * Ports the v0 site's `components/section-nav.tsx` (legacy v0 dossier K-1) with:
 *   - JARA token restyle (orange → {colors.steel} active + {colors.navy} text)
 *   - F2.R10 Safari fixes (3/5 voter convergent):
 *     * Explicit observer.disconnect() on unmount (Gemini)
 *     * Safari <16.4 negative-rootMargin graceful degradation (GLM) —
 *       if no section fires "active" within 1.5s of mount we fall back to
 *       marking the first section active so the rail never looks broken
 *     * Safari 17+ off-by-one with percentage rootMargin under sticky
 *       positioning (DeepSeek) — accepted as cosmetic since the fallback
 *       above catches the worst case
 *
 * Usage:
 *   <SectionNav sections={[{ id: 'foo', label: 'Foo' }, ...]} />
 *
 * Each section in the page MUST have a matching `id="..."` on its container
 * AND apply `scroll-mt-20` (Tailwind) so the smooth-scroll offset matches the
 * sticky-header allowance.
 *
 * Composition pattern from v0: sidebar (desktop) + horizontal scrolling pills
 * (mobile). Sticky sidebar follows the user; mobile pills auto-center the
 * active section into view.
 */

export type SectionItem = {
  id: string;
  label: string;
};

interface SectionNavProps {
  sections: SectionItem[];
  /** ARIA label for both the desktop sidebar nav and the mobile pill row. */
  ariaLabel?: string;
}

const SCROLL_OFFSET_PX = 80;
const FALLBACK_TIMEOUT_MS = 1500;

export function SectionNav({ sections, ariaLabel = 'Page sections' }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const pendingIdRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const observerFiredRef = useRef(false);

  const scheduleUpdate = useCallback((id: string) => {
    pendingIdRef.current = id;
    observerFiredRef.current = true;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingIdRef.current) {
        setActiveId(pendingIdRef.current);
        pendingIdRef.current = null;
      }
    });
  }, []);

  // Scroll-spy observer + Safari <16.4 fallback timer
  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            scheduleUpdate(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach((el) => observer.observe(el));

    // F2.R10 GLM fallback: Safari <16.4 silently ignores negative rootMargin.
    // If the observer hasn't fired within 1.5s, we know we're on a broken
    // implementation; lock activeId to the first section so the rail still
    // reads as a navigation aid rather than appearing inert.
    const fallbackTimer = window.setTimeout(() => {
      if (!observerFiredRef.current && sections[0]) {
        setActiveId(sections[0].id);
      }
    }, FALLBACK_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [sections, scheduleUpdate]);

  // Hash-link landing (deep link to /foo#bar scrolls smoothly after layout settles)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(t);
  }, []);

  // Auto-center the active mobile pill so the user can always see the current section
  useEffect(() => {
    if (!mobileNavRef.current || !activeId) return;
    const activeBtn = mobileNavRef.current.querySelector<HTMLElement>(
      `[data-section="${activeId}"]`
    );
    activeBtn?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [activeId]);

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <nav
          className="sticky top-20 w-56 rounded-lg bg-bg-soft p-4"
          aria-label={ariaLabel}
        >
          <ul className="flex flex-col gap-0.5">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(section.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel ${
                      isActive
                        ? 'border-l-[3px] border-steel bg-white pl-[9px] font-semibold text-navy'
                        : 'text-ink/75 hover:bg-white hover:text-navy'
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile horizontal scrolling pill row (sticky under header) */}
      <div
        ref={mobileNavRef}
        className="sticky top-16 z-30 -mx-6 overflow-x-auto border-b border-bluegray/40 bg-white px-6 py-2 lg:hidden"
        role="navigation"
        aria-label={ariaLabel}
      >
        <div className="flex gap-2">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                data-section={section.id}
                onClick={() => handleClick(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel ${
                  isActive
                    ? 'bg-steel text-white'
                    : 'bg-bg-soft text-ink/75 hover:bg-bluegray/40 hover:text-navy'
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
