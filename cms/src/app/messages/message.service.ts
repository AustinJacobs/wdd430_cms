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

  sortAndSend() {
    this.messages.sort((first, second) => {
      if (first < second) return -1;
      if (first > second) return 1;
      return 0;
    });
    this.messageListChangedEvent.next(this.messages.slice());
  }

  getMessages() {
    this.http
      .get<{ message: string; messageObjects: Message[] }>(
        'http://localhost:3000/messages'
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          console.log(response.messageObjects);
          this.messages = response.messageObjects;
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
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

  addMessage(newMessage: Message) {
    if (!newMessage) return;
    newMessage.id = '';
    this.http
      .post<{ message: string; messageObject: Message }>(
        'http://localhost:3000/messages/',
        newMessage,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.messages.push(response.messageObject);
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }
}
