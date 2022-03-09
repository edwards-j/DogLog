import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddEventFormComponent } from 'src/app/dialogs/add-event-form/add-event-form.component';

@Component({
  selector: 'app-manage-pet',
  templateUrl: './manage-pet.component.html',
  styleUrls: ['./manage-pet.component.css']
})
export class ManagePetComponent implements OnInit, OnDestroy {
  currentPet: Pet;
  dailyLogs: DailyLog[];
  shareWithDisplay: string[];
  currentUser: any;
  petStream$: Subscription;
  showEventDeleteIcon: boolean;

  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private authService: AuthService, private petService: PetService) {
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.currentPet = state!['currentPet']
      this.dailyLogs = state!['dailyLogs']

      if (this.currentPet.petID) {
        this.petStream$ = this.petService.getPet(this.currentPet.petID).subscribe(res => {
          this.currentPet = {
            petID: res.payload.id,
            petName: res.payload.data().petName,
            ownerEmail: res.payload.data().ownerEmail,
            gender: res.payload.data().gender,
            species: res.payload.data().species,
            birthday: res.payload.data().birthday,
            sharedWith: res.payload.data().sharedWith,
            eventTypes: res.payload.data().eventTypes
          }
        })
      }
    } else {
      snackBar.open('Woof! There was an error loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDataFromSession();

    // Filter out the current user from the shared with array that is shown on screen
    this.shareWithDisplay = this.currentPet.sharedWith!.filter(email => {
      return email !== this.currentUser.email;
    });

    this.showEventDeleteIcon = false;
  }

  ngOnDestroy() {
    this.petStream$.unsubscribe();
  }

  navigateHome(): void {
    this.router.navigate(['/home'], { state: { currentPet: this.currentPet } })
  }

  editPetInfo() {
    let editDialog = this.dialog.open(AddPetFormComponent, { data: { petInfoToEdit: this.currentPet } });

    editDialog.afterClosed().subscribe(data => {
      if (data) {
        this.currentPet = { ...data['updatedPetInfo'] }
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
    let deleteDialog = this.dialog.open(DeletePetConfirmationComponent, { data: { petInfo: this.currentPet, dailyLogs: this.dailyLogs } })
  }

  openAddEventFormDialog() {
    this.dialog.open(AddEventFormComponent, { data: { currentPet: this.currentPet } })
  }

  removeEvent(event: string) {
    this.petService.removeEventType(this.currentPet.petID, event).then(() => {
      this.snackBar.open('Event Removed', 'Close', { verticalPosition: 'top' })
    })
  }

  toggleEventDeleteIcon() {
    this.showEventDeleteIcon = !this.showEventDeleteIcon;
  }

}
