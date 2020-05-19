export interface RowEvent<T> {
  originalEvent: MouseEvent;
  data: T;
  type: 'row' | 'radiobutton' | 'checkbox';
  index: number;
}
