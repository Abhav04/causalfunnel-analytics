'use client';

import { useState } from 'react';
import SessionJourney from './SessionJourney';

export default function SessionList({ sessions }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  if (sessions.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center">
        <p className="text-sm text-slate-500">No sessions yet. Visit the demo page to generate some.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isSelected = selectedSessionId === session.session_id;
        return (
          <div key={session.session_id} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setSelectedSessionId(isSelected ? null : session.session_id)}
              className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 bg-white text-slate-900"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs text-slate-500 truncate">{session.session_id || 'null-session'}</div>
                <div className="text-sm mt-1" suppressHydrationWarning={true}>
                  <span className="font-medium">{session.event_count}</span>
                  <span className="text-slate-500"> events &middot; last seen </span>
                  <span className="text-slate-500">
                    {new Date(session.last_seen).toLocaleString('en-GB', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>
              </div>
              <span className="text-slate-400 text-sm shrink-0">{isSelected ? '−' : '+'}</span>
            </button>
            {isSelected && <SessionJourney sessionId={session.session_id} />}
          </div>
        );
      })}
    </div>
  );
}
