import { Injectable } from "@angular/core";
import { Queue } from "./queue.interface";


@Injectable({
    providedIn: 'root',
})
export class QueueService<T>  {
    private _queue: Queue<T>;
    
    constructor() {
        this._queue = {
            head: null,
            tail: null,
            size: () => {
                let current = this._queue.head;
                let count = 0;

                while (current) {
                    count++;
                    current = current.next;
                }

                return count;
            },
            enqueue: (data: T) => {
                const node = {
                    data,
                    next: null
                };

                if (!this._queue.head) {
                    this._queue.head = node;
                    this._queue.tail = node;
                } else {
                    if (this._queue.tail) {
                        this._queue.tail.next = node;
                    }

                    this._queue.tail = node;
                }
            },
            dequeue: () => {
                if (!this._queue.head) {
                    return null;
                }

                const data = this._queue.head.data;

                if (this._queue.head === this._queue.tail) {
                    this._queue.head = null;
                    this._queue.tail = null;
                } else {
                    this._queue.head = this._queue.head.next;
                }

                return data;
            },
            isEmpty: () => {
                return this._queue.head === null;
            },
            clear: () => {
                this._queue.head = null;
                this._queue.tail = null;
            }
        };
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get length(): number {
        return this._queue.size();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    enqueue(value: T): void {
        this._queue.enqueue(value);
    }

    dequeue(): T | null {
        return this._queue.dequeue();
    }

    isEmpty(): boolean {
        return this._queue.isEmpty();
    }

    clear(): void {
        this._queue.clear();
    }
}

