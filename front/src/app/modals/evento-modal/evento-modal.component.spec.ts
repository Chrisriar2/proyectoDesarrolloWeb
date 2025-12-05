import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoModalComponent } from './evento-modal.component';

describe('EventoModalComponent', () => {
  let component: EventoModalComponent;
  let fixture: ComponentFixture<EventoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventoModalComponent]
    });
    fixture = TestBed.createComponent(EventoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
