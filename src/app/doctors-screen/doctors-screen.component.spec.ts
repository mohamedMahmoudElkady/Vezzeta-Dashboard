import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsScreenComponent } from './doctors-screen.component';

describe('DoctorsScreenComponent', () => {
  let component: DoctorsScreenComponent;
  let fixture: ComponentFixture<DoctorsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
