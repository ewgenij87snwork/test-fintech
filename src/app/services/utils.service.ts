import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public formatDate(timestamp: string) {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  }
}
