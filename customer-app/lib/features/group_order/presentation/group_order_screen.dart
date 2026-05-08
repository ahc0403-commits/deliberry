import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/i18n/app_localizations.dart';
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

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final room = runtime.groupOrderRoom;
        return Scaffold(
          appBar: AppBar(
            title: Text(l10n.raw('Group Order')),
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
                const Icon(Icons.group_rounded,
                    size: 48, color: AppTheme.white),
                const SizedBox(height: 12),
                Text(
                  l10n.raw('Order Together'),
                  style: Theme.of(context)
                      .textTheme
                      .headlineMedium!
                      .copyWith(color: AppTheme.white),
                ),
                const SizedBox(height: 8),
                Text(
                  l10n.raw(
                    'Create a local room code, copy the invite, and reuse it on this device. Live multi-person syncing is still not supported.',
                  ),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: AppTheme.white.withValues(alpha: 0.85),
                      ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Create room
          Text(
            l10n.raw('Preview a host invite'),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: () {
              final createdRoom = runtime.createGroupOrderRoom();
              Navigator.of(context).pushNamed(
                RouteNames.groupOrderShare,
                arguments: createdRoom.code,
              );
            },
            icon: const Icon(Icons.visibility_outlined),
            label: Text(l10n.raw('Create Local Room')),
          ),
          const SizedBox(height: 8),
          Text(
            l10n.raw(
              'This creates a local room on this device only. You can reopen it and test invite copy flows, but it does not sync across devices.',
            ),
            style: Theme.of(context).textTheme.bodySmall!.copyWith(
                  color: AppTheme.textSecondary,
                ),
          ),

          if (room != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderColor),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.raw('Current local room'),
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          room.code,
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge!
                              .copyWith(fontWeight: FontWeight.w800),
                        ),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushNamed(
                      RouteNames.groupOrderShare,
                      arguments: room.code,
                    ),
                    child: Text(l10n.raw('Open room')),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 32),

          // Join room
          Text(
            l10n.raw('Join an existing room'),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _codeController,
            textCapitalization: TextCapitalization.characters,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: l10n.raw('Enter room code'),
              prefixIcon: const Icon(Icons.tag_rounded),
            ),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: _codeController.text.trim().isEmpty
                ? null
                : () {
                    final joined = runtime.joinGroupOrderRoom(
                      _codeController.text,
                    );
                    if (!joined) {
                      _showMessage(
                        l10n.raw(
                          'This code is not active on this device yet. Create the room here first, then join it locally.',
                        ),
                      );
                      return;
                    }

                    Navigator.of(context).pushNamed(
                      RouteNames.groupOrderShare,
                      arguments: _codeController.text.trim().toUpperCase(),
                    );
                  },
            child: Text(l10n.raw('Join Room')),
          ),

          const SizedBox(height: 32),

          // How it works
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  l10n.raw('How it works'),
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 16),
                _stepRow(context, '1', l10n.raw('Open a local invite preview')),
                _stepRow(context, '2', l10n.raw('Copy the preview code or message')),
                _stepRow(
                  context,
                  '3',
                  l10n.raw('Reuse the same code on this device to simulate a member join'),
                ),
              ],
            ),
          ),
            ],
          ),
        );
      },
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
