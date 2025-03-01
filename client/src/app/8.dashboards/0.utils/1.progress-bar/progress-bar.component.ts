import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface IChildNode {
  Id: number;
  name: string;
  score: number;
}
export interface IParentNode {
  Id: number;
  name: string;
  score: number;
  expanded: boolean;
  childList: IChildNode[];
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class UtilProgressBarComponent {
  @Input() parentList: IParentNode[] = [];
  @Output() progressBarClick = new EventEmitter<{
    parentId: number;
    childId: number;
  }>(); // EventEmitter defined

  constructor() {}

  ngOnInit(): void {}

  togglePanel(inParent: IParentNode, event: Event) {
    event.stopPropagation();
    this.parentList.forEach((eachParent) => {
      if (eachParent.name !== inParent.name) {
        eachParent.expanded = false;
      }
    });
    inParent.expanded = !inParent.expanded;
  }

  onProgressBarClick(parentId: number, childId: number) {
    console.log(
      `Progress bar clicked: Parent ID = ${parentId}, Child ID = ${childId}`
    );
    this.progressBarClick.emit({ parentId, childId }); // Emit the event
  }
}
