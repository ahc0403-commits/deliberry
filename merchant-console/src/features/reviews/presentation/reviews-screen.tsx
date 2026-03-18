"use client";

import { startTransition, useState } from "react";
import { MessageSquareQuote, Sparkles, Star, Store } from "lucide-react";
import type { ReviewsData } from "../../../shared/data/merchant-repository";
import { loadMoreMerchantReviewsAction } from "../server/review-actions";

type MerchantReviewsScreenProps = {
  data: ReviewsData;
  source: "persisted" | "fallback";
  storeId: string;
  initialHasMore: boolean;
};

export function MerchantReviewsScreen({
  data,
  source,
  storeId,
  initialHasMore,
}: MerchantReviewsScreenProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");
  const [reviews, setReviews] = useState(data.reviews);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  function handleLoadMore() {
    if (!hasMore || isLoadingMore || reviews.length === 0) return;
    setIsLoadingMore(true);
    const lastReview = reviews[reviews.length - 1];
    startTransition(async () => {
      const result = await loadMoreMerchantReviewsAction({
        storeId,
        cursorCreatedAt: lastReview.date,
        cursorId: lastReview.id,
      });
      if (result.ok) {
        setReviews((prev) => [...prev, ...result.reviews]);
        setHasMore(result.hasMore);
      }
      setIsLoadingMore(false);
    });
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.responded;
    if (filter === "responded") return r.responded;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.responded).length;
  const respondedCount = reviews.length - pendingCount;
  const avgRating = reviews.length === 0
    ? 0
    : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">Customer feedback</span>
          <h1 className="merchant-hero-title">Reviews</h1>
          <p className="merchant-hero-subtitle">
            Monitor store feedback, spot comments that still need follow-up, and keep preview-only response behavior visibly honest.
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <Sparkles size={14} />
              Responses stay preview-only in this phase
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">Feedback focus</div>
          <div className="merchant-hero-panel-value">{pendingCount} awaiting reply</div>
          <div className="merchant-hero-panel-text">
            {source === "persisted"
              ? "Review records now come from persisted customer feedback for this store. Response controls still remain preview-only."
              : "Review data is using the local fallback store snapshot. Response controls still remain preview-only."}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Average rating</div>
          <div className="merchant-summary-value">{avgRating.toFixed(1)}</div>
          <div className="merchant-summary-meta">
            {reviews.length} total review entr{reviews.length === 1 ? "y" : "ies"} in the current store scope
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Needs response</div>
          <div className="merchant-summary-value">{pendingCount}</div>
          <div className="merchant-summary-meta">The highest-priority queue for this route</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Already answered</div>
          <div className="merchant-summary-value">{respondedCount}</div>
          <div className="merchant-summary-meta">Responses are read-only snapshots, not live editable threads</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">Review queue</div>
            <div className="card-subtitle">Filter customer feedback by response state</div>
          </div>
          <div className="merchant-inline-note">
            <MessageSquareQuote size={14} />
            {source === "persisted"
              ? "Responses remain preview-only even though review reads are persisted-first"
              : "Response controls are preview-only"}
          </div>
        </div>

      <div className="tab-bar merchant-tab-bar">
        <button
          className={`tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All<span className="tab-count">{reviews.length}</span>
        </button>
        <button
          className={`tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Needs Response<span className="tab-count">{pendingCount}</span>
        </button>
        <button
          className={`tab ${filter === "responded" ? "active" : ""}`}
          onClick={() => setFilter("responded")}
        >
          Responded
          <span className="tab-count">
            {reviews.filter((r) => r.responded).length}
          </span>
        </button>
      </div>

      <div className="review-list merchant-review-list">
        {filteredReviews.length === 0 ? (
          <div className="card merchant-card">
            <div className="empty-state">
              <div className="empty-state-icon">{"\u2605"}</div>
              <div className="empty-state-title">No reviews</div>
              <div className="empty-state-desc">
                No reviews match this filter
              </div>
            </div>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`review-card merchant-review-card ${!review.responded ? "unresponded" : ""}`}
            >
              <div className="review-header">
                <div className="review-customer">
                  <div className="review-avatar">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="review-name">{review.customerName}</div>
                    <div className="review-meta">
                      Order {review.orderId} &middot; {review.date}
                    </div>
                  </div>
                </div>
                <div className="review-stars">
                  <span className="merchant-review-rating-pill">
                    <Star size={13} />
                    {review.rating.toFixed(1)}
                  </span>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`review-star ${i < review.rating ? "" : "empty"}`}
                    >
                      {"\u2605"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-text">{review.text}</div>

              {review.responded && review.response ? (
                <div className="review-response">
                  <div className="review-response-label">Your Response</div>
                  <div className="review-response-text">{review.response}</div>
                  <div className="review-response-date">
                    {review.responseDate}
                  </div>
                </div>
              ) : (
                <div className="review-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled
                    aria-disabled="true"
                  >
                    Response Preview Only
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
        {hasMore && (
          <div style={{ padding: "16px", textAlign: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading…" : "Load more reviews"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
