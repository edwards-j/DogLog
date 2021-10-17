import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore) {

    // Set up the observable to track auth state changes
    // If a user logs in, set their info in session
    // If they log out, remove it
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        sessionStorage.setItem('user', JSON.stringify(user))
      } else {
        sessionStorage.removeItem('user')
      }
    })

  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
      })
      .catch(error => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) {
          return { isValid: false, message: error.message };
        } else {
          return {}
        }
      });
  }

  signupUser(user: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let emailLower = user.email.toLowerCase();

        this.db.doc('/users/' + emailLower)    // on a successful signup, create a document in 'users' collection with the new user's info
          .set({
            accountType: 'endUser',
            displayName: user.displayName,
            displayName_lower: user.displayName.toLowerCase(),
            email: user.email,
            email_lower: emailLower
          });

        //result.user.sendEmailVerification();                    // immediately send the user a verification email
      })
      .catch(error => {
        console.log('Auth Service: signup error', error);
        if (error.code) {
          return { isValid: false, message: error.message };
        } else {
          return {}
        }
      });
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Auth Service: reset password success');
        // this.router.navigate(['/amount']);
      })
      .catch(error => {
        console.log('Auth Service: reset password error...');
        console.log(error.code);
        console.log(error)
        if (error.code)
          return error;
      });
  }

  // async resendVerificationEmail() {                         // verification email is sent in the Sign Up function, but if you need to resend, call this function
  //   return (await this.afAuth.currentUser).sendEmailVerification()
  //     .then(() => {
  //       // this.router.navigate(['home']);
  //     })
  //     .catch(error => {
  //       console.log('Auth Service: sendVerificationEmail error...');
  //       console.log('error code', error.code);
  //       console.log('error', error);
  //       if (error.code)
  //         return error;
  //     });
  // }

  logoutUser(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['/login']);                    // when we log the user out, navigate them to home
      })
      .catch(error => {
        console.log('Auth Service: logout error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code)
          return error;
      });
  }

  setUserInfo(payload: object) {
    console.log('Auth Service: saving user info...');
    this.db.collection('users')
      .add(payload).then((res: any) => {
        console.log("Auth Service: setUserInfo response...")
        console.log(res);
      })
  }

  getUserDataFromSession() {
    let userString = sessionStorage.getItem('user')
    return JSON.parse(userString || '{}')
  }
}
