import { Injectable } from '@angular/core';
export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}
