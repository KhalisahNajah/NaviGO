class TrafficReport {
  final String id;
  final String type;
  final String description;
  final String location;
  final DateTime timestamp;
  final int helpfulVotes;
  final int notHelpfulVotes;
  final String status;

  TrafficReport({
    required this.id,
    required this.type,
    required this.description,
    required this.location,
    required this.timestamp,
    this.helpfulVotes = 0,
    this.notHelpfulVotes = 0,
    this.status = 'active',
  });

  factory TrafficReport.fromJson(Map<String, dynamic> json) {
    return TrafficReport(
      id: json['id'],
      type: json['type'],
      description: json['description'],
      location: json['location'],
      timestamp: DateTime.parse(json['timestamp']),
      helpfulVotes: json['helpfulVotes'] ?? 0,
      notHelpfulVotes: json['notHelpfulVotes'] ?? 0,
      status: json['status'] ?? 'active',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'description': description,
      'location': location,
      'timestamp': timestamp.toIso8601String(),
      'helpfulVotes': helpfulVotes,
      'notHelpfulVotes': notHelpfulVotes,
      'status': status,
    };
  }
}