export class BarPlotter {
  barData: any;
  barLayout: any;

  constructor(inXPerfValue: number[], inYPerfValue: number[], title: string) {
    this.barData = [
      {
        type: 'bar',
        x: inXPerfValue, // X-axis represents the value (horizontal bar)
        y: inYPerfValue,
        orientation: 'h', // Ensures it's a horizontal bar chart
        marker: {
          color:
            inXPerfValue[0] >= 75
              ? 'green'
              : inXPerfValue[0] >= 50
              ? 'yellow'
              : 'red',
        },
      },
    ];

    this.barLayout = {
      title: title,
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };
  }
}

export class PiePlotter {
  pieData: any;
  pieLayout: any;

  constructor(inLabels: string[], inValues: number[], title: string) {
    this.pieData = [
      {
        type: 'pie',
        labels: inLabels,
        values: inValues,
        hole: 0.4,
      },
    ];

    this.pieLayout = {
      title: title,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };
  }
}
