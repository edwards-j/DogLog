import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PetService } from '../services/pet.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  userInfo: any;
  @Input() petId: any;
  @Input() dailyLogId: any;
  @Input() notes: any;
  noteForm: FormGroup;

  constructor(private authService: AuthService, private petService: PetService) { 
    this.userInfo = this.authService.getUserDataFromSession()

    this.noteForm = new FormGroup({
      'message': new FormControl('', Validators.required),
      'author': new FormControl(this.userInfo.email),
      'time': new FormControl('')
    })
   }

  ngOnInit(): void {
  }

  addNote() {
    if (this.noteForm.invalid) return;

    this.noteForm.patchValue({'time': Date.now()})

    this.petService.addNote(this.petId, this.dailyLogId, this.noteForm.value)
  }
}
