import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useRecipeFilters } from '../features/recipes/store';

export default function MainLayout() {
  const { showFavorites, setShowFavorites } = useRecipeFilters();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleFavorites = () => {
    if (location.pathname !== '/') navigate('/');
    setShowFavorites(!showFavorites);
    setMobileOpen(false);
  };

  const go = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cartoon-yellow via-cartoon-orange to-cartoon-pink paper-texture">
      <header className="bg-white shadow-cartoon border-b-4 border-cartoon-blue border-hand-drawn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-4xl font-cartoon font-bold text-gray-900 text-hand flex items-center">
              <span className="text-5xl mr-3 animate-float">🍽️</span>
              Eat Day
            </Link>
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={handleFavorites}
                className={`px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon transition-all duration-300 hover:scale-105 ${showFavorites ? 'bg-cartoon-red text-white' : 'bg-cartoon-purple text-white hover:bg-purple-600'}`}
              >
                <span className="mr-2">{showFavorites ? '📋' : '❤️'}</span>
                {showFavorites ? 'Toutes' : 'Favoris'}
              </button>
              <button
                onClick={() => go('/random')}
                className="px-4 py-2 bg-cartoon-gray text-white rounded-hand hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon"
              >
                <span className="mr-2">🎲</span>
                Random
              </button>
              <button
                onClick={() => go('/calendar')}
                className="px-4 py-2 bg-cartoon-blue text-white rounded-hand hover:bg-blue-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon"
              >
                <span className="mr-2">📅</span>
                Calendar
              </button>
              <button
                onClick={() => go('/add')}
                className="px-4 py-2 bg-cartoon-green text-white rounded-hand hover:bg-green-600 transition-all duration-300 hover:scale-105 shadow-hand-drawn border-2 border-white font-cartoon"
              >
                <span className="mr-2">➕</span>
                Ajouter
              </button>
            </nav>
            <button
              className="md:hidden px-4 py-2 bg-cartoon-purple text-white rounded-hand shadow-hand-drawn border-2 border-white font-cartoon"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✖️' : '☰'}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <button
              onClick={handleFavorites}
              className={`w-full px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon text-left ${showFavorites ? 'bg-cartoon-red text-white' : 'bg-cartoon-purple text-white'}`}
            >
              {showFavorites ? '📋 Toutes' : '❤️ Favoris'}
            </button>
            <button
              onClick={() => go('/random')}
              className="w-full px-4 py-2 bg-cartoon-gray text-white rounded-hand shadow-hand-drawn border-2 border-white font-cartoon text-left"
            >
              🎲 Random
            </button>
            <button
              onClick={() => go('/calendar')}
              className="w-full px-4 py-2 bg-cartoon-blue text-white rounded-hand shadow-hand-drawn border-2 border-white font-cartoon text-left"
            >
              📅 Calendar
            </button>
            <button
              onClick={() => go('/add')}
              className="w-full px-4 py-2 bg-cartoon-green text-white rounded-hand shadow-hand-drawn border-2 border-white font-cartoon text-left"
            >
              ➕ Ajouter
            </button>
          </div>
        )}
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
