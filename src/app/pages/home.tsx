import { SiteHeader } from '../components/site-header'
import { Hero } from '../components/hero'
import { CollectionGrid } from '../components/collection-grid'
import { FeaturedModel } from '../components/featured-model'
import { EditorialSection } from '../components/editorial-section'
import { CtaContact } from '../components/cta-contact'
import { SiteFooter } from '../components/site-footer'

export function Home() {
  return (
    <div className="min-h-screen bg-white text-[var(--ds-black)]">
      <SiteHeader />
      <main>
        <Hero />
        <CollectionGrid />
        <FeaturedModel />
        <EditorialSection />
        <CtaContact />
      </main>
      <SiteFooter />
    </div>
  )
}
