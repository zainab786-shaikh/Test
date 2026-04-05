export class BarPlotter {
  barData: any;
  barLayout: any;

  constructor(inXPerfValue: number[], inYPerfValue: number[], title: string) {
    this.barData = [
      {
        type: 'bar',
        x: inXPerfValue,
        y: inYPerfValue,
        orientation: 'h',
        width: 0.4,
        marker: {
          color:
            inXPerfValue[0] >= 75
              ? 'rgba(52, 211, 153, 0.7)' 
              : inXPerfValue[0] >= 50
              ? 'rgba(251, 191, 36, 0.7)' 
              : 'rgba(251, 113, 133, 0.7)', 
          line: {
            color:
              inXPerfValue[0] >= 75
                ? 'rgba(52, 211, 153, 1)'
                : inXPerfValue[0] >= 50
                ? 'rgba(251, 191, 36, 1)'
                : 'rgba(251, 113, 133, 1)',
            width: 2,
          }
        },
      },
    ];

    this.barLayout = {
      title: title ? { text: title, font: { size: 15, color: '#475569' } } : undefined,
      xaxis: { 
        range: [0, 100], 
        title: { text: 'Percentage (%)', font: { size: 12 } },
        color: '#64748b',
        showgrid: true,
        gridcolor: 'rgba(0,0,0,0.05)',
        zeroline: false
      },
      yaxis: { 
        range: [-0.5, 0.5], 
        showticklabels: false,
        showgrid: false,
        zeroline: false
      },
      showlegend: false,
      height: 140, 
      margin: title ? { l: 20, r: 20, t: 40, b: 40 } : { l: 20, r: 20, t: 10, b: 40 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: '"Plus Jakarta Sans", "Inter", sans-serif', color: '#475569' }
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
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: '"Plus Jakarta Sans", "Inter", sans-serif' }
    };
  }
}
