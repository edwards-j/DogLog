import { Component, OnInit, Inject } from '@angular/core';
import { PetService } from '../services/pet.service';
import { DailyLogEvent } from '../models/daily-log-event.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-daily-log-event-form',
  templateUrl: './daily-log-event-form.component.html',
  styleUrls: ['./daily-log-event-form.component.css']
})
export class DailyLogEventFormComponent implements OnInit {

  petID: string;
  dailyLogID: string;
  currentUser: any

  addEventForm: FormGroup

  constructor(private petService: PetService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private authService: AuthService, private _bottomSheetRef: MatBottomSheetRef<DailyLogEventFormComponent>) {
    this.addEventForm = new FormGroup({
      'type': new FormControl('', Validators.required),
      'notes': new FormControl('')
    })

    this.petID = this.data.petID;
    this.dailyLogID = this.data.dailyLogID

    //let state = this.router.getCurrentNavigation()!.extras.state


    // if (state) {
    //   this.petID = this.router.getCurrentNavigation()!.extras.state!['petID']
    //   this.dailyLogID = this.router.getCurrentNavigation()!.extras.state!['dailyLogID']
    // }

    this.currentUser = this.authService.getUserDataFromSession();
  }

  ngOnInit(): void {

  }

  addDailyLogEvent() {
    const newEvent: DailyLogEvent = {
      time: Date.now(),
      userEmail: this.currentUser.email,
      type: this.addEventForm.controls['type'].value,
      notes: this.addEventForm.controls['notes'].value
    }

    this.petService.addDailyLogEvent(this.petID, this.dailyLogID, newEvent).then(res => {
      this._bottomSheetRef.dismiss()
    })
  }
}
