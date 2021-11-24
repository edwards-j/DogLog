import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pet } from 'src/app/models/pet.model';

@Component({
  selector: 'add-pet-form',
  templateUrl: './add-pet-form.component.html',
  styleUrls: ['./add-pet-form.component.css']
})
export class AddPetFormComponent implements OnInit {
  addPetForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private dialogRef: MatDialogRef<AddPetFormComponent>) {
    this.addPetForm = new FormGroup({
      'petName': new FormControl('', Validators.required),
      // 'breed': new FormControl(''),
      'species': new FormControl('', Validators.required),
      'gender': new FormControl(''),
      'birthday': new FormControl('')
    })
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
      sharedWith: [this.data.userEmail]
    }    


    this.petService.addPet(petToAdd).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }
}
