import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPhotographerLoginComponent } from './admin-photographer-login.component';

describe('AdminPhotographerLoginComponent', () => {
  let component: AdminPhotographerLoginComponent;
  let fixture: ComponentFixture<AdminPhotographerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPhotographerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPhotographerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
