'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { MOCK_CHAT_THREADS, ChatMessage } from '@/data/mockData';

export default function ChatPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const [threads, setThreads] = useState(MOCK_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(MOCK_CHAT_THREADS[0]?.id || '');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-me',
      text: inputText,
      timestamp: 'Just now',
      isMe: true,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              lastMessage: inputText,
              lastMessageTime: 'Just now',
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    setInputText('');
  };

  if (!ready || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-[calc(100vh-12rem)] min-h-[500px] rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden flex flex-col md:flex-row">
          {/* Left Conversations Sidebar */}
          <div className="w-full md:w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-black text-zinc-900 dark:text-white">
                Messages & Proposals
              </h2>
              <p className="text-xs text-zinc-500">Active conversations with local pros</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {threads.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No active message conversations yet.
                </div>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      activeThreadId === thread.id
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={thread.participantAvatar}
                        alt={thread.participantName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      {thread.online && (
                        <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {thread.participantName}
                        </span>
                        <span className="text-[10px] text-zinc-400">{thread.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Active Chat Window */}
          <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
            {activeThread ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeThread.participantAvatar}
                      alt={activeThread.participantName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {activeThread.participantName}
                      </h3>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ● {activeThread.online ? 'Online & Available' : 'Offline'} • {activeThread.participantRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Creating Escrow milestone offer for ${activeThread.participantName}...`)}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
                    >
                      $ Send Job Milestone Offer
                    </button>
                  </div>
                </div>

                {/* Chat Thread Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/30 dark:bg-zinc-950/20">
                  {activeThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                          msg.isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                            : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-none border border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="mt-1 text-[10px] text-zinc-400">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Attachment upload dialog')}
                    className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    📎
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message or project question..."
                    className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-zinc-500">
                <span className="text-3xl mb-2">💬</span>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">No active chat selected</p>
                <p className="mt-1 text-zinc-400">Post a request or contact a provider to start a conversation.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
