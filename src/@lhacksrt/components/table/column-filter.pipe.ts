import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from './table.interface';

@Pipe({ name: 'columnFilter' })
export class ColumnFilterPipe implements PipeTransform {
  transform(columns: TableColumn<any>[]): string[] {
    return columns.filter(column => column.visible).map(column => column.property);
  }
}
