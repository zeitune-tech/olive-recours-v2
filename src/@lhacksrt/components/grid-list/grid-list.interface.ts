export interface GridListItem {
    type: "vertical" | "horizontal";

    title: string;
    subtitle?: string;
    description?: string;
    slug: string;
    image?: string;
    category: string;

    duration?: number;
    totalSteps?: number;
    updatedAt?: string;
    createdAt?: string;
    featured?: boolean;

    badge?: string[];
    progress?: {
        currentStep: number;
        completed: number;
    };
    checkbox?: boolean;
}
 
export interface GridListItemsOptions<T> {
    property: string;
    type: 'title' | 'subtitle' | 'image' | 'badge' | 'progress' | 'checkbox' | 'category'
            | 'duration' | 'totalSteps' | 'updatedAt' | 'createdAt' | 'featured' | 'description';
    cssClasses?: string[];
}

export interface FilterOptionAccessor {
    key: string;
    label: string;
}

export interface GridListOptions<T> {
    filterOptions: T[]
    filterOptionAccessor: FilterOptionAccessor,
    itemOptions: GridListItemsOptions<T>[]
}