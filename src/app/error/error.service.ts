import { Injectable } from '@angular/core';

/*
  * This service is used to store errors in the application.
  * The stored errors can be used to display error messages to the user.
  * A new error overwrites the old one.
*/
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  private errorMessage: string | null = null;
  private errorTitle: string | null = null;


  setError(errorTitle: string | null, errorMessage: string | null){
    this.errorMessage = errorMessage;
    this.errorTitle = errorTitle;
  }
  getError(): {
    errorMessage: string | null,
    errorTitle: string | null,
  } {
    return {
      errorMessage: this.errorMessage,
      errorTitle: this.errorTitle,
    };
  }
}
