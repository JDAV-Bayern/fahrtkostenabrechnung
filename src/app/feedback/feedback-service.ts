import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// DTO Interfaces
export interface FeedbackDTO {
  id: string;
  course_id: string;
  course_name: string;
  teamers: string[];
  surveyJson: Record<string, unknown>;
}

export interface FeedbackCreateDTO {
  course_id: string;
  course_name: string;
  teamers: string[];
}

export interface FeedbackRecordDTO {
  id: string;
  feedback_id: string;
  feedback: unknown;
}

export interface FeedbackRecordCreateDTO {
  feedback_id: string;
  feedback: unknown;
}

export interface FeedbackAccessTokenDTO {
  id: string;
  token: string;
  course_id: string;
  role: string;
  used: number;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = environment.backendUrl;
  http = inject(HttpClient);

  /**
   * Retrieve all feedback entries.
   * @returns List of all feedback entries.
   */
  listFeedbacks(): Observable<FeedbackDTO[]> {
    return this.http.get<FeedbackDTO[]>(`${this.baseUrl}/feedback/`);
  }

  /**
   * Retrieves a single feedback by token.
   * @param token Access token with 'get_feedback' role.
   * @returns The feedback entry associated with the token or null.
   */
  getFeedbackByToken(token: string): Observable<FeedbackDTO> {
    const params = new HttpParams().set('token', token);
    return this.http.get<FeedbackDTO>(`${this.baseUrl}/feedback/by-token`, {
      params,
    });
  }

  /**
   * Create a new feedback entry.
   * @param feedbackCreateDTO The feedback data to create.
   * @param token Access token with 'give_feedback' role.
   * @returns The created feedback entry.
   */
  createFeedback(
    feedbackCreateDTO: FeedbackCreateDTO,
  ): Observable<FeedbackDTO> {
    return this.http.post<FeedbackDTO>(
      `${this.baseUrl}/feedback/`,
      feedbackCreateDTO,
    );
  }

  /**
   * Retrieve all feedback records for a specific feedback ID.
   * @param feedbackId The ID of the feedback to retrieve records for.
   * @param token Access token with 'get_feedback' role.
   * @returns A list of feedback records.
   */
  listFeedbackRecords(token: string): Observable<FeedbackRecordDTO[]> {
    const params = new HttpParams().set('token', token);
    return this.http.get<FeedbackRecordDTO[]>(
      `${this.baseUrl}/feedback/by-token/records`,
      { params },
    );
  }

  /**
   * Create a new feedback record.
   * @param feedbackRecordDTO The feedback record data to create.
   * @param token Access token with 'give_feedback' role.
   * @returns The created feedback record.
   */
  createFeedbackRecord(
    feedbackRecordDTO: FeedbackRecordCreateDTO,
    token: string,
  ): Observable<FeedbackRecordDTO> {
    const params = new HttpParams().set('token', token);
    return this.http.post<FeedbackRecordDTO>(
      `${this.baseUrl}/feedback/by-token`,
      feedbackRecordDTO,
      { params },
    );
  }

  /**
   * Retrieve all feedback access tokens for a specific feedback ID.
   * @param feedbackId The ID of the feedback to retrieve tokens for.
   * @returns A list of feedback access tokens.
   */
  listFeedbackTokens(feedbackId: string): Observable<FeedbackAccessTokenDTO[]> {
    return this.http.get<FeedbackAccessTokenDTO[]>(
      `${this.baseUrl}/feedback/${feedbackId}/tokens`,
    );
  }

  /**
   * Create a new feedback access token.
   * @param feedbackId The ID of the feedback to create a token for.
   * @param role Role for the token. Must be either 'give_feedback' or 'get_feedback'.
   * @returns The created feedback access token.
   */
  createFeedbackToken(
    feedbackId: string,
    role: string,
  ): Observable<FeedbackAccessTokenDTO> {
    return this.http.post<FeedbackAccessTokenDTO>(
      `${this.baseUrl}/feedback/${feedbackId}/tokens`,
      { role },
    );
  }

  /**
   * Delete a feedback access token.
   * @param tokenId The ID of the token to delete.
   * @returns Observable<void>
   */
  deleteFeedbackToken(tokenId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/feedback/tokens/${tokenId}`);
  }
}
