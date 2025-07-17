import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector       : 'error-403',
    templateUrl    : './error-403.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        RouterModule
    ]
})
export class Error403Component
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
