import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';

class PublicWebsiteHandoffService {
  const PublicWebsiteHandoffService();

  static const String _baseUrl = String.fromEnvironment(
    'PUBLIC_WEBSITE_URL',
    defaultValue: 'https://go.deli-berry.com',
  );

  Uri? resolvePath(String path) {
    final normalizedPath = path.trim();
    if (normalizedPath.isEmpty) {
      return null;
    }

    try {
      final baseUri = Uri.parse(_baseUrl);
      final relativePath = normalizedPath.startsWith('/')
          ? normalizedPath.substring(1)
          : normalizedPath;
      return baseUri.resolve(relativePath);
    } catch (_) {
      return null;
    }
  }

  Future<bool> openPath(String path) async {
    final uri = resolvePath(path);
    if (uri == null) {
      return false;
    }

    return launchUrl(
      uri,
      mode:
          kIsWeb ? LaunchMode.platformDefault : LaunchMode.externalApplication,
    );
  }
}
