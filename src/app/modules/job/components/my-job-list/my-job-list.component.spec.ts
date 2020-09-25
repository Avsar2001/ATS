import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobListComponent } from './my-job-list.component';

describe('MyJobListComponent', () => {
  let component: MyJobListComponent;
  let fixture: ComponentFixture<MyJobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJobListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
