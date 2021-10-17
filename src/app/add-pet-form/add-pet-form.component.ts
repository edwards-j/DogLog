import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
      'breed': new FormControl(''),
      'gender': new FormControl(''),
      'birthday': new FormControl(''),
      'userId': new FormControl(this.data.userId)
    })
   }

  ngOnInit(): void {
  }

  addPet() {
    if (this.addPetForm.invalid) return;

    this.petService.addPet(this.addPetForm.value).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }

}
