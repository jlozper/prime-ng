import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { TreeModule } from 'primeng/tree';

import { AutocompleteTreeComponent } from './autocomplete-tree.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AutocompleteTreeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    TreeModule,
  ],
  exports: [
    AutocompleteTreeComponent
  ]
})
export class AutocompleteTreeModule { }
