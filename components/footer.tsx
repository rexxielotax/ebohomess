import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.059 1.37-.059 4.04 0 2.67.01 2.987.059 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.976-.045 1.505-.207 1.858-.344.466-.182.8-.399 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.059-1.37.059-4.04 0-2.67-.01-2.987-.059-4.04-.045-.976-.207-1.505-.344-1.858a3.09 3.09 0 00-.748-1.15 3.09 3.09 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.059-4.04-.059zm0 4.594a5.604 5.604 0 110 11.208 5.604 5.604 0 010-11.208zM12 16a4 4 0 100-8 4 4 0 000 8zm5.884-8.803a1.31 1.31 0 11-2.62 0 1.31 1.31 0 012.62 0z"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#0A2E1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="EboHomes" className="h-9 w-auto" />
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Connecting landlords and tenants across Ebonyi State with trust
              and transparency.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-white/70 hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-white/70 hover:text-white transition-colors">
                <XIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">For Tenants</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/search" className="hover:text-white transition-colors">Search Properties</Link></li>
              <li><Link href="/dashboard/saved" className="hover:text-white transition-colors">Saved Properties</Link></li>
              <li><Link href="/dashboard/messages" className="hover:text-white transition-colors">Messages</Link></li>
              <li><Link href="/dashboard/applications" className="hover:text-white transition-colors">Rental Application</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">For Landlords</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/list-property" className="hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Landlord Dashboard</Link></li>
              <li><Link href="/dashboard/payments" className="hover:text-white transition-colors">Payments &amp; Earnings</Link></li>
              <li><Link href="/dashboard/verification" className="hover:text-white transition-colors">Verification Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/safety-tips" className="hover:text-white transition-colors">Safety Tips</Link></li>
              <li><Link href="/report-listing" className="hover:text-white transition-colors">Report a Listing</Link></li>
              <li><a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60 text-center sm:text-left">
            &copy; {new Date().getFullYear()} EboHomes. All rights reserved. Built with care for Ebonyi State communities.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}