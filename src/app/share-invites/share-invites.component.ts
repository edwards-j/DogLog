import { Component, OnInit, OnDestroy } from '@angular/core';
import { PetService } from '../services/pet.service';
import { AuthService } from '../services/auth.service';
import { ShareInvite } from '../models/share-invite.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-share-invites',
  templateUrl: './share-invites.component.html',
  styleUrls: ['./share-invites.component.css']
})
export class ShareInvitesComponent implements OnInit, OnDestroy {

  shareInvites: any[];
  user: any;
  getShareInvites$: Subscription;

  constructor(private petService: PetService, private authService: AuthService, private snackBar: MatSnackBar) {
    this.user = this.authService.getUserDataFromSession()
  }

  ngOnInit(): void {
    this.shareInvites = []
    this.getShareInvites();
  }

  ngOnDestroy() {
    this.getShareInvites$.unsubscribe()
  }

  getShareInvites() {
    this.getShareInvites$ = this.petService.getShareInvites(this.user.email).subscribe(res => {
      if (res) {
        this.shareInvites = res.map((d: any) => {
          let invite: ShareInvite = {
            shareInviteID: d.payload.doc.id,
            createdDateTime: d.payload.doc.data().createdDateTime,
            petName: d.payload.doc.data().petName,
            petID: d.payload.doc.data().petID,
            shareWith: d.payload.doc.data().shareWith,
            ownerEmail: d.payload.doc.data().ownerEmail,
            seen: d.payload.doc.data().seen
          }

          return invite;
        })

        this.shareInvites.forEach((invite: ShareInvite) => {
          if (invite.seen === false) {
            this.petService.markInviteAsSeen(invite.shareInviteID)
          }
        })
      }
    })
  }

  acceptInvite(petID: string, petName: string, shareInviteID: string) {
    debugger
    this.petService.addUserToPet(petID, this.user.email).then(() => {
      this.snackBar.open(`You\'ll now have access to ${petName}\'s logs`, 'Close', { verticalPosition: 'top', duration: 3000 })

      this.petService.deleteShareInvite(shareInviteID)
    })
  }

  deleteInvite(inviteID: string) {
    this.petService.deleteShareInvite(inviteID).then(() => {
      this.snackBar.open('Invite Deleted', 'Close', { verticalPosition: 'top', duration: 3000 })
    })
  }

}
