import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSidepanelComponent } from './event-sidepanel.component';

describe('EventSidepanelComponent', () => {
  let component: EventSidepanelComponent;
  let fixture: ComponentFixture<EventSidepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSidepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
