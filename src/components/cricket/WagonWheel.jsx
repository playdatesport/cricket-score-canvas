const WagonWheel = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-48 h-48 rounded-full border-2 border-primary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/20 rounded-full" />
        </div>
        <div className="text-center text-muted-foreground text-sm absolute inset-0 flex items-center justify-center">
          Shot data visualization
        </div>
      </div>
    </div>
  );
};

export default WagonWheel;
