import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpletreeComponent } from './simpletree.component';

describe('SimpletreeComponent', () => {
  let component: SimpletreeComponent;
  let fixture: ComponentFixture<SimpletreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpletreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpletreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
