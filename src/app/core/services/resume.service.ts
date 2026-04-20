import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnalysisResult, HistoryItem } from '../models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  analyzeResume(file: File, jobDescription: string): Observable<AnalysisResult> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    return this.http.post<{ success: boolean; data: AnalysisResult }>(
      `${this.apiUrl}/resume/analyze`,
      formData
    ).pipe(
      map(response => response.data)
    );
  }

  getHistory(): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(`${this.apiUrl}/resume/history`);
  }

  getHistoryById(id: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(`${this.apiUrl}/resume/history/${id}`);
  }

  deleteHistory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/resume/history/${id}`);
  }
}
