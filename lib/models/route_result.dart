class RouteResult {
  final String distance;
  final String duration;
  final double fuelCost;
  final double tollCost;
  final double totalCost;
  final String routeType;

  RouteResult({
    required this.distance,
    required this.duration,
    required this.fuelCost,
    required this.tollCost,
    required this.totalCost,
    required this.routeType,
  });

  factory RouteResult.fromJson(Map<String, dynamic> json) {
    return RouteResult(
      distance: json['distance'],
      duration: json['duration'],
      fuelCost: json['fuelCost'].toDouble(),
      tollCost: json['tollCost'].toDouble(),
      totalCost: json['totalCost'].toDouble(),
      routeType: json['routeType'],
    );
  }
}