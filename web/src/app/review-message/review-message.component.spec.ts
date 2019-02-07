import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMessageComponent } from './review-message.component';

describe('ReviewMessageComponent', () => {
  let component: ReviewMessageComponent;
  let fixture: ComponentFixture<ReviewMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
