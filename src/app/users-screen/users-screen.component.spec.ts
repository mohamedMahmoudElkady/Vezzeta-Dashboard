import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersScreenComponent } from './users-screen.component';

describe('UsersScreenComponent', () => {
  let component: UsersScreenComponent;
  let fixture: ComponentFixture<UsersScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
