import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetService } from 'src/app/services/pet.service';
import { ShareInvite } from 'src/app/models/share-invite.model';

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
      'createdDateTime': new FormControl('')
    })
  }


  ngOnInit(): void {
  }

  sharePet() {
    if (this.sharePetForm.invalid) return

    //this.sharePetForm.patchValue({'createdDateTime': Date.now()})

    const shareInvite: ShareInvite = {
      petID: this.data.petID,
      petName: this.data.petName,
      shareWith: this.sharePetForm.controls['shareWith'].value,
      ownerEmail: this.data.userEmail,
      createdDateTime: Date.now(),
      seen: false
    }

    this.petService.sendShareInvite(shareInvite).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }

}
