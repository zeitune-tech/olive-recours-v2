import { Component, Input, OnInit } from "@angular/core";
import { SelectedTicket, Ticket } from "../../core/models/common.model";


@Component({
    selector: 'tickets',
    templateUrl: './tickets.component.html',
})
export class TicketsComponent implements OnInit {

    @Input() tickets: Ticket[] = [];
    @Input() isAnalytics: boolean = false;

    currenValues: SelectedTicket[] = [];



    constructor() {
        console.log('TicketsComponent');
    }


    ngOnInit() {
        this.tickets.forEach((ticket) => {
            this.currenValues.push({
                name: ticket.name,
                value: ticket.value[0].value,
                description: ticket.value[0].description
            });
        });
    }

    changeTicket(ticket: Ticket, value: Partial<SelectedTicket>) {
        this.currenValues = this.currenValues.map((currentTicket) => {
            if (currentTicket.name === ticket.name) {
                return {
                    ...currentTicket,
                    ...value
                };
            } else {
                return currentTicket;
            }
        });
    }

    getCurrentValue(ticket: Ticket) {
        return this.currenValues.find((currentTicket) => currentTicket.name === ticket.name);
    }
}