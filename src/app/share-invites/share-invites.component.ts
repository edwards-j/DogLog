import { Component, OnInit } from '@angular/core';
import { PetService } from '../services/pet.service';
import { AuthService } from '../services/auth.service';
import { ShareInvite } from '../models/share-invite.model';

@Component({
  selector: 'app-share-invites',
  templateUrl: './share-invites.component.html',
  styleUrls: ['./share-invites.component.css']
})
export class ShareInvitesComponent implements OnInit {

  shareInvites: any[];
  user: any;

  constructor(private petService: PetService, private authService: AuthService) { 
    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.getShareInvites();
  }

  getShareInvites() {
    this.petService.getShareInvites(this.user.email).subscribe(res => {
      if (res) {
        this.shareInvites = res.docs.map((d: any) => {
          let invite: ShareInvite = {
            createdDateTime: d.data().createdDateTime,
            petName: d.data().petName,
            petID: d.data().petID,
            shareWith: d.data().shareWith,
            ownerEmail: d.data().ownerEmail
          }

          return invite;
        })
      }
    })
  }
    
}
