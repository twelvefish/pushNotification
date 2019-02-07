import { PushCenterModule } from './push-center.module';

describe('PushCenterModule', () => {
  let pushCenterModule: PushCenterModule;

  beforeEach(() => {
    pushCenterModule = new PushCenterModule();
  });

  it('should create an instance', () => {
    expect(pushCenterModule).toBeTruthy();
  });
});
