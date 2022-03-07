import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPetFormComponent } from '../dialogs/add-pet-form/add-pet-form.component';
import { Pet } from '../models/pet.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  pets: any;
  user: any;
  shareInvites: any[];
  shareInviteStream$: Subscription;

  constructor(private authService: AuthService, private petService: PetService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {


    this.pets = [];
    this.user = this.authService.getUserDataFromSession();
  }

  ngOnInit(): void {
    this.getPets();
    this.listenForShareInvite();
  }

  ngOnDestroy() {
    this.shareInviteStream$.unsubscribe();
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
          sharedWith: d.payload.doc.data().sharedWith,
          eventTypes: d.payload.doc.data().eventTypes
        }

        return pet;
      })
    })
  }

  navigateToPetDetail(pet: any) {
    this.router.navigate(['/pet/'], { state: { petData: pet } });
  }

  openAddPetDialog() {
    this.dialog.open(AddPetFormComponent, { data: { userEmail: this.user.email } });
  }

  listenForShareInvite() {
    this.shareInviteStream$ = this.petService.getUnseenShareInvitesStream(this.user.email).subscribe(res => {
      if (res.length > 0 && res[0].type === 'added') {
        let snack = this.snackBar.open(`You have a new pet share invite`, 'View', { verticalPosition: 'top', duration: 3000 });
        snack.onAction().subscribe(() => {
          this.router.navigate(['/shareInvites']);
        })
      }
    })
  }
}
