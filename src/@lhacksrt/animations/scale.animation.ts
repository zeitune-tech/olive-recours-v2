import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnimationDurations, AnimationCurves } from './constant.animation';

// -----------------------------------------------------------------------------------------------------
// @ Scale in out
// -----------------------------------------------------------------------------------------------------
const scaleInOut = trigger('scaleInOut',
    [

        state('void',
            style({
                opacity  : 0,
                transform: 'scale(0.5)'
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


// -----------------------------------------------------------------------------------------------------
// @ Scale fade in
// -----------------------------------------------------------------------------------------------------

const scaleFadeIn = trigger('scaleFadeIn',
    [

        state('void',
            style({
                opacity  : 0,
                transform: 'scale(0.8)'
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
        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${AnimationDurations.entering} ${AnimationCurves.deceleration}`
                }
            }
        )
    ]
);


// -----------------------------------------------------------------------------------------------------
// @ Scale in
// -----------------------------------------------------------------------------------------------------

const scaleIn = trigger('scaleIn',
    [

        state('void',
            style({
                transform: 'scale(0)'
            })
        ),

        state('*',
            style({
                transform: 'scale(1)'
            })
        ),

        // Prevent the transition if the state is false
        transition('void => false', []),

        // Transition
        transition('void => *', animate('{{timings}}'),
            {
                params: {
                    timings: `${AnimationDurations.entering} ${AnimationCurves.deceleration}`
                }
            }
        )
    ]
);

export { 
    scaleInOut,
    scaleFadeIn,
    scaleIn
};