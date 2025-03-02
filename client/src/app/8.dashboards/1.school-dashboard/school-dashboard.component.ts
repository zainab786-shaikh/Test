import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {
  DashboardServiceHelper,
  IParentNode,
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
  templateUrl: './school-dashboard.component.html',
  styleUrl: './school-dashboard.component.css',
})
export class SchoolDashboardComponent {
  serviceHelper = new DashboardServiceHelper();
  schoolId: number = 1;

  perfOverall!: number;
  perfOverallPlotter!: BarPlotter;

  perfPerStandard!: IParentNode[];
  perfPerSubject!: IParentNode[];

  constructor() {
    this.schoolId = 1;
  }

  ngOnInit(): void {
    this.perfOverall = this.serviceHelper.getOverallPerfForSchool(
      this.schoolId
    );

    this.perfOverallPlotter! = new BarPlotter(
      [this.perfOverall],
      [0],
      'Overall Performance'
    );

    let perfPerStandardTemp = this.serviceHelper.getPerfForSchoolPerStandard(
      this.schoolId
    );

    this.perfPerStandard = perfPerStandardTemp.map((eachStandard) => {
      return {
        Id: eachStandard.Id,
        name: eachStandard.name,
        score: eachStandard.score,
        expanded: false,
        childList: [],
      } as IParentNode;
    });

    let perfPerSubjectTemp = this.serviceHelper.getPerfForSchoolPerSubject(
      this.schoolId
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
  }

  clickByStandard(parentId: number) {
    console.log('Standard Id: ' + parentId);
  }

  clickBySubject(parentId: number) {
    console.log('Subject Id: ' + parentId);
  }
}
