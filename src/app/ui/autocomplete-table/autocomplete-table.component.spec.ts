import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteTableComponent } from './autocomplete-table.component';

describe('AutocompleteTableComponent', () => {
  let component: AutocompleteTableComponent;
  let fixture: ComponentFixture<AutocompleteTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
