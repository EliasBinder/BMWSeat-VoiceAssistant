import 'package:flutter/foundation.dart';
import 'package:ssh2/ssh2.dart';

class SSHClientWrapper {
  late SSHClient _client;
  bool _isConnected = false;

  Future<void> connect(String host, String username, String password) async {
    _client = SSHClient(
      host: host,
      port: 22,
      username: username,
      passwordOrKey: password,
    );

    try {
      final result = await _client.connect();
      if (result == "session_connected") {
        _isConnected = true;
      } else {
        _isConnected = false;
        if (kDebugMode) {
          print('SSH connection failed: $result');
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('SSH connection failed: $e');
      }
      _isConnected = false;
    }
  }

  Future<void> disconnect() async {
    if (_isConnected) {
      await _client.disconnect();
      _isConnected = false;
    }
  }

  bool get isConnected => _isConnected;

  Future<String> executeCommand(String command) async {
    if (!_isConnected) {
      throw Exception('SSH connection not established');
    }

    try {
      final result = await _client.execute(command);
      return result ?? '';
    } catch (e) {
      throw Exception('Error executing command: $e');
    }
  }
}
