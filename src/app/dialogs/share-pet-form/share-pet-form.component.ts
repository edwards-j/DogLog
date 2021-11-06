import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-share-pet-form',
  templateUrl: './share-pet-form.component.html',
  styleUrls: ['./share-pet-form.component.css']
})
export class SharePetFormComponent implements OnInit {
  sharePetForm: FormGroup

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private dialogRef: MatDialogRef<SharePetFormComponent>) {
    this.sharePetForm = new FormGroup({
      'shareWith': new FormControl('', Validators.email),
      'ownerEmail': new FormControl(this.data.userEmail),
      'time': new FormControl('')
    })
  }


  ngOnInit(): void {
  }

  sharePet() {
    if (this.sharePetForm.invalid) return

    this.sharePetForm.patchValue({'time': Date.now()})

    this.petService.sendShareInvite(this.sharePetForm.value).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }

}
