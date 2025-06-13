import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';
import { MessageSquare, Menu, X, LogOut } from 'lucide-react';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useChatContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">AI Chat Assistant</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/features')} 
              className={`transition-colors ${isActive('/features') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Features
            </button>
            <button 
              onClick={() => navigate('/about')} 
              className={`transition-colors ${isActive('/about') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              About
            </button>
            <button 
              onClick={() => navigate('/blog')} 
              className={`transition-colors ${isActive('/blog') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              Blog
            </button>
            <a href="/#support" className="text-gray-300 hover:text-white transition-colors">Support</a>
            {state.user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {state.user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline text-white">{state.user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 shadow-xl border border-gray-700 py-2 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm border-b border-gray-700">
                    <div className="font-medium text-white">{state.user.username}</div>
                    <div className="text-xs text-gray-400">{state.user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 text-white"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  navigate('/features');
                  setIsMenuOpen(false);
                }}
                className={`text-left transition-colors ${isActive('/features') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Features
              </button>
              <button 
                onClick={() => {
                  navigate('/about');
                  setIsMenuOpen(false);
                }}
                className={`text-left transition-colors ${isActive('/about') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                About
              </button>
              <button 
                onClick={() => {
                  navigate('/blog');
                  setIsMenuOpen(false);
                }}
                className={`text-left transition-colors ${isActive('/blog') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
              >
                Blog
              </button>
              <a 
                href="/#support" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Support
              </a>
              {!state.user && (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 text-white"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};