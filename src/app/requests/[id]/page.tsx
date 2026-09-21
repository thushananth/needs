'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LocationModal } from '@/components/LocationModal';
import { useAllRequests, useStoreReady, useSubmittedProposals, useSubmitProposal, MIN_BID_AMOUNT } from '@/data/requestStore';

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, requireProvider } = useAuth();
  const requestId = (params.id as string) || 'req-1';

  const allRequests = useAllRequests();
  const storeReady = useStoreReady();
  const matchedRequest = allRequests.find((r) => r.id === requestId);
  const request = matchedRequest || allRequests[0];
  const submittedProposals = useSubmittedProposals(request?.id || '');
  const submitProposal = useSubmitProposal();
  const proposals = [...submittedProposals, ...(request?.proposals ?? [])];
  const [bidError, setBidError] = useState('');

  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('40');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    const amount = Number(bidAmount.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(amount) || amount < MIN_BID_AMOUNT) {
      setBidError(`Bid must be a number of at least $${MIN_BID_AMOUNT}.`);
      return;
    }
    const providerId = `user:${user?.email ?? ''}`;
    if (proposals.some((p) => p.providerId === providerId)) {
      setBidError('You have already submitted a proposal for this request.');
      return;
    }
    setBidError('');
    setSubmitting(true);
    setTimeout(() => {
      submitProposal(request.id, {
        id: `prop-u-${Date.now()}`,
        providerId,
        providerName: user?.name || 'Local Provider',
        providerAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 0,
        bidAmount: `$${amount}`,
        estimatedTime: 'New proposal',
        coverLetter: coverLetter.trim(),
        submittedAt: 'Just now',
      });
      setSubmitting(false);
      setProposalModalOpen(false);
      setCoverLetter('');
      alert('Proposal submitted successfully! The client has been notified via chat.');
    }, 700);
  };

  if (!matchedRequest && !storeReady) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading request...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-4xl">🔍</span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Request Not Found</h1>
          <p className="text-xs text-zinc-500">There are currently no active service requests matching this ID.</p>
          <Link
            href="/requests"
            className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
          >
            Browse Requests
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navbar />
      <LocationModal />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Back button & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 transition"
          >
            ← Back to Browse Requests
          </Link>

          <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            ● Accepting Proposals
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Specification Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {request.category}
                  </span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    ⚡ {request.urgency} Urgency
                  </span>
                  <span className="text-xs text-zinc-400">• Posted {request.postedAt}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {request.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                  <span>📍 Location: <strong>{request.city}, {request.region}, {request.country}</strong></span>
                  <span>•</span>
                  <span>{request.distanceKm} km away</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Full Specification & Description
                </h3>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {request.fullDescription || request.description}
                </p>
              </div>

              {/* Attachments */}
              {request.attachments && request.attachments.length > 0 && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Attachments ({request.attachments.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {request.attachments.map((att) => (
                      <div
                        key={att}
                        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        <span>📄</span>
                        <span>{att}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proposals Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Submitted Proposals ({proposals.length})
                </h2>
                <button
                  onClick={() => requireProvider(() => setProposalModalOpen(true))}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition"
                >
                  + Submit Proposal
                </button>
              </div>

              {proposals.length > 0 ? (
                <div className="space-y-3">
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.providerAvatar}
                            alt={prop.providerName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            {prop.providerId.startsWith('user:') ? (
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                {prop.providerName}
                              </span>
                            ) : (
                              <Link
                                href={`/providers/${prop.providerId}`}
                                className="text-xs font-bold text-zinc-900 dark:text-white hover:text-indigo-600"
                              >
                                {prop.providerName}
                              </Link>
                            )}
                            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                              <span className="text-amber-500 font-bold">★ {prop.rating || 'New'}</span>
                              <span>• {prop.estimatedTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-emerald-600">{prop.bidAmount}</span>
                          <span className="block text-[10px] text-zinc-400">{prop.submittedAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        "{prop.coverLetter}"
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Link
                          href="/chat"
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                        >
                          💬 Chat with Pro
                        </Link>
                        <button
                          onClick={() => alert(`Awarded job to ${prop.providerName} for ${prop.bidAmount}!`)}
                          className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                        >
                          Hire & Accept Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-500 dark:border-zinc-800">
                  No proposals submitted yet. Be the first local provider to submit a quote!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-400 uppercase">Estimated Budget</span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {request.budget}
                </div>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Posted By</span>
                  <strong className="text-zinc-900 dark:text-white font-bold">{request.clientName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Client Rating</span>
                  <strong className="text-amber-500 font-bold">★ 4.95 (18 hires)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Payment Status</span>
                  <strong className="text-emerald-600 font-bold">✓ Escrow Verified</strong>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => requireProvider(() => setProposalModalOpen(true))}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  Submit Proposal Now
                </button>
                <Link
                  href="/chat"
                  className="block w-full text-center rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  Message Client
                </Link>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                Location Map Preview
              </h4>
              <div className="h-40 rounded-2xl bg-gradient-to-tr from-indigo-900 to-zinc-900 flex items-center justify-center text-white text-xs font-bold p-4 text-center">
                🗺️ IP Geolocation Match: {request.city}, {request.region}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PROPOSAL MODAL */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Submit Proposal
              </h3>
              <button
                onClick={() => setProposalModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Bid Amount ($)
                </label>
                <input
                  type="text"
                  required
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setBidError('');
                  }}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <p className="mt-1 text-[10px] text-zinc-400">Minimum bid: ${MIN_BID_AMOUNT}</p>
                {bidError && <p className="mt-1 text-xs font-semibold text-rose-600">{bidError}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Cover Note / Estimated Arrival
                </label>
                <textarea
                  rows={3}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="e.g. I am 15 mins away with pipe fittings ready..."
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProposalModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
