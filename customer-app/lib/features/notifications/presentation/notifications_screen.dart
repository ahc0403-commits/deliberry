import 'package:flutter/material.dart';

import '../../../core/data/mock_data.dart'
    show MockData, MockNotification, formatRelativeTime;
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  late List<MockNotification> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = List.from(MockData.notifications);
  }

  void _markAllRead() {
    setState(() {
      _notifications = _notifications
          .map((n) => MockNotification(
                id: n.id,
                title: n.title,
                body: n.body,
                createdAt: n.createdAt,
                icon: n.icon,
                isRead: true,
              ))
          .toList();
    });
  }

  void _markRead(int index) {
    final n = _notifications[index];
    if (!n.isRead) {
      setState(() {
        _notifications[index] = MockNotification(
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt,
          icon: n.icon,
          isRead: true,
        );
      });
    }
  }

  int get _unreadCount => _notifications.where((n) => !n.isRead).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Colors.white,
        actions: [
          if (_unreadCount > 0)
            TextButton(
              onPressed: _markAllRead,
              child: const Text(
                'Mark all read',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
        ],
      ),
      body: _notifications.isEmpty
          ? _buildEmpty()
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                    children: [
                      FeatureHeroCard(
                        eyebrow: 'Notifications',
                        title: 'Stay on top of local account updates',
                        subtitle:
                            'This inbox is a demo-safe local feed. You can mark items as read here, but it does not sync with a backend inbox.',
                        icon: Icons.notifications_active_rounded,
                        badge:
                            '$_unreadCount unread · ${_notifications.length} total',
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          const InfoPill(
                            icon: Icons.inbox_outlined,
                            label: 'Mock-backed inbox',
                            highlight: true,
                          ),
                          if (_unreadCount > 0)
                            InfoPill(
                              icon: Icons.mark_email_unread_outlined,
                              label:
                                  '$_unreadCount unread notification${_unreadCount > 1 ? 's' : ''}',
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ...List.generate(_notifications.length, (index) {
                        final notif = _notifications[index];
                        return Padding(
                          padding: EdgeInsets.only(
                            bottom: index == _notifications.length - 1 ? 0 : 10,
                          ),
                          child: _NotificationTile(
                            notification: notif,
                            onTap: () => _markRead(index),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildEmpty() {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: const [
        FeatureHeroCard(
          eyebrow: 'Notifications',
          title: 'Nothing new in this local inbox',
          subtitle:
              'This screen holds mock-backed notification history for the current build and remains intentionally backend-free.',
          icon: Icons.notifications_none_rounded,
          badge: '0 unread',
        ),
        SizedBox(height: 16),
        InfoPill(
          icon: Icons.info_outline_rounded,
          label: 'Local read-state only',
          highlight: true,
        ),
        SizedBox(height: 24),
        EmptyState(
          icon: Icons.notifications_none_rounded,
          title: 'No notifications',
          subtitle:
              "You're all caught up. We'll let you know when something new arrives.",
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
      color: isUnread ? const Color(0xFFFFFAF9) : Colors.white,
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
                color: Colors.black.withValues(alpha: 0.03),
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
                              notification.title,
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
                        notification.body,
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
                        label: formatRelativeTime(notification.createdAt),
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
