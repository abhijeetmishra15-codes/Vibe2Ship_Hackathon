import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/locales/LanguageContext';
import { MessageSquare, X, Send, Sparkles, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockDb } from '@/db/mockDb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CopilotDrawer() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize chat with greeting
  useEffect(() => {
    setMessages([
      {
        id: "m-init",
        sender: "ai",
        text: t('copilotGreeting'),
        time: new Date()
      }
    ]);
  }, [t]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: userText,
      time: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Get issues to check status dynamically
    const issues = await mockDb.getIssues();
    
    // Simulate AI response logic
    setTimeout(() => {
      let aiResponseText = "";
      let matchedIssue = null;

      // Normalize search string
      const query = userText.toLowerCase();

      if (query.includes("streetlight") || query.includes("light") || query.includes("sector 30") || query.includes("park lane")) {
        matchedIssue = issues.find(i => i.category === "Streetlight" || i.title.toLowerCase().includes("streetlight"));
      } else if (query.includes("pothole") || query.includes("sector 15") || query.includes("road")) {
        matchedIssue = issues.find(i => i.category === "Pothole" || i.title.toLowerCase().includes("pothole"));
      } else if (query.includes("garbage") || query.includes("trash") || query.includes("city park")) {
        matchedIssue = issues.find(i => i.category === "Garbage" || i.title.toLowerCase().includes("garbage"));
      } else if (query.includes("water") || query.includes("leak") || query.includes("sector 22")) {
        matchedIssue = issues.find(i => i.category === "Water Leakage" || i.title.toLowerCase().includes("leakage"));
      }

      if (matchedIssue) {
        aiResponseText = `I found a matching report: "${matchedIssue.title}".\n\n- **Status**: ${matchedIssue.status.toUpperCase()}\n- **Location**: ${matchedIssue.location.address}\n- **Reporter**: ${matchedIssue.reporter.name}\n- **Report Date**: ${new Date(matchedIssue.createdAt).toLocaleDateString()}\n\n`;
        
        if (matchedIssue.status === "resolved" && matchedIssue.resolutionUpdate) {
          aiResponseText += `Update: This issue was successfully RESOLVED by the local authority. Note: "${matchedIssue.resolutionUpdate.content}"`;
        } else if (matchedIssue.status === "verifying") {
          aiResponseText += `Update: Community verification is ongoing. Local verifier Vikram Singh has verified the report on-site.`;
        } else {
          aiResponseText += `Update: This report is currently OPEN and waiting for community verification and municipal review. Please upvote the issue to raise its priority!`;
        }
      } else if (query.includes("how many") || query.includes("count") || query.includes("total") || query.includes("status")) {
        const total = issues.length;
        const open = issues.filter(i => i.status === "open").length;
        const verifying = issues.filter(i => i.status === "verifying").length;
        const resolved = issues.filter(i => i.status === "resolved").length;
        aiResponseText = `Here is the current city dashboard summary:\n\n- Total Reports: **${total}**\n- Open / Pending: **${open}**\n- Verifying: **${verifying}**\n- Resolved: **${resolved}**\n\nWould you like me to guide you on how to report a new issue or view the hotspot map?`;
      } else if (query.includes("how to report") || query.includes("file") || query.includes("create")) {
        aiResponseText = `To report an issue:\n1. Click the **"Report New Issue"** button in the sidebar or dashboard.\n2. Upload a photo or video of the problem (e.g., potholes, trash piles).\n3. Use the GPS picker on the interactive map to pin the location.\n4. Review the AI-predicted category and severity scores.\n5. Click **"Submit"** and watch for points added to your leaderboard profile!`;
      } else {
        aiResponseText = `I'm here to help with civic problem solving! I can lookup issues like "pothole on Sector 15", "garbage piles", or "broken streetlights". I can also provide overall city statistics. Could you please specify which issue or area you'd like to check?`;
      }

      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        time: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-primary to-emerald-500 text-white p-4 rounded-full shadow-premium hover:shadow-premium-hover hover:scale-105 transition-all duration-300 flex items-center justify-center group h-auto"
        aria-label="Toggle AI Copilot"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out font-bold text-xs whitespace-nowrap">
          {t('copilotTitle')}
        </span>
      </Button>

      {/* Slide-out Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 max-w-sm w-full bg-card shadow-2xl z-50 border-l border-border flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="h-5 w-5 fill-current animate-pulse" />
            <span className="font-display font-bold text-sm tracking-tight">{t('copilotTitle')}</span>
          </div>
          <Button 
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-premium leading-relaxed border ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white border-primary/20 rounded-tr-none'
                    : 'bg-secondary/70 text-foreground border-border rounded-tl-none'
                }`}
              >
                {/* Simple Markdown Bold parsing */}
                {msg.text.split('\n').map((paragraph, idx) => {
                  return (
                    <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                      {paragraph.split('**').map((part, pIdx) => {
                        return pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{part}</strong> : part;
                      })}
                    </p>
                  );
                })}
              </div>
              <span className="text-[9px] text-muted-foreground/60 mt-1 px-1">
                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-1.5 bg-secondary/40 px-4 py-2.5 rounded-2xl rounded-tl-none border border-border w-fit">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-card">
          <div className="flex items-center space-x-2 bg-secondary/80 hover:bg-secondary rounded-xl p-1 border border-border/80 transition-colors">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('copilotPlaceholder')}
              className="!bg-transparent !border-0 focus:!ring-0 focus:!border-transparent !px-2.5 !py-1.5"
            />
            <Button
              type="submit"
              variant="primary"
              className="p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
              disabled={!inputValue.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
