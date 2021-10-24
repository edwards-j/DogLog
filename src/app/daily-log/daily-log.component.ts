import { Component, OnInit, Input } from '@angular/core';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
dailyLog: any;
walks: any

  constructor(private petService: PetService, private router: Router, private snackBar: MatSnackBar) { 
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
    } 
  }

  ngOnInit(): void {
    this.getWalks()
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

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petId, this.dailyLog.id).then(() => {
      this.router.navigate(['/pet/' + this.dailyLog.petId])
    })
  }

}
