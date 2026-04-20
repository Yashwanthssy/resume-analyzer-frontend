import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ResumeService } from '../../core/services/resume.service';
import { AnalysisResult } from '../../core/models/resume.model';
import { ScoreRingComponent } from '../../shared/components/score-ring/score-ring.component';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ScoreRingComponent],
  templateUrl: './analyzer.component.html',
  styleUrl: './analyzer.component.scss'
})
export class AnalyzerComponent {
  private fb = inject(FormBuilder);
  private resumeService = inject(ResumeService);

  form: FormGroup;
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  isLoading = signal(false);
  analysisResult = signal<AnalysisResult | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      jobDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('File size must be less than 5MB');
      return;
    }

    this.selectedFile.set(file);
    this.errorMessage.set(null);
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedFile()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.analysisResult.set(null);

    this.resumeService.analyzeResume(this.selectedFile()!, this.form.value.jobDescription)
      .subscribe({
        next: (result) => {
          this.analysisResult.set(result);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Failed to analyze resume. Please try again.');
          this.isLoading.set(false);
        }
      });
  }

  getVerdictClass(verdict: string): string {
    const verdictMap: { [key: string]: string } = {
      'Strong Match': 'strong',
      'Good Match': 'good',
      'Partial Match': 'partial',
      'Weak Match': 'weak'
    };
    return verdictMap[verdict] || 'weak';
  }
}
