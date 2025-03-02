import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {
  DashboardServiceHelper,
  IChildNode,
} from '../dashboard.component.servicehelper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  IParentNode,
  UtilProgressBarComponent,
} from '../0.utils/1.progress-bar/progress-bar.component';
import { BarPlotter } from '../dashboard.component.servicePlotter';

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
    UtilProgressBarComponent,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  serviceHelper = new DashboardServiceHelper();

  schoolId!: number;
  standardId!: number;
  studentId!: number;

  perfOverall!: number;
  perfOverallPlotter!: BarPlotter;

  perfPerSubject!: IChildNode[];
  lessonData!: IParentNode[];

  constructor() {
    this.schoolId = 1;
    this.standardId = 1;
    this.studentId = 1;
  }

  ngOnInit(): void {
    //====================================| Plot
    this.perfOverall =
      this.serviceHelper.getOverallPerfForSchoolStandardPerStudent(
        this.schoolId,
        this.standardId,
        this.studentId
      );

    this.perfOverallPlotter! = new BarPlotter(
      [this.perfOverall],
      [0],
      'Overall Performance'
    );

    this.perfPerSubject = this.serviceHelper.getPerfForStudentPerSubject(
      this.schoolId,
      this.standardId,
      this.studentId
    );

    this.lessonData = this.perfPerSubject.map((eachSubject) => {
      return {
        Id: eachSubject.Id,
        name: eachSubject.name,
        score: eachSubject.score,
        expanded: false,
        childList: this.serviceHelper.getPerfForStudentPerSubjectLesson(
          this.schoolId,
          this.standardId,
          this.studentId,
          eachSubject.Id
        ),
      };
    });
  }

  clickByLesson(event: { parentId: number; childId: number }) {
    console.log(
      'Subject Id: ' + event.parentId + ' Lesson Id: ' + event.childId
    );
  }
  //====================================| Calculations
}
