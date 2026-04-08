import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const aiResponses = {
    greeting: "Hi! I'm your Smart Tech Store AI assistant. Ask me about products, dev help, error fixes, or navigation! 🚀",
    'resume|cv': "The AI Resume Builder ($9.99) generates professional CVs in seconds. Perfect for job applications! Check it out in AI Tools → https://yourstore.com/product/1",
    'error|bug|fix': "What's the error? Common fixes:\n\nReact useEffect infinite loop? Add deps: useEffect(() => {}, [deps])\nCSS not loading? Check Tailwind config path.\nPaste your error for specific help! 🐛",
    'how.*react|tutorial': "React quickstart:\n```jsx\nconst App = () => <div>Hello World</div>;\n```\nNeed full boilerplate? Check our React Boilerplate Pro ($39.99)!",
    'docker': "Docker essential: `docker build -t myapp .`\n`docker run -p 3000:3000 myapp`\nGet Docker Mastery Kit ($34.99) for complete guide!",
    'product|buy': "Browse 15+ premium tools in Shop! Top: AI Resume Builder, Code Autocompletion Pro. Filter by AI Tools, Software, Dev Resources.",
    'navigation|page': "Pages: Home / Shop / AI Tools / Software / Dev Resources / Contact. Use nav bar!",
    default: "Great question! Tell me about products, code errors, tutorials, or how to navigate. What can I help with? 💡"
  };

  const getAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(aiResponses)) {
      if (key !== 'default' && lowerMsg.match(new RegExp(key.replace(/\|/g, '|'), 'i'))) {
        return response;
      }
    }
    return aiResponses.default;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getAIResponse(userMessage);
      setMessages(prev => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
      inputRef.current?.focus();
    }, 800 + Math.random() * 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white rounded-2xl shadow-2xl shadow-primary-500/25 hover:shadow-glow-lg transition-all duration-200 z-50 flex items-center justify-center hover:scale-110"
        title="AI Assistant"
      >
        <SparklesIcon className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] glass rounded-2xl shadow-2xl shadow-primary-500/25 border border-primary-500/30 z-50 flex flex-col overflow-hidden ai-chat">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">Smart AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-12 font-mono">
                Ask me anything about products, code, errors, or site! 👋
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-4 rounded-2xl shadow-lg ${msg.type === 'user' ? 'bg-gradient-to-r from-accent-500 to-cyan-500 text-white' : 'bg-surface/80 text-slate-200 border border-slate-600/50'}`}>
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{msg.text}</pre>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-message flex justify-start">
                <div className="bg-surface/80 text-slate-200 border border-slate-600/50 p-4 rounded-2xl max-w-xs flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse flex items-center justify-center">
                    <SparklesIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-mono">Smart AI is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex space-x-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about products, errors, tutorials..."
                className="flex-1 bg-surface/50 border border-slate-600/50 rounded-xl p-4 text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none resize-none h-12 max-h-24"
                rows="1"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white rounded-xl flex items-center justify-center shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center font-mono">
              AI responses are powered by Smart Tech intelligence
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;

