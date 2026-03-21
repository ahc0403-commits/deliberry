"use server";

import type { MerchantReview } from "../../../shared/data/merchant-mock-data";
import { ensureMerchantStoreScope } from "../../auth/server/access";
import { supabaseMerchantRuntimeRepository } from "../../../shared/data/supabase-merchant-runtime-repository";
import { replyToMerchantReviewRuntimeData } from "../../../shared/data/merchant-review-runtime-service";

export type MerchantReviewReplyActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  review: MerchantReview | null;
};

export async function loadMoreMerchantReviewsAction(input: {
  storeId: string;
  cursorCreatedAt: string;
  cursorId: string;
}): Promise<
  | { ok: true; reviews: MerchantReview[]; hasMore: boolean }
  | { ok: false; error: string }
> {
  const PAGE_SIZE = 25;
  try {
    await ensureMerchantStoreScope(input.storeId);
    const data = await supabaseMerchantRuntimeRepository.getReviewsData({
      storeId: input.storeId,
      limit: PAGE_SIZE,
      cursor: { createdAt: input.cursorCreatedAt, id: input.cursorId },
    });
    return {
      ok: true,
      reviews: data.reviews,
      hasMore: data.reviews.length >= PAGE_SIZE,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load more reviews.",
    };
  }
}

export async function replyToMerchantReviewAction(
  storeId: string,
  _previousState: MerchantReviewReplyActionState,
  formData: FormData,
): Promise<MerchantReviewReplyActionState> {
  try {
    const access = await ensureMerchantStoreScope(storeId);
    if (!access.session) {
      return {
        status: "error",
        message: "Merchant session is required before replying to reviews.",
        review: null,
      };
    }

    const reviewId = String(formData.get("reviewId") ?? "");
    const responseText = String(formData.get("responseText") ?? "").trim();

    if (!reviewId) {
      return {
        status: "error",
        message: "Review selection is missing.",
        review: null,
      };
    }

    if (!responseText) {
      return {
        status: "error",
        message: "Response text cannot be empty.",
        review: null,
      };
    }

    const result = await replyToMerchantReviewRuntimeData({
      storeId,
      reviewId,
      actorId: access.session.merchantId,
      actorType: access.session.actorType,
      responseText,
    });

    return {
      status: "success",
      message: "Review response saved.",
      review: result.review,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to save merchant review response.",
      review: null,
    };
  }
}
