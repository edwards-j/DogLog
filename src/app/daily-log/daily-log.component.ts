import { Component, OnInit, Input } from '@angular/core';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddOutFormComponent } from '../dialogs/add-out-form/add-out-form.component';
import { Out } from '../models/out.model';
import { Pet } from '../models/pet.model';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
  dailyLog: any;
  currentPet: Pet;
  outs: Out[]
  walks: any
  notes: any;

  constructor(private petService: PetService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
      this.currentPet = this.router.getCurrentNavigation()!.extras.state!['currentPet']
    }
  }

  ngOnInit(): void { }

  // Only get outs if the Outs header is being expanded and we don't currently have any data
  // Lazy loads the data 
  outsHeaderClicked() {
    if (this.outs === undefined) {
      this.getOuts();
    }
  }

  // Only get walks if the Walks header is being expanded and we don't currently have any data
  // Lazy loads the data 
  walksHeaderClicked() {
    if (this.walks === undefined) {
      this.getWalks();
    }
  }

  getOuts() {
    this.petService.getOuts(this.dailyLog.petID, this.dailyLog.dailyLogID).subscribe(res => {
      if (res) {
        this.outs = res.map((d: any) => {
          let out: Out = {
            outID: d.payload.doc.id,
            ...d.payload.doc.data()
          }

          return out
        })
      }

      // Sort so most recent are on top
      this.outs.sort((a: any, b: any) => {
        return b.time - a.time
      })
    })
  }

  deleteOut(outID: string) {
    this.petService.deleteOut(this.dailyLog.petID, this.dailyLog.dailyLogID, outID).then(() => {
      this.snackBar.open("Out successfully deleted", '', { duration: 2500 })
    }).catch(err => {
      this.snackBar.open("Error deleting out", '', { duration: 2500 })
      console.log(err)
    })
  }

  getWalks() {
    this.petService.getWalks(this.dailyLog.petID, this.dailyLog.dailyLogID).subscribe(res => {
      if (res) {
        this.walks = res.map((d: any) => {
          return {
            "id": d.payload.doc.id,
            "time": d.payload.doc.data().time,
            "distanceMiles": d.payload.doc.data().distanceMiles
          }
        })
      }
    })
  }

  openAddOutDialog() {
    this.dialog.open(AddOutFormComponent, { data: { petID: this.dailyLog.petID, dailyLogID: this.dailyLog.dailyLogID } })
  }

  addWalk() {
    const newWalk = {
      time: Date.now(),
      distanceMiles: 2
    }
    
    this.petService.addWalk(this.dailyLog.petID, this.dailyLog.dailyLogID, newWalk)
  }

  deleteWalk(walkID: string) {
    this.petService.deleteWalk(this.dailyLog.petID, this.dailyLog.dailyLogID, walkID).then(() => {
      this.snackBar.open("Walk successfully deleted", '', { duration: 2500 })
    }).catch(err => {
      this.snackBar.open("Error deleting walk", '', { duration: 2500 })
      console.log(err)
    })
  }

  notesHeaderClicked() {
    if (this.notes === undefined) {
      this.getNotes()
    }
  }

  getNotes() {
    this.petService.getNotes(this.dailyLog.petId, this.dailyLog.dailyLogID).subscribe(res => {
      if (res) {
        this.notes = res.map((d: any) => {
          return {
            "id": d.payload.doc.id,
            "time": d.payload.doc.data().time,
            "message": d.payload.doc.data().message,
            "author": d.payload.doc.data().author,
          }
        })

        this.notes.sort((a: any, b: any) => {
          return a.time - b.time;
        })
      }
    })
  }

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petID, this.dailyLog.dailyLogID).then(() => {
      this.router.navigate(['/pet/'], { state: { petData: this.currentPet } })
    })
  }

}
