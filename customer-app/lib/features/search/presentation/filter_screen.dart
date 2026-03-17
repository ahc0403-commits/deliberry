import 'package:flutter/material.dart';

import '../../../core/data/customer_runtime_controller.dart';
import '../../../core/data/mock_data.dart';
import '../../../core/theme/app_theme.dart';

class FilterScreen extends StatefulWidget {
  const FilterScreen({super.key});

  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  late Map<String, int> _selectedIndices;

  @override
  void initState() {
    super.initState();
    _selectedIndices = Map<String, int>.from(
      CustomerRuntimeController.instance.filterSelections,
    );
  }

  void _toggle(String section, int index) {
    setState(() {
      if (_selectedIndices[section] == index) {
        if (section != 'Sort by' && section != 'Cuisine') {
          _selectedIndices[section] = -1;
        }
      } else {
        _selectedIndices[section] = index;
      }
    });
  }

  void _resetAll() {
    setState(() {
      _selectedIndices = {
        'Sort by': 0,
        'Cuisine': 0,
        'Price range': -1,
        'Dietary': -1,
      };
    });
  }

  int get _activeFilterCount {
    var count = 0;
    if ((_selectedIndices['Sort by'] ?? 0) > 0) count++;
    if ((_selectedIndices['Cuisine'] ?? 0) > 0) count++;
    if ((_selectedIndices['Price range'] ?? -1) >= 0) count++;
    if ((_selectedIndices['Dietary'] ?? -1) >= 0) count++;
    return count;
  }

  @override
  Widget build(BuildContext context) {
    final sections = MockData.filterOptions;

    return Scaffold(
      backgroundColor: AppTheme.backgroundGrey,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.close_rounded, size: 22),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Filters',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: _resetAll,
            child: Text(
              'Reset${_activeFilterCount > 0 ? ' ($_activeFilterCount)' : ''}',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: _activeFilterCount > 0
                    ? AppTheme.primaryColor
                    : AppTheme.textSecondary,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.only(bottom: 16),
              children: sections.entries.map((entry) {
                return _FilterSection(
                  title: entry.key,
                  options: entry.value,
                  selectedIndex: _selectedIndices[entry.key] ?? -1,
                  onSelected: (index) => _toggle(entry.key, index),
                );
              }).toList(),
            ),
          ),
          _ApplyBar(
            activeCount: _activeFilterCount,
            onApply: () {
              CustomerRuntimeController.instance.setFilters(_selectedIndices);
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
    );
  }
}

class _FilterSection extends StatelessWidget {
  const _FilterSection({
    required this.title,
    required this.options,
    required this.selectedIndex,
    required this.onSelected,
  });

  final String title;
  final List<String> options;
  final int selectedIndex;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
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
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(options.length, (index) {
              final isSelected = selectedIndex == index;
              return FilterChip(
                selected: isSelected,
                onSelected: (_) => onSelected(index),
                label: Text(options[index]),
                labelStyle: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : const Color(0xFF1A1A2E),
                ),
                showCheckmark: false,
                backgroundColor: AppTheme.backgroundGrey,
                selectedColor: AppTheme.primaryColor,
                side: BorderSide(
                  color:
                      isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _ApplyBar extends StatelessWidget {
  const _ApplyBar({
    required this.activeCount,
    required this.onApply,
  });

  final int activeCount;
  final VoidCallback onApply;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 16,
        bottom: MediaQuery.of(context).padding.bottom + 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppTheme.borderColor)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: FilledButton(
        onPressed: onApply,
        child: Text(
          activeCount > 0
              ? 'Apply $activeCount filter${activeCount != 1 ? 's' : ''}'
              : 'Apply Filters',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
