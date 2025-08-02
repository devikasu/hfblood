import React, { useEffect, useState } from "react";

export default function App() {
  const [medusaActive, setMedusaActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [heraCursed, setHeraCursed] = useState(false);

  // 👁️ Medusa triggers randomly
  useEffect(() => {
    const medusaTimer = setTimeout(() => {
      setMedusaActive(true);
      let t = 3;
      const interval = setInterval(() => {
        t--;
        setCountdown(t);
        if (t <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }, Math.random() * 15000 + 5000); // trigger in 5–20 sec

    return () => clearTimeout(medusaTimer);
  }, []);

  // 👑 Hera: trigger on rage interaction
  useEffect(() => {
    let clickCount = 0;
    let lastClickTime = 0;

    const onClick = () => {
      const now = Date.now();
      if (now - lastClickTime < 500) clickCount++;
      else clickCount = 1;
      lastClickTime = now;

      if (clickCount >= 5) {
        setHeraCursed(true);
        setTimeout(() => setHeraCursed(false), 5000);
      }
    };

    const onScroll = () => {
      if (Math.random() < 0.2) setHeraCursed(true);
      setTimeout(() => setHeraCursed(false), 4000);
    };

    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`min-h-screen text-white p-6 transition-all duration-300 ease-in-out ${
        heraCursed ? "invert rotate-1" : ""
      } bg-gradient-to-br from-orange-800 to-yellow-600`}
    >
      {/* ⛺ Camp Half-Blood Welcome */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold tracking-widest">🏛️ THE HALF-BLOOD HUB</h1>
        <p className="mt-4 text-lg italic">A safe haven for the dangerously divine</p>
      </div>

      {/* 🐍 Medusa Curse Popup */}
      {medusaActive && countdown > 0 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl text-center border border-green-500">
            <h2 className="text-2xl font-bold mb-2">Medusa is watching…</h2>
            <p>Look away in {countdown}...</p>
          </div>
        </div>
      )}

      {/* 🗿 Medusa Stone Screen */}
      {medusaActive && countdown <= 0 && (
        <div className="fixed inset-0 bg-gray-800 text-white z-50 flex items-center justify-center text-center p-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">🗿 You have been turned to stone!</h2>
            <p className="text-xl">
              Chant <span className="font-mono text-yellow-300">"Reloadus Tabulus"</span> and press <kbd className="bg-white text-black px-2 py-1 rounded">Ctrl + R</kbd> to beg Athena for mercy.
            </p>
          </div>
        </div>
      )}

      {/* 👑 Hera Curse Popup */}
      {heraCursed && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-4 py-2 rounded shadow-lg z-50">
          ⚡ You’ve angered Hera. The UI is cursed!
        </div>
      )}
    </div>
  );
}
