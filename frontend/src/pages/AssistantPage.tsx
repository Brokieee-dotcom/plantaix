import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Sprout, RefreshCw, User, HelpCircle } from 'lucide-react';
import { Plant } from '../types';
import { sendBotanicalChatMessage } from '../services/aiService';

interface AssistantPageProps {
  plants: Plant[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ plants }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Greetings, botanical researcher. I am **Dr. Xylem**, your resident Botanical AI Scientist on the PLANT-X platform.

I can assist you with:
- Analyzing early-warning physiological indicators before cellular wilting
- Explaining Vapor Pressure Deficit (VPD) thresholds and Tetens equation physics
- Formulating recovery protocols for water, heat, or osmotic stress
- Interpreting plant sensor telemetry and chlorophyll reflectance

How can I assist your laboratory research today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'How does VPD above 1.6 kPa trigger stomatal closure?',
    'Explain how PLANT-X predicts stress before visible wilting',
    'What is the ideal substrate moisture for Arabidopsis Col-0?',
    'Propose an emergency recovery protocol for heat-stressed specimens',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const plantContext = {
        plantsCount: plants.length,
        meanHealth: plants.length
          ? Math.round(plants.reduce((a, b) => a + b.healthScore, 0) / plants.length)
          : 0,
        highStressCount: plants.filter((p) => p.stressRisk > 60).length,
      };

      const replyText = await sendBotanicalChatMessage(text.trim(), historyForApi, plantContext);

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while connecting to Dr. Xylem. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Dr. Xylem — AI Botanical Research Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                GEMINI 3.8 FLASH
              </span>
            </h2>
            <p className="text-xs text-emerald-400/70">
              Precision plant physiology consultation and early-warning stress mitigation
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-emerald-950/60 transition"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-emerald-400/60 font-mono whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Prompt:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-[#081b12] hover:bg-[#0c281b] border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300 text-xs whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#06120d] border border-emerald-500/20 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl space-y-2 ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-black font-medium ml-12 rounded-tr-none'
                  : 'bg-[#081811] border border-emerald-500/25 text-emerald-100 mr-12 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <div>{msg.content}</div>
              <div
                className={`text-[9px] font-mono ${
                  msg.role === 'user' ? 'text-black/60 text-right' : 'text-emerald-500/60'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs leading-relaxed">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#081811] border border-emerald-500/25 text-emerald-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span className="font-mono text-xs">Consulting botanical telemetry models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-[#081811] p-2 rounded-2xl border border-emerald-500/30"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Dr. Xylem about plant stress, VPD calculations, or recovery protocols..."
          className="flex-1 px-4 py-2 bg-transparent text-white placeholder-emerald-600 focus:outline-none text-xs"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
