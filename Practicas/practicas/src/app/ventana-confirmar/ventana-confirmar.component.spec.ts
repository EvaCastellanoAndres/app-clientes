import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaConfirmarComponent } from './ventana-confirmar.component';

describe('VentanaConfirmarComponent', () => {
  let component: VentanaConfirmarComponent;
  let fixture: ComponentFixture<VentanaConfirmarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaConfirmarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
