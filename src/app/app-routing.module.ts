import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './sign-up/sign-up.component'
import { AuthGuard } from './services/auth.guard';
import { PetDetailsComponent } from './pet/pet-details/pet-details.component';
import { DailyLogComponent } from './daily-log/daily-log.component';
import { DailyLogEventFormComponent } from './daily-log-event-form/daily-log-event-form.component';
import { ShareInvitesComponent } from './share-invites/share-invites.component';
import { ManagePetComponent } from './pet/manage-pet/manage-pet.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'pet', component: PetDetailsComponent},
  {path:'pet/dailyLog', component: DailyLogComponent},
  {path: 'logEvent', component: DailyLogEventFormComponent},
  {path: 'shareInvites', component: ShareInvitesComponent},
  {path: 'manage', component: ManagePetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
``