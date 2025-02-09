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
  templateUrl: './school-dashboard.component.html',
  styleUrl: './school-dashboard.component.css',
})
export class SchoolDashboardComponent {
  serviceHelper = new DashboardServiceHelper();
  schoolId: number = 1;
  standardId: number = 1;

  overallPerformance!: number;
  standardWisePerformance!: { standard: string; score: number }[];

  constructor() {
    this.schoolId = 1;
    this.standardId = 1;

    this.overallPerformance = this.serviceHelper.getPerSchoolOverallPerformance(
      this.schoolId!
    );

    this.standardWisePerformance =
      this.serviceHelper.getPerSchoolStandardPerformance(this.schoolId!);
  }

  overallPerformanceData: any;
  overallPerformanceLayout: any;

  standardWiseBarPerformanceData: any;
  standardWiseBarPerformanceLayout: any;

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

    this.standardWiseBarPerformanceData = [
      {
        type: 'bar',
        x: this.standardWisePerformance.map((s) => s.score), // X-axis represents the value (horizontal bar)
        y: this.standardWisePerformance.map((s) => s.standard),
        orientation: 'h', // Ensures it's a horizontal bar chart
      },
    ];

    this.standardWiseBarPerformanceLayout = {
      title: 'Overall Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };
  }
}
