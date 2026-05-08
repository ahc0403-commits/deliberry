import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

import '../supabase/supabase_client.dart';

class VnpaySandboxPaymentRequest {
  const VnpaySandboxPaymentRequest({
    required this.orderId,
    this.bankCode,
    this.locale = 'vn',
  });

  final String orderId;
  final String? bankCode;
  final String locale;
}

class VnpaySandboxPaymentResult {
  const VnpaySandboxPaymentResult({
    required this.launched,
    this.paymentUrl,
    this.paymentReference,
    this.amountVnd,
    this.blockerCode,
    this.message,
  });

  final bool launched;
  final Uri? paymentUrl;
  final String? paymentReference;
  final int? amountVnd;
  final String? blockerCode;
  final String? message;
}

class VnpaySandboxPaymentService {
  const VnpaySandboxPaymentService();

  Future<VnpaySandboxPaymentResult> openSandboxPayment(
    VnpaySandboxPaymentRequest request,
  ) async {
    final client = CustomerSupabaseClient.maybeClient;
    if (client == null || client.auth.currentUser == null) {
      return const VnpaySandboxPaymentResult(
        launched: false,
        blockerCode: 'customer_session_required',
        message: 'Sign in before starting a VNPAY sandbox payment.',
      );
    }

    try {
      final response = await client.functions.invoke(
        'create-vnpay-sandbox-payment',
        body: {
          'order_id': request.orderId,
          'bank_code': request.bankCode,
          'locale': request.locale,
        },
      );
      final data = response.data;
      if (data is! Map) {
        return const VnpaySandboxPaymentResult(
          launched: false,
          blockerCode: 'vnpay_response_invalid',
          message: 'VNPAY sandbox response was not readable.',
        );
      }

      final paymentUrlText = data['payment_url'] as String?;
      final paymentUrl =
          paymentUrlText == null ? null : Uri.tryParse(paymentUrlText);
      if (paymentUrl == null) {
        return VnpaySandboxPaymentResult(
          launched: false,
          blockerCode: 'vnpay_payment_url_missing',
          message: (data['message'] as String?) ??
              'VNPAY sandbox payment URL was not returned.',
        );
      }

      final launched = await launchUrl(
        paymentUrl,
        mode: kIsWeb
            ? LaunchMode.platformDefault
            : LaunchMode.externalApplication,
      );
      return VnpaySandboxPaymentResult(
        launched: launched,
        paymentUrl: paymentUrl,
        paymentReference: data['payment_reference'] as String?,
        amountVnd: (data['amount_vnd'] as num?)?.toInt(),
        blockerCode: launched ? null : 'vnpay_launch_failed',
        message: launched
            ? (data['message'] as String?) ?? 'Opening VNPAY sandbox.'
            : 'VNPAY sandbox payment page could not be opened.',
      );
    } on FunctionException catch (error) {
      return VnpaySandboxPaymentResult(
        launched: false,
        blockerCode: 'vnpay_function_failed',
        message: error.details?.toString() ?? error.reasonPhrase,
      );
    } catch (error) {
      return VnpaySandboxPaymentResult(
        launched: false,
        blockerCode: 'vnpay_sandbox_failed',
        message: error.toString(),
      );
    }
  }
}
