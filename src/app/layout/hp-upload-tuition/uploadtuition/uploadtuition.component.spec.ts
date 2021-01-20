import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadtuitionComponent } from './uploadtuition.component';

describe('UploadtuitionComponent', () => {
  let component: UploadtuitionComponent;
  let fixture: ComponentFixture<UploadtuitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadtuitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadtuitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
