const OverByOverChart = ({ data }) => {
  const maxRuns = Math.max(...data.map(d => d.runs), 10);

  return (
    <div className="space-y-2">
      {data.map((over, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-8">Ov {over.over}</span>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(over.runs / maxRuns) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium w-8">{over.runs}</span>
        </div>
      ))}
    </div>
  );
};

export default OverByOverChart;
