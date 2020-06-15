import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  sendMsg(msg) {
    this.messages.next(msg);
  }

}
