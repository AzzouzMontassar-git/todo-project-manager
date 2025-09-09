import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importe tous tes composants
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectCreateComponent } from './features/projects/project-create/project-create.component';
import { DashboardClientComponent } from './features/dashboard/dashboard-client/dashboard-client.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard-client', component: DashboardClientComponent },

  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/create', component: ProjectCreateComponent },
  { path: '**', redirectTo: '' } // redirige toute route inconnue vers Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
