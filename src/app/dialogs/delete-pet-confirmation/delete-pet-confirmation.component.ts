import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetService } from 'src/app/services/pet.service';
import { AddPetFormComponent } from '../add-pet-form/add-pet-form.component';
import { Router } from '@angular/router';
import { Pet } from 'src/app/models/pet.model';
import { DailyLog } from 'src/app/models/daily-log.model';

@Component({
  selector: 'app-delete-pet-confirmation',
  templateUrl: './delete-pet-confirmation.component.html',
  styleUrls: ['./delete-pet-confirmation.component.css']
})
export class DeletePetConfirmationComponent implements OnInit {
  currentPet: Pet;
  dailyLogs: DailyLog[];
  petNameInput: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private dialogRef: MatDialogRef<AddPetFormComponent>, private router: Router) { 
    this.currentPet = this.data['petInfo'];
    this.dailyLogs = this.data['dailyLogs'];
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close()
  }

  deletePet() {
    if (!this.currentPet.petID) {
      console.error('Unable to delete pet. petID null or undefined')
      return
    }

    // Delete all of the daily logs before deleting pet
    this.dailyLogs.forEach(log => {
      this.petService.deleteDailyLog(this.currentPet.petID, log.dailyLogID)
    })

    // Once the daily log subcollection has been deleted, we can safely deleted the pet
    this.petService.deletePet(this.currentPet.petID).then(() => {
      this.closeDialog()
      this.router.navigate(['/home'])
    })
  }

}
