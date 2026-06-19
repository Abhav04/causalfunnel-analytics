'use client';

import { useState, useEffect } from 'react';

export default function SessionJourney({ sessionId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/events`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Could not load session events:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [sessionId]);

  if (loading) {
    return <p className="px-4 pb-4 text-sm text-slate-400 bg-slate-50">Loading...</p>;
  }

  return (
    <ul className="border-t border-slate-200 px-4 py-3 space-y-2 bg-slate-50">
      {events.map((event, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-slate-800">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              event.event_type === 'click' ? 'bg-indigo-500' : 'bg-slate-400'
            }`}
          />
          <span className="font-medium">{event.event_type}</span>
          <span className="text-slate-400" suppressHydrationWarning={true}>
            {new Date(event.timestamp).toLocaleTimeString('en-GB', { timeStyle: 'medium' })}
          </span>
          {event.event_type === 'click' && (
            <span className="text-slate-400">at ({event.x}, {event.y})</span>
          )}
        </li>
      ))}
    </ul>
  );
}
