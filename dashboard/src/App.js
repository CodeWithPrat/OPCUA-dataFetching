import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Activity, Zap } from 'lucide-react';
import HomePage from "./components/mainIndex/Homepage";
import MultipleGauges from "./components/spindle/Spindle";
import MultipleGaugesFD from "./components/feedDrive/FeedDrive";

function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 min-h-screen flex flex-col">
        <header className="bg-slate-900 shadow-lg">
          <nav className="container mx-auto px-4 py-6">
            <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-6">
              <NavItem to="/" icon={<Home />} text="Home" />
              <NavItem to="/spindle" icon={<Activity />} text="Spindle" />
              <NavItem to="/feed-drive" icon={<Zap />} text="Feed Drive" />
            </ul>
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
          <p>&copy; 2024 Central Manufacturing Technology Institute . All rights reserved.</p>
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