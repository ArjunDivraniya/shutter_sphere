import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaSmile, FaSearch, FaCircle, FaComments } from "react-icons/fa";

const ChatSection = ({ conversations, onSendMessage, signupId }) => {
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeThreadId]);

  const activeThread = conversations.find(c => c.id === activeThreadId) || conversations[0];

  const handleSend = () => {
    if (!messageText.trim() || !activeThread) return;
    onSendMessage(activeThread.threadId || activeThread.id.replace('C-', ''), activeThread.userId, messageText);
    setMessageText("");
  };

  return (
    <div className="surface-card h-[calc(100vh-180px)] border border-[var(--border)] overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-r border-[var(--border)] flex flex-col bg-[var(--bg-elevated)]/30">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-[#ffb84d] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-xs">No conversations yet</div>
          ) : (
            conversations.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setActiveThreadId(chat.id)}
                className={`w-full p-4 flex items-center gap-3 border-b border-[var(--border)] transition-all hover:bg-[var(--surface-strong)]/50 ${activeThreadId === chat.id ? 'bg-[var(--surface-strong)] border-r-4 border-r-[#ff7a45]' : ''}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-[var(--border)] flex items-center justify-center text-[#ffb84d] font-bold">
                    {chat.name?.charAt(0) || "P"}
                  </div>
                  {chat.online && <FaCircle className="absolute bottom-0 right-0 text-[8px] text-emerald-500 stroke-black stroke-[3px]" />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold text-sm text-white truncate">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="bg-[#ff7a45] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-[#ff7a45]/30">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate whitespace-nowrap overflow-hidden">
                    {chat.messages?.[chat.messages.length - 1]?.text || "Start a conversation..."}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-[var(--bg-elevated)]/10 backdrop-blur-sm">
        {activeThread ? (
          <>
            <header className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]/20">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-[var(--surface-strong)] border border-[var(--border)] flex items-center justify-center text-xs text-[#ffb84d]">
                    {activeThread.name?.charAt(0)}
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-white">{activeThread.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Now</p>
                 </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {activeThread.messages?.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.fromMe 
                        ? 'bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white rounded-tr-none shadow-lg' 
                        : 'bg-[var(--surface-strong)] text-white border border-[var(--border)] rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`text-[8px] font-bold mt-1 block uppercase tracking-tighter ${msg.fromMe ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            <footer className="p-4 bg-[var(--bg-elevated)]/40 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                 <button className="p-2.5 text-[var(--text-muted)] hover:text-[#ffb84d] transition-all">
                    <FaSmile />
                 </button>
                 <input 
                   type="text" 
                   value={messageText}
                   onChange={(e) => setMessageText(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Type a message..."
                   className="flex-1 bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-[#ffb84d] transition-all"
                 />
                 <button 
                  onClick={handleSend}
                  className="p-3 bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white rounded-xl shadow-lg shadow-[#ff7a45]/30 hover:scale-105 active:scale-95 transition-all"
                 >
                    <FaPaperPlane className="text-sm" />
                 </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 bg-[var(--surface-strong)] rounded-full flex items-center justify-center mb-4">
                 <FaComments className="text-2xl text-[var(--text-muted)]" />
              </div>
              <p className="text-white font-bold">Select a conversation</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Pick a chat from the left to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatSection;
