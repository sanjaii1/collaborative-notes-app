import React, { useState, useEffect } from 'react';
import { tabManager } from '../utils/tabManager';

interface TabSession {
  tabId: string;
  user: any;
  isAuthenticated: boolean;
  lastActive: string;
}

const TabSessionsOverview: React.FC = () => {
  const [tabSessions, setTabSessions] = useState<TabSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadTabSessions = () => {
    const tabs = tabManager.getAllTabs();
    const sessions: TabSession[] = [];

    tabs.forEach(tabKey => {
      const tabData = JSON.parse(localStorage.getItem(tabKey) || '{}');
      const tabId = tabKey.replace('auth-tab-', '');
      
      sessions.push({
        tabId,
        user: tabData.user || null,
        isAuthenticated: tabData.isAuthenticated || false,
        lastActive: new Date().toLocaleTimeString(),
      });
    });

    setTabSessions(sessions);
  };

  useEffect(() => {
    loadTabSessions();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadTabSessions, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const isCurrentTab = (tabId: string) => {
    return tabId === tabManager.getTabId();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-colors"
      >
        {isOpen ? 'Hide' : 'Show'} Tab Sessions ({tabSessions.length})
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Active Tab Sessions</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {tabSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active tab sessions found.</p>
              ) : (
                tabSessions.map((session) => (
                  <div
                    key={session.tabId}
                    className={`p-4 border rounded-lg ${
                      isCurrentTab(session.tabId)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-gray-600">
                            Tab: {session.tabId.slice(-8)}
                          </span>
                          {isCurrentTab(session.tabId) && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              session.isAuthenticated
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {session.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                          </span>
                        </div>
                        
                        {session.user ? (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">User:</span> {session.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {session.user.email}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No user logged in</p>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Last active: {session.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={loadTabSessions}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
              >
                Refresh Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TabSessionsOverview; 