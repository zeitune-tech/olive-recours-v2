import { NgModule } from "@angular/core";
import { DateTokensPipe } from "./date-tokens.pipe";
import { FindByKeyPipe } from "./find-by-key.pipe";
import { RelativeDateTimePipe } from "./relative-date-time.pipe";
import { StripHtmlPipe } from "./strip-html.pipe";



@NgModule({
    declarations: [
        DateTokensPipe,
        FindByKeyPipe,
        RelativeDateTimePipe,
        RelativeDateTimePipe,
        StripHtmlPipe
    ],
    exports : [
        DateTokensPipe,
        FindByKeyPipe,
        RelativeDateTimePipe,
        RelativeDateTimePipe,
        StripHtmlPipe
    ]
})
export class PipeModule {}