import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getDoc, query, collection, where, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";
import { ShareInvite } from '../models/share-invite.model';


@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(private db: AngularFirestore) {
  }

  // Pet functions
  addPet(newPet: any): Promise<any> {
    return this.db.collection('pets').add(newPet)
  }

  deletePet(petId: any): Promise<any> {
    return this.db.collection('pets').doc(petId).delete()
  }

  updatePet(petId: any, petInfo: any): Promise<any> {
    return this.db.collection('pets').doc(petId).update(petInfo)
  }

  addEventType(petID: string | undefined, eventToAdd: string) {
    return this.db.collection('pets').doc(petID).update({eventTypes: arrayUnion(eventToAdd)})
  }

  removeEventType(petID: string | undefined, eventToRemove: string) {
    return this.db.collection('pets').doc(petID).update({eventTypes: arrayRemove(eventToRemove)})
  }

  // Gets the pets for a user
  getUsersPets(email: string): Observable<any> {
    return this.db.collection('pets', pet => pet.where('sharedWith', 'array-contains', email)).snapshotChanges()
  }

  getPet(petId: string): Observable<any> {
    return this.db.collection('pets').doc(petId).snapshotChanges()
  }

  // Daily Log functions
  getDailyLogs(petId: string | undefined): Observable<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').snapshotChanges()
  }

  addDailyLog(petId: string | undefined , dailyLog: any): Promise<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').add(dailyLog)
  }

  deleteDailyLog(petId: string | undefined , dailyLogId: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).delete()
  }

  // Daily Log Event Functions
  addDailyLogEvent(petId: string | undefined , dailyLogId: any, event: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).update({
      events: arrayUnion(event)
    })
  }

  deleteDailyLogEvent(petId: string | undefined , dailyLogId: any, event: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).update({
      events: arrayRemove(event)
    })
  }

  getDailyLogDetails(petId: string | undefined , dailyLogId: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).snapshotChanges()
  }

  // Share functions
  sendShareInvite(invite: ShareInvite) {
    return this.db.collection('shareInvites').add(invite);
  }

  getShareInvites(email: any): Observable<any> {
    return this.db.collection('shareInvites', invite => invite.where('shareWith', '==', email)).snapshotChanges();
  }

  getUnseenShareInvitesStream(email: any): Observable<any> {
    return this.db.collection('shareInvites', invite => invite.where('shareWith', '==', email).where('seen','==', false)).snapshotChanges();
  }

  markInviteAsSeen(inviteID: string | undefined) {
    return this.db.collection('shareInvites').doc(inviteID).update({seen: true});
  }

  addUserToPet(petID: string, email: string) {
    return this.db.collection('pets').doc(petID).update({sharedWith: arrayUnion(email)})
  }

  removeUserFromPet(petID: string | undefined, email: string) {
    return this.db.collection('pets').doc(petID).update({sharedWith: arrayRemove(email)})
  }

  deleteShareInvite(inviteID: string | undefined) {
    return this.db.collection('shareInvites').doc(inviteID).delete();
  }
}