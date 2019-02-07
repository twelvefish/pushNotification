import { ReviewMessageModule } from './review-message.module';

describe('ReviewMessageModule', () => {
  let reviewMessageModule: ReviewMessageModule;

  beforeEach(() => {
    reviewMessageModule = new ReviewMessageModule();
  });

  it('should create an instance', () => {
    expect(reviewMessageModule).toBeTruthy();
  });
});
