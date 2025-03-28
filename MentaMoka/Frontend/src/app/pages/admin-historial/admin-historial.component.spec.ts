import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistorialComponent } from './admin-historial.component';

describe('AdminHistorialComponent', () => {
  let component: AdminHistorialComponent;
  let fixture: ComponentFixture<AdminHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
