interface Node<T> {
    data: T;
    next: Node<T> | null;
}
    
export interface Queue<T> {
    head: Node<T> | null;
    tail: Node<T> | null;

    enqueue(data: T): void;
    dequeue(): T | null;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
}
