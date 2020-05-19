import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutocompleteTreeModule } from './ui/autocomplete-tree/autocomplete-tree.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteTableModule } from './ui/autocomplete-table/autocomplete-table.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AutocompleteTreeModule,
    AutocompleteTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
