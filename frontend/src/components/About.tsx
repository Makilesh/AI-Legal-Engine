import React from 'react';
import { MessageSquare, Users, Shield, Award } from 'lucide-react';
import { Footer } from './Footer';
export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About AI Chat Assistant
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing communication through advanced artificial intelligence and
            natural language processing.
          </p>
        </div>

       {/* Mission Section */}
<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg shadow-lg rounded-2xl p-10 mb-12 border border-gray-700">
  <h2 className="text-3xl font-extrabold text-white mb-4">Our Mission</h2>
  <p className="text-gray-300 text-lg leading-relaxed">
    At the heart of our vision lies a commitment to revolutionizing AI-powered communication.  
    By seamlessly blending cutting-edge technology with human intuition, we strive to bridge language barriers,  
    foster deeper connections, and create a world where conversations feel effortless, natural, and truly meaningful.  
  </p>
</div>


        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">1M+</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">5+</div>
            <div className="text-gray-300">Supported Languages</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">24/7</div>
            <div className="text-gray-300">Support Available</div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-400">
              Pushing the boundaries of AI technology to create better conversational experiences.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <p className="text-gray-400">
              Making AI communication tools available and usable for everyone.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Security</h3>
            <p className="text-gray-400">
              Ensuring the privacy and protection of all user conversations and data.
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
            <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quality</h3>
            <p className="text-gray-400">
              Delivering exceptional conversational experiences through advanced AI.
            </p>
          </div>
        </div>

       {/* Team Section */}
<div className="text-center mb-16">
  <h2 className="text-3xl font-bold mb-12">Our Team</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <img
        src="src\api\jefry.png"
        alt="Jefry Sumith AJ"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">Jefry Sumith AJ</h3>
      <p className="text-gray-400">Backend Developer</p>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <img
        src="src\api\pranav.png"
        alt="Pranav Ram D S"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">Pranav Ram D S</h3>
      <p className="text-gray-400">Lead Developer</p>
    </div>
    
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <img
        src="src\api\vinu.jpg"
        alt="Vinu Varsanth M R"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">Vinu Varsanth M R</h3>
      <p className="text-gray-400">Frontend Developer</p>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <img
        src="src\api\rithik.png"
        alt="Rithik C A"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">Rithik C A</h3>
      <p className="text-gray-400">AI Developer</p>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6">
      <img
        src="src\api\makilesh.png"
        alt="Lisa Thompson"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-semibold mb-2">Makilesh M</h3>
      <p className="text-gray-400">Data Manager</p>
    </div>
          </div>
          
        </div>
        
      </div>
      <Footer />
    </div>
  );
};