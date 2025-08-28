import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  selectedPersonnelId: number | null = null;

  constructor() { }

  setSelectedPersonnelId(personnelId: number) {
    this.selectedPersonnelId = personnelId;
  }
}
