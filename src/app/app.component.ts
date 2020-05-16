import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { TreeNode } from 'primeng/api/treenode';
import { AppService } from './app.service';
import { FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  listData$: Observable<TreeNode[]>;

  control = new FormControl({value: '', disabled: false}, Validators.required);

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.listData$ = this.appService.getData();
    this.control.valueChanges.pipe(tap(value => console.log('control value: ', value))).subscribe();
  }

}
