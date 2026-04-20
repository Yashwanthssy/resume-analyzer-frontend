import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-ring.component.html',
  styleUrl: './score-ring.component.scss'
})
export class ScoreRingComponent implements OnInit {
  @Input() score: number = 0;
  
  circumference = 2 * Math.PI * 40; // radius = 40
  strokeDashoffset = this.circumference;

  ngOnInit() {
    const progress = this.score / 100;
    this.strokeDashoffset = this.circumference * (1 - progress);
  }

  getScoreColor(): string {
    if (this.score > 70) return 'success';
    if (this.score >= 40) return 'warning';
    return 'danger';
  }
}
