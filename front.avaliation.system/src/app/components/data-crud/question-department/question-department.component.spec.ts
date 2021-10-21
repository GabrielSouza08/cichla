import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDepartmentComponent } from './question-department.component';

describe('QuestionDepartmentComponent', () => {
  let component: QuestionDepartmentComponent;
  let fixture: ComponentFixture<QuestionDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
