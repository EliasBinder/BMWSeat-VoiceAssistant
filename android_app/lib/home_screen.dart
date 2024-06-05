import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'ssh_client.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final SSHClientWrapper _sshClient = SSHClientWrapper();
  bool _sshConnected = false;
  String _selectedLanguage = 'en';
  String _selectedCommand = '';
  final TextEditingController _customCommandController =
      TextEditingController();

  final Map<String, List<String>> _commands = {
    'en': [
      'Hyper seat move 3 centimeters forward',
      'Hyper seat move 8 centimeters backward',
      'Hyper seat move 8 centimeters up',
      'Hyper seat move 8 centimeters down',
      'Hyper seat move 8 degrees up',
      'Hyper seat move 8 degrees down',
      'Hyper backrest incline 5 degrees forward',
      'Hyper backrest incline 12 degrees backward',
      'Hyper vacust function 1 parking start',
      'Hyper vacust function 2 easy start',
      'Hyper vacust function 3 comfort start',
      'Hyper vacust function 4 small start',
      'Hyper vacust function 5 medium start',
      'Hyper vacust function 6 large start',
      'Hyper vacust function 7 sport start',
      'Hyper vacust function 8 lumbar star',
    ],
    'de': [
      'Hyper sitz bewegen 3 Zentimeter vorwärts',
      'Hyper sitz bewegen 8 Zentimeter rückwärts',
      'Hyper sitz bewegen 8 Zentimeter aufwärts',
      'Hyper sitz bewegen 8 Zentimeter abwärts',
      'Hyper sitz bewegen 8 Grad aufwärts',
      'Hyper sitz bewegen 8 Grad abwärts',
      'Hyper rückenlehne neigen 5 Grad vorwärts',
      'Hyper rückenlehne neigen 12 Grad rückwärts',
      'Hyper vacust funktion 1 parken starten',
      'Hyper vacust funktion 2 easyin starten',
      'Hyper vacust funktion 3 komfort starten',
      'Hyper vacust funktion 4 klein starten',
      'Hyper vacust funktion 5 mittel starten',
      'Hyper vacust funktion 6 groß starten',
      'Hyper vacust funktion 7 sport starten',
      'Hyper vacust funktion 8 lendenwirbel starten',
    ],
    'it': [
      'Hyper sedile muovi 3 centimetri avanti',
      'Hyper sedile muovi 8 centimetri indietro',
      'Hyper sedile muovi 8 centimetri su',
      'Hyper sedile muovi 8 centimetri giù',
      'Hyper sedile muovi 8 gradi su',
      'Hyper sedile muovi 8 gradi giù',
      'Hyper schienale inclina 5 gradi avanti',
      'Hyper schienale inclina 12 gradi indietro',
      'Hyper vacust funzione 1 parcheggio avvia',
      'Hyper vacust funzione 2 easyin avvia',
      'Hyper vacust funzione 3 comfort avvia',
      'Hyper vacust funzione 4 piccolo avvia',
      'Hyper vacust funzione 5 medio avvia',
      'Hyper vacust funzione 6 grande avvia',
      'Hyper vacust funzione 7 sport avvia',
      'Hyper vacust funzione 8 lombare avvia',
    ],
  };

  @override
  void initState() {
    super.initState();
    _connectSSH();
  }

  // Future<void> _connectSSH() async {
  //   // await _sshClient.connect(
  //   //   '100.65.29.66',
  //   //   'unibz',
  //   //   'bmwproject',
  //   // );

  //   await _sshClient.connect(
  //     '10.11.129.38',
  //     'kevinfred',
  //     '1999',
  //   );

  //   setState(() {
  //     _sshConnected = _sshClient.isConnected;
  //   });
  // }
  Future<void> _connectSSH() async {
    try {
      await _sshClient.connect(
        '100.65.29.66',
        'unibz',
        'bmwproject',
      );

      setState(() {
        _sshConnected = _sshClient.isConnected;
      });

      if (_sshConnected) {
        if (kDebugMode) {
          print('SSH connection established successfully.');
        }
      } else {
        if (kDebugMode) {
          print('SSH connection failed.');
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error connecting to SSH: $e');
      }
      setState(() {
        _sshConnected = false;
      });
    }
  }

  Future<void> _sendCommand() async {
    if (!_sshConnected) {
      _showErrorDialog('SSH connection not established');
      return;
    }

    final command = _selectedCommand.isNotEmpty
        ? _selectedCommand
        : _customCommandController.text;

    final commandParts = command.split(' ');
    if (commandParts.length >= 4) {
      final jsonBody = {
        "triggerword": commandParts[0],
        "domain": commandParts[1],
        "commandname": commandParts[2],
        "value": int.parse(commandParts[3]),
        "unit": commandParts.length >= 5 ? commandParts[4] : '',
        "direction": commandParts.length >= 6 ? commandParts[5] : '',
        "raw": command,
        "origin": "driver",
        "originlanguage": _selectedLanguage,
        "status_indicator": 200,
      };

      try {
        final response = await http.post(
          Uri.parse('http://10.30.51.150:8888/api/v5/hyper/commands'),
          //Uri.parse('http://10.11.129.38:5000/api/command'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(jsonBody),
        );

        if (response.statusCode == 200) {
          _showSuccessDialog('Command sent successfully');
        } else {
          _showErrorDialog(
              'Failed to send command. Status code: ${response.statusCode}');
        }
      } catch (e) {
        _showErrorDialog('Error sending command: $e');
      }
    } else {
      _showErrorDialog('Invalid command format');
    }
  }

  Future<void> _testHypervisor() async {
    if (!_sshConnected) {
      _showErrorDialog('SSH connection not established');
      return;
    }

    const command =
        "curl -X POST http://10.30.51.221:3000/api/say -H \"Content-Type: application/json\" -d '{\"text\": \"THIS IS A TEST from THE HYPERVISOR main system check routing. System ist Bereit. START\"}'";
    //const command ="curl -X POST http://10.11.129.38:5000/api/message -H \"Content-Type: application/json\" -d '{\"message\": \"THIS IS A TEST from THE HYPERVISOR main system check routing. System ist Bereit. START\"}'";
    try {
      final result = await _sshClient.executeCommand(command);
      _showSuccessDialog('Hypervisor test command sent successfully:\n$result');
    } catch (e) {
      _showErrorDialog('Error sending hypervisor test command: $e');
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Error'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Success'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _startNPM() async {
    if (!_sshConnected) {
      _showErrorDialog('SSH connection not established');
      return;
    }

    try {
      await _sshClient.executeCommand("kill \$(lsof -t -i:3000)");
      await _sshClient.executeCommand(
        "cd /home/unibz/Documents/BMWSeat-VoiceAssistant && /home/unibz/.nvm/versions/node/v20.3.0/bin/npx npm start",
      );
      _showSuccessDialog('NPM started successfully');
    } catch (e) {
      _showErrorDialog('Error starting NPM: $e');
    }
  }

  Future<void> _executeWakeCommand() async {
    if (!_sshConnected) {
      _showErrorDialog('SSH connection not established');
      return;
    }

    try {
      _showSuccessDialog('Wake command executed successfully');
    } catch (e) {
      _showErrorDialog('Error executing wake command: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hyper Command'),
      ),
      backgroundColor: Colors.black,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                width: 300,
                child: Row(
                  children: [
                    const Text('SSH Connection Status:',
                        style: TextStyle(color: Colors.white)),
                    const SizedBox(width: 8.0),
                    Container(
                      width: 20.0,
                      height: 20.0,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _sshConnected
                            ? const Color(0xFF6BB1E1)
                            : Colors.red,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24.0),
              SizedBox(
                width: 300,
                child: DropdownButtonFormField<String>(
                  value: _selectedLanguage == 'en' ? null : _selectedLanguage,
                  hint: const Text('Choose Language',
                      style: TextStyle(color: Colors.black)),
                  onChanged: (value) {
                    setState(() {
                      _selectedLanguage = value ?? 'en';
                      _selectedCommand = '';
                    });
                  },
                  items: ['en', 'de', 'it'].map((language) {
                    return DropdownMenuItem<String>(
                      value: language,
                      child: Text(language,
                          style: const TextStyle(color: Colors.black)),
                    );
                  }).toList(),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 12.0),
                  ),
                ),
              ),
              const SizedBox(height: 24.0),
              SizedBox(
                width: 300,
                child: DropdownButtonFormField<String>(
                  value: _selectedCommand.isNotEmpty ? _selectedCommand : null,
                  hint: const Text('Select a command',
                      style: TextStyle(color: Colors.black)),
                  onChanged: (value) {
                    setState(() {
                      _selectedCommand = value ?? '';
                      _customCommandController.text = value ?? '';
                    });
                  },
                  items: _selectedLanguage != 'Choose Language' &&
                          _commands[_selectedLanguage] != null
                      ? _commands[_selectedLanguage]!.map((command) {
                          return DropdownMenuItem<String>(
                            value: command,
                            child: Text(
                              command,
                              style: const TextStyle(color: Colors.black),
                              overflow: TextOverflow.ellipsis,
                              softWrap: false,
                            ),
                          );
                        }).toList()
                      : [],
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 12.0),
                  ),
                ),
              ),
              const SizedBox(height: 24.0),
              SizedBox(
                width: 300,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Enter custom command',
                      style: TextStyle(color: Colors.white),
                    ),
                    const SizedBox(height: 8.0),
                    TextFormField(
                      controller: _customCommandController,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12.0),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16.0, vertical: 12.0),
                      ),
                      style: const TextStyle(color: Colors.black),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24.0),
              SizedBox(
                width: 300,
                child: ElevatedButton(
                  onPressed: _sendCommand,
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.black,
                    backgroundColor: const Color(0xFF6BB1E1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text('Send Command'),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              SizedBox(
                width: 300,
                child: ElevatedButton(
                  onPressed: _startNPM,
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.black,
                    backgroundColor: const Color(0xFF6BB1E1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text('Start NPM'),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              SizedBox(
                width: 300,
                child: ElevatedButton(
                  onPressed: _executeWakeCommand,
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.black,
                    backgroundColor: const Color(0xFF6BB1E1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text('Wake'),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              SizedBox(
                width: 300,
                child: ElevatedButton(
                  onPressed: _testHypervisor,
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.black,
                    backgroundColor: const Color(0xFF6BB1E1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Text('Test Hypervisor'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
