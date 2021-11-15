import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { PetService } from '../services/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private authService: AuthService, private petService: PetService, private snackBar: MatSnackBar) { 
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

    this.petService.addNote(this.petId, this.dailyLogId, this.noteForm.value).then(() => {
      this.noteForm.reset();
    }).catch(err => {
      this.snackBar.open("Error adding note", '', { duration: 2500 })
    })
  }
}
