#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("font/woff2", ".woff2")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. Direct route for /login and /login.html
        if path in ("/login", "/login.html"):
            login_file = os.path.join(DIRECTORY, "login.html")
            if os.path.exists(login_file):
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                with open(login_file, "rb") as f:
                    content = f.read()
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # 2. Direct route for /casino or /pages/casino.html -> redirect to home lobby
        if path in ("/casino", "/pages/casino.html"):
            self.send_response(302)
            self.send_header("Location", "/")
            self.end_headers()
            return

        # 3. Game links: /pages/v_*:*.html -> redirect to home lobby with game param
        if path.startswith("/pages/v_"):
            game_file = os.path.basename(path).replace(".html", "")
            self.send_response(302)
            self.send_header("Location", f"/?game={urllib.parse.quote(game_file)}")
            self.end_headers()
            return

        # 4. Route css-variables endpoint if requested directly
        if "css-variables" in path:
            css_path = os.path.join(DIRECTORY, "styles", "css-variables.css")
            if os.path.exists(css_path):
                self.send_response(200)
                self.send_header("Content-Type", "text/css; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                with open(css_path, "rb") as f:
                    content = f.read()
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # 5. Check if requested file exists on disk
        clean_path = path.lstrip("/")
        local_path = os.path.join(DIRECTORY, clean_path)
        if not os.path.exists(local_path) and not path == "/":
            _, ext = os.path.splitext(clean_path)
            # If it's a media/script/style file that's missing, return empty 200/204 so page assets don't break
            if ext in (".css", ".js", ".png", ".jpg", ".webp", ".avif", ".svg", ".woff2", ".bin", ".ico", ".json", ".map"):
                self.send_response(204)
                self.end_headers()
                return

            # For all missing pages/navigation routes, NEVER direct to error page -> direct to /login
            self.send_response(302)
            self.send_header("Location", "/login?reason=required")
            self.end_headers()
            return

        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        # Never send a 404 or other error page to user: redirect to login page for page visits
        accept = self.headers.get("Accept", "") if hasattr(self, "headers") and self.headers else ""
        if "text/html" in accept or "." not in self.path:
            self.send_response(302)
            self.send_header("Location", "/login?reason=required")
            self.end_headers()
            return
        super().send_error(code, message, explain)

    def do_POST(self):
        # Handle all POST requests gracefully (telemetry, trackers, cda redirects)
        length = int(self.headers.get("Content-Length", 0))
        body = b""
        if length > 0:
            body = self.rfile.read(length)

        if "/debug_log" in self.path:
            with open("/tmp/debug.json", "wb") as f:
                f.write(body)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"logged"}')
            return

        # If it was a navigation POST form submission (e.g., /cdaredirect), redirect to home page
        parsed = urllib.parse.urlparse(self.path)
        if "redirect" in parsed.path:
            self.send_response(303)
            self.send_header("Location", "/")
            self.end_headers()
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        response = b'{"status":"ok"}'
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Mellstroy casino hosting started at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
