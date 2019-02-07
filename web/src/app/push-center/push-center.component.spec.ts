import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushCenterComponent } from './push-center.component';

describe('PushCenterComponent', () => {
  let component: PushCenterComponent;
  let fixture: ComponentFixture<PushCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
