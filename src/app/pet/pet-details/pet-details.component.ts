import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'rxjs';
import { PetService } from 'src/app/services/pet.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SharePetFormComponent } from 'src/app/dialogs/share-pet-form/share-pet-form.component';
import { Pet } from 'src/app/models/pet.model';
import { DailyLog } from 'src/app/models/daily-log.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { state } from '@angular/animations';


@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit, AfterViewInit {
  currentPet: Pet;
  currentUser: any
  petIconSource: string;
  dailyLogs: DailyLog[];
  displayedColumns: string[] = ['date'];
  dataSource: MatTableDataSource<DailyLog> = new MatTableDataSource<DailyLog>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    switch (this.currentPet.species) {
      case 'dog':
        this.petIconSource = '../../../assets/dog.png'
        break;
      case 'cat':
        this.petIconSource = '../../../assets/cat.png'
        break;
      default:
        break;
    }
  }

  ngAfterViewInit() {
    this.getDailyLogs()
  }

  navigateHome(): void {
    this.router.navigate(['/home'])
  }

  navigateToManagePet(): void {
    this.router.navigate(['/manage'], { state: { currentPet: this.currentPet, dailyLogs: this.dailyLogs } })
  }

  getDailyLogs() {
    this.petService.getDailyLogs(this.currentPet.petID).subscribe(res => {
      if (res) {
        this.dailyLogs = res.map((d: any) => {
          let dailyLog: DailyLog = {
            dailyLogID: d.payload.doc.id,
            date: d.payload.doc.data().date,
            events: d.payload.doc.data().events,
            eventTypes: d.payload.doc.data().eventTypes
          }

          return dailyLog
        })

        // Sort the logs in desc order, so newest is at the top
        this.dailyLogs.sort((a: any, b: any) => {
          return b.date - a.date
        })

        this.dataSource = new MatTableDataSource<DailyLog>(this.dailyLogs);

        this.dataSource.paginator = this.paginator;
      }
    })
  }

  addDailyLog() {
    // Check if there is already a log for today. If so, just return
    if (this.dailyLogs.length > 0) {
      if (this.timeConverter(this.dailyLogs[0].date) === this.timeConverter(Date.now())) {
        this.snackBar.open('A log has already been created for today', 'Close', { verticalPosition: 'top', duration: 2500 })
        return
      }
    }

    let dailyLog: DailyLog = {
      date: Date.now(),
      events: [],
      eventTypes: this.currentPet.eventTypes
    }

    this.petService.addDailyLog(this.currentPet.petID, dailyLog)
  }

  navigateToDailyLog(log: any) {
    let dailyLogComponentState = {
      petID: this.currentPet.petID,
      ...log
    }

    this.router.navigate(['pet/dailyLog'], { state: { logData: dailyLogComponentState, currentPet: this.currentPet } })
  }

  openSharePetForm() {
    this.dialog.open(SharePetFormComponent, { data: { userEmail: this.currentUser.email, petID: this.currentPet.petID, petName: this.currentPet.petName } })
  }

  unfollowPet() {
    this.petService.removeUserFromPet(this.currentPet.petID, this.currentUser.email).then(() => {
      this.navigateHome();
      this.snackBar.open(`You are no longer following ${this.currentPet.petName}`, 'Close', { verticalPosition: 'top' });
    })
  }

  getCurrentDate() {
    const dateObj = new Date;
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const year = dateObj.getFullYear();

    return `${month}/${date}/${year}`
  }

  timeConverter(UNIX_timestamp: number) {
    var a = new Date(0);
    a.setUTCMilliseconds(UNIX_timestamp)
    return a.toLocaleDateString()
  }
}
