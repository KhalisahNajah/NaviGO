import 'package:flutter/material.dart';
import 'package:navifuel/models/traffic_report.dart';
import 'package:navifuel/widgets/report_card_widget.dart';
import 'package:navifuel/widgets/submit_report_dialog.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  List<TrafficReport> _reports = [
    TrafficReport(
      id: '1',
      type: 'Accident',
      description: 'Multi-car accident blocking two lanes on Highway 101 North',
      location: 'Highway 101 North, Exit 42',
      timestamp: DateTime.now().subtract(const Duration(minutes: 30)),
      helpfulVotes: 15,
      notHelpfulVotes: 2,
    ),
    TrafficReport(
      id: '2',
      type: 'Road Work',
      description: 'Construction crew working on bridge repairs, expect delays',
      location: 'Bay Bridge, Eastbound',
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      helpfulVotes: 8,
      notHelpfulVotes: 1,
    ),
    TrafficReport(
      id: '3',
      type: 'Police',
      description: 'Speed trap setup near downtown exit',
      location: 'I-280 South, Exit 57',
      timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
      helpfulVotes: 23,
      notHelpfulVotes: 0,
    ),
  ];

  void _addReport(TrafficReport report) {
    setState(() {
      _reports.insert(0, report);
    });
  }

  void _voteOnReport(String reportId, bool isHelpful) {
    setState(() {
      final index = _reports.indexWhere((report) => report.id == reportId);
      if (index != -1) {
        final report = _reports[index];
        _reports[index] = TrafficReport(
          id: report.id,
          type: report.type,
          description: report.description,
          location: report.location,
          timestamp: report.timestamp,
          helpfulVotes: isHelpful ? report.helpfulVotes + 1 : report.helpfulVotes,
          notHelpfulVotes: !isHelpful ? report.notHelpfulVotes + 1 : report.notHelpfulVotes,
          status: report.status,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Thank you for your feedback!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Reports'),
        actions: [
          IconButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => SubmitReportDialog(
                  onSubmit: _addReport,
                ),
              );
            },
            icon: const Icon(Icons.add_alert),
            style: IconButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Text(
                  'Active Reports (${_reports.length})',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: _reports.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.report,
                          size: 48,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No Active Reports',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Be the first to report road conditions in your area',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _reports.length,
                    itemBuilder: (context, index) {
                      final report = _reports[index];
                      return ReportCardWidget(
                        report: report,
                        onVote: _voteOnReport,
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}