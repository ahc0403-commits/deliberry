import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';

class GroupOrderShareScreen extends StatelessWidget {
  const GroupOrderShareScreen({
    this.roomCode,
    super.key,
  });

  final String? roomCode;

  Future<void> _copyInvite(
    BuildContext context, {
    required String text,
    required String message,
  }) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final room = runtime.groupOrderRoom;
        final previewCode = roomCode ?? room?.code ?? 'LOCAL-0000';
        final participants = room != null && room.code == previewCode
            ? room.participants
            : const <GroupOrderParticipant>[];
        final participantCountLabel =
            context.l10n.localParticipantCountLabel(participants.length);

        return Scaffold(
          appBar: AppBar(
            title: Text(context.l10n.raw('Invite Preview')),
          ),
          body: ListView(
            padding: const EdgeInsets.all(20),
            children: [
          const SizedBox(height: 20),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.backgroundGrey,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.info_outline_rounded,
                  size: 18,
                  color: AppTheme.textSecondary,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    context.l10n.raw(
                      'This is a local room view. Invite copy works, and the participant list reflects joins made on this same device only.',
                    ),
                    style: Theme.of(context).textTheme.bodySmall!.copyWith(
                          color: AppTheme.textSecondary,
                        ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Room code card
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderColor),
            ),
              child: Column(
                children: [
                  Text(
                  context.l10n.raw('Local Room Code'),
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: AppTheme.textSecondary,
                      ),
                ),
                const SizedBox(height: 12),
                Text(
                  previewCode,
                  style: Theme.of(context).textTheme.headlineLarge!.copyWith(
                        fontWeight: FontWeight.w900,
                        letterSpacing: 4,
                      ),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () => _copyInvite(
                    context,
                    text: previewCode,
                    message: context.l10n.raw('Room code copied.'),
                  ),
                  icon: const Icon(Icons.copy_rounded, size: 18),
                  label: Text(context.l10n.raw('Copy Code')),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(180, 44),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Share options
          FilledButton.icon(
            onPressed: () => _copyInvite(
              context,
              text:
                  'Deliberry local group order room: use code $previewCode on this device to review the shared-order flow.',
              message: context.l10n.raw('Local invite copied.'),
            ),
            icon: const Icon(Icons.share_rounded),
            label: Text(context.l10n.raw('Copy Preview Invite')),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () => _copyInvite(
              context,
              text:
                  'Local room only: $previewCode. This code works on this device for preview joins only.',
              message: context.l10n.raw('Local room message copied.'),
            ),
            icon: const Icon(Icons.message_rounded),
            label: Text(context.l10n.raw('Copy Preview Message')),
          ),

          const SizedBox(height: 32),

          // Members section
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      context.l10n.raw('Preview Participants'),
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundGrey,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        participantCountLabel,
                        style: Theme.of(context).textTheme.labelMedium,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                if (participants.isEmpty)
                  Center(
                    child: Text(
                      context.l10n.raw(
                        'Create or join a local room from the previous screen to populate this participant list.',
                      ),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall!.copyWith(
                            color: AppTheme.textSecondary,
                          ),
                    ),
                  )
                else
                  ...participants.asMap().entries.map((entry) {
                    final participant = entry.value;
                    return Padding(
                      padding: EdgeInsets.only(
                        bottom: entry.key == participants.length - 1 ? 0 : 8,
                      ),
                      child: _memberRow(
                        context,
                        participant.name,
                        participant.role == 'host'
                            ? context.l10n.raw('Preview host')
                            : context.l10n.raw('Local member'),
                      ),
                    );
                  }),
              ],
            ),
          ),
            ],
          ),
        );
      },
    );
  }

  Widget _memberRow(BuildContext context, String name, String role) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.backgroundGrey,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: AppTheme.primaryColor,
            child: Text(
              name.isEmpty ? '?' : name.substring(0, 1).toUpperCase(),
              style: Theme.of(context).textTheme.titleSmall!.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.white,
                  ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              name,
              style: Theme.of(context).textTheme.titleSmall,
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              role,
              style: Theme.of(context).textTheme.labelSmall!.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primaryColor,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
