import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;
  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  sortAndSend() {
    this.contacts.sort((first, second) => {
      if (first < second) return -1;
      if (first > second) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://localhost:3000/contacts'
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.contacts = response.contacts;
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  getContact(id: string): Contact {
    return this.contacts.find(
      (contact) => contact.id === id || contact._id === id
    );
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    this.http
      .delete<{ message: string }>(
        'http://localhost:3000/contacts/' + contact.id
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    newContact.id = '';
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        newContact,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.contacts.push(response.contact);
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  updateContact(original: Contact, newContact: Contact) {
    if (!newContact || !original) return;
    const pos = this.contacts.indexOf(original);
    if (pos < 0) return;

    newContact.id = original.id;
    newContact._id = original._id;
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/contacts/' + original.id,
        newContact,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }
}
