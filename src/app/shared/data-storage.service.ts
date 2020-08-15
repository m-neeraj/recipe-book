import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

import { map, tap, exhaustMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthService
        ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://neeraj-recipe-book-3dd7b.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log("store recipes response : ");
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
            'https://neeraj-recipe-book-3dd7b.firebaseio.com/recipes.json',
        )
        .pipe(
            map(recipes => {
                console.log("recipes response: ");
                console.log(recipes);
                return recipes.map(recipe => {
                    return {
                        ...recipe, ingredients: recipe.ingredients? recipe.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                console.log("recipes tap");
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}