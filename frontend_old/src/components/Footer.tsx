export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
          </div>
          <p className="text-dark-300 text-sm font-medium">
            Rakshak AI &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-dark-400 hover:text-foreground text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-dark-400 hover:text-foreground text-sm transition-colors">Terms of Service</a>
          <p className="text-dark-500 text-xs">API: http://localhost:8000</p>
        </div>
      </div>
    </footer>
  );
}
