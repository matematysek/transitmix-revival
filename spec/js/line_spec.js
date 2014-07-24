describe("Line Calculations", function() {
  var simpleServiceWindows; // 10 hours every weekday
  var simpleServiceWindowsWithWeekend; // 10 hours every day
  var simpleCoordinates;
  
  beforeEach(function() {
    simpleServiceWindows = new app.ServiceWindows([
      { name: "All Day", from: "7am", to: "5pm", headway: 60}
    ]);

    simpleServiceWindowsWithWeekend = new app.ServiceWindows([
      { name: "All Day", from: "7am", to: "5pm", headway: 60},
      { name: "All Saturday", from: "7am", to: "5pm", headway: 60, isSaturday: true},
      { name: "All Sunday", from: "7am", to: "5pm", headway: 60, isSunday: true}
    ]);

    // A line that's .5 miles one way, 1 mile two ways
    simpleCoordinates = [[[37.774853254793086,-122.45455741882324]],[[37.774847,-122.454656],[37.774756,-122.45464799999999],[37.775189,-122.45134999999999],[37.775881999999996,-122.44582399999999]]];
  });

  it("calculates that there are 2550 service hours if only one bus used on weekdays", function() {
    var map = new app.Map();
    var line = new app.Line(map.getLineDefaults());
    var lines = new app.Lines([line]);

    map.lines = lines;
    lines.map = map;

    line.set({speed: 10, serviceWindows: simpleServiceWindows, coordinates: simpleCoordinates});
    var calculations = line.getCalculations();
    expect(calculations.total.revenueHours).toBe(2550);
  });

  it("calculates that there are 3650 service hours if only one bus used every day", function() {
    var map = new app.Map();
    var line = new app.Line(map.getLineDefaults());

    var lines = new app.Lines([line]);

    map.lines = lines;
    lines.map = map;

    line.set({speed: 10, serviceWindows: simpleServiceWindowsWithWeekend, coordinates: simpleCoordinates});
    var calculations = line.getCalculations();
    expect(calculations.total.revenueHours).toBe(3650);
  });
});
