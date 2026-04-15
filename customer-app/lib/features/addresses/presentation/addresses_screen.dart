import 'package:flutter/material.dart';

import '../../../app/router/route_names.dart';
import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class AddressesScreen extends StatelessWidget {
  const AddressesScreen({
    this.returnRouteName = RouteNames.home,
    this.isRequiredGate = false,
    super.key,
  });

  final String returnRouteName;
  final bool isRequiredGate;

  void _handleExit(BuildContext context, CustomerRuntimeController runtime) {
    if (!isRequiredGate) {
      Navigator.of(context).maybePop();
      return;
    }
    if (runtime.addresses.isEmpty) {
      return;
    }
    Navigator.of(context).pushReplacementNamed(returnRouteName);
  }

  @override
  Widget build(BuildContext context) {
    final runtime = CustomerRuntimeController.instance;
    final session = CustomerSessionController.instance;

    return ListenableBuilder(
      listenable: Listenable.merge([runtime, session]),
      builder: (context, _) {
        if (session.isSignedIn && !runtime.hasPersistedRuntimeLoaded) {
          return const Scaffold(
            backgroundColor: AppTheme.backgroundGrey,
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final addresses = runtime.addresses;

        return PopScope(
          canPop: !isRequiredGate,
          onPopInvokedWithResult: (didPop, _) {
            if (didPop) return;
            _handleExit(context, runtime);
          },
          child: Scaffold(
            backgroundColor: AppTheme.backgroundGrey,
            appBar: AppBar(
              title: const Text('My Addresses'),
              backgroundColor: Colors.white,
              leading: IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: () => _handleExit(context, runtime),
              ),
              actions: [
                IconButton(
                  icon: Icon(Icons.add_rounded, color: AppTheme.primaryColor),
                  onPressed: () => _showAddAddressSheet(context, runtime),
                  tooltip: 'Add address',
                ),
              ],
            ),
            body: Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                    children: [
                      FeatureHeroCard(
                        eyebrow: 'Addresses',
                        title: 'Manage your saved delivery addresses',
                        subtitle:
                            'Signed-in addresses sync with your customer account so they stay available after refresh and on future visits.',
                        icon: Icons.location_on_rounded,
                        badge:
                            '${addresses.length} saved address${addresses.length == 1 ? '' : 'es'}',
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          if (isRequiredGate)
                            const InfoPill(
                              icon: Icons.lock_outline_rounded,
                              label: 'Address required before home',
                              highlight: true,
                            ),
                          const InfoPill(
                            icon: Icons.info_outline_rounded,
                            label: 'Account-synced when signed in',
                            highlight: true,
                          ),
                          const InfoPill(
                            icon: Icons.edit_location_alt_outlined,
                            label: 'No map or geocoding',
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      if (addresses.isEmpty)
                        const EmptyState(
                          icon: Icons.location_off_outlined,
                          title: 'No saved addresses',
                          subtitle:
                              'Add an address to start using this account area for checkout and delivery.',
                        )
                      else
                        ...List.generate(addresses.length, (index) {
                          final address = addresses[index];
                          return Padding(
                            padding: EdgeInsets.only(
                              bottom: index == addresses.length - 1 ? 0 : 12,
                            ),
                            child: _AddressCard(
                              address: address,
                              onEdit: () =>
                                  _showEditSheet(context, runtime, address),
                              onDelete: () =>
                                  _confirmDelete(context, runtime, address),
                              onSetDefault: address.isDefault
                                  ? null
                                  : () => _handleSetDefault(
                                        context,
                                        runtime,
                                        address.id,
                                      ),
                            ),
                          );
                        }),
                    ],
                  ),
                ),
                _AddButton(
                  onTap: () => _showAddAddressSheet(context, runtime),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showAddAddressSheet(
      BuildContext context, CustomerRuntimeController runtime) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _AddressFormSheet(
        title: 'Add New Address',
        onSave: (label, street, detail) async {
          await runtime.addAddress(MockAddress(
            id: '',
            label: label,
            street: street,
            detail: detail,
          ));
        },
      ),
    );
  }

  void _showEditSheet(BuildContext context, CustomerRuntimeController runtime,
      MockAddress address) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _AddressFormSheet(
        title: 'Edit Address',
        address: address,
        onSave: (label, street, detail) async {
          await runtime.updateAddress(MockAddress(
            id: address.id,
            label: label,
            street: street,
            detail: detail,
            isDefault: address.isDefault,
          ));
        },
      ),
    );
  }

  Future<void> _handleSetDefault(
    BuildContext context,
    CustomerRuntimeController runtime,
    String addressId,
  ) async {
    try {
      await runtime.setDefaultAddress(addressId);
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('We could not update the default address. Try again.'),
        ),
      );
    }
  }

  void _confirmDelete(BuildContext context, CustomerRuntimeController runtime,
      MockAddress address) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete address'),
        content: Text('Remove "${address.label}" from your saved addresses?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              try {
                await runtime.deleteAddress(address.id);
              } catch (_) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content:
                        Text('We could not remove that address. Try again.'),
                  ),
                );
              }
            },
            child: Text(
              'Delete',
              style: TextStyle(color: AppTheme.errorColor),
            ),
          ),
        ],
      ),
    );
  }
}

