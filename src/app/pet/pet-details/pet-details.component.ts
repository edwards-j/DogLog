import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  currentPet: any


  constructor(private router: Router) {
    this.currentPet = this.router.getCurrentNavigation()!.extras.state!['petData']
  }

  ngOnInit(): void {
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

}
