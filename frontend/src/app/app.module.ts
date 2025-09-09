import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { ProjectCreateComponent } from './features/projects/project-create/project-create.component';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';
import { TaskDetailComponent } from './features/tasks/task-detail/task-detail.component';
import { TaskCreateComponent } from './features/tasks/task-create/task-create.component';
import { HomeComponent } from './features/home/home.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { DashboardClientComponent } from './features/dashboard/dashboard-client/dashboard-client.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderUserComponent } from './shared/components/header-user/header-user.component';
import { ProfileComponent } from './profile/profile.component';
import { HeaderClientComponent } from './header-client/header-client.component'; // <-- ajoute ça

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectCreateComponent,
    TaskListComponent,
    TaskDetailComponent,
    TaskCreateComponent,
    HomeComponent,
    DashboardClientComponent,
    HeaderUserComponent,
    ProfileComponent,
    HeaderClientComponent,
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
      RouterModule,
       AppRoutingModule,
       HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
