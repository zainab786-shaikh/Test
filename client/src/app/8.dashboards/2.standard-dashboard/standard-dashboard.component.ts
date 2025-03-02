import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {
  DashboardServiceHelper,
  IParentNode,
  IChildNode,
} from '../dashboard.component.servicehelper';
import { BarPlotter } from '../dashboard.component.servicePlotter';
import { UtilProgressBarComponent } from '../0.utils/1.progress-bar/progress-bar.component';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-standard-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    PlotlyModule,
    UtilProgressBarComponent,
  ],
  templateUrl: './standard-dashboard.component.html',
  styleUrl: './standard-dashboard.component.css',
})
export class StandardDashboardComponent {
  serviceHelper = new DashboardServiceHelper();
  schoolId: number = 1;
  standardId: number = 1;

  perfOverall!: number;
  perfOverallPlotter!: BarPlotter;

  perfPerSubject!: IParentNode[];
  perfPerStudent!: IParentNode[];

  constructor() {
    this.schoolId = 1;
    this.standardId = 1;
  }

  ngOnInit(): void {
    this.perfOverall = this.serviceHelper.getOverallPerfForSchoolPerStandard(
      this.schoolId,
      this.standardId
    );

    this.perfOverallPlotter! = new BarPlotter(
      [this.perfOverall],
      [0],
      'Overall Performance'
    );

    let perfPerSubjectTemp = this.serviceHelper.getPerfForStandardPerSubject(
      this.schoolId,
      this.standardId
    );

    this.perfPerSubject = perfPerSubjectTemp.map((eachSubject) => {
      return {
        Id: eachSubject.Id,
        name: eachSubject.name,
        score: eachSubject.score,
        expanded: false,
        childList: [],
      } as IParentNode;
    });

    let perfPerStudentTemp = this.serviceHelper.getPerfForStandardPerStudent(
      this.schoolId,
      this.standardId
    );

    this.perfPerStudent = perfPerStudentTemp.map((eachStandard) => {
      return {
        Id: eachStandard.Id,
        name: eachStandard.name,
        score: eachStandard.score,
        expanded: false,
        childList: [],
      } as IParentNode;
    });
  }

  clickBySubject(parentId: number) {
    console.log('Subject Id: ' + parentId);
  }

  clickByStudent(parentId: number) {
    console.log('Student Id: ' + parentId);
  }
}
