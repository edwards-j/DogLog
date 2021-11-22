import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
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

  // Gets the pets for a user
  getUsersPets(email: string): Observable<any> {
    return this.db.collection('pets', pet => pet.where('sharedWith', 'array-contains', email)).snapshotChanges()
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

  // Outs functions
  getOuts(petId: string , dailyLogId: any): Observable<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('outs').snapshotChanges()
  }

  addOut(petId: string , dailyLogId: any, out: any): Promise<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('outs').add(out)
  }

  deleteOut(petId: string , dailyLogId: any, outId: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('outs').doc(outId).delete()
  }

  // Walk functions
  getWalks(petId: string , dailyLogId: any): Observable<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('walks').snapshotChanges()
  }

  addWalk(petId: string , dailyLogId: any, walk: any): Promise<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('walks').add(walk)
  }

  deleteWalk(petId: string , dailyLogId: any, walkId: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('walks').doc(walkId).delete()
  }

  // Notes functions
  addNote(petId: string , dailyLogId: any, note: any): Promise<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('notes').add(note)
  }

  getNotes(petId: string , dailyLogId: any): Observable<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('notes').snapshotChanges()
  }

  // Share functions
  sendShareInvite(invite: ShareInvite) {
    return this.db.collection('shareInvites').add(invite);
  }

  getShareInvites(email: any): Observable<any> {
    return this.db.collection('shareInvites', invite => invite.where('shareWith', '==', email)).snapshotChanges();
  }
}