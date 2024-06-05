import 'package:flutter/material.dart';
import 'home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Hyper Command',
      theme: ThemeData(
        primaryColor: const Color(0xFF6BB1E1),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Colors.white),
          bodyMedium: TextStyle(color: Colors.white),
        ),
        appBarTheme: const AppBarTheme(
          color: Colors.black,
        ),
        buttonTheme: const ButtonThemeData(
          buttonColor: Color(0xFF6BB1E1), // Light blue for buttons
          textTheme: ButtonTextTheme.primary,
        ),
        inputDecorationTheme: const InputDecorationTheme(
          labelStyle: TextStyle(color: Colors.white),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.white),
          ),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Color(0xFF6BB1E1)),
          ),
        ),
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blue)
            .copyWith(secondary: Colors.black),
      ),
      home: const HomeScreen(),
    );
  }
}
