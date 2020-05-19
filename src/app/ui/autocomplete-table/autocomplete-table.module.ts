import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteTableComponent } from './autocomplete-table.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [AutocompleteTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    TableModule
  ],
  exports: [
    AutocompleteTableComponent
  ]
})
export class AutocompleteTableModule { }
