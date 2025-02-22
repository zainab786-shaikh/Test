import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { DashboardServiceHelper } from '../dashboard.component.servicehelper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    PlotlyModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  serviceHelper = new DashboardServiceHelper();
  schoolId: number = 1;
  standardId: number = 1;
  studentId: number = 1;

  overallPerformance!: number;
  subjectWisePerformance!: {
    subject: string;
    score: number;
    expanded: boolean;
  }[];
  latestAssessments!: {
    subject: string;
    lesson: string;
    qz: number;
    fb: number;
    tf: number;
  }[];

  comparisonData = []; //this.serviceHelper.getComparisonData();
  goals = [];
  activityFeed = [];

  lessonPerformance!: {
    subject: string;
    lessonList: {
      name: string;
      score: number;
    }[];
  }[];

  subjectLesson!: {
    [subject: string]: {
      x: any;
      y: any;
      type: string;
    }[];
  };

  constructor() {
    this.schoolId = 1;
    this.standardId = 1;
    this.studentId = 1;

    this.overallPerformance =
      this.serviceHelper.getPerStudentOverallPerformance(
        this.schoolId!,
        this.standardId!,
        this.studentId!
      );

    this.subjectWisePerformance =
      this.serviceHelper.getPerStudentSubjectPerformance(
        this.schoolId!,
        this.standardId!,
        this.studentId!
      );

    this.latestAssessments = this.serviceHelper.getLatestAssessments(
      this.schoolId!,
      this.standardId!,
      this.studentId!
    );

    // comparisonData = []; //this.serviceHelper.getComparisonData();
    // goals = []; //this.serviceHelper.generateGoals();
    // activityFeed = []; //this.serviceHelper.generateActivityFeed();

    this.lessonPerformance = this.serviceHelper.getPerSubjectLessonPerformance(
      this.schoolId!,
      this.standardId!,
      this.studentId!
    );

    this.subjectLesson = {};
    this.lessonPerformance.forEach((eachSubject) => {
      this.subjectLesson[eachSubject.subject] =
        this.getOverallLessonPerformanceData(eachSubject);
    });
  }

  overallPerformanceData: any;
  overallPerformanceLayout: any;

  subjectWisePiePerformanceData: any;
  subjectWisePiePerformanceLayout: any;

  subjectWiseBarPerformanceData: any;
  subjectWiseBarPerformanceLayout: any;

  overallLessonPerformanceLayout: any;

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

    this.overallLessonPerformanceLayout = {
      title: 'Lesson Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };
  }

  //====================================| Calculations
  getOverallLessonPerformanceData(subject: any) {
    return [
      {
        type: 'bar',
        orientation: 'h',
        y: subject.lessonList.map((eachLesson: any) => eachLesson.name),
        x: subject.lessonList.map((eachLesson: any) => eachLesson.score),
      },
    ];
  }

  togglePanel(subjectItem: any, event: Event) {
    event.stopPropagation();
    this.subjectWisePerformance.forEach((eachSubject) => {
      if (eachSubject.subject !== subjectItem.subject) {
        eachSubject.expanded = false;
      }
    });
    subjectItem.expanded = !subjectItem.expanded;
  }

  onProgressBarClick(value: number) {
    console.log(`Progress bar with value ${value}% clicked`);
  }
}
