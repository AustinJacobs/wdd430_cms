import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];

  contactChangedEvent = new EventEmitter<Contact[]>();

  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
    this.getContacts();
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

  getContacts() {
    this.http
      .get('https://atjcms-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: any) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts.sort((first: Contact, second: Contact) => {
            if (first.id < second.id) {
              return -1;
            } else if (first.id === second.id) {
              return 0;
            } else {
              return 1;
            }
          });
          this.contactListChangedEvent.next(this.contacts.slice());
          // console.log(this.contacts.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  storeContacts() {
    let json = JSON.stringify(this.contacts);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    this.http
      .put<{ message: string }>(
        'https://atjcms-default-rtdb.firebaseio.com/contacts.json',
        json,
        {
          headers: headers,
        }
      )
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  getContact(id: string) {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) {
    if (contact === null || contact === undefined) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  addContact(newContact: Contact) {
    if (newContact === null || newContact === undefined) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (
      originalContact === null ||
      originalContact === undefined ||
      newContact === null ||
      newContact === undefined
    ) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }
}
