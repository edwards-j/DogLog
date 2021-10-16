import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  addPetForm: FormGroup;
  pets: any;
  user: any

  constructor(private authService: AuthService, private petService: PetService, private router: Router) {
    this.addPetForm = new FormGroup({
      'petName': new FormControl('', Validators.required),
      'breed': new FormControl(''),
      'gender': new FormControl(''),
      'birthday': new FormControl(''),
      'userId': new FormControl('')
    })

    this.pets = [];
    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.addPetForm.patchValue({ 'userId': this.user.uid })

    this.getPets()
  }

  logOut() {
    this.authService.logoutUser()
  }

  addPet() {
    console.log(this.addPetForm.value)

    if (this.addPetForm.invalid) return;

    this.petService.addPet(this.addPetForm.value)
  }

  getPets() {
    this.petService.getUsersPets(this.user.uid).subscribe(res => {
      this.pets = res.docs.map((d:any) => {
        return {
          "id": d.id,
          "petName": d.data().petName
        }
      })
    })
  }

  navigateToPetDeail(pet: any) {
    this.router.navigate(['/pet/' + pet.id], {state : {petData: pet}})
  }
}
