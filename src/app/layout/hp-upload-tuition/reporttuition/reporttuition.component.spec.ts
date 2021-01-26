import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporttuitionComponent } from './reporttuition.component';

describe('ReporttuitionComponent', () => {
  let component: ReporttuitionComponent;
  let fixture: ComponentFixture<ReporttuitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporttuitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporttuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
