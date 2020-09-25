import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsListFormComponent } from './skills-list-form.component';

describe('SkillsListFormComponent', () => {
  let component: SkillsListFormComponent;
  let fixture: ComponentFixture<SkillsListFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsListFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
