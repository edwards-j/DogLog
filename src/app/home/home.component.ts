import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPetFormComponent } from '../dialogs/add-pet-form/add-pet-form.component';
import { Pet } from '../models/pet.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pets: any;
  user: any;
  shareInvites: any[];

  constructor(private authService: AuthService, private petService: PetService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {


    this.pets = [];
    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.getPets();
    this.checkForShareInvite();
  }

  getPets() {
    this.petService.getUsersPets(this.user.email).subscribe(res => {

      this.pets = res.map((d: any) => {
        let pet: Pet = {
          petID: d.payload.doc.id,
          petName: d.payload.doc.data().petName,
          ownerEmail: d.payload.doc.data().ownerEmail,
          gender: d.payload.doc.data().gender,
          species: d.payload.doc.data().species,
          birthday: d.payload.doc.data().birthday,
          sharedWith: d.payload.doc.data().sharedWith
        }

        return pet
      })
    })
  }

  navigateToPetDeail(pet: any) {
    this.router.navigate(['/pet/'], { state: { petData: pet } })
  }

  openAddPetDialog() {
    this.dialog.open(AddPetFormComponent, { data: { userEmail: this.user.email } })
  }

  checkForShareInvite() {
    this.petService.getUnseenShareInvites(this.user.email).subscribe(res => {
      if (!res.empty) {
        this.snackBar.open(`You have a new pet share invites`, 'Close', { verticalPosition: 'top', duration: 3000 });
      }
    })
  }
}
