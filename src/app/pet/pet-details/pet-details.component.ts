import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'rxjs';
import { PetService } from 'src/app/services/pet.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SharePetFormComponent } from 'src/app/dialogs/share-pet-form/share-pet-form.component';
import { Pet } from 'src/app/models/pet.model';
import { DailyLog } from 'src/app/models/daily-log.model';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  currentPet: Pet;
  currentUser: any
  dailyLogs: DailyLog[];


  constructor(private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private petService: PetService, private authService: AuthService, private dialog: MatDialog) {

    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['petData']
    } else {
      snackBar.open('Woof! There was an error Loading Pet Info', 'Close', { verticalPosition: 'top' });
      this.navigateHome()
    }

    this.currentUser = this.authService.getUserDataFromSession();
  }

  ngOnInit(): void {
    this.getDailyLogs()
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  getDailyLogs() {
    this.petService.getDailyLogs(this.currentPet.petID).subscribe(res => {
      if (res) {
        this.dailyLogs = res.map((d: any) => {
          let dailyLog: DailyLog = {
            dailyLogID: d.payload.doc.id,
            date: d.payload.doc.data().date,
            breakfast: d.payload.doc.data().breakfast,
            dinner: d.payload.doc.data().dinner
          }

          return dailyLog
        })

        // Sort the logs in desc order, so newest is at the top
        this.dailyLogs.sort((a: any, b: any) => {
          return b.date - a.date
        })
      }
    })
  }

  addDailyLog() {
    // Check if there is already a log for today. If so, just return
    if (this.dailyLogs.length > 0) {
      if ( this.timeConverter(this.dailyLogs[0].date) === this.timeConverter(Date.now())) {
        this.snackBar.open('A log has already been created for today', 'Close', { duration: 2500 })
        return
      }
    }

    let dailyLog: DailyLog = {
      date: Date.now(),
      breakfast: 0,
      dinner: 0
    }

    this.petService.addDailyLog(this.currentPet.petID, dailyLog)
  }

  navigateToDailyLog(log: any) {
    let dailyLogComponentState = {
      petID: this.currentPet.petID,
      ...log
    }

    this.router.navigate(['pet/dailyLog'], { state: { logData: dailyLogComponentState } })
  }

  openSharePetForm() {
    this.dialog.open(SharePetFormComponent, { data: { userEmail: this.currentUser.email, petID: this.currentPet.petID } })
  }

  deletePet() {
    // If there are daily logs for this pet, we have to delete them first
    if (this.dailyLogs.length > 0) {
      for (let log of this.dailyLogs) {
        this.petService.deleteDailyLog(this.currentPet.petID, log.dailyLogID)
      }
    }

    // Once all the dailyLogs subcollections have been deleted, we can delete the pet
    this.petService.deletePet(this.currentPet.petID).then(() => {
      this.navigateHome()
      this.snackBar.open('Pet sucessfully deleted', 'Close', { verticalPosition: 'top' });
    }).catch((error) => {
      console.error("Error deleting pet: ", error);
    });
  }

  getCurrentDate() {
    const dateObj = new Date;
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${month}/${date}/${year}`
  }

  timeConverter(UNIX_timestamp: number){
    var a = new Date(0);
    a.setUTCMilliseconds(UNIX_timestamp)
    return a.toLocaleDateString()
  }
}
