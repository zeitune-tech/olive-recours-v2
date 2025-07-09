import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { fromPairs } from 'lodash-es';
import { AppConfigService } from '../config/config.service';

@Injectable({
    providedIn: 'root'
})
export class MediaWatcherService {

    private _onMediaChange: ReplaySubject<{ 
        matchingAliases: string[]; 
        matchingQueries: any 
    }> = new ReplaySubject<{ 
        matchingAliases: string[]; 
        matchingQueries: any 
    }>(1);

    constructor(
        private _breakpointObserver: BreakpointObserver,
        private _appConfigService: AppConfigService
    ) {
        this._appConfigService.config$.pipe(
            map(config => fromPairs(
                Object.entries(config.screens).map(
                    ([alias, screen]) => ([alias, `(min-width: ${screen})`])
                )
            )),
            switchMap(screens => this._breakpointObserver.observe(Object.values(screens)).pipe(
                map((state) => {

                    // Prepare the observable values and set their defaults
                    const matchingAliases: string[] = [];
                    const matchingQueries: any = {};

                    // Get the matching breakpoints and use them to fill the subject
                    const matchingBreakpoints = Object.entries(state.breakpoints).filter(([_, matches]) => matches) ?? [];
                    
                    for ( const [query] of matchingBreakpoints ) {
                        // Find the alias of the matching query
                        const matchingEntry = Object.entries(screens).find(([_, q]) => q === query);
                        const matchingAlias = matchingEntry ? matchingEntry[0] : undefined;

                        // Add the matching query to the observable values
                        if ( matchingAlias ) {
                            matchingAliases.push(matchingAlias);
                            matchingQueries[matchingAlias] = query;
                        }
                    }

                    // Execute the observable
                    this._onMediaChange.next({
                        matchingAliases,
                        matchingQueries
                    });
                })
            ))
        ).subscribe();
    }
    
    get onMediaChange$(): Observable<{ 
        matchingAliases: string[]; 
        matchingQueries: any 
    }> {
        return this._onMediaChange.asObservable();
    }

    onMediaQueryChange$(query: string | string[]): Observable<BreakpointState> {
        return this._breakpointObserver.observe(query);
    }
}
