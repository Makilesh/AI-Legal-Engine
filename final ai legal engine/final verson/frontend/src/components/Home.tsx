import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../context/ChatContext';
import { Footer } from './Footer';
import { 
  MessageSquare, 
  ArrowRight, 
  LogOut, 
  Menu, 
  X, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Send
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useChatContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  const handleGetStarted = () => {
    if (state.user) {
      navigate('/chat');
    } else {
      navigate('/login');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', email: '', message: '' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Top Navigation */}
      <nav className="fixed w-full bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">AI Chat Assistant</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/features')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => navigate('/about')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => navigate('/blog')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Blog
              </button>
              <a href="#support" className="text-gray-300 hover:text-white transition-colors">Support</a>
              {state.user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {state.user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden md:inline">{state.user.username}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 shadow-xl border border-gray-700 py-2 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm border-b border-gray-700">
                      <div className="font-medium">{state.user.username}</div>
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
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
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
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    navigate('/about');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => {
                    navigate('/blog');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </button>
                <a 
                  href="#support" 
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
                      className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
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

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Your AI-Powered Conversation Partner
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Experience natural conversations with our advanced AI assistant. Get instant responses, 
            multilingual support, and voice interactions all in one place.
          </p>
          
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/features')}
            className="bg-gray-800/50 p-4 rounded-xl text-center hover:bg-gray-700/50 transition-colors"
          >
            Chatbot Features
          </button>
          <button 
            onClick={() => navigate('/about')}
            className="bg-gray-800/50 p-4 rounded-xl text-center hover:bg-gray-700/50 transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => navigate('/blog')}
            className="bg-gray-800/50 p-4 rounded-xl text-center hover:bg-gray-700/50 transition-colors"
          >
            Blog
          </button>
          <a 
            href="#support" 
            className="bg-gray-800/50 p-4 rounded-xl text-center hover:bg-gray-700/50 transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Natural Conversations</h3>
            <p className="text-gray-400 text-center">
              Engage in fluid, context-aware conversations with our AI assistant.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Multilingual Support</h3>
            <p className="text-gray-400 text-center">
              Communicate in multiple languages with seamless translation.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Voice Interaction</h3>
            <p className="text-gray-400 text-center">
              Speak naturally with voice input and text-to-speech output.
            </p>
          </div>
        </div>

        {/* Contact Support Section */}
        <section id="support" className="mt-24 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Support</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Direct Support</h3>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-5 h-5" />
                    <a href="mailto:support@aichat.com" className="hover:text-white transition-colors">
                      support@aichat.com
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Live Chat Support</h3>
                  <p className="text-gray-300 mb-4">
                    Our support team is available 24/7 to assist you with any questions or concerns.
                  </p>
                  <button
                    onClick={handleGetStarted}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};