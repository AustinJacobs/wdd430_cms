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

  sortAndSend() {
    this.documents.sort((first, second) => {
      if (first < second) return -1;
      if (first > second) return 1;
      return 0;
    });
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() {
    this.http
      .get<{ message: string; documents: Document[] }>(
        'http://localhost:3000/documents/'
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.documents = response.documents;
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  getDocument(id: string): Document {
    return this.documents.find((d) => d.id === id);
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
    if (!newDocument) return;
    newDocument.id = '';
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        newDocument,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.documents.push(response.document);
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  updateDocument(original: Document, newDocument: Document) {
    if (!newDocument || !original) return;
    const pos = this.documents.indexOf(original);
    if (pos < 0) return;

    newDocument.id = original.id;
    newDocument._id = original._id;
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/documents/' + original.id,
        newDocument,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }

  deleteDocument(document: Document) {
    if (!document) return;
    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
    this.http
      .delete<{ message: string }>(
        'http://localhost:3000/documents/' + document.id
      )
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        error: (error) => {
          console.error(error.message);
          console.error(error.error);
        },
      });
  }
}
