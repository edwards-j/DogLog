import { Component, OnInit, Input } from '@angular/core';
import { PetService } from '../services/pet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'daily-log',
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.css']
})
export class DailyLogComponent implements OnInit {
dailyLog: any;

  constructor(private petService: PetService, private router: Router) { 
    let state = this.router.getCurrentNavigation()!.extras.state

    if (state) {
      this.dailyLog = this.router.getCurrentNavigation()!.extras.state!['logData']
    } 
  }

  ngOnInit(): void {
  }

  deleteDailyLog() {
    this.petService.deleteDailyLog(this.dailyLog.petId, this.dailyLog.id).then(() => {
      this.router.navigate(['/pet/' + this.dailyLog.petId])
    })
  }

}
