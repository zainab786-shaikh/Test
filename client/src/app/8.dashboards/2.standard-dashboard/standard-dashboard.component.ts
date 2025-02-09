import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { DashboardServiceHelper } from '../dashboard.component.servicehelper';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-standard-dashboard',
  imports: [CommonModule, MatCardModule, MatTableModule, PlotlyModule],
  templateUrl: './standard-dashboard.component.html',
  styleUrl: './standard-dashboard.component.css',
})
export class StandardDashboardComponent {
  serviceHelper = new DashboardServiceHelper();
  schoolId: number = 1;
  standardId: number = 1;

  overallPerformance!: number;
  subjectWisePerformance!: { subject: string; score: number }[];
  studentWisePerformance!: { student: string; score: number }[];

  constructor() {
    this.schoolId = 1;
    this.standardId = 1;

    this.overallPerformance =
      this.serviceHelper.getPerStandardOverallPerformance(
        this.schoolId!,
        this.standardId!
      );

    this.subjectWisePerformance =
      this.serviceHelper.getPerStandardSubjectPerformance(
        this.schoolId!,
        this.standardId!
      );

    this.studentWisePerformance =
      this.serviceHelper.getPerStandardStudentsPerformance(
        this.schoolId!,
        this.standardId!
      );

    // comparisonData = []; //this.serviceHelper.getComparisonData();
    // goals = []; //this.serviceHelper.generateGoals();
    // activityFeed = []; //this.serviceHelper.generateActivityFeed();
  }

  overallPerformanceData: any;
  overallPerformanceLayout: any;

  subjectWisePiePerformanceData: any;
  subjectWisePiePerformanceLayout: any;

  overallSubjectPerformanceData: any;
  overallSubjectPerformanceLayout: any;

  subjectWiseBarPerformanceData: any;
  subjectWiseBarPerformanceLayout: any;

  studentWiseBarPerformanceData: any;
  studentWiseBarPerformanceLayout: any;

  ngOnInit(): void {
    //====================================| Plot
    this.overallPerformanceData = [
      {
        type: 'bar',
        x: [this.overallPerformance], // X-axis represents the value (horizontal bar)
        y: [0],
        orientation: 'h', // Ensures it's a horizontal bar chart
        marker: {
          color:
            this.overallPerformance >= 75
              ? 'green'
              : this.overallPerformance >= 50
              ? 'yellow'
              : 'red',
        },
      },
    ];

    this.overallPerformanceLayout = {
      title: 'Overall Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };

    this.subjectWisePiePerformanceData = [
      {
        type: 'pie',
        labels: this.subjectWisePerformance.map((s) => s.subject),
        values: this.subjectWisePerformance.map((s) => s.score),
        hole: 0.4,
      },
    ];

    this.subjectWisePiePerformanceLayout = {
      title: 'Progress by Subject',
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };

    this.subjectWiseBarPerformanceData = [
      {
        type: 'bar',
        x: this.subjectWisePerformance.map((s) => s.score), // X-axis represents the value (horizontal bar)
        y: this.subjectWisePerformance.map((s) => s.subject),
        orientation: 'h', // Ensures it's a horizontal bar chart
      },
    ];

    this.subjectWiseBarPerformanceLayout = {
      title: 'Overall Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };

    this.studentWiseBarPerformanceData = [
      {
        type: 'bar',
        x: this.studentWisePerformance.map((s) => s.score), // X-axis represents the value (horizontal bar)
        y: this.studentWisePerformance.map((s) => s.student),
        orientation: 'h', // Ensures it's a horizontal bar chart
      },
    ];

    this.studentWiseBarPerformanceLayout = {
      title: 'Overall Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };
  }
}
