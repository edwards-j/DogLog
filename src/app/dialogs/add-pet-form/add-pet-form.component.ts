import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pet } from 'src/app/models/pet.model';
import { Router } from '@angular/router';

@Component({
  selector: 'add-pet-form',
  templateUrl: './add-pet-form.component.html',
  styleUrls: ['./add-pet-form.component.css']
})
export class AddPetFormComponent implements OnInit {
  addPetForm: FormGroup;
  petInfoToEdit: Pet;
  editMode: boolean

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private dialogRef: MatDialogRef<AddPetFormComponent>, private router: Router) {
    this.addPetForm = new FormGroup({
      'petName': new FormControl('', Validators.required),
      // 'breed': new FormControl(''),
      'species': new FormControl('', Validators.required),
      'gender': new FormControl(''),
      'birthday': new FormControl(''),
      'eventTypes': new FormControl('', Validators.required),
    })

    this.petInfoToEdit = data['petInfoToEdit']

    if (this.petInfoToEdit) {
      this.editMode = true;

      this.addPetForm.patchValue({
        'petName': this.petInfoToEdit.petName,
        'species': this.petInfoToEdit.species,
        'gender': this.petInfoToEdit.gender,
        // 'birthday': this.petInfoToEdit.birthday 
      })
    }
  }

  ngOnInit(): void {
  }

  addPet() {
    if (this.addPetForm.invalid) return;

    const petToAdd: Pet = {
      petName: this.addPetForm.controls['petName'].value,
      species: this.addPetForm.controls['species'].value,
      gender: this.addPetForm.controls['gender'].value,
      birthday: new Date(this.addPetForm.controls['birthday'].value).getTime(),
      ownerEmail: this.data.userEmail,
      sharedWith: [this.data.userEmail],
      eventTypes: this.addPetForm.controls['eventTypes'].value.split(',').trim()
    }

    this.petService.addPet(petToAdd).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }

  updatePet() {
    if (this.addPetForm.invalid) return;

    const petInfo: Pet = {
      petName: this.addPetForm.controls['petName'].value,
      species: this.addPetForm.controls['species'].value,
      gender: this.addPetForm.controls['gender'].value,
      birthday: new Date(this.addPetForm.controls['birthday'].value).getTime()
    }

    this.petService.updatePet(this.petInfoToEdit.petID, petInfo).then((res: any) => {
      if (res === undefined) {
        this.dialogRef.close({'updatedPetInfo': petInfo})
      }
    })
  }
}
