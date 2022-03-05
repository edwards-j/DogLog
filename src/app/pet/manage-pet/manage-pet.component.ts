import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pet } from 'src/app/models/pet.model';
import { SharePetFormComponent } from 'src/app/dialogs/share-pet-form/share-pet-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AddPetFormComponent } from 'src/app/dialogs/add-pet-form/add-pet-form.component';
import { PetService } from 'src/app/services/pet.service';
import { DailyLog } from 'src/app/models/daily-log.model';
import { DeletePetConfirmationComponent } from 'src/app/dialogs/delete-pet-confirmation/delete-pet-confirmation.component';

@Component({
  selector: 'app-manage-pet',
  templateUrl: './manage-pet.component.html',
  styleUrls: ['./manage-pet.component.css']
})
export class ManagePetComponent implements OnInit {
  currentPet: Pet;
  dailyLogs: DailyLog[];
  shareWithDisplay: string[];
  currentUser: any;

  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private authService: AuthService, private petService: PetService) { 
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.currentPet = state!['currentPet']
      this.dailyLogs = state!['dailyLogs']
    } else {
      snackBar.open('Woof! There was an error loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }

    console.log(this.currentPet)
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDataFromSession();

    // Filter out the current user from the shared with array that is shown on screen
    this.shareWithDisplay = this.currentPet.sharedWith!.filter(email => {
      return email !== this.currentUser.email;
    });
  }

  navigateHome(): void {
    this.router.navigate(['/home'], { state: { currentPet: this.currentPet } })
  }

  editPetInfo() {
    let editDialog = this.dialog.open(AddPetFormComponent, { data: { petInfoToEdit: this.currentPet } });

    editDialog.afterClosed().subscribe(data => {
      if (data) {
        this.currentPet = {...data['updatedPetInfo']}
      }
    })
  }

  openSharePetForm() {
    this.dialog.open(SharePetFormComponent, { data: { userEmail: this.currentUser.email, petID: this.currentPet.petID, petName: this.currentPet.petName } })
  }

  removeShare(email: string) {
    this.petService.removeUserFromPet(this.currentPet.petID, email)
  }

  openDeletePetConfirmation() {
    let deleteDialog = this.dialog.open(DeletePetConfirmationComponent, {data: {petInfo: this.currentPet, dailyLogs: this.dailyLogs}})
  }

}
