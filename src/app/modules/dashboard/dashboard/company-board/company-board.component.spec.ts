import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBoardComponent } from './company-board.component';

describe('CompanyBoardComponent', () => {
  let component: CompanyBoardComponent;
  let fixture: ComponentFixture<CompanyBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
