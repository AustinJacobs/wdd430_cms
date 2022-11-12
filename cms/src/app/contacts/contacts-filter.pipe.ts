import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], [term]) {
    let filteredContactsArray: Contact[] = [];

    if (term && term.length > 0) {
      filteredContactsArray = contacts.filter((contact: Contact) =>
        contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filteredContactsArray.length < 1) {
      return contacts;
    }
    return filteredContactsArray;
  }
}
