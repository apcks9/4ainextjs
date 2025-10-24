import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResponseRenderer from '../components/ResponseRenderer';

export default function GridOnly() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiResponses, setAiResponses] = useState({
    claude: '',
    chatgpt: '',
    grok: '',
    perplexity: ''
  });
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    claude: import.meta.env.VITE_CLAUDE_API_KEY || '',
    chatgpt: import.meta.env.VITE_OPENAI_API_KEY || '',
    grok: import.meta.env.VITE_GROK_API_KEY || '',
    perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY || ''
  });

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const queryText = aiInput;
    setAiInput('');
    setLoading(true);

    setAiResponses({
      claude: 'Loading...',
      chatgpt: 'Loading...',
      grok: 'Loading...',
      perplexity: 'Loading...'
    });

    const CLAUDE_API_KEY = apiKeys.claude;
    const OPENAI_API_KEY = apiKeys.chatgpt;
    const GROK_API_KEY = apiKeys.grok;
    const PERPLEXITY_API_KEY = apiKeys.perplexity;

    try {
      // Call Claude API through backend
      fetch('http://localhost:3001/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: queryText,
          apiKey: CLAUDE_API_KEY
        })
      })
        .then(res => res.json())
        .then(data => {
          const response = data.error
            ? `Error: ${data.error.message || JSON.stringify(data.error)}`
            : data.content?.[0]?.text || 'Error: Unable to get response';
          setAiResponses(prev => ({ ...prev, claude: response }));
        })
        .catch(err => {
          setAiResponses(prev => ({ ...prev, claude: `Error: ${err.message}` }));
        });

      // Call OpenAI API directly
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [{ role: 'user', content: queryText }]
        })
      })
        .then(res => res.json())
        .then(data => {
          const response = data.error
            ? `Error: ${data.error.message || JSON.stringify(data.error)}`
            : data.choices?.[0]?.message?.content || 'Error: Unable to get response';
          setAiResponses(prev => ({ ...prev, chatgpt: response }));
        })
        .catch(err => {
          setAiResponses(prev => ({ ...prev, chatgpt: `Error: ${err.message}` }));
        });

      // Call Grok API directly
      fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'grok-4',
          messages: [{ role: 'user', content: queryText }]
        })
      })
        .then(res => res.json())
        .then(data => {
          const response = data.error
            ? `Error: ${data.error.message || JSON.stringify(data.error)}`
            : data.choices?.[0]?.message?.content || 'Error: Unable to get response';
          setAiResponses(prev => ({ ...prev, grok: response }));
        })
        .catch(err => {
          setAiResponses(prev => ({ ...prev, grok: `Error: ${err.message}` }));
        });

      // Call Perplexity API directly
      fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: queryText }]
        })
      })
        .then(res => res.json())
        .then(data => {
          const response = data.error
            ? `Error: ${data.error.message || JSON.stringify(data.error)}`
            : data.choices?.[0]?.message?.content || 'Error: Unable to get response';
          setAiResponses(prev => ({ ...prev, perplexity: response }));
        })
        .catch(err => {
          setAiResponses(prev => ({ ...prev, perplexity: `Error: ${err.message}` }));
        });

    } catch (error) {
      console.error('AI API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gray-100'}`}>
      {/* Minimal top bar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="w-full px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ezarg - Grid Only</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-1 text-sm ${darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded transition-all`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-1 text-sm ${darkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-700 hover:bg-gray-800'} text-white rounded transition-all`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="w-full px-2 py-2">
        {/* Input bar */}
        <form onSubmit={handleAiSubmit} className="mb-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask a question to all four AIs..."
              className={`flex-1 px-3 py-1 text-sm border ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            />
            <button
              type="submit"
              disabled={loading || !aiInput.trim()}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>

        {/* 2x2 Grid Layout - Full screen */}
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[calc(100vh-100px)]">
          {/* Claude Response - Top Left */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg p-1 border flex flex-col overflow-hidden`}>
            <h4 className={`text-xs font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-1 flex items-center gap-1 px-1 flex-shrink-0`}>
              <span className="text-sm">🤖</span> Claude
            </h4>
            <div className={`ai-response ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs overflow-y-auto px-1 flex-1 min-h-0`}>
              <ResponseRenderer response={aiResponses.claude} darkMode={darkMode} />
            </div>
          </div>

          {/* ChatGPT Response - Top Right */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg p-1 border flex flex-col overflow-hidden`}>
            <h4 className={`text-xs font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'} mb-1 flex items-center gap-1 px-1 flex-shrink-0`}>
              <span className="text-sm">💬</span> ChatGPT
            </h4>
            <div className={`ai-response ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs overflow-y-auto px-1 flex-1 min-h-0`}>
              <ResponseRenderer response={aiResponses.chatgpt} darkMode={darkMode} />
            </div>
          </div>

          {/* Grok Response - Bottom Left */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg p-1 border flex flex-col overflow-hidden`}>
            <h4 className={`text-xs font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'} mb-1 flex items-center gap-1 px-1 flex-shrink-0`}>
              <span className="text-sm">⚡</span> Grok
            </h4>
            <div className={`ai-response ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs overflow-y-auto px-1 flex-1 min-h-0`}>
              <ResponseRenderer response={aiResponses.grok} darkMode={darkMode} />
            </div>
          </div>

          {/* Perplexity Response - Bottom Right */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg p-1 border flex flex-col overflow-hidden`}>
            <h4 className={`text-xs font-semibold ${darkMode ? 'text-orange-400' : 'text-orange-600'} mb-1 flex items-center gap-1 px-1 flex-shrink-0`}>
              <span className="text-sm">🔍</span> Perplexity
            </h4>
            <div className={`ai-response ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-xs overflow-y-auto px-1 flex-1 min-h-0`}>
              <ResponseRenderer response={aiResponses.perplexity} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
