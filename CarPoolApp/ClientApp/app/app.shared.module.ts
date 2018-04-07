import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CarpoolsComponent } from './components/carpools/carpools.component';
import { ViewAllCarpoolsComponent } from './components/viewallcarpools/viewallcarpools.component';
import { CreateCarpoolComponent } from './components/createcarpool/createcarpool.component';

import { CarpoolService } from './components/carpool.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        CarpoolsComponent,
        ViewAllCarpoolsComponent,
        CreateCarpoolComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'viewallcarpools', component: ViewAllCarpoolsComponent},
            { path: 'createcarpool', component: CreateCarpoolComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        CarpoolService
    ]
})
export class AppModuleShared {
}
