import {
  Component, OnInit, Input, ChangeDetectionStrategy, Self, ChangeDetectorRef, Output, EventEmitter, OnDestroy, Optional
} from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl  } from '@angular/forms';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { pluck, tap, withLatestFrom, shareReplay, takeUntil } from 'rxjs/operators';

import { LazyLoadEvent } from 'primeng/api/public_api';

import { AutocompleteEvent, TableColumn, ListData, SearchParams } from './models';


@Component({
  selector: 'pri-autocomplete-table',
  templateUrl: './autocomplete-table.component.html',
  styleUrls: ['./autocomplete-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteTableComponent<T>  implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() pageSize: number;
  @Input() pageLinks = 3;
  @Input() field: string; // Campo a mostrar en caso de utilizar objetos como valor en el autocomplete
  @Input() emptyMessage = 'No existen resultados'; // Mensaje en caso de que no se obtengan resultados en la búsqueda
  @Input() tableColumns$: Observable<TableColumn<T>[]>;
  @Input() listData$: Observable<ListData>; // Listado de datos a utilizar en el tree

  @Output() searchTermChanges = new EventEmitter<SearchParams>();

  // Variables relacionadas con la tabla
  tableData$: Observable<T[]>;
  totalRecords$: Observable<number>;
  pageSize$: BehaviorSubject<number>;
  private pageIndexSubject = new BehaviorSubject<number>(0);

  // Variables relacionadas con el autocomplete
  suggestions$ = new BehaviorSubject<T[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');

  // Variables
  formControl: FormControl;
  private lazyLoadSubject = new Subject<boolean>(); // Subject para el evento de obtención de datos del servidor
  private destroySubject = new Subject<boolean>();
  
  onChange = (_: any) => {};
  onTouch = () => {};

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.formControl = this.ngControl.control as FormControl; // Obtenemos la instanacia del control del host (autocomplete-tree)

    this.listData$ = this.listData$.pipe(shareReplay(1));
    this.tableData$ = this.listData$.pipe(pluck('tableData'));
    this.totalRecords$ = this.listData$.pipe(pluck('totalRecords'));
    this.pageSize$ = new BehaviorSubject(this.pageSize || 10);

    // Establecemos el campo a mostrar en el autocomplete si no se ha pasado como parámetro
    this.tableColumns$ = this.tableColumns$.pipe(tap(columns => this.field = this.field || columns[0].field));

    // Punto único de subscripción a eventos
    this.fetchData().pipe(takeUntil(this.destroySubject)).subscribe();
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  // Método correspondiente al ControlValueAccessor
  writeValue(value: any): void {
    return value;
  }

  // Método correspondiente al ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Método correspondiente al ControlValueAccessor
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Método correspondiente al ControlValueAccessor
  setDisabledState(isDisabled: boolean) {
    this.changeDetectionRef.markForCheck(); // Rerenderizamos la vista por el uso del changeDetectionRef = OnPush
  }

  // onSearch del autocomplete
  onSearch(event: AutocompleteEvent): void {
    this.suggestions$.next([{} as T]); // Un único valor nos permite mostrar el template (el tree)
    this.searchTermSubject.next(event.query);
    this.lazyLoadSubject.next();
  }

  // onRowSelect de la tabla
  onRowSelect(event: MouseEvent, row: T): void {
    this.suggestions$.next([row]); // Pasamos el valor al autocomplete para que pueda ser mostrado
    this.formControl.setValue(row); // Seteamos el valor del control con el nodo seleccionado en el tree
  }

  // onLazyLoad de la tabla
  onLazyLoad(event: LazyLoadEvent) {
    const pageSize = event.first / event.rows;
    this.pageIndexSubject.next(pageSize);
    this.lazyLoadSubject.next();
  }

  // onClick en la tabla
  onTableClick(event: any) {
    if (event.target.className.includes('paginator')) {
      event.stopPropagation();
    }
  }

  // Flujo del evento de obtención de datos
  private fetchData(): Observable<any> {
    return this.lazyLoadSubject
      .pipe(
        withLatestFrom(this.searchTermSubject, this.pageSize$, this.pageIndexSubject),
        tap(([ignore, searchTerm, pageSize, pageIndex]) =>
          this.searchTermChanges.emit({ searchTerm, paginationData: { pageSize, pageIndex }})
        ),
      );
  }
}
