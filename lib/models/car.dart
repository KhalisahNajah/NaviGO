class Car {
  final String id;
  final String name;
  final String make;
  final String model;
  final String year;
  final double fuelEfficiency; // km/L
  final String fuelType;
  final bool isDefault;

  Car({
    required this.id,
    required this.name,
    required this.make,
    required this.model,
    required this.year,
    required this.fuelEfficiency,
    required this.fuelType,
    this.isDefault = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'make': make,
      'model': model,
      'year': year,
      'fuelEfficiency': fuelEfficiency,
      'fuelType': fuelType,
      'isDefault': isDefault,
    };
  }

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      id: json['id'],
      name: json['name'],
      make: json['make'],
      model: json['model'],
      year: json['year'],
      fuelEfficiency: json['fuelEfficiency'].toDouble(),
      fuelType: json['fuelType'],
      isDefault: json['isDefault'] ?? false,
    );
  }

  Car copyWith({
    String? id,
    String? name,
    String? make,
    String? model,
    String? year,
    double? fuelEfficiency,
    String? fuelType,
    bool? isDefault,
  }) {
    return Car(
      id: id ?? this.id,
      name: name ?? this.name,
      make: make ?? this.make,
      model: model ?? this.model,
      year: year ?? this.year,
      fuelEfficiency: fuelEfficiency ?? this.fuelEfficiency,
      fuelType: fuelType ?? this.fuelType,
      isDefault: isDefault ?? this.isDefault,
    );
  }
}