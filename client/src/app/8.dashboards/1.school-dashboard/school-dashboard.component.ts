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
import { ProgressService } from '../../4.progress/progress.service';

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
  schoolId: number = 1;

  perfOverall!: number;
  perfOverallPlotter!: BarPlotter;

  perfPerStandard!: IParentNode[];
  perfPerSubject!: IParentNode[];

  constructor(
    private progressService: ProgressService,
    private serviceHelper: DashboardServiceHelper
  ) {
    this.schoolId = 1;
  }

  ngOnInit(): void {
    this.serviceHelper.initializeDashboardData(this.schoolId);
    this.progressService.getAllSchool(this.schoolId).subscribe((data) => {
      this.perfOverall = this.serviceHelper.getOverallPerformance(data);

      // Standard => Overall
      let perfPerStandardTemp = this.serviceHelper.getPerfPerStandard(data);
      this.perfPerStandard = perfPerStandardTemp.map((eachStandard) => {
        return {
          Id: eachStandard.Id,
          name: eachStandard.name,
          score: eachStandard.score,
          expanded: false,
          childList: [],
        } as IParentNode;
      });

      this.perfOverallPlotter! = new BarPlotter(
        [this.perfOverall],
        [0],
        'Overall Performance'
      );

      // Subject => Overall
      let perfPerSubjectTemp = this.serviceHelper.getPerfPerSubject(data);
      this.perfPerSubject = perfPerSubjectTemp.map((eachSubject) => {
        return {
          Id: eachSubject.Id,
          name: eachSubject.name,
          score: eachSubject.score,
          expanded: false,
          childList: [],
        } as IParentNode;
      });
    });
  }

  clickByStandard(parentId: number) {
    console.log('Standard Id: ' + parentId);
  }

  clickBySubject(parentId: number) {
    console.log('Subject Id: ' + parentId);
  }
}
