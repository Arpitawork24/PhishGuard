import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { MessageAnalyzer } from './pages/MessageAnalyzer';
import { URLScanner } from './pages/URLScanner';
import { IPInfo } from './pages/IPInfo';
import { Dashboard } from './pages/Dashboard';
import { SettingsModal } from './components/common/SettingsModal';
import { ThemeTransitionEffect } from './components/common/ThemeTransitionEffect';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'home':
        return <Home onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'message':
        return <MessageAnalyzer />;
      case 'url':
        return <URLScanner />;
      case 'ip':
        return <IPInfo />;
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      default:
        return <Home onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <ThemeProvider>
      {/* Cool Interactive Cyber Shockwave & Telemetry Theme Transition */}
      <ThemeTransitionEffect />

      <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-200">
        {/* Top Floating Navigation */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Main Content Area with Smooth Page Transitions */}
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="w-full"
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Platform Settings / Engine Info Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
