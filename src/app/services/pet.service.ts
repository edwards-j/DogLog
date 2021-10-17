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
    console.log('Pet Service: saving new pet...');

    return this.db.collection('pets').add(newPet)
  }

  // Gets the pets for a user one time
  getUsersPets(userId: string): Observable<any> {
    return this.db.collection('pets', pet => pet.where('userId', '==', userId)).get()

    // Change the .get() to .valueChanges() to subscribe to any value change events to automatically update the data 
  }
}