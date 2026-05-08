import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../app/router/route_names.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class AuthPhoneScreen extends StatefulWidget {
  const AuthPhoneScreen({super.key});

  @override
  State<AuthPhoneScreen> createState() => _AuthPhoneScreenState();
}

class _AuthPhoneScreenState extends State<AuthPhoneScreen> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() => setState(() {}));
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  bool get _canContinue =>
      _controller.text.replaceAll(RegExp(r'\D'), '').length >= 8;

  Future<void> _onContinue() async {
    if (!_canContinue || _isLoading) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final normalizedPhoneNumber = _normalizeInternationalPhoneNumber(
      _controller.text,
    );
    if (normalizedPhoneNumber == null) {
      setState(() {
        _isLoading = false;
        _errorMessage = context.l10n.raw(
          'Enter a valid international phone number, for example +84 912 345 678.',
        );
      });
      return;
    }
    try {
      await CustomerSessionController.instance
          .requestOtp(phoneNumber: normalizedPhoneNumber);
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed(RouteNames.authOtp);
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _errorMessage = context.l10n.authPhoneError(error);
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.white,
      appBar: AppBar(
        backgroundColor: AppTheme.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
      ),
      body: ScrollableSafeContent(
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              context.l10n.raw('Enter your\nphone number'),
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w800,
                color: Theme.of(context).colorScheme.onSurface,
                letterSpacing: 0,
                height: 1.15,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              context.l10n.raw(
                'Use phone verification only when this environment has the Supabase phone provider enabled.',
              ),
              style: TextStyle(
                fontSize: 15,
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.primaryTint),
                ),
                child: Text(
                  _errorMessage!,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppTheme.errorColor,
                    height: 1.35,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 36),
            Text(
              context.l10n.raw(
                'Enter your number in international format, for example +84 912 345 678.',
              ),
              style: TextStyle(
                fontSize: 12,
                color: AppTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                border: Border.all(
                  color: _focusNode.hasFocus
                      ? AppTheme.primaryColor
                      : AppTheme.borderColor,
                  width: _focusNode.hasFocus ? 2 : 1,
                ),
                borderRadius: BorderRadius.circular(14),
                color: AppTheme.backgroundGrey,
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Focus(
                      onFocusChange: (_) => setState(() {}),
                      child: TextField(
                        controller: _controller,
                        focusNode: _focusNode,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                            RegExp(r'[0-9+\-\s()]'),
                          ),
                        ],
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w500,
                          color: Theme.of(context).colorScheme.onSurface,
                          letterSpacing: 0.5,
                        ),
                        decoration: InputDecoration(
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 16,
                          ),
                          hintText: '+84 912 345 678',
                          hintStyle: TextStyle(
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w400,
                            fontSize: 17,
                          ),
                          filled: false,
                        ),
                        onSubmitted: (_) => _onContinue(),
                      ),
                    ),
                  ),
                  if (_controller.text.isNotEmpty)
                    GestureDetector(
                      onTap: () => _controller.clear(),
                      child: Padding(
                        padding: const EdgeInsets.only(right: 12),
                        child: Icon(
                          Icons.cancel_rounded,
                          size: 20,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Text(
              context.l10n.raw('Standard message & data rates may apply.'),
              style: TextStyle(
                fontSize: 12,
                color: AppTheme.textSecondary,
              ),
            ),
            const Spacer(),
            FilledButton(
              onPressed: _canContinue ? _onContinue : null,
              style: FilledButton.styleFrom(
                backgroundColor:
                    _canContinue ? AppTheme.primaryColor : AppTheme.borderColor,
                foregroundColor: AppTheme.white,
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: AppTheme.white,
                      ),
                    )
                  : Text(context.l10n.raw('Request Code')),
            ),
          ],
        ),
      ),
    );
  }
}


String? _normalizeInternationalPhoneNumber(String raw) {
  final trimmed = raw.trim();
  if (trimmed.isEmpty) {
    return null;
  }

  final hasLeadingPlus = trimmed.startsWith('+');
  final digitsOnly = trimmed.replaceAll(RegExp(r'\D'), '');
  if (digitsOnly.length < 8) {
    return null;
  }

  return hasLeadingPlus ? '+$digitsOnly' : '+$digitsOnly';
}
