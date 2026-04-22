import { FaEnvelope, FaPaperPlane, FaPaperclip, FaRegBell, FaSearch, FaSlidersH } from "react-icons/fa";

const ChatSection = ({
  chatQuery,
  setChatQuery,
  visibleConversations,
  activeConversationId,
  setActiveConversationId,
  setConversations,
  activeConversation,
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  return (
    <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
      <section className="surface-card p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="Search chats"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2.5 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        <div className="mt-4 space-y-2">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                setActiveConversationId(conversation.id);
                setConversations((prev) => prev.map((item) => (item.id === conversation.id ? { ...item, unread: 0 } : item)));
              }}
              className={`w-full rounded-xl border p-3 text-left transition ${
                conversation.id === activeConversationId
                  ? "border-[#ffb84d]/50 bg-[#ffb84d]/10"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-[var(--text)]">{conversation.name}</p>
                {conversation.unread > 0 ? (
                  <span className="rounded-full bg-[#ff7a45] px-2 py-0.5 text-[10px] font-bold text-white">{conversation.unread}</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{conversation.messages[conversation.messages.length - 1]?.text || "No messages"}</p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                {conversation.pinned ? <span>Pinned</span> : null}
                <span>{conversation.online ? "Online" : "Offline"}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="surface-card flex min-h-[560px] flex-col p-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <p className="font-semibold text-[var(--text)]">{activeConversation?.name || "Select conversation"}</p>
            <p className="text-xs text-[var(--text-muted)]">{activeConversation?.online ? "Typing enabled • Online" : "Last seen recently"}</p>
          </div>
          <div className="flex gap-2 text-[var(--text-muted)]">
            <button className="rounded-lg border border-[var(--border)] p-2"><FaSlidersH /></button>
            <button className="rounded-lg border border-[var(--border)] p-2"><FaRegBell /></button>
          </div>
        </div>

        <div className="custom-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {(activeConversation?.messages || []).map((message, index) => (
            <div key={`${message.time}-${index}`} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${message.fromMe ? "bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] text-white" : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"}`}>
                <p>{message.text}</p>
                <p className={`mt-1 text-[10px] ${message.fromMe ? "text-white/85" : "text-[var(--text-muted)]"}`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {["Availability", "Pricing", "Follow-up"].map((template) => (
              <button key={template} onClick={() => setNewMessage(`${template} template: `)} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]">
                {template}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-muted)]"><FaPaperclip /></button>
            <button className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--text-muted)]"><FaEnvelope /></button>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button onClick={sendMessage} className="rounded-xl bg-gradient-to-r from-[#ff7a45] to-[#ffb84d] p-2.5 text-white">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatSection;
