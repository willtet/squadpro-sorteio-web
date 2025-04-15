import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacaoRegistroComponent } from './confirmacao-registro.component';

describe('ConfirmacaoRegistroComponent', () => {
  let component: ConfirmacaoRegistroComponent;
  let fixture: ComponentFixture<ConfirmacaoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacaoRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmacaoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
