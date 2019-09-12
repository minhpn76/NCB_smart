import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesshistoryComponent } from './accesshistory.component';

describe('AccesshistoryComponent', () => {
  let component: AccesshistoryComponent;
  let fixture: ComponentFixture<AccesshistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesshistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
