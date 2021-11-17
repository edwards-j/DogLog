import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-add-out-form',
  templateUrl: './add-out-form.component.html',
  styleUrls: ['./add-out-form.component.css']
})
export class AddOutFormComponent implements OnInit {
  addOutForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private petService: PetService, private dialogRef: MatDialogRef<AddOutFormComponent>) {
    this.addOutForm = new FormGroup({
      'time': new FormControl(''),
      'pee': new FormControl(''),
      'poo': new FormControl('')
    })
  }

  ngOnInit(): void {
  }
  addOut(): void {
    if (this.addOutForm.invalid) return;

    this.addOutForm.patchValue({'time': Date.now()})

    this.petService.addOut(this.data.petID, this.data.dailyLogID, this.addOutForm.value).then((res: any) => {
      if (res) {
        this.dialogRef.close()
      }
    })
  }

}
