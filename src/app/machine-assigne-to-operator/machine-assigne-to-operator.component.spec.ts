import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineAssigneToOperatorComponent } from './machine-assigne-to-operator.component';

describe('MachineAssigneToOperatorComponent', () => {
  let component: MachineAssigneToOperatorComponent;
  let fixture: ComponentFixture<MachineAssigneToOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineAssigneToOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineAssigneToOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
