import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, merge, Subject } from 'rxjs';
import { TreeNode } from 'primeng/api/treenode';
import { AutocompleteTreeService } from './services/autocomplete-tree.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { tap, switchMap, takeUntil } from 'rxjs/operators';
import { AutocompleteTableService } from './services/autocomplete-table.service';
import { ListData, TableColumn, SearchParams } from './ui/autocomplete-table/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  treeListData$: Observable<TreeNode[]>;

  tableListData$: Observable<ListData>;
  tableColumns$: Observable<TableColumn<any>[]>;

  private tableColumnsSubject = new BehaviorSubject<TableColumn<any>[]>([]);
  private tableSearchSubject = new BehaviorSubject<SearchParams>({} as SearchParams);
  private destroySubject = new Subject<boolean>();

  autocomplete: FormGroup;

  constructor(
    private autocompleteTreeService: AutocompleteTreeService,
    private autocompleteTableService: AutocompleteTableService
  ) {}

  ngOnInit() {
    this.createForm();
    merge(
      this.autocomplete.get('tree').valueChanges.pipe(tap(value => console.log('autocomplete-tree value: ', value))),
      this.autocomplete.get('table').valueChanges.pipe(tap(value => console.log('autocomplete-table value: ', value)))
    )
      .pipe(takeUntil(this.destroySubject))
      .subscribe();

    this.treeListData$ = this.autocompleteTreeService.fetchData();

    this.tableListData$ = this.getTableData();
    this.tableColumns$ = this.tableColumnsSubject.asObservable();
    this.tableColumnsSubject.next([
      { label: 'Nombre', field: 'name' },
      { label: 'Identificador', field: 'id' }
    ]);
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  onTableSearch(searchParams: SearchParams): void {
    this.tableSearchSubject.next(searchParams);
  }

  private getTableData(): Observable<ListData> {
    return this.tableSearchSubject
      .pipe(
        switchMap(params => this.autocompleteTableService.fetchData(params)),
      );
  }

  private createForm(): void {
    this.autocomplete = new FormGroup({
      tree: new FormControl({value: '', disabled: false}, Validators.required),
      table: new FormControl({value: '', disabled: false}),
    });
  }

}
