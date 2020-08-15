import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
@Component({
    selector : 'app-header',
    templateUrl : './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated =  false;
    collapsed = true;
    private userSub = new Subscription;

    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService,
        ) {}

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(
            user => {
                this.isAuthenticated = !!user;
            }
        );
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}