import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TableColumn } from './table.interface';

@Injectable()
export class TableService<T> {

    constructor() { }

    onFilterChange(filterValue: string, dataSource: MatTableDataSource<T>) {
        if (!dataSource) return;
        dataSource.filter = filterValue.trim().toLowerCase();
    }

    toggleColumnVisibility(column: TableColumn<T>, event: Event) {
        event.stopPropagation();
        column.visible = !column.visible;
    }

    isAllSelected(dataSource: MatTableDataSource<T>, selection: SelectionModel<T>) {
        const numSelected = selection.selected.length;
        const numRows = dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(dataSource: MatTableDataSource<T>, selection: SelectionModel<T>) {
        this.isAllSelected(dataSource, selection) ?
        selection.clear() :
        dataSource.data.forEach(row => selection.select(row));
    }

    // Get today's date
    getToday(): Date {
        return new Date();
    }

    // Get all days in a specific month and year
    getDaysInMonth(year: number, month: number): Date[] {
        const days: Date[] = [];
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= totalDays; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    }

    // Get weeks in a specific month and year
    getWeeksInMonth(year: number, month: number): Date[][] {
        const daysInMonth = this.getDaysInMonth(year, month);
        const weeks: Date[][] = [];
        let currentWeek: Date[] = [];

        daysInMonth.forEach((date) => {
        if (currentWeek.length === 0 || date.getDay() > currentWeek[0].getDay()) {
            currentWeek.push(date);
        } else {
            weeks.push(currentWeek);
            currentWeek = [date];
        }
        });

        if (currentWeek.length) {
            weeks.push(currentWeek);
        }

        return weeks;
    }
}
