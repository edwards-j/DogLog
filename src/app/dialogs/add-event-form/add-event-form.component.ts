import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PetService } from 'src/app/services/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pet } from 'src/app/models/pet.model';

@Component({
  selector: 'app-add-event-form',
  templateUrl: './add-event-form.component.html',
  styleUrls: ['./add-event-form.component.css']
})
export class AddEventFormComponent implements OnInit {
  addEventForm: FormGroup
  currentPet: Pet;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<AddEventFormComponent>) {
    this.addEventForm = new FormGroup({
      'eventName': new FormControl('', Validators.required)
    })

    this.currentPet = this.data.currentPet;
  }

  ngOnInit(): void {
  }

  addEvent() {
    if (this.addEventForm.invalid) return;

    const eventToAdd = this.addEventForm.controls['eventName'].value;

    if (this.currentPet.eventTypes && this.currentPet.eventTypes!.includes(eventToAdd)) {
      this.snackBar.open(`This event alread exists for ${this.currentPet.petName}`, 'Close', { verticalPosition: 'top' })
      return
    }

    this.petService.addEventType(this.currentPet.petID, eventToAdd).then((res: any) => {
      if (res === undefined) {
        // this.addEventForm.reset();
        this.closeDialog();
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
