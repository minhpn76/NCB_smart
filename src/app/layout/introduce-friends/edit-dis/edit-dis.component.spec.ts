import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDisComponent } from './edit-dis.component';

describe('EditDisComponent', () => {
  let component: EditDisComponent;
  let fixture: ComponentFixture<EditDisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
