import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauhinhsoduComponent } from './cauhinhsodu.component';

describe('CauhinhsoduComponent', () => {
  let component: CauhinhsoduComponent;
  let fixture: ComponentFixture<CauhinhsoduComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauhinhsoduComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauhinhsoduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
