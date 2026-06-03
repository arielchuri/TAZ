// Modal for reaching out to a poster on the Give & Take board.
// Collects sender name (required), email (required), and an optional message.
// Mockup only — no email is actually sent. Shows a confirmation on submit.

import { useEffect, useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';

// onSent(id) is called after a successful submit so BoardPage can mark the entry pending.
export default function ConnectModal({ entry, type, onClose, onSent }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function submit() {
    if (!name.trim()) { setError('PLEASE ENTER YOUR NAME.'); return; }
    if (!email.trim() || !/.+@.+\..+/.test(email.trim())) {
      setError('PLEASE ENTER A VALID EMAIL.');
      return;
    }
    setError('');
    await fetch('/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entry.id, type }),
    });
    onSent(entry.id);
    setDone(true);
  }

  const label = type === 'skill' ? 'SKILL ON OFFER' : 'NEED REQUESTED';
  const accent = type === 'skill' ? '#a3e635' : '#22d3ee';

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
      onClick={onClose}
    >
      <Card
        className='w-full max-w-lg p-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='mb-5 flex items-start justify-between gap-4'>
          <h2 className='text-2xl font-extrabold uppercase tracking-tight'>
            {done ? 'Message Sent!' : 'Get Connected'}
          </h2>
          <Button size='sm' onClick={onClose} aria-label='Close'>✕</Button>
        </div>

        {/* Listing summary */}
        <div className='mb-6 flex flex-wrap items-center gap-2'>
          <Badge style={{ backgroundColor: accent, borderColor: '#000' }}>{label}</Badge>
          {entry.category && <Badge>{entry.category}</Badge>}
          <Badge>{entry.item}</Badge>
        </div>

        {done ? (
          // Confirmation state
          <div className='space-y-4 text-center'>
            <div className='text-6xl'>✓</div>
            <p className='font-bold uppercase tracking-wide'>
              Your message is on its way to {entry.email}.
            </p>
            <Button variant='inverse' onClick={onClose} className='w-full'>
              Back to board
            </Button>
          </div>
        ) : (
          // Form state
          <div className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-bold uppercase tracking-widest text-neutral-600'>
                Your name <span className='text-red-600'>*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-bold uppercase tracking-widest text-neutral-600'>
                Your email <span className='text-red-600'>*</span>
              </label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='so they can reply to you'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-bold uppercase tracking-widest text-neutral-600'>
                Message <span className='text-neutral-400'>(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Say something...'
                rows={3}
                className='w-full border-2 border-black bg-white px-3 py-2 text-base text-black placeholder:text-neutral-500 focus:outline-none focus:shadow-[4px_4px_0_0_#000]'
              />
            </div>

            {error && (
              <p className='border-2 border-black bg-neutral-100 p-2 text-sm font-bold'>
                {error}
              </p>
            )}

            <div className='flex gap-3 pt-1'>
              <Button onClick={onClose} className='flex-1'>Cancel</Button>
              <Button variant='inverse' onClick={submit} className='flex-1'>
                Send Message
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
