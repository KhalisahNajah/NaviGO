class GasStation {
  final String id;
  final String name;
  final String address;
  final double distance;
  final double price;
  final double latitude;
  final double longitude;

  GasStation({
    required this.id,
    required this.name,
    required this.address,
    required this.distance,
    required this.price,
    required this.latitude,
    required this.longitude,
  });

  factory GasStation.fromJson(Map<String, dynamic> json) {
    return GasStation(
      id: json['id'],
      name: json['name'],
      address: json['address'],
      distance: json['distance'].toDouble(),
      price: json['price'].toDouble(),
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
    );
  }
}