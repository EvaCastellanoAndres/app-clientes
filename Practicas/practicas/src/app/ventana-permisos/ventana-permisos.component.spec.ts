import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaPermisosComponent } from './ventana-permisos.component';

describe('VentanaPermisosComponent', () => {
  let component: VentanaPermisosComponent;
  let fixture: ComponentFixture<VentanaPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaPermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
