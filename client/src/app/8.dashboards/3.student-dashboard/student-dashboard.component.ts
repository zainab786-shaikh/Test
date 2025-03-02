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
import { ProgressService } from '../../4.progress/progress.service';

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
  schoolId!: number;
  standardId!: number;
  studentId!: number;

  perfOverall!: number;
  perfOverallPlotter!: BarPlotter;

  perfPerSubject!: IChildNode[];
  lessonData!: IParentNode[];

  constructor(
    private progressService: ProgressService,
    private serviceHelper: DashboardServiceHelper
  ) {
    this.schoolId = 1;
    this.standardId = 1;
    this.studentId = 1;
  }

  ngOnInit(): void {
    this.serviceHelper.initializeDashboardData(this.schoolId);
    this.progressService
      .getAllStudent(this.schoolId, this.standardId, this.studentId)
      .subscribe((data) => {
        this.perfOverall = this.serviceHelper.getOverallPerformance(data);
        this.perfOverallPlotter! = new BarPlotter(
          [this.perfOverall],
          [0],
          'Overall Performance'
        );

        this.perfPerSubject = this.serviceHelper.getPerfPerSubject(data);
        this.lessonData = this.perfPerSubject.map((eachSubject) => {
          let lessonList = data.filter(
            (eachProgress) => eachProgress.subject == eachSubject.Id
          );
          return {
            Id: eachSubject.Id,
            name: eachSubject.name,
            score: eachSubject.score,
            expanded: false,
            childList: this.serviceHelper.getPerfPerLesson(lessonList),
          };
        });
      });
  }

  clickByLesson(event: { parentId: number; childId: number }) {
    console.log(
      'Subject Id: ' + event.parentId + ' Lesson Id: ' + event.childId
    );
  }
  //====================================| Calculations
}
