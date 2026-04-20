import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Couple } from './couple';

describe('Couple', () => {
  let component: Couple;
  let fixture: ComponentFixture<Couple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Couple],
    }).compileComponents();

    fixture = TestBed.createComponent(Couple);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
