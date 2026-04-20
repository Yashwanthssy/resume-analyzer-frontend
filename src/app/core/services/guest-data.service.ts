import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnalysisResult } from '../models/resume.model';

export interface GuestAnalysis {
  id: string;
  fileName: string;
  jobDescription: string;
  analysisResult: AnalysisResult;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuestDataService {
  private readonly GUEST_DATA_KEY = 'guest_analyses';
  private guestAnalysesSubject = new BehaviorSubject<GuestAnalysis[]>([]);
  public guestAnalyses$ = this.guestAnalysesSubject.asObservable();

  constructor() {
    this.loadGuestData();
  }

  saveGuestAnalysis(analysis: GuestAnalysis): void {
    const currentAnalyses = this.getGuestAnalyses();
    currentAnalyses.unshift(analysis); // Add to beginning
    
    // Keep only last 10 analyses for guests
    if (currentAnalyses.length > 10) {
      currentAnalyses.splice(10);
    }
    
    localStorage.setItem(this.GUEST_DATA_KEY, JSON.stringify(currentAnalyses));
    this.guestAnalysesSubject.next(currentAnalyses);
  }

  getGuestAnalyses(): GuestAnalysis[] {
    try {
      const data = localStorage.getItem(this.GUEST_DATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error parsing guest data:', error);
      return [];
    }
  }

  clearGuestData(): void {
    localStorage.removeItem(this.GUEST_DATA_KEY);
    this.guestAnalysesSubject.next([]);
  }

  hasGuestData(): boolean {
    return this.getGuestAnalyses().length > 0;
  }

  private loadGuestData(): void {
    const analyses = this.getGuestAnalyses();
    this.guestAnalysesSubject.next(analyses);
  }
}