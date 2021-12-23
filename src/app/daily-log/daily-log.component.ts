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
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
  dailyLog: DailyLog;
  currentPet: Pet;
  notes: any;
  user: any;

  eventCounts: any = {
    'food': 0,
    'water': 0,
    'treat': 0,
    'walk': 0,
    'pee': 0,
    'poop': 0
  }

  foodCount = 0;
  waterCount = 0;
  treatCount = 0;

  constructor(private authService: AuthService, private petService: PetService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private bottomSheet: MatBottomSheet) {
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['currentPet']
    } else {
      snackBar.open('Woof! There was an error Loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }

    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.getEvents()
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  getEvents() {
    this.petService.getDailyLogDetails(this.currentPet.petID, this.dailyLog.dailyLogID).subscribe(res => {
      if (res) {
        this.dailyLog.events = res.payload.data()!.events

        // Reset all counts to 0
        for (let event in this.eventCounts) {
          this.eventCounts[event] = 0
        }

        // Update counts
        this.dailyLog.events.forEach((event: DailyLogEvent) => {
          this.eventCounts[event.type]++
        })

        // Sort events so newest is on top
        this.dailyLog.events.sort((a, b) => {
          return b.time - a.time
        })
      }
    })

  }

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petID, this.dailyLog.dailyLogID).then(() => {
      this.router.navigate(['/pet/'], { state: { petData: this.currentPet } })
    })
  }

  deleteEvent(event: any) {
    this.petService.deleteDailyLogEvent(this.dailyLog.petID, this.dailyLog.dailyLogID, event).then(() => {
      this.snackBar.open('Event deleted', 'Close', { verticalPosition: 'top' });
    })
  }

  openAddEventForm() {
    this.bottomSheet.open(DailyLogEventFormComponent, { data: { dailyLogID: this.dailyLog.dailyLogID, petID: this.currentPet.petID } })
  }
}
