import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  customers, orders, products, notifications,
  monthlySales, storePerformance, topProducts,
} from '../data/mockData';

const PAGE_NAMES = {
  '/': 'Dashboard',
  '/contacts': 'Contacts',
  '/orders': 'Orders',
  '/products': 'Products',
  '/reports': 'Reports',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

function getPageName(pathname) {
  if (pathname.startsWith('/contacts/')) return 'Customer Profile';
  return PAGE_NAMES[pathname] || 'Dashboard';
}

function TypingDots() {
  return (
    <div className="ai-typing-dots">
      <span /><span /><span />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`ai-msg-wrap ${isUser ? 'ai-msg-user' : 'ai-msg-ai'}`}>
      {!isUser && (
        <div className="ai-msg-avatar">
          <i className="ti ti-sparkles" />
        </div>
      )}
      <div className={`ai-bubble ${isUser ? 'ai-bubble-user' : 'ai-bubble-ai'}`}>
        {msg.content}
      </div>
    </div>
  );
}

// ─── Local response generator ────────────────────────────────────────────────
function generateLocalReply(question, currentPage) {
  const q = question.toLowerCase();

  if (q.includes('underperforming') || q.includes('store') || q.includes('worst')) {
    return `Based on our performance audit, **PMRG Hazratganj** in Lucknow is underperforming, achieving ₹16,00,000 against a target of ₹18,00,000 (an 11% gap). **PMRG SG Highway** in Ahmedabad is also behind targets by 12% (₹22,00,000 achieved vs ₹25,00,000 target). \n\nI recommend evaluating local promotional campaigns for these regions.`;
  }

  if (q.includes('vip') || q.includes('customer') || q.includes('elite') || q.includes('best')) {
    return `Here are the top VIP and Elite customers currently active in your database:\n\n• **Vikram Singh**: ₹21,80,000 total spend (410 transactions, Elite)\n• **Rahul Mehta**: ₹12,40,500 total spend (284 transactions, VIP)\n• **Arun Nair**: ₹8,75,000 total spend (132 transactions, VIP)\n\nWe see high transaction density for Vikram Singh in our Jaipur store.`;
  }

  if (q.includes('return') || q.includes('spike') || q.includes('november')) {
    return `Yes, returns spiked to **92** in November. This coincided with our highest sales volume month (745 orders, ₹49,00,000 revenue) due to Diwali campaigns. \n\nSize exchanges in the Running and Casual categories accounted for 72% of these returns, indicating a need for clearer size guides on the store app.`;
  }

  if (q.includes('summarise') || q.includes('summarize') || q.includes('recent') || q.includes('order')) {
    return `Here is a summary of the 12 recent orders in June 2025:\n\n• **Delivered**: 6 orders (totaling ₹37,321)\n• **Processing**: 2 orders (Priya Sharma, Puma RS-X3 & Arun Nair, Reebok Classic)\n• **Shipped**: 2 orders (Arun Nair & Vikram Singh)\n• **Returned**: Meera Iyer (Woodland Sneakers, ORD-2025-8835)\n• **Cancelled**: Sneha Patel (New Balance 574, ORD-2025-8837)`;
  }

  if (q.includes('stock') || q.includes('low') || q.includes('out') || q.includes('inventory')) {
    return `We currently have two critical inventory alerts:\n\n• **New Balance 574**: 0 units in stock (OUT OF STOCK)\n• **Reebok Classic Leather**: 5 units remaining (LOW STOCK)\n\nOther product lines are healthy: Bata Power X leads with 210 units, and Campus Force has 145 units.`;
  }

  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('greet')) {
    return `Hello! I am PMRG Assistant, your business intelligence buddy. I see you're currently viewing the **${currentPage}** page. How can I help you analyze the CRM data today?`;
  }

  // Fallback response
  return `I see you are viewing the **${currentPage}** page. While I only have access to our local PMRG CRM dataset (2,847 customers, 4,924 orders, and annual revenue of ₹3.82 Cr), I can give you quick calculations on:\n\n• Top VIP customers\n• Underperforming store targets\n• Low-stock items\n• Monthly order status breakdowns\n\nWhat would you like me to pull up?`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIBuddy() {
  const location = useLocation();
  const currentPage = getPageName(location.pathname);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm PMRG Assistant — your AI business analyst.\n\nAsk me anything about your customers, orders, products, or revenue. I have live access to your CRM data!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate smart thinking delay
    setTimeout(() => {
      const reply = generateLocalReply(text, currentPage);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 800);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        className={`ai-buddy-fab ${open ? 'ai-buddy-fab--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        title="PMRG Assistant"
        aria-label="Open AI Assistant"
      >
        <i className={`ti ${open ? 'ti-x' : 'ti-message-chatbot'}`} />
      </button>

      {/* ── Chat Panel ── */}
      <div className={`ai-buddy-panel ${open ? 'ai-buddy-panel--open' : ''}`}>
        {/* Header */}
        <div className="ai-buddy-header">
          <div className="ai-buddy-header-info">
            <div className="ai-buddy-logo">
              <i className="ti ti-sparkles" />
            </div>
            <div>
              <div className="ai-buddy-title">PMRG Assistant</div>
              <div className="ai-buddy-status">
                <span className="ai-online-dot" />
                Online · {currentPage}
              </div>
            </div>
          </div>
          <button className="ai-buddy-close" onClick={() => setOpen(false)} title="Close">
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-buddy-messages">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && (
            <div className="ai-msg-wrap ai-msg-ai">
              <div className="ai-msg-avatar"><i className="ti ti-sparkles" /></div>
              <div className="ai-bubble ai-bubble-ai"><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="ai-quick-prompts">
            {[
              'Which store is underperforming?',
              'Who are my top VIP customers?',
              'Show me low stock products',
              'Summarize this month\'s orders',
            ].map(q => (
              <button key={q} className="ai-quick-btn" onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-buddy-input-wrap">
          <textarea
            ref={inputRef}
            className="ai-buddy-input"
            placeholder="Ask about sales, customers, stock…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <button
            className="ai-buddy-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            title="Send"
          >
            <i className="ti ti-send" />
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && <div className="ai-buddy-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
