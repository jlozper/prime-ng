import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteTreeComponent } from './autocomplete-tree.component';

describe('AutocompleteTreeComponent', () => {
  let component: AutocompleteTreeComponent;
  let fixture: ComponentFixture<AutocompleteTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
