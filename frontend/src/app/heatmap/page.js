'use client';

import { useState, useEffect } from 'react';

export default function HeatmapPage() {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/pages`);
        if (!res.ok) throw new Error('Failed to fetch pages');
        const data = await res.json();
        setPages(data);
      } catch (error) {
        console.error('Could not load pages:', error.message);
      }
    }
    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) {
      setClicks([]);
      return;
    }
    async function fetchClicks() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/heatmap?page_url=${encodeURIComponent(selectedPage)}`
        );
        if (!res.ok) throw new Error('Failed to fetch clicks');
        const data = await res.json();
        setClicks(data);
      } catch (error) {
        console.error('Could not load click data:', error.message);
      }
    }
    fetchClicks();
  }, [selectedPage]);

  return (
    <main className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-xl font-semibold tracking-tight mb-1 text-slate-900">Heatmap</h1>
      <p className="text-sm text-slate-500 mb-6">Select a page to see where visitors click</p>

      <select
        value={selectedPage}
        onChange={(e) => setSelectedPage(e.target.value)}
        className="border border-slate-300 rounded-md px-3 py-2 mb-6 w-full text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select a page</option>
        {pages.map((url) => (
          <option key={url} value={url}>{url}</option>
        ))}
      </select>

      {selectedPage && (
        <div className="relative border border-slate-200 rounded-lg bg-slate-50" style={{ width: '100%', height: '500px' }}>
          {clicks.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
              No clicks recorded for this page yet
            </p>
          ) : (
            clicks.map((click, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-indigo-500 rounded-full opacity-50"
                style={{ left: `${click.x}px`, top: `${click.y}px`, transform: 'translate(-50%, -50%)' }}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}
