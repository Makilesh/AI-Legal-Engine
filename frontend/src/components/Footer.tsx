import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/features')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blog')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <a href="#support" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">AI Chat</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Voice Support</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Multilingual</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2 text-white">Contact</h4>
              <a href="mailto:support@aichat.com" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-5 h-5" />
                support@aichat.com
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} AI Chat Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};