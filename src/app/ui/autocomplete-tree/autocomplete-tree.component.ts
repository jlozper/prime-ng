import { Component, OnInit, Input, ChangeDetectionStrategy, Self, ChangeDetectorRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl  } from '@angular/forms';

import { Observable, BehaviorSubject } from 'rxjs';
import { withLatestFrom, map, shareReplay } from 'rxjs/operators';

import { TreeNode } from 'primeng/api/treenode';

import { TreeEvent } from './models/tree-event.model';
import { AutocompleteEvent } from './models/autocomplete-event.model';

@Component({
  selector: 'pri-autocomplete-tree',
  templateUrl: './autocomplete-tree.component.html',
  styleUrls: ['./autocomplete-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteTreeComponent  implements ControlValueAccessor, OnInit {

  @Input() field = 'label'; // Campo a mostrar en caso de utilizar objetos como valor en el autocomplete
  @Input() emptyMessage = 'No existen resultados'; // Mensaje en caso de que no se obtengan resultados en la búsqueda
  @Input() selectionMode = 'single';
  @Input() listData$: Observable<TreeNode[]>; // Listado de datos a utilizar en el tree

  formControl: FormControl;

  filteredList$: Observable<TreeNode[]>;
  suggestions$ = new BehaviorSubject<TreeNode[]>([]);

  private searchSubject = new BehaviorSubject<string>(''); // Subject para el evento de búsqueda del autocomplete

  onChange = (_: any) => {};
  onTouch = () => {};

  constructor(
    @Self() public ngControl: NgControl,
    private changeDetectionRef: ChangeDetectorRef
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.formControl = this.ngControl.control as FormControl; // Obtenemos la instanacia del control del host (autocomplete-tree)
    this.filteredList$ = this.filteredList();
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

  // onNodeSelect del tree
  onNodeSelect(event: TreeEvent): void {
    const value = event.node;
    this.suggestions$.next([value]); // Pasamos el valor al autocomplete para que pueda ser mostrado
    this.formControl.setValue(value); // Seteamos el valor del control con el nodo seleccionado en el tree
  }

  // Evita la propagación del evento del nodo
  onStopPropagation(event: TreeEvent): void {
    event.originalEvent.stopPropagation();
  }

  // Flujo para el filtrado de los datos del tree partiendo del término de búsqueda
  private filteredList(): Observable<TreeNode[]> {
    return this.searchSubject
      .pipe(
        withLatestFrom(this.listData$),
        map(([searchTerm, listData]) => this.filterData(listData, searchTerm)),
        shareReplay(1),
      );
  }

  /*
   * Método recursivo para el filtrado de nodos en función del término de búsqueda.
   * Si el nodo contiene el término de búsqueda, se muesta éste y no se comprueban los hijos.
   * Si el nodo no contiene el término de búsqueda, se comprueban los hijos (si existen).
   * Si los hijos contienen el término de búsqueda, se muestra la ruta completa con los padres expandidos
   */
  private filterData(data: TreeNode[], searchTerm: string): TreeNode[] {
    return data
      .reduce((filteredData, node) => {
        if (node.label && this.includes(node.label, searchTerm)) {
          filteredData.push(node);
        } else if (node.children?.length) {
          const filteredChildren = this.filterData(node.children, searchTerm);
          if (filteredChildren?.length) {
            filteredData.push({ ...node, children: filteredChildren, expanded: true });
          }
        }
        return filteredData;
      }, []);
  }

  // Comprueba si una cadena contiene una subcadena sin tener en cuenta mayúsculas o acentos
  private includes(str: string, substr: string): boolean {
    return this.normalize(str).includes(this.normalize(substr));
  }

  // Normaliza una cadena quitando acentos y pasándola a minúscula
  private normalize(str: string): string {
    return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

}