class _AddressCard extends StatelessWidget {
  const _AddressCard({
    required this.address,
    required this.onEdit,
    required this.onDelete,
    this.onSetDefault,
  });

  final MockAddress address;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback? onSetDefault;

  IconData get _labelIcon {
    switch (address.label.toLowerCase()) {
      case 'home':
        return Icons.home_rounded;
      case 'work':
        return Icons.work_rounded;
      default:
        return Icons.location_on_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: address.isDefault
              ? AppTheme.primaryColor.withValues(alpha: 0.4)
              : AppTheme.borderColor,
          width: address.isDefault ? 1.5 : 1,
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
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    color: address.isDefault
                        ? Theme.of(context).colorScheme.primaryContainer
                        : AppTheme.backgroundGrey,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(
                    _labelIcon,
                    size: 20,
                    color: address.isDefault
                        ? AppTheme.primaryColor
                        : AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Row(
                    children: [
                      Text(
                        address.label,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      if (address.isDefault) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color:
                                Theme.of(context).colorScheme.primaryContainer,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Default',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  icon: Icon(Icons.more_vert_rounded,
                      size: 20, color: AppTheme.textSecondary),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  onSelected: (value) {
                    if (value == 'edit') onEdit();
                    if (value == 'delete') onDelete();
                    if (value == 'default') onSetDefault?.call();
                  },
                  itemBuilder: (_) => [
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit_outlined, size: 18),
                          SizedBox(width: 10),
                          Text('Edit'),
                        ],
                      ),
                    ),
                    if (onSetDefault != null)
                      const PopupMenuItem(
                        value: 'default',
                        child: Row(
                          children: [
                            Icon(Icons.check_circle_outline, size: 18),
                            SizedBox(width: 10),
                            Text('Set as default'),
                          ],
                        ),
                      ),
                    PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete_outline,
                              size: 18, color: AppTheme.errorColor),
                          const SizedBox(width: 10),
                          Text(
                            'Delete',
                            style: TextStyle(color: AppTheme.errorColor),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(height: 1),
            const SizedBox(height: 12),
            Text(
              address.street,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              address.detail,
              style: TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
              ),
            ),
            if (onSetDefault != null) ...[
              const SizedBox(height: 12),
              InkWell(
                onTap: onSetDefault,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    'Set as default',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _AddButton extends StatelessWidget {
  const _AddButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 12,
        bottom: MediaQuery.of(context).padding.bottom + 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppTheme.borderColor)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: FilledButton.icon(
        onPressed: onTap,
        icon: const Icon(Icons.add_rounded, size: 20),
        label: const Text('Add New Address'),
      ),
    );
  }
}

class _AddressFormSheet extends StatefulWidget {
  const _AddressFormSheet({
    required this.title,
    required this.onSave,
    this.address,
  });

  final String title;
  final MockAddress? address;
  final Future<void> Function(String label, String street, String detail)
      onSave;

  @override
  State<_AddressFormSheet> createState() => _AddressFormSheetState();
}

class _AddressFormSheetState extends State<_AddressFormSheet> {
  late final TextEditingController _labelController;
  late final TextEditingController _streetController;
  late final TextEditingController _detailController;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _labelController = TextEditingController(text: widget.address?.label ?? '');
    _streetController =
        TextEditingController(text: widget.address?.street ?? '');
    _detailController =
        TextEditingController(text: widget.address?.detail ?? '');
  }

  @override
  void dispose() {
    _labelController.dispose();
    _streetController.dispose();
    _detailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final label = _labelController.text.trim();
    final street = _streetController.text.trim();
    final detail = _detailController.text.trim();
    if (label.isEmpty || street.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Label and street address are required.')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      await widget.onSave(label, street, detail);
      if (!mounted) return;
      Navigator.pop(context);
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('We could not save that address. Try again.'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  widget.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                IconButton(
                  onPressed: _saving ? null : () => Navigator.pop(context),
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _labelController,
              enabled: !_saving,
              decoration: const InputDecoration(
                labelText: 'Label (Home, Work...)',
                prefixIcon: Icon(Icons.label_outline),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _streetController,
              enabled: !_saving,
              decoration: const InputDecoration(
                labelText: 'Street address',
                prefixIcon: Icon(Icons.location_on_outlined),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _detailController,
              enabled: !_saving,
              decoration: const InputDecoration(
                labelText: 'Apt, floor, notes',
                prefixIcon: Icon(Icons.apartment_outlined),
              ),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _submit,
              child: _saving
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Save Address'),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}
