import 'package:flutter/material.dart';

import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';
import '../../../app/router/route_names.dart';
import '../../common/presentation/widgets.dart';

class ReviewsScreen extends StatefulWidget {
  const ReviewsScreen({this.orderId, super.key});

  final String? orderId;

  @override
  State<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends State<ReviewsScreen> {
  double _rating = 0;
  final _controller = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a rating')),
      );
      return;
    }
    setState(() => _submitted = true);
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;
    final record = runtime.findOrderRecordById(widget.orderId);
    final order = record?.order;
    final hasLinkedOrder = widget.orderId != null && order != null;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        title: Text(hasLinkedOrder ? 'Leave a Review' : 'Review Preview'),
        backgroundColor: Colors.white,
      ),
      body: !hasLinkedOrder
          ? const _ReviewUnavailableView()
          : _submitted
              ? _SuccessView(storeName: order.storeName)
              : _FormView(
                  order: order,
                  rating: _rating,
                  controller: _controller,
                  onRatingChanged: (r) => setState(() => _rating = r),
                  onSubmit: _submit,
                ),
    );
  }
}

class _FormView extends StatelessWidget {
  const _FormView({
    required this.order,
    required this.rating,
    required this.controller,
    required this.onRatingChanged,
    required this.onSubmit,
  });

  final MockOrder order;
  final double rating;
  final TextEditingController controller;
  final ValueChanged<double> onRatingChanged;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    final ratingLabels = {
      1.0: 'Terrible',
      2.0: 'Bad',
      3.0: 'Okay',
      4.0: 'Good',
      5.0: 'Excellent!',
    };

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        FeatureHeroCard(
          eyebrow: 'Reviews',
          title: 'Leave feedback for one completed order',
          subtitle:
              'This form is tied to the current order context and saves only a local preview in this build.',
          icon: Icons.rate_review_rounded,
          badge: order.id,
        ),
        const SizedBox(height: 16),
        // Store context header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  Icons.storefront_rounded,
                  color: AppTheme.primaryColor,
                  size: 28,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order.storeName,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${order.itemCount} items · ${formatOrderDate(order.createdAt)}',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      order.id,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: const [
            InfoPill(
              icon: Icons.receipt_long_outlined,
              label: 'Order-linked only',
              highlight: true,
            ),
            InfoPill(
              icon: Icons.info_outline_rounded,
              label: 'Local feedback preview',
            ),
          ],
        ),

        const SizedBox(height: 16),

        // Rating section
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: Column(
            children: [
              const Text(
                'How was your experience?',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              RatingStars(
                rating: rating,
                size: 48,
                interactive: true,
                onChanged: onRatingChanged,
              ),
              const SizedBox(height: 12),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: rating > 0
                    ? Text(
                        ratingLabels[rating] ?? '',
                        key: ValueKey(rating),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: rating >= 4
                              ? AppTheme.successColor
                              : rating >= 3
                                  ? AppTheme.secondaryColor
                                  : AppTheme.errorColor,
                        ),
                      )
                    : Text(
                        'Tap to rate',
                        key: const ValueKey('empty'),
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                      ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Review text
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
              const Text(
                'Tell us more (optional)',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                maxLines: 5,
                maxLength: 500,
                decoration: const InputDecoration(
                  hintText:
                      'What did you love? What could be better? Your feedback helps other customers and the restaurant.',
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Quick tags
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
              const Text(
                'Quick tags',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 12),
              _QuickTags(),
            ],
          ),
        ),

        const SizedBox(height: 24),

        FilledButton(
          onPressed: onSubmit,
          child: const Text('Save Feedback Preview'),
        ),

        const SizedBox(height: 24),
      ],
    );
  }
}

class _QuickTags extends StatefulWidget {
  @override
  State<_QuickTags> createState() => _QuickTagsState();
}

class _QuickTagsState extends State<_QuickTags> {
  final _tags = [
    'Great food',
    'Fast delivery',
    'Good packaging',
    'Fresh ingredients',
    'Worth the price',
    'Accurate order',
  ];
  final _selected = <String>{};

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: _tags.map((tag) {
        final isSelected = _selected.contains(tag);
        return InkWell(
          onTap: () => setState(() {
            if (isSelected) {
              _selected.remove(tag);
            } else {
              _selected.add(tag);
            }
          }),
          borderRadius: BorderRadius.circular(24),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: isSelected
                  ? Theme.of(context).colorScheme.primaryContainer
                  : AppTheme.backgroundGrey,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color:
                    isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
              ),
            ),
            child: Text(
              tag,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color:
                    isSelected ? AppTheme.primaryColor : AppTheme.textSecondary,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _SuccessView extends StatelessWidget {
  const _SuccessView({required this.storeName});

  final String storeName;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        FeatureHeroCard(
          eyebrow: 'Feedback saved',
          title: 'Review preview recorded',
          subtitle:
              'Thanks for rating $storeName. This feedback stays in the current demo flow and does not sync beyond this preview.',
          icon: Icons.check_circle_rounded,
          badge: 'Preview only',
        ),
        const SizedBox(height: 24),
        const EmptyState(
          icon: Icons.rate_review_outlined,
          title: 'Feedback saved in preview',
          subtitle:
              'Your review stays local to this session and is not sent to a backend service in this build.',
        ),
        const SizedBox(height: 20),
        FilledButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Done'),
        ),
      ],
    );
  }
}

class _ReviewUnavailableView extends StatelessWidget {
  const _ReviewUnavailableView();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        const FeatureHeroCard(
          eyebrow: 'Reviews',
          title: 'Feedback needs a real order context',
          subtitle:
              'This route only supports order-linked review entry, so it stays tied to the right completed order.',
          icon: Icons.rate_review_outlined,
          badge: 'Order detail entry only',
        ),
        const SizedBox(height: 24),
        const EmptyState(
          icon: Icons.rate_review_outlined,
          title: 'Open a completed order to leave feedback',
          subtitle:
              'This profile entry is only a review preview. Start from an order detail screen so the review stays tied to the right order context.',
        ),
        const SizedBox(height: 20),
        FilledButton(
          onPressed: () =>
              Navigator.of(context).pushReplacementNamed(RouteNames.orders),
          child: const Text('Go to Orders'),
        ),
      ],
    );
  }
}
