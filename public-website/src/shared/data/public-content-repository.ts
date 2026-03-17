export type PublicContentSnapshot = {
  placeholderState: string;
  sections: string[];
};

export class InMemoryPublicContentRepository {
  getLandingSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed landing content boundary. Real CMS or content delivery integration is deferred.",
      sections: ["hero message", "service summary", "entry links"],
    };
  }

  getServiceSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed service content boundary. Real content loading is deferred to later work.",
      sections: ["service summary", "customer value", "merchant value"],
    };
  }

  getMerchantSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed merchant onboarding boundary. Real inquiry or CMS loading is deferred to later work.",
      sections: [
        "merchant value proposition",
        "inquiry entry",
        "onboarding handoff",
      ],
    };
  }

  getSupportSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed support content boundary. Real support loading is deferred to later work.",
      sections: ["help entry", "policy links", "support categories"],
    };
  }

  getLegalSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed legal content boundary. Real document loading is deferred to later work.",
      sections: ["privacy", "terms", "refund policy"],
    };
  }

  getDownloadSnapshot(): PublicContentSnapshot {
    return {
      placeholderState:
        "Repository-backed app-download boundary. Real app-store integration is deferred to later work.",
      sections: ["platform badges placeholder", "download copy", "customer handoff"],
    };
  }
}

export const publicContentRepository = new InMemoryPublicContentRepository();
