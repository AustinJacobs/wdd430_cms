import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();

  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http
      .get('https://atjcms-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: any) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((first: Document, second: Document) => {
            if (first.id < second.id) {
              return -1;
            } else if (first.id === second.id) {
              return 0;
            } else {
              return 1;
            }
          });
          this.documentListChangedEvent.next(this.documents.slice());
          // console.log(this.documents.slice());
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  storeDocuments() {
    let json = JSON.stringify(this.documents);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    this.http
      .put<{ message: string }>(
        'https://atjcms-default-rtdb.firebaseio.com/documents.json',
        json,
        {
          headers: headers,
        }
      )
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === null || newDocument === undefined) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (
      originalDocument === null ||
      originalDocument === undefined ||
      newDocument === null ||
      newDocument === undefined
    ) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document === null || document === undefined) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
