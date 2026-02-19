'use client';

import Header from '@/components/Header';
import PrivacyNotice from '@/components/PrivacyNotice';
import Wizard from '@/components/Wizard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <PrivacyNotice />
        <Wizard />
      </main>
    </div>
  );
}
