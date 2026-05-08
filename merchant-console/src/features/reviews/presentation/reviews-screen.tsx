"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { MessageSquareQuote, Star, Store } from "lucide-react";
import type { ReviewsData } from "../../../shared/data/merchant-repository";
import {
  loadMoreMerchantReviewsAction,
  replyToMerchantReviewAction,
  type MerchantReviewReplyActionState,
} from "../server/review-actions";
import type { MerchantReview } from "../../../shared/data/merchant-mock-data";
import { useMerchantI18n } from "../../../shared/i18n/client";
import { toDisplayTime } from "../../../shared/domain";

type MerchantReviewsScreenProps = {
  data: ReviewsData;
  storeId: string;
  initialHasMore: boolean;
};

const INITIAL_REPLY_STATE: MerchantReviewReplyActionState = {
  status: "idle",
  message: null,
  review: null,
};

export function MerchantReviewsScreen({
  data,
  storeId,
  initialHasMore,
}: MerchantReviewsScreenProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");
  const [reviews, setReviews] = useState(data.reviews);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const { locale, raw } = useMerchantI18n();

  function handleReviewSaved(nextReview: MerchantReview) {
    setReviews((current) =>
      current.map((review) => (review.id === nextReview.id ? nextReview : review)),
    );
  }

  function handleLoadMore() {
    if (!hasMore || isLoadingMore || reviews.length === 0) return;
    setLoadMoreError(null);
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
      } else {
        setLoadMoreError(result.error);
      }
      setIsLoadingMore(false);
    });
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.responded;
    if (filter === "responded") return review.responded;
    return true;
  });

  const pendingCount = reviews.filter((review) => !review.responded).length;
  const respondedCount = reviews.length - pendingCount;
  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="merchant-surface">
      <section className="merchant-hero merchant-hero-insights">
        <div className="merchant-hero-copy">
          <span className="merchant-eyebrow">{raw("Customer feedback")}</span>
          <h1 className="merchant-hero-title">{raw("Reviews")}</h1>
          <p className="merchant-hero-subtitle">
            {raw("Monitor store feedback and post persisted merchant replies without leaving the store review queue.")}
          </p>
          <div className="merchant-context-row">
            <span className="merchant-context-pill">
              <Store size={14} />
              {data.store.name}
            </span>
            <span className="merchant-context-pill merchant-context-pill-muted">
              <MessageSquareQuote size={14} />
              {raw("Persisted review read and reply flow")}
            </span>
          </div>
        </div>
        <div className="merchant-hero-panel">
          <div className="merchant-hero-panel-label">{raw("Feedback focus")}</div>
          <div className="merchant-hero-panel-value">
            {pendingCount} · {raw("Awaiting reply")}
          </div>
          <div className="merchant-hero-panel-text">
            {raw("Review records and merchant replies stay attached to the active store scope.")}
          </div>
        </div>
      </section>

      <div className="merchant-summary-band">
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Average rating")}</div>
          <div className="merchant-summary-value">{avgRating.toFixed(1)}</div>
          <div className="merchant-summary-meta">
            {raw(reviews.length === 1 ? "1 total review entry" : "{count} total review entries").replace(
              "{count}",
              String(reviews.length),
            )}
          </div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Needs response")}</div>
          <div className="merchant-summary-value">{pendingCount}</div>
          <div className="merchant-summary-meta">{raw("Highest-priority queue for this store")}</div>
        </div>
        <div className="merchant-summary-card">
          <div className="merchant-summary-label">{raw("Already answered")}</div>
          <div className="merchant-summary-value">{respondedCount}</div>
          <div className="merchant-summary-meta">{raw("Persisted merchant responses")}</div>
        </div>
      </div>

      <div className="merchant-cluster-card">
        <div className="merchant-cluster-card-header">
          <div>
            <div className="card-title">{raw("Review queue")}</div>
            <div className="card-subtitle">{raw("Filter customer feedback by response state")}</div>
          </div>
          <div className="merchant-inline-note">
            <MessageSquareQuote size={14} />
            {raw("Replies save against persisted review records")}
          </div>
        </div>

        <div className="tab-bar merchant-tab-bar">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {raw("All")}<span className="tab-count">{reviews.length}</span>
          </button>
          <button
            className={`tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            {raw("Needs Response")}<span className="tab-count">{pendingCount}</span>
          </button>
          <button
            className={`tab ${filter === "responded" ? "active" : ""}`}
            onClick={() => setFilter("responded")}
          >
            {raw("Responded")}<span className="tab-count">{respondedCount}</span>
          </button>
        </div>

        <div className="review-list merchant-review-list">
          {filteredReviews.length === 0 ? (
            <div className="card merchant-card">
              <div className="empty-state">
                <div className="empty-state-icon">{"\u2605"}</div>
                <div className="empty-state-title">{raw("No reviews")}</div>
                <div className="empty-state-desc">{raw("No reviews match this filter.")}</div>
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
                    <div className="review-avatar">{review.customerName.charAt(0)}</div>
                    <div>
                      <div className="review-name">{review.customerName}</div>
                      <div className="review-meta">
                        {raw("Order {number}").replace("{number}", review.orderId)} &middot; {toDisplayTime(review.date, locale)}
                      </div>
                    </div>
                  </div>
                  <div className="review-stars">
                    <span className="merchant-review-rating-pill">
                      <Star size={13} />
                      {review.rating.toFixed(1)}
                    </span>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={`review-star ${index < review.rating ? "" : "empty"}`}
                      >
                        {"\u2605"}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="review-text">{review.text}</div>

                {review.responded && review.response ? (
                  <div className="review-response">
                    <div className="review-response-label">{raw("Your Response")}</div>
                    <div className="review-response-text">{review.response}</div>
                    <div className="review-response-date">
                      {review.responseDate ? toDisplayTime(review.responseDate, locale) : ""}
                    </div>
                  </div>
                ) : (
                  <ReviewReplyForm
                    review={review}
                    storeId={storeId}
                    onSaved={handleReviewSaved}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {loadMoreError ? (
          <div className="merchant-settings-intro">
            <strong>{raw("Unable to load more reviews")}</strong>
            <p>{raw(loadMoreError)}</p>
          </div>
        ) : null}

        {hasMore && (
          <div style={{ padding: "16px", textAlign: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? raw("Loading...") : raw("Load more reviews")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewReplyForm({
  review,
  storeId,
  onSaved,
}: {
  review: MerchantReview;
  storeId: string;
  onSaved: (review: MerchantReview) => void;
}) {
  const { raw } = useMerchantI18n();
  const [draft, setDraft] = useState("");
  const [actionState, formAction, isPending] = useActionState(
    replyToMerchantReviewAction.bind(null, storeId),
    INITIAL_REPLY_STATE,
  );

  useEffect(() => {
    if (actionState.status === "success" && actionState.review) {
      setDraft("");
      onSaved(actionState.review);
    }
  }, [actionState, onSaved]);

  return (
    <form action={formAction} className="review-actions" style={{ alignItems: "stretch" }}>
      <input type="hidden" name="reviewId" value={review.id} />
      <textarea
        className="form-input"
        name="responseText"
        placeholder={raw("Write a public response for this customer review")}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={3}
        style={{ minHeight: "88px" }}
      />
      <div className="page-actions merchant-page-actions" style={{ justifyContent: "space-between" }}>
        {actionState.message ? (
          <span
            className="merchant-inline-note"
            style={{
              color:
                actionState.status === "error"
                  ? "var(--color-danger)"
                  : "var(--color-success)",
            }}
          >
            {raw(actionState.message)}
          </span>
        ) : (
          <span className="merchant-inline-note">{raw("Replies are visible to customers once saved.")}</span>
        )}
        <button className="btn btn-primary btn-sm" type="submit" disabled={isPending || draft.trim().length === 0}>
          {isPending ? raw("Saving...") : raw("Save Response")}
        </button>
      </div>
    </form>
  );
}
