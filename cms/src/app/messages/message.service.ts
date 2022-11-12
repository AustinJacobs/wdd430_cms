import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageListChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages() {
    this.http
      .get('https://atjcms-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: any) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((first: Message, second: Message) => {
            if (first.id < second.id) {
              return -1;
            } else if (first.id === second.id) {
              return 0;
            } else {
              return 1;
            }
          });
          this.messageListChangedEvent.next(this.messages.slice());
          // console.log(this.documents.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  storeMessages() {
    let json = JSON.stringify(this.messages);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    this.http
      .put<{ message: string }>(
        'https://atjcms-default-rtdb.firebaseio.com/messages.json',
        json,
        {
          headers: headers,
        }
      )
      .subscribe(() => {
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  getMessage(id: string): Message {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
