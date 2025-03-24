import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Import CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,  // ✅ Ensure it's a standalone component
  imports: [CommonModule,RouterModule],  // ✅ Import CommonModule here
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  features: string[] = [
    "Personalized Learning",
    "AI-Driven Content",
    "Interactive Lessons",
    "Real-Time Feedback",
    "Adaptive Assessments"
  ];

  currentFeature: number = 0;
  currentText: string = "";
  deleting: boolean = false;
  imgNum: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.startTypewriter();
    this.startImageRotation();
  }

  startTypewriter(): void {
    setInterval(() => {
      if (this.deleting) {
        this.currentText = this.currentText.slice(0, -1);
      } else {
        this.currentText = this.features[this.currentFeature].slice(0, this.currentText.length + 1);
      }

      if (!this.deleting && this.currentText === this.features[this.currentFeature]) {
        setTimeout(() => {
          this.deleting = true;
        }, 1500);
      } else if (this.deleting && this.currentText === "") {
        this.deleting = false;
        this.currentFeature = (this.currentFeature + 1) % this.features.length;
      }
    }, this.deleting ? 60 : 100);
  }

  startImageRotation(): void {
    setInterval(() => {
      this.imgNum = this.imgNum === 5 ? 1 : this.imgNum + 1;
    }, 4300);
  }
}
