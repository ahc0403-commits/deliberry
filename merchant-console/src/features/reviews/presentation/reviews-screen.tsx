"use client";

import { useState } from "react";
import { MessageSquareQuote, Sparkles, Star, Store } from "lucide-react";
import { merchantQueryServices } from "../../../shared/data/merchant-query-services";

type MerchantReviewsScreenProps = {
  storeId: string;
};

export function MerchantReviewsScreen({ storeId }: MerchantReviewsScreenProps) {
  const data = merchantQueryServices.getReviewsData(storeId);
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");

  const filteredReviews = data.reviews.filter((r) => {
    if (filter === "pending") return !r.responded;
    if (filter === "responded") return r.responded;
    return true;
  });

  const pendingCount = data.reviews.filter((r) => !r.responded).length;
  const respondedCount = data.reviews.length - pendingCount;
  const avgRating =
    data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length;

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
            Review data is fixture-backed for the current demo store, but the response-state split is still useful for triage.
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">Average rating</div>
          <div className="merchant-summary-value">{avgRating.toFixed(1)}</div>
          <div className="merchant-summary-meta">{data.reviews.length} total review entries in the current store scope</div>
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
            Response controls are preview-only
          </div>
        </div>

      <div className="tab-bar merchant-tab-bar">
        <button
          className={`tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All<span className="tab-count">{data.reviews.length}</span>
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
            {data.reviews.filter((r) => r.responded).length}
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
      </div>
    </div>
  );
}
