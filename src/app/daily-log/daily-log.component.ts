import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit, OnDestroy {
  dailyLog: DailyLog;
  currentPet: Pet;
  notes: any;
  user: any;
  todayLog: boolean;
  eventStream$: Subscription;
  petStream$: Subscription;

  eventCounts: any = {}

  constructor(private authService: AuthService, private petService: PetService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private bottomSheet: MatBottomSheet, private datePipe: DatePipe) {
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['currentPet']
    } else {
      snackBar.open('Woof! There was an error Loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }

    // Get the current date and the daily log's date in the same format
    let todayDate = this.datePipe.transform(Date.now(), 'shortDate');
    let logDate = this.datePipe.transform(this.dailyLog.date, 'shortDate');

    // If today's date and the log's date are the same, show the Add Event button
    // Otherwise, hide it so you can't add logs for past days
    if (todayDate === logDate) {
      this.todayLog = true;
    } else {
      this.todayLog = false;
    }

    this.user = this.authService.getUserDataFromSession();

    // This subscription is here to make sure everything is up to date
    // Since the data is passed around in, state object some of the data (e.g. eventTypes) weren't always up to day, b/c the GET was happening from the home component
    if (this.currentPet.petID) {
      this.petStream$ = this.petService.getPet(this.currentPet.petID).subscribe(res => {
        this.currentPet = {
          petID: res.payload.id,
          petName: res.payload.data().petName,
          ownerEmail: res.payload.data().ownerEmail,
          gender: res.payload.data().gender,
          species: res.payload.data().species,
          birthday: res.payload.data().birthday,
          sharedWith: res.payload.data().sharedWith,
          eventTypes: res.payload.data().eventTypes
        }
      })
    }
  }

  ngOnInit(): void {
    this.getEventStream()
  }

  ngOnDestroy() {
    this.eventStream$.unsubscribe();
    this.petStream$.unsubscribe();
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  getEventStream() {
    this.eventStream$ = this.petService.getDailyLogDetails(this.currentPet.petID, this.dailyLog.dailyLogID).subscribe(res => {
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
      this.snackBar.open('Event deleted', 'Close', { verticalPosition: 'top', duration: 3000 });
    })
  }

  openAddEventForm() {
    this.bottomSheet.open(DailyLogEventFormComponent, { data: { dailyLogID: this.dailyLog.dailyLogID, petID: this.currentPet.petID, eventTypes: this.currentPet.eventTypes } })
  }
}
