import { Component, OnInit, Input } from '@angular/core';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Pet } from '../models/pet.model';
import { DailyLogEvent } from '../models/daily-log-event.model';
import { DailyLog } from '../models/daily-log.model';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DailyLogEventFormComponent } from '../daily-log-event-form/daily-log-event-form.component';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
  dailyLog: DailyLog;
  currentPet: Pet;
  notes: any;

  foodCount = 0;
  waterCount = 0;
  treatCount = 0;

  constructor(private petService: PetService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private bottomSheet: MatBottomSheet) {
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['currentPet']
    } else {
      snackBar.open('Woof! There was an error Loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }
  }

  ngOnInit(): void {
    this.getEvents()
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  getEvents() {
    this.petService.getDailyLogDetails(this.currentPet.petID, this.dailyLog.dailyLogID).subscribe(res => {
      this.dailyLog.events = res.payload.data()!.events

      this.foodCount = 0
      this.waterCount = 0
      this.treatCount = 0

      this.dailyLog.events.forEach(event => {
        switch (event.type) {
          case 'food':
            this.foodCount++
            break;
          case 'water':
            this.waterCount++
            break;
          case 'treat':
            this.treatCount++
            break;
          default:
            break;
        }
      })

      this.dailyLog.events.sort((a, b) => {
        return b.time - a.time
      })
    })
  }

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petID, this.dailyLog.dailyLogID).then(() => {
      this.router.navigate(['/pet/'], { state: { petData: this.currentPet } })
    })
  }

  openAddEventForm() {
    this.bottomSheet.open(DailyLogEventFormComponent, { data: { dailyLogID: this.dailyLog.dailyLogID, petID: this.currentPet.petID } })
  }
}
