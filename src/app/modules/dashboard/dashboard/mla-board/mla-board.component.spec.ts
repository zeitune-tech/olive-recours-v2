import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlaBoardComponent } from './mla-board.component';

describe('MlaBoardComponent', () => {
  let component: MlaBoardComponent;
  let fixture: ComponentFixture<MlaBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MlaBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlaBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
