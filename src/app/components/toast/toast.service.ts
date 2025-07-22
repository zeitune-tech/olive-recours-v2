import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastType } from './toast.types';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toasts$ = new BehaviorSubject<Toast[]>([]);
    private defaultDuration = 4000;

    get toasts() {
        return this.toasts$.asObservable();
    }

    show(type: ToastType, message: string, title?: string, duration?: number) {
        const id = Math.random().toString(36).slice(2, 10) + Date.now();
        const toast: Toast = {
            id,
            type,
            message,
            title,
            duration: duration ?? this.defaultDuration,
            createdAt: Date.now(),
        };
        this.toasts$.next([...this.toasts$.value, toast]);
        if (toast.duration) {
            setTimeout(() => this.dismiss(id), toast.duration);
        }
        return id;
    }

    success(message: string, title?: string, duration?: number) {
        return this.show('success', message, title, duration);
    }
    info(message: string, title?: string, duration?: number) {
        return this.show('info', message, title, duration);
    }
    error(message: string, title?: string, duration?: number) {
        return this.show('error', message, title, duration);
    }
    primary(message: string, title?: string, duration?: number) {
        return this.show('primary', message, title, duration);
    }
    accent(message: string, title?: string, duration?: number) {
        return this.show('accent', message, title, duration);
    }
    warn(message: string, title?: string, duration?: number) {
        return this.show('warn', message, title, duration);
    }
    secondary(message: string, title?: string, duration?: number) {
        return this.show('secondary', message, title, duration);
    }

    dismiss(id: string) {
        this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
    }

    clear() {
        this.toasts$.next([]);
    }
} 