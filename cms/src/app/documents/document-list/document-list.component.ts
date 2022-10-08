import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>()

  documents: Document[] = [
    new Document('1', 'Enduro', 'A type of mountain biking that involves endurance.', 'https://en.wikipedia.org/wiki/Enduro_(mountain_biking)#:~:text=Enduro%20in%20its%20most%20basic,%22transfer%22%20stages%20in%20between.', null),
    new Document('2', 'Downhill', 'It is right in the name, you are riding a bike straight down a hill.', 'https://en.wikipedia.org/wiki/Downhill_mountain_biking', null),
    new Document('3', 'Trail', 'A good mixture of up and downhill riding in the mountains.', 'https://en.wikipedia.org/wiki/Mountain_biking#:~:text=Trail%20riding%20or%20trail%20biking,complex%2C%20known%20as%20trail%20centres.', null),
    new Document('4', 'Gravel/Road', 'A type of biking where you ride on pavement or gravel roads.', 'https://www.bikeradar.com/features/what-is-a-road-bike/', null)
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
