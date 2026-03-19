import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../app/router/route_names.dart';
import '../../../core/session/customer_session_controller.dart';
import '../../../core/theme/app_theme.dart';
import '../../common/presentation/widgets.dart';

class AuthOtpScreen extends StatefulWidget {
  const AuthOtpScreen({super.key});

  @override
  State<AuthOtpScreen> createState() => _AuthOtpScreenState();
}

class _AuthOtpScreenState extends State<AuthOtpScreen> {
  static const _codeLength = 6;

  final List<TextEditingController> _controllers =
      List.generate(_codeLength, (_) => TextEditingController());
  final List<FocusNode> _focusNodes =
      List.generate(_codeLength, (_) => FocusNode());

  bool _isLoading = false;
  int _resendSeconds = 30;
  Timer? _resendTimer;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNodes[0].requestFocus();
    });
    for (final c in _controllers) {
      c.addListener(() => setState(() {}));
    }
  }

  @override
  void dispose() {
    _resendTimer?.cancel();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _startResendTimer() {
    _resendTimer?.cancel();
    setState(() => _resendSeconds = 30);
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) {
        t.cancel();
        return;
      }
      setState(() {
        if (_resendSeconds > 0) {
          _resendSeconds--;
        } else {
          t.cancel();
        }
      });
    });
  }

  String get _enteredCode => _controllers.map((c) => c.text).join();

  bool get _isComplete => _enteredCode.length == _codeLength;

  void _onDigitEntered(int index, String value) {
    if (value.length == 1 && index < _codeLength - 1) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    if (_isComplete) _onVerify();
  }

  Future<void> _onVerify() async {
    if (!_isComplete || _isLoading) return;
    setState(() => _isLoading = true);

    await Future.delayed(const Duration(milliseconds: 800));

    await CustomerSessionController.instance.verifyOtp();

    if (mounted) {
      Navigator.of(context).pushReplacementNamed(RouteNames.onboarding);
    }
  }

  void _onResend() {
    if (_resendSeconds > 0) return;
    for (final c in _controllers) {
      c.clear();
    }
    _focusNodes[0].requestFocus();
    _startResendTimer();
  }

  String _maskedPhone() {
    final phone = CustomerSessionController.instance.phoneNumber ?? '';
    if (phone.length < 4) return phone;
    return '•••• ${phone.substring(phone.length - 4)}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
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
              'Verify your\nphone number',
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w800,
                color: Theme.of(context).colorScheme.onSurface,
                letterSpacing: -0.8,
                height: 1.15,
              ),
            ),
            const SizedBox(height: 10),
            RichText(
              text: TextSpan(
                text: 'Enter the 6-digit code sent to ',
                style: TextStyle(
                  fontSize: 15,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
                children: [
                  TextSpan(
                    text: _maskedPhone(),
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),

            // OTP digit boxes
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                  _codeLength,
                  (i) => _OtpBox(
                        controller: _controllers[i],
                        focusNode: _focusNodes[i],
                        onChanged: (v) => _onDigitEntered(i, v),
                        isFilled: _controllers[i].text.isNotEmpty,
                      )),
            ),
            const SizedBox(height: 24),

            // Resend
            Center(
              child: _resendSeconds > 0
                  ? Text(
                      'Resend code in ${_resendSeconds}s',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    )
                  : GestureDetector(
                      onTap: _onResend,
                      child: const Text(
                        'Resend code',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                    ),
            ),
            const Spacer(),

            FilledButton(
              onPressed: _isComplete && !_isLoading ? _onVerify : null,
              style: FilledButton.styleFrom(
                backgroundColor:
                    _isComplete ? AppTheme.primaryColor : AppTheme.borderColor,
                foregroundColor: Colors.white,
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Verify'),
            ),
            const SizedBox(height: 16),
            Center(
              child: GestureDetector(
                onTap: () => Navigator.of(context)
                    .pushReplacementNamed(RouteNames.authPhone),
                child: RichText(
                  text: TextSpan(
                    text: 'Wrong number? ',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                    ),
                    children: const [
                      TextSpan(
                        text: 'Change it',
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;
  final bool isFilled;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.onChanged,
    required this.isFilled,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      width: 48,
      height: 56,
      decoration: BoxDecoration(
        color: isFilled
            ? Theme.of(context).colorScheme.primaryContainer
            : AppTheme.backgroundGrey,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isFilled
              ? AppTheme.primaryColor
              : focusNode.hasFocus
                  ? AppTheme.primaryColor
                  : AppTheme.borderColor,
          width: isFilled || focusNode.hasFocus ? 2 : 1,
        ),
      ),
      child: Focus(
        onFocusChange: (_) {},
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          textAlign: TextAlign.center,
          keyboardType: TextInputType.number,
          maxLength: 1,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: AppTheme.primaryColor,
            letterSpacing: 0,
          ),
          decoration: const InputDecoration(
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            counterText: '',
            contentPadding: EdgeInsets.zero,
            filled: false,
          ),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
