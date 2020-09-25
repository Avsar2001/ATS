import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventListComponent } from './my-event-list.component';

describe('MyEventListComponent', () => {
  let component: MyEventListComponent;
  let fixture: ComponentFixture<MyEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
