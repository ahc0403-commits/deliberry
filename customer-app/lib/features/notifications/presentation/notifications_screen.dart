import 'package:flutter/material.dart';

import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart'
    show MockNotification, formatRelativeTime;
import '../../../core/i18n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;

    return ListenableBuilder(
      listenable: runtime,
      builder: (context, _) {
        final notifications = runtime.notifications;
        final unreadCount = runtime.unreadNotificationCount;

        return Scaffold(
          backgroundColor: AppTheme.backgroundGrey,
          appBar: AppBar(
            title: Text(context.l10n.raw('Notifications')),
            backgroundColor: AppTheme.white,
            actions: [
              if (unreadCount > 0)
                TextButton(
                  onPressed: runtime.markAllNotificationsRead,
                  child: Text(
                    context.l10n.raw('Mark all read'),
                    style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
            ],
          ),
          body: notifications.isEmpty
              ? _buildEmpty(context)
              : Column(
                  children: [
                    Expanded(
                      child: ListView(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                        children: [
                          FeatureHeroCard(
                            eyebrow: 'Notifications',
                            title: 'Stay on top of account activity',
                            subtitle:
                                context.l10n.text('notification.heroSubtitle'),
                            icon: Icons.notifications_active_rounded,
                            badge: context.l10n.notificationSummary(
                              unread: unreadCount,
                              total: notifications.length,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              InfoPill(
                                icon: Icons.inbox_outlined,
                                label: context.l10n
                                    .text('notification.sessionInbox'),
                                highlight: true,
                              ),
                              if (unreadCount > 0)
                                InfoPill(
                                  icon: Icons.mark_email_unread_outlined,
                                  label:
                                      context.l10n.unreadNotificationCountLabel(
                                    unreadCount,
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ...List.generate(notifications.length, (index) {
                            final notif = notifications[index];
                            return Padding(
                              padding: EdgeInsets.only(
                                bottom:
                                    index == notifications.length - 1 ? 0 : 10,
                              ),
                              child: _NotificationTile(
                                notification: notif,
                                onTap: () =>
                                    runtime.markNotificationRead(notif.id),
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

  Widget _buildEmpty(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        FeatureHeroCard(
          eyebrow: 'Notifications',
          title: 'Nothing new in this inbox',
          subtitle: context.l10n.text('notification.emptySubtitle'),
          icon: Icons.notifications_none_rounded,
          badge: '0 unread',
        ),
        const SizedBox(height: 16),
        InfoPill(
          icon: Icons.info_outline_rounded,
          label: context.l10n.text('notification.sessionReadState'),
          highlight: true,
        ),
        const SizedBox(height: 24),
        EmptyState(
          icon: Icons.notifications_none_rounded,
          title: 'No notifications',
          subtitle: context.l10n.text('notification.emptySubtitle'),
        ),
      ],
    );
  }
}

class _NotificationTile extends StatelessWidget {
  const _NotificationTile({
    required this.notification,
    required this.onTap,
  });

  final MockNotification notification;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isUnread = !notification.isRead;

    return Material(
      color: isUnread ? AppTheme.primaryMist : AppTheme.white,
      borderRadius: BorderRadius.circular(18),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border(
              left: BorderSide(
                color: isUnread ? AppTheme.primaryColor : Colors.transparent,
                width: 3,
              ),
              top: BorderSide(color: AppTheme.borderColor),
              right: BorderSide(color: AppTheme.borderColor),
              bottom: BorderSide(color: AppTheme.borderColor),
            ),
            boxShadow: [
              BoxShadow(
                color: AppTheme.inkColor.withValues(alpha: 0.03),
                blurRadius: 16,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    color: isUnread
                        ? Theme.of(context).colorScheme.primaryContainer
                        : AppTheme.backgroundGrey,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    notification.icon,
                    size: 22,
                    color: isUnread
                        ? AppTheme.primaryColor
                        : AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              context.l10n.raw(notification.title),
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: isUnread
                                    ? FontWeight.w800
                                    : FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          if (isUnread)
                            Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.only(top: 4),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        context.l10n.raw(notification.body),
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 10),
                      InfoPill(
                        icon: Icons.schedule_rounded,
                        label: formatRelativeTime(
                          notification.createdAt,
                          languageCode: context.l10n.locale.languageCode,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
