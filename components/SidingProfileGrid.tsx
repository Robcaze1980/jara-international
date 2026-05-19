import Image from 'next/image';
import type { Product, ProductProfile } from '@/data/products';

/**
 * 4-profile grid for the Siding product page. Renders product.profiles as a
 * responsive card grid — 2 columns on tablet, 4 on desktop. Each card has:
 *   - English profile name (H3)
 *   - Spanish proprietary name underneath
 *   - Positioning one-liner
 *   - Optional close-up image (only Machihembrado has one; others go
 *     text-only by design to keep the card grid balanced visually)
 *   - Description paragraph
 *   - Dimensions strip
 *   - Optional differentiator badge ("No HardiePlank equivalent")
 *   - Anchor id for deep-link from variant table or external citation
 *
 * Returns null if product.profiles is empty — keeps the section optional
 * and non-blocking for single-profile products.
 */

export function SidingProfileGrid({ product }: { product: Product }) {
  if (!product.profiles || product.profiles.length === 0) return null;

  return (
    <section
      aria-labelledby="profile-grid-heading"
      className="rounded-lg bg-white border border-bluegray/40 p-6 lg:p-10"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          The four profiles
        </p>
        <h2
          id="profile-grid-heading"
          className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl text-balance"
        >
          Choose the profile that matches your architectural language
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink/80">
          Four distinct edge profiles across the same fiber-cement substrate —
          from the everyday Lap to the historic-restoration Victorian to the
          accent-detail Slat. Specify the profile by project need; specify the
          finish by project palette.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {product.profiles.map((profile) => (
          <ProfileCard key={profile.anchor} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function ProfileCard({ profile }: { profile: ProductProfile }) {
  return (
    <article
      id={profile.anchor}
      className="flex flex-col rounded-lg border border-bluegray/40 bg-bg-soft overflow-hidden scroll-mt-24"
    >
      {profile.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
          <Image
            src={profile.image}
            alt={`Plycem Siding ${profile.name} (${profile.spanishName}) profile close-up — fiber-cement plank with ${profile.name.toLowerCase()} edge geometry`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-navy">
              {profile.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wider text-steel">
              {profile.spanishName}
            </p>
          </div>
          {profile.badge && (
            <span className="shrink-0 rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {profile.badge}
            </span>
          )}
        </div>

        <p className="mt-2 font-display text-sm font-semibold text-navy/80">
          {profile.positioning}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          {profile.description}
        </p>

        <p className="mt-auto pt-4 text-xs leading-relaxed text-ink/60 border-t border-bluegray/30">
          <span className="font-semibold uppercase tracking-wider text-steel">Dimensions: </span>
          {profile.dimensions}
        </p>
      </div>
    </article>
  );
}
