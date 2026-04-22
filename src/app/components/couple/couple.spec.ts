import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoupleComponent } from './couple';

describe('Couple', () => {
  let component: CoupleComponent;
  let fixture: ComponentFixture<CoupleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoupleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoupleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
