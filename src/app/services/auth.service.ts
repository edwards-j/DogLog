import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn: boolean;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) { 
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.userLoggedIn = true
      } else {
        this.userLoggedIn = false;
      }
    })
  }
}
