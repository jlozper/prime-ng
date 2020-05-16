import { Component, OnInit, Input, ChangeDetectionStrategy, Self } from '@angular/core';
import { FormControl, ControlValueAccessor, NgControl  } from '@angular/forms';

import { Observable, BehaviorSubject } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

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
  @Input() listData$: Observable<TreeNode[]>;

  formControl: FormControl;

  filteredList$: Observable<TreeNode[]>;
  searchSubject = new BehaviorSubject<string>('');
  suggestions$ = new BehaviorSubject<TreeNode[]>([]);

  onChange = (_: any) => {};
  onTouch = () => {};

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.formControl = this.ngControl.control as FormControl;
    this.filteredList$ = this.filteredList();
  }

  writeValue(value: any): void {
    return value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onSearch(event: AutocompleteEvent): void {
    this.suggestions$.next([{}]);
    this.searchSubject.next(event.query);
  }

  onNodeSelect(event: TreeEvent): void {
    const value = event.node;
    this.suggestions$.next([value]);
    this.formControl.setValue(value);
  }

  onStopPropagation(event: TreeEvent): void {
    event.originalEvent.stopPropagation();
  }

  private filteredList(): Observable<TreeNode[]> {
    return this.searchSubject
      .pipe(
        withLatestFrom(this.listData$),
        map(([searchTerm, listData]) => this.filterData(listData, searchTerm)),
      );
  }

  private filterData(data: any, searchTerm: string, depth = 1): TreeNode[] {
    return data
      .reduce((filteredData, row) => {
        if (row.label && this.includes(row.label, searchTerm)) {
          filteredData.push(row);
        } else if (row.children?.length) {
          const filteredChildren = this.filterData(row.children, searchTerm, ++depth);
          if (filteredChildren?.length) {
            filteredData.push({ ...row, children: filteredChildren, expanded: true });
          }
        }
        return filteredData;
      }, [])
      .flat(depth);
  }

  private includes(str: string, substr: string): boolean {
    return this.normalize(str).includes(this.normalize(substr));
  }

  private normalize(str: string): string {
    return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

}
