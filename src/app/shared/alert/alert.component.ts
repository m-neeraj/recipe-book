import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector : 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls : ['alert.component.css']
})
export class AlertComponent {
    @Input() message: string;
    @Output() close = new EventEmitter<void>();

    constructor(private router: Router) {}

    onCloseAlert() {
        this.close.emit();
    }
}