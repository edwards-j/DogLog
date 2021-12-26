import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pet } from 'src/app/models/pet.model';
import { SharePetFormComponent } from 'src/app/dialogs/share-pet-form/share-pet-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-manage-pet',
  templateUrl: './manage-pet.component.html',
  styleUrls: ['./manage-pet.component.css']
})
export class ManagePetComponent implements OnInit {
  currentPet: Pet;
  currentUser: any;

  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private authService: AuthService) { 
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['currentPet']
    } else {
      snackBar.open('Woof! There was an error loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDataFromSession();
  }

  navigateHome(): void {
    this.router.navigate(['/home'], { state: { currentPet: this.currentPet } })
  }

  openSharePetForm() {
    this.dialog.open(SharePetFormComponent, { data: { userEmail: this.currentUser.email, petID: this.currentPet.petID, petName: this.currentPet.petName } })
  }

  removeShare(email: string) {
    console.log(email)
  }

}
