import './globals.css';

export const metadata = {
  title: 'CausalFunnel Analytics',
  description: 'User analytics dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <nav className="border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-8 py-4 flex items-center gap-6">
            <span className="font-semibold tracking-tight text-slate-900">CausalFunnel</span>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900">Sessions</a>
            <a href="/heatmap" className="text-sm text-slate-600 hover:text-slate-900">Heatmap</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
