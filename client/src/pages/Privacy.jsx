import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AGENT_NAME, BROKERAGE_NAME, CONTACT_EMAIL, CURRENT_YEAR } from '../constants/compliance';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 pb-24 md:pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-tag mb-4 block">legal</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink mb-2">Privacy Policy</h1>
          <p className="text-ink4 font-sans text-sm mb-12">Last updated: May 2025</p>
        </motion.div>

        <div className="prose-like space-y-10 text-sm font-sans text-ink2 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Who collects your information</h2>
            <p>{AGENT_NAME}, Salesperson, {BROKERAGE_NAME} ("PropertyLens", "we", "us"). Any personal information submitted through this platform is collected by {AGENT_NAME} in their capacity as a licensed Ontario realtor.</p>
            {/* TODO: MAHESH TO PROVIDE brokerage address */}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">What we collect</h2>
            <ul className="space-y-2">
              {[
                'Name, email address, and phone number (when provided)',
                'Search queries and property interests',
                'Saved properties and searches',
                'Communication history (chat logs submitted with leads)',
                'Session data (pages visited, device type) — anonymised',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green mt-1">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">How we use it</h2>
            <ul className="space-y-2">
              {[
                'To respond to your inquiry or showing request',
                'To send listing alerts you have explicitly opted into',
                'To improve search relevance and user experience',
                'We do not send unsolicited marketing emails',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green mt-1">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">PIPEDA compliance</h2>
            <p>We collect, use, and disclose personal information in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA). You have the right to access, correct, or request deletion of your personal information at any time.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Data retention</h2>
            <p>Personal information is retained for up to 2 years from your last interaction, or until you request deletion, whichever comes first. Anonymised analytics data may be retained indefinitely.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Third-party services</h2>
            <p className="mb-3">We use the following third-party services, each governed by their own privacy policy:</p>
            <ul className="space-y-1">
              {['Supabase (database)', 'Anthropic Claude (AI processing)', 'Repliers.io (MLS data)', 'Mapbox (mapping)', 'Resend (email delivery)'].map(s => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-ink4 mt-1">—</span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3">We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Cookies</h2>
            <p>We use session cookies only — no persistent tracking, no advertising cookies. We do not use Google Analytics or any ad-network trackers.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink mb-3">Request deletion</h2>
            <p>Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-green underline">{CONTACT_EMAIL}</a> with subject "Delete my data". We will confirm deletion within 30 days.</p>
          </section>

          <div className="bg-cream2 rounded-xl p-5 text-[11px] text-ink4">
            <p>© {CURRENT_YEAR} PropertyLens · {AGENT_NAME}, {BROKERAGE_NAME}</p>
            <p className="mt-1">Governing law: Province of Ontario, Canada</p>
            <p className="mt-1">
              <Link to="/terms" className="underline">Terms of Use</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
