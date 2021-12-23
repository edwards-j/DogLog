import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DogLog';
  showNavButton: boolean
  @ViewChild('sidenav') sidenav: any; 

  constructor(private afAuth: AngularFireAuth, private router: Router, private authService: AuthService) {
    this.showNavButton = false;

    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.showNavButton = true
      } else {
        this.showNavButton = false
      }
    })
  }

  toggleSideNav() {
    this.sidenav.toggle()
  }

  navigateToRoute(route: string) {
    this.router.navigate([`/${route}`]).then(() => {
      this.toggleSideNav()
    })
  }

  navigateHome(): void {
    this.router.navigate(['/home']).then(() => {
      this.toggleSideNav()
    })
  }

  logOut() {
    this.authService.logoutUser()
  }

  goBack() {
    window.history.back()
  }
  
}


