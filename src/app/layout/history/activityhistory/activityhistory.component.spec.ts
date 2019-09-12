import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityhistoryComponent } from './activityhistory.component';

describe('ActivityhistoryComponent', () => {
  let component: ActivityhistoryComponent;
  let fixture: ComponentFixture<ActivityhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
