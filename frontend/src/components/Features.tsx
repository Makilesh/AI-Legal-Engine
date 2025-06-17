import React from 'react';
import { MessageSquare, Globe, Mic, Bot, Lock, Zap, Brain, Sparkles, Clock } from 'lucide-react';
import { Footer } from './Footer';
export const Features: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Language Processing",
      description: "Advanced AI that understands context and nuance in conversations, providing human-like responses."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Communicate in multiple languages including English, Tamil, Hindi, Telugu, and Kannada."
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Interaction",
      description: "Seamless voice input and text-to-speech output for natural conversations."
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "24/7 Availability",
      description: "Always available to assist you, providing instant responses at any time."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Conversations",
      description: "End-to-end encryption ensuring your conversations remain private and secure."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Responses",
      description: "Lightning-fast processing and response times for efficient communication."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Contextual Understanding",
      description: "Maintains context throughout conversations for more meaningful interactions."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Proactive suggestions and insights based on conversation context."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Conversation History",
      description: "Access to past conversations and ability to continue previous discussions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the advanced capabilities of our AI Chat Assistant, designed to provide
            an exceptional conversational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <div className="text-blue-400">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience These Features?</h2>
          <button
            onClick={() => window.location.href = '/chat'}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Chatting Now
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};