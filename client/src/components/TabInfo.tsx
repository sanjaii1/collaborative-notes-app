import React from 'react';
import { useAuthStore } from '../store/authStore';
import { tabManager } from '../utils/tabManager';

const TabInfo: React.FC = () => {
  const { user, tabId, isAuthenticated } = useAuthStore();

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[250px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Tab Information</h3>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Tab ID:</span>
          <span className="font-mono text-gray-800">{tabId.slice(-8)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {user && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">User:</span>
              <span className="font-medium text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">{user.email}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={() => {
            const newTab = window.open(window.location.href, '_blank');
            if (newTab) {
              newTab.focus();
            }
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Open New Tab
        </button>
      </div>
    </div>
  );
};

export default TabInfo; 