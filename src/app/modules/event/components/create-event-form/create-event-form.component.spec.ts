import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventFormComponent } from './create-event-form.component';

describe('CreateEventFormComponent', () => {
  let component: CreateEventFormComponent;
  let fixture: ComponentFixture<CreateEventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
