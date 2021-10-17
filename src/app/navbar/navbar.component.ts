import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showNav: boolean

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private router: Router) { 
    this.showNav = false;

    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.showNav = true
      } else {
        this.showNav = false
      }
    })
  }

  ngOnInit(): void {
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  logOut() {
    this.authService.logoutUser()
  }

}
