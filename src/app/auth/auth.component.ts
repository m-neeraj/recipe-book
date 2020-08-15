import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector : 'app-auth',
    templateUrl : 'auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, { static :false }) alertHost: PlaceholderDirective;
    closeSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }

        this.isLoading = true;
        const formValues = form.value;
        let authObservable = new Observable<AuthResponseData>();

        if(this.isLoginMode) {
            authObservable = this.authService.login(formValues.email, formValues.password);    
        } else {
            authObservable = this.authService.signup(formValues.email, formValues.password);
        }
        
        authObservable.subscribe(
            resData => {
                this.isLoading = false;
                this.error = "";
                console.log("login/signup Response :  : ");
                console.log(resData);
                this.router.navigate(["recipes"]);
            }, errorMessage => {
                this.isLoading = false;
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
            }
        );

    form.reset();
    }

    // onCloseErrorAlert() {
    //     this.error = null;
    // }

    ngOnDestroy() {
        if(this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }

    showErrorAlert(message: string) {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const errorAlertComponent = 
            hostViewContainerRef.createComponent(alertComponentFactory);
        errorAlertComponent.instance.message = message;
        this.closeSubscription = errorAlertComponent.instance.close.subscribe(() => {
            this.closeSubscription.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}