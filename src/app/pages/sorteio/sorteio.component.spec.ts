import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteioComponent } from './sorteio.component';

describe('SorteioComponent', () => {
  let component: SorteioComponent;
  let fixture: ComponentFixture<SorteioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorteioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SorteioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
