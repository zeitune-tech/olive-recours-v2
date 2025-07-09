import { Injectable } from "@angular/core";
import { GridListItemsOptions, GridListItem } from "./grid-list.interface";


@Injectable()
export class GridListService {

    constructor() {}

    options: GridListItemsOptions<GridListItem>[] = [
        {
            property: "title",
            type: "title"
        },
        {
            property: "subtitle",
            type: "subtitle"
        },
        {
            property: "image",
            type: "image"
        },
        {
            property: "badge",
            type: "badge"
        },
        {
            property: "progress",
            type: "progress"
        },
        {
            property: "checkbox",
            type: "checkbox"
        },
        {
            property: "category",
            type: "category"
        }
    ];
}