import { Component, OnInit, Input } from '@angular/core';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddOutFormComponent } from '../dialogs/add-out-form/add-out-form.component';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
dailyLog: any;
outs: any
walks: any
notes: any;

  constructor(private petService: PetService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { 
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
    } 
  }

  ngOnInit(): void {}

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
    this.petService.getOuts(this.dailyLog.petId, this.dailyLog.id).subscribe(res => {
      this.deleteDailyLog
      if (res) {
        this.outs = res.map((d: any) => {
          return {
            "id": d.payload.doc.id,
            "time": d.payload.doc.data().time,
            "pee": d.payload.doc.data().pee,
            "poo": d.payload.doc.data().poo
          }
        })
      }

      // Sort so most recent are on top
      this.outs.sort((a: any, b: any) => {
        return b.time - a.time
      })
    })
  }

  deleteOut(outId: string) {
    this.petService.deleteOut(this.dailyLog.petId, this.dailyLog.id, outId).then(() => {
      this.snackBar.open("Out successfully deleted", '', {duration: 2500})
    }).catch(err => {
      this.snackBar.open("Error deleting out", '', {duration: 2500})
      console.log(err)
    })
  }

  getWalks() {
    this.petService.getWalks(this.dailyLog.petId, this.dailyLog.id).subscribe(res => {
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
    this.dialog.open(AddOutFormComponent, { data: { petId: this.dailyLog.petId, dailyLogId: this.dailyLog.id} })
  }

  addWalk() {
    const newWalk = {
      time: Date.now(),
      distanceMiles: 2
    }

    this.petService.addWalk(this.dailyLog.petId, this.dailyLog.id, newWalk)
  }

  deleteWalk(walkId: string) {
    this.petService.deleteWalk(this.dailyLog.petId, this.dailyLog.id, walkId).then(() => {
      this.snackBar.open("Walk successfully deleted", '', {duration: 2500})
    }).catch(err => {
      this.snackBar.open("Error deleting walk", '', {duration: 2500})
      console.log(err)
    })
  }

  notesHeaderClicked() {
    if (this.notes === undefined) {
      this.getNotes()
    }
  }

  getNotes() {
    this.petService.getNotes(this.dailyLog.petId, this.dailyLog.id).subscribe(res => {
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
          return b.time - a.time;
        })
      }
    })
  }

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petId, this.dailyLog.id).then(() => {
      this.router.navigate(['/pet/' + this.dailyLog.petId])
    })
  }

}
