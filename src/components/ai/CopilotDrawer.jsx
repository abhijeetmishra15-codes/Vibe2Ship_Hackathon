import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/locales/LanguageContext';
import { X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function CopilotDrawer() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize chat with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "m-init",
          sender: "ai",
          text: "Hello! I am your AI Civic Assistant. How can I help you today?",
          time: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!user) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: userText,
      time: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-civic-agent', {
        body: {
          action: 'copilot_chat',
          payload: {
            message: userText,
            context: { path: window.location.pathname }
          }
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        sender: "ai",
        text: data.text,
        time: new Date()
      }]);
    } catch (error) {
      console.error("Copilot error:", error);
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        sender: "ai",
        text: 'Sorry, I encountered an error while processing your request. Please try again later.',
        time: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]'}`}
        aria-label="Open AI Copilot"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Slide-out Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-[100] w-full sm:w-[400px] bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-primary/5">
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="h-5 w-5 fill-current animate-pulse" />
            <h2 className="font-display font-black text-lg tracking-tight">Civic Copilot</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div 
                className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border border-border text-foreground rounded-tl-sm'
                }`}
              >
                {/* Process markdown-like bold syntax from dummy AI simply for UI */}
                {msg.text.split('\n').map((line, i) => {
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <span key={i} className="block mb-1">
                        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                      </span>
                    )
                  }
                  return <span key={i} className="block mb-1">{line}</span>
                })}
              </div>
              <span className="text-[9px] font-medium text-muted-foreground mt-1 px-1">
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start">
               <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border flex items-center space-x-2">
                 <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                 <span className="text-xs font-medium text-muted-foreground">Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-background/50">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2 bg-card border border-border/60 rounded-full p-1 pl-4 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground min-w-0"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full h-8 w-8 shrink-0 bg-primary text-primary-foreground"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </form>
          <div className="mt-3 text-center">
            <span className="text-[10px] font-medium text-muted-foreground flex items-center justify-center">
              Powered by <Bot className="h-3 w-3 mx-1" /> Gemini AI
            </span>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] sm:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
