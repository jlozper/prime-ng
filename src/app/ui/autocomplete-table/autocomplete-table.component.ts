import { Component, OnInit, Input, ChangeDetectionStrategy, Self, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl  } from '@angular/forms';

import { Observable, BehaviorSubject, Subject, merge } from 'rxjs';
import { pluck, tap, withLatestFrom, shareReplay, takeUntil, map } from 'rxjs/operators';

import { LazyLoadEvent } from 'primeng/api/public_api';

import { AutocompleteEvent } from '../autocomplete-tree/models/autocomplete-event.model';
import { TableColumn } from './models/table-column.model';
import { ListData, PaginationData } from './models/list-data.model';
import { SearchParams } from './models/search-params.model';


@Component({
  selector: 'pri-autocomplete-table',
  templateUrl: './autocomplete-table.component.html',
  styleUrls: ['./autocomplete-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteTableComponent<T>  implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() field; // Campo a mostrar en caso de utilizar objetos como valor en el autocomplete
  @Input() emptyMessage = 'No existen resultados'; // Mensaje en caso de que no se obtengan resultados en la búsqueda
  @Input() tableColumns$: Observable<TableColumn<T>[]>;
  @Input() listData$: Observable<ListData>; // Listado de datos a utilizar en el tree

  @Output() searchTermChanges = new EventEmitter<SearchParams>();

  tableData$: Observable<object[]>;
  paginationData$: Observable<PaginationData>;

  suggestions$ = new BehaviorSubject<any[]>([]);

  formControl: FormControl;

  private searchSubject = new BehaviorSubject<string>(''); // Subject para el evento de búsqueda del autocomplete
  private lazyLoadSubject = new BehaviorSubject<number>(0); // Subject para el evento de paginación del tamplate
  private destroySubject = new Subject<boolean>();

  onChange = (_: any) => {};
  onTouch = () => {};

  constructor(
    @Self() public ngControl: NgControl,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.formControl = this.ngControl.control as FormControl; // Obtenemos la instanacia del control del host (autocomplete-tree)

    this.listData$ = this.listData$.pipe(shareReplay(1));

    this.tableData$ = this.listData$
      .pipe(
        pluck('tableData'),
        shareReplay(1),
      );

    this.paginationData$ = this.listData$
      .pipe(
        pluck('paginationData'),
        shareReplay(1),
      );

    // Establecemos el campo a mostrar en el autocomplete si no se ha pasado como parámetro
    this.tableColumns$ = this.tableColumns$.pipe(tap(columns => this.field = this.field || columns[0].field));

    // Única subscripción a eventos
    this.fetchData()
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
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
    this.suggestions$.next([{}]); // Un único valor nos permite mostrar el template (el tree)
    this.searchSubject.next(event.query); // Pasamos el término de búsqueda al Subject del evento
  }

  // onRowSelect de la tabla
  onRowSelect(event: MouseEvent, row: T): void {
    const value = row;
    this.suggestions$.next([value]); // Pasamos el valor al autocomplete para que pueda ser mostrado
    this.formControl.setValue(value); // Seteamos el valor del control con el nodo seleccionado en el tree
  }

  // onLazyLoad de la tabla
  onLazyLoad(event: LazyLoadEvent) {
    this.lazyLoadSubject.next(event.first);
  }

  // onClick en la tabla
  onTableClick(event: any) {
    if (event.target.className.includes('paginator')) {
      event.stopPropagation();
    }
  }

  // Flujo del evento de obtención de datos
  private fetchData(): Observable<any> {
    return merge(
      this.fromSearch(),
      this.fromPaginator()
    )
      .pipe(
        tap(([searchTerm, paginationData]) => this.searchTermChanges.emit({ searchTerm, paginationData })),
      );
  }

  // Obtener datos tras búsqueda del autocomplete
  private fromSearch(): Observable<[string, PaginationData]> {
    return this.searchSubject
      .pipe(
        withLatestFrom(this.paginationData$)
      );
  }

  // Obtener datos tras utilizar el paginador de la tabala
  private fromPaginator(): Observable<[string, PaginationData]> {
    return this.lazyLoadSubject
      .pipe(
        withLatestFrom(this.paginationData$),
        map(([first, paginationData]) => [this.searchSubject.value, {
          ...paginationData, pageIndex: first / paginationData.pageSize
        }])
      );
  }
}
