import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AITrainingAssistantProps {
  moduleTitle: string;
  moduleId?: string;
  context?: string;
}

export function AITrainingAssistant({ moduleTitle, moduleId, context }: AITrainingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-training-assistant', {
        body: { 
          question: userMessage, 
          context,
          trainingModule: moduleTitle 
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer 
      }]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-neutral-950/90 border border-neutral-800 shadow-lg shadow-black/60">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-yellow-300" />
        <h3 className="font-semibold text-neutral-50">AI Training Assistant</h3>
      </div>

      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-300">
            Ask me anything about {moduleTitle}. I'm here to help you learn.
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <Bot className="w-5 h-5 text-yellow-300 mt-1" />
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-black/80 text-neutral-50 border border-neutral-800'
              }`}
            >
              <p>{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <User className="w-5 h-5 text-neutral-300 mt-1" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="min-h-[60px] bg-black/80 border-neutral-800 text-neutral-50 placeholder:text-neutral-500"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Card>
  );
}