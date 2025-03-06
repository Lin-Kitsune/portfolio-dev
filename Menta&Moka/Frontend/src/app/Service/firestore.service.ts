import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  saveUser(userData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${userData.uid}`);
    return setDoc(userRef, userData);
  }
}
