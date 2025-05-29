#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"サーバーが起動しました: http://localhost:{PORT}")
    print(f"ゲームプレビュー: http://localhost:{PORT}/game-preview.html")
    print("Ctrl+C で停止")
    httpd.serve_forever()