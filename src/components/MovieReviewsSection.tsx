import React, { useState } from 'react';
import { Star, MessageSquarePlus, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../types';

interface MovieReviewsSectionProps {
  movie: Movie;
  openAuthModal: () => void;
}

export const MovieReviewsSection: React.FC<MovieReviewsSectionProps> = ({
  movie,
  openAuthModal,
}) => {
  const { currentUser } = useAuth();
  const { getReviewsForMovie, addReview } = useBooking();
  const reviews = getReviewsForMovie(movie.id);

  const [rating, setRating] = useState(10);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal();
      return;
    }
    if (!comment) return;

    addReview(movie.id, rating, headline || 'Spectacular Cinema Experience!', comment);
    setHeadline('');
    setComment('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Audience Reviews & Critic Ratings</span>
          </h3>
          <p className="text-xs text-slate-400">
            {reviews.length} Verified Viewer Reviews • Average Rating {movie.rating} / 10
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              openAuthModal();
            } else {
              setIsFormOpen(!isFormOpen);
            }
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-red-400" />
          <span>{isFormOpen ? 'Close Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Review Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Your Rating for {movie.title}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    num <= rating
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-500 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Headline</label>
            <input
              type="text"
              placeholder="e.g. Electrifying action, unmatched background score!"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Review Comments *</label>
            <textarea
              required
              rows={3}
              placeholder="What did you think of the performances, direction, and audio format?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/30"
            >
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 font-bold text-xs flex items-center justify-center">
                  {r.userName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-xs text-white">{r.userName}</span>
                  <span className="text-[10px] text-slate-500 ml-2">{r.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-bold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{r.rating}/10</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-200">{r.headline}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
