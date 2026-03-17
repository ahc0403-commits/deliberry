import { publicContentRepository } from "./public-content-repository";

export class PublicContentService {
  getLandingSnapshot() {
    return publicContentRepository.getLandingSnapshot();
  }

  getServiceSnapshot() {
    return publicContentRepository.getServiceSnapshot();
  }

  getMerchantSnapshot() {
    return publicContentRepository.getMerchantSnapshot();
  }

  getSupportSnapshot() {
    return publicContentRepository.getSupportSnapshot();
  }

  getLegalSnapshot() {
    return publicContentRepository.getLegalSnapshot();
  }

  getDownloadSnapshot() {
    return publicContentRepository.getDownloadSnapshot();
  }
}

export const publicContentService = new PublicContentService();
