import { Component, Input } from "@angular/core";
import { GridListItem, GridListItemsOptions } from "../grid-list.interface";


@Component({
    selector: 'template-grid-list-item',
    templateUrl: './grid-list-item.component.html'
})
export class GridListItemComponent {
    
    @Input() item: GridListItem = {
        type: "vertical",
        title: "Title",
        subtitle: "Subtitle",
        slug: "slug",
        category: "Category",
        image: "https://via.placeholder.com/150",
        badge: ["Badge 1", "Badge 2"],
        duration: 60,
        totalSteps: 3,
        updatedAt: "2021-01-01",
        createdAt: "2021-01-01",
        featured: true,
        progress: {
            currentStep: 1,
            completed: 3
        },
        checkbox: true
    };
    
    constructor() { }
}