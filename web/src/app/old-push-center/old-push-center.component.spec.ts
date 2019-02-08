import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldPushCenterComponent } from './old-push-center.component';

describe('OldPushCenterComponent', () => {
  let component: OldPushCenterComponent;
  let fixture: ComponentFixture<OldPushCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldPushCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldPushCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
