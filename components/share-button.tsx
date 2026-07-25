'use client'
import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, Link2, X } from 'lucide-react'

export function ShareButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined'
    ? window.location.origin + '/listing/' + listingId
    : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.preventDefault(); setOpen(true) }}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <Share2 size={14} /> Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Share this property</h3>
              <button onClick={() => setOpen(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <a href={'https://wa.me/?text=' + encodeURIComponent(url)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center"><MessageCircle size={20} className="text-white" /></div>
                <span className="text-[10px] text-muted-foreground">WhatsApp</span>
              </a>
              <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center"><Link2 size={20} className="text-white" /></div>
                <span className="text-[10px] text-muted-foreground">Facebook</span>
              </a>
              <a href={'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center"><Share2 size={20} className="text-white" /></div>
                <span className="text-[10px] text-muted-foreground">Twitter</span>
              </a>
            </div>

            <div className="flex items-center gap-2 bg-secondary rounded-lg p-2">
              <input readOnly value={url} className="flex-1 bg-transparent text-xs text-foreground outline-none truncate" />
              <button
                onClick={handleCopy}
                className={copied ? 'flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground' : 'flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-card border border-border text-foreground'}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}