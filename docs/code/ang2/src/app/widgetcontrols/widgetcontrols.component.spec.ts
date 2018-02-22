import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetcontrolsComponent } from './widgetcontrols.component';

describe('WidgetcontrolsComponent', () => {
  let component: WidgetcontrolsComponent;
  let fixture: ComponentFixture<WidgetcontrolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetcontrolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetcontrolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
