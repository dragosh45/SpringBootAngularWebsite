import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersPageComponentComponent } from './members-page-component.component';

describe('MembersPageComponentComponent', () => {
  let component: MembersPageComponentComponent;
  let fixture: ComponentFixture<MembersPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersPageComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
