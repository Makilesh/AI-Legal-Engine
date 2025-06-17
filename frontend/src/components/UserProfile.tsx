import React from 'react';
import { useChatContext } from '../context/ChatContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  if (!state.user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2">
        <img
          src={state.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${state.user.username}`}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
          {state.user.username}
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700"></div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
};