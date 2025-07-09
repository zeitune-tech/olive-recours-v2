import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnimationDurations, AnimationCurves } from './constant.animation';

// -----------------------------------------------------------------------------------------------------
// @ Popover
// -----------------------------------------------------------------------------------------------------

const popover = trigger('popover',
    [

        state('void',
            style({
                opacity  : 0,
                transform: 'scale(0.6)'
            })
        ),

        state('*',
            style({
                opacity  : 1,
                transform: 'scale(1)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),

        // Transition
        transition('void => *, * => void', animate('{{timings}}'),
            {
                params: {
                    timings: `${AnimationDurations.entering} ${AnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export { popover };