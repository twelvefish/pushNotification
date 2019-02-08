import { OldPushCenterModule } from './old-push-center.module';

describe('OldPushCenterModule', () => {
  let oldPushCenterModule: OldPushCenterModule;

  beforeEach(() => {
    oldPushCenterModule = new OldPushCenterModule();
  });

  it('should create an instance', () => {
    expect(oldPushCenterModule).toBeTruthy();
  });
});
