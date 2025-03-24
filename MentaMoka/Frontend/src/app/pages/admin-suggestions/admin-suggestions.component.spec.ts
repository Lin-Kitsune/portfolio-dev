import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSuggestionsComponent } from './admin-suggestions.component';

describe('AdminSuggestionsComponent', () => {
  let component: AdminSuggestionsComponent;
  let fixture: ComponentFixture<AdminSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
