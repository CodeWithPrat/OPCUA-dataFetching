import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Activity, Zap } from 'lucide-react';
import HomePage from "./components/mainIndex/Homepage";
import MultipleGauges from "./components/spindle/Spindle";
import MultipleGaugesFD from "./components/feedDrive/FeedDrive";

// DateTimeDisplay Component
function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      setCurrentDateTime({ date, time });
    };

    updateTime(); // Initial call to set the date and time immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="text-white text-center sm:text-right">
      <p>{currentDateTime.date}</p>
      <p>{currentDateTime.time}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen flex flex-col">
        <header className="bg-slate-900 shadow-lg">
          <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
            <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-6">
              <NavItem to="/" icon={<Home />} text="Home" />
              <NavItem to="/spindle" icon={<Activity />} text="Spindle" />
              <NavItem to="/feed-drive" icon={<Zap />} text="Feed Drive" />
            </ul>
            {/* Right side date and time display */}
            <DateTimeDisplay />
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spindle" element={<MultipleGauges />} />
            <Route path="/feed-drive" element={<MultipleGaugesFD />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white text-center py-4">
          <p>&copy; 2024 Central Manufacturing Technology Institute. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, text }) {
  return (
    <li>
      <Link 
        to={to} 
        className="flex items-center space-x-2 px-4 py-2 rounded-full text-white hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
}

export default App;
