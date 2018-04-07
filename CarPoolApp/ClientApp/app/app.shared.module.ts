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
import { LogoutComponent } from './components/logout/logout.component';
import { CarpoolsComponent } from './components/carpools/carpools.component';
import { ViewAllCarpoolsComponent } from './components/viewallcarpools/viewallcarpools.component';
import { CreateCarpoolComponent } from './components/createcarpool/createcarpool.component';

import { CarpoolService } from './components/carpool.service';
import { LoginService } from './components/login.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        LogoutComponent,
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
            { path: 'logout', component: LogoutComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        CarpoolService,
        LoginService
    ]
})
export class AppModuleShared {
}
