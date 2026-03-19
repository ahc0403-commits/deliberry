"use server";

import type { MerchantReview } from "../../../shared/data/merchant-mock-data";
import { ensureMerchantStoreScope } from "../../auth/server/access";
import { supabaseMerchantRuntimeRepository } from "../../../shared/data/supabase-merchant-runtime-repository";

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
