import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'rxjs';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  currentPet: any


  constructor(private router: Router, private snackBar: MatSnackBar) {

    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['petData']
    } else {
      snackBar.open('Woof! There was an error Loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }
  }

  ngOnInit(): void {}

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

}
