import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPetFormComponent } from '../dialogs/add-pet-form/add-pet-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pets: any;
  user: any

  constructor(private authService: AuthService, private petService: PetService, private router: Router, private dialog: MatDialog) {


    this.pets = [];
    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.getPets()
  }

  getPets() {
    this.petService.getUsersPets(this.user.uid).subscribe(res => {

      this.pets = res.map((d: any) => {
        return {
          "id": d.payload.doc.id,
          "petName": d.payload.doc.data().petName
        }
      })
    })
  }

  navigateToPetDeail(pet: any) {
    this.router.navigate(['/pet/'], { state: { petData: pet } })
  }

  openAddPetDialog() {
    this.dialog.open(AddPetFormComponent, { data: { userId: this.user.uid } })
  }
}
