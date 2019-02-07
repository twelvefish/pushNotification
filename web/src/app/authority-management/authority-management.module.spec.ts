import { AuthorityManagementModule } from './authority-management.module';

describe('AuthorityManagementModule', () => {
  let authorityManagementModule: AuthorityManagementModule;

  beforeEach(() => {
    authorityManagementModule = new AuthorityManagementModule();
  });

  it('should create an instance', () => {
    expect(authorityManagementModule).toBeTruthy();
  });
});
