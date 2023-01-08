import 'dart:html';

import 'package:flutter/material.dart';
import 'package:html/parser.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String htmlContent = "";

  htmlMining() async {
    // TODO: CORS problem - replace by webview
    final response = await http.Client().get(Uri.parse('https://www.url.com'));
    print(response.statusCode);
    if (response.statusCode == 200) {
      var document = parse(response.body);
      print(document.getElementsByClassName('price-box_price-text'));
    }
  }

  @override
  Widget build(BuildContext context) {
    htmlMining();
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[Text('$htmlContent')],
        ),
      ),
    );
  }
}
