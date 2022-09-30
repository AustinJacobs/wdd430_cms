import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(
      '2',
      'Birthday Party',
      'Hey, can you send me the party info for Kai?',
      'Austin'
    ),
    new Message(
      '3',
      'Shopping List',
      'I am not sure what to buy at the store. Can you send me the list?',
      'Hannah'
    ),
    new Message(
      '4',
      'Doctor Visit',
      'Please, can you tell me what time my visit is?',
      'Sam'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    //push message to array of messages
    this.messages.push(message);
  }
}
