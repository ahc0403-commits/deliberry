import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/theme/app_theme.dart';

class GroupOrderRoomScreen extends StatefulWidget {
  const GroupOrderRoomScreen({super.key});

  @override
  State<GroupOrderRoomScreen> createState() => _GroupOrderRoomScreenState();
}

class _GroupOrderRoomScreenState extends State<GroupOrderRoomScreen> {
  final _codeController = TextEditingController();

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  String _generatePreviewCode() {
    final millis = DateTime.now().millisecondsSinceEpoch % 10000;
    return 'LOCAL-${millis.toString().padLeft(4, '0')}';
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Group Order'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Hero section
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.primaryColor,
                  AppTheme.primaryColor.withValues(alpha: 0.7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(Icons.group_rounded, size: 48, color: Colors.white),
                const SizedBox(height: 12),
                Text(
                  'Order Together',
                  style: Theme.of(context)
                      .textTheme
                      .headlineMedium!
                      .copyWith(color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  'Preview the invite flow for a shared order. Live multi-person syncing is not supported yet.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: Colors.white.withValues(alpha: 0.85),
                      ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Create room
          Text(
            'Preview a host invite',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: () {
              Navigator.of(context).pushNamed(
                RouteNames.groupOrderShare,
                arguments: _generatePreviewCode(),
              );
            },
            icon: const Icon(Icons.visibility_outlined),
            label: const Text('Open Invite Preview'),
          ),
          const SizedBox(height: 8),
          Text(
            'This creates a local preview only. It does not open a live shared room.',
            style: Theme.of(context).textTheme.bodySmall!.copyWith(
                  color: AppTheme.textSecondary,
                ),
          ),

          const SizedBox(height: 32),

          // Join room
          Text(
            'Join an existing room',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _codeController,
            textCapitalization: TextCapitalization.characters,
            onChanged: (_) => setState(() {}),
            decoration: const InputDecoration(
              hintText: 'Enter room code',
              prefixIcon: Icon(Icons.tag_rounded),
            ),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: _codeController.text.trim().isEmpty
                ? null
                : () => _showMessage(
                      'Joining shared rooms is not supported yet. This screen only previews the host invite flow.',
                    ),
            child: const Text('Join Room'),
          ),

          const SizedBox(height: 32),

          // How it works
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'How it works',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 16),
                _stepRow(context, '1', 'Open a local invite preview'),
                _stepRow(context, '2', 'Copy the preview code or message'),
                _stepRow(
                  context,
                  '3',
                  'Return here later for live shared-cart support',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _stepRow(BuildContext context, String number, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: Theme.of(context).textTheme.labelMedium!.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primaryColor,
                    ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}
