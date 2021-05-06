import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauhinhsoduEditComponent } from './cauhinhsodu-edit.component';

describe('CauhinhsoduEditComponent', () => {
  let component: CauhinhsoduEditComponent;
  let fixture: ComponentFixture<CauhinhsoduEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauhinhsoduEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauhinhsoduEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
