import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(private db: AngularFirestore) {
  }


  addPet(newPet: any): Promise<any> {
    return this.db.collection('pets').add(newPet)
  }

  deletePet(petId: any): Promise<any> {
    return this.db.collection('pets').doc(petId).delete()
  }

  // Gets the pets for a user one time
  getUsersPets(userId: string): Observable<any> {
    return this.db.collection('pets', pet => pet.where('userId', '==', userId)).snapshotChanges()
  }

  getDailyLogs(petId: string): Observable<any> {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').snapshotChanges()
  }

  addDailyLog(petId: string , dailyLog: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').add(dailyLog)
  }

  deleteDailyLog(petId: string , dailyLogId: any) {
    return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).delete()
  }

  // addWalk(petId: string , dailyLogId: any, walk: any) {
  //   return this.db.collection('pets').doc(petId).collection('dailyLogs').doc(dailyLogId).collection('walks').add(walk)
  // }
}