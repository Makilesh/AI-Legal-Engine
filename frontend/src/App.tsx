import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ChatInterface } from './components/ChatInterface';
import { Home } from './components/Home';
import { Features } from './components/Features';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Navigation } from './components/Navigation';

import { useChatContext } from './context/ChatContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useChatContext();
  return state.user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatInterface />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          
        </div>
      </ChatProvider>
    </Router>
  );
}

export default App;