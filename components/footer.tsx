import { MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="relative border-t border-border mt-12"
      style={{
        backgroundImage: "url('/footer-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">EboHomes</h3>
              <p className="text-sm text-white/70">
                Connecting landlords and tenants across Ebonyi State with trust and transparency.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-4">
                <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="#" aria-label="TikTok" className="text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
                </a>
                <a href="#" aria-label="X (Twitter)" className="text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@ebohomes.com" className="text-white/70 hover:text-white">
                    support@ebohomes.com
                  </a>
                </li>
                <li>
                  <a href="tel:+2348012345678" className="text-white/70 hover:text-white">
                    +234 801 234 5678
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white flex items-center gap-2">
                    <MessageSquare size={16} />
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/70 hover:text-white">Safety Tips</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Report a Listing</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; 2026 EboHomes. All rights reserved.</p>
            <p>Built with care for Ebonyi State communities.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}