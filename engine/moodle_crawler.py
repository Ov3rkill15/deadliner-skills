#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Helper script to crawl Moodle course pages, list activities, and download resources
using an authenticated session cookie.
"""

import argparse
import html
import os
import re
import sys
import urllib.parse
import requests


def create_session(cookie_value, domain):
    session = requests.Session()
    session.cookies.set("MoodleSession", cookie_value, domain=domain, path="/")
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
    })
    return session


def crawl_course(session, course_url, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    resp = session.get(course_url)
    resp.raise_for_status()
    page_html = resp.text

    with open(os.path.join(output_dir, "course_index.html"), "w", encoding="utf-8") as f:
        f.write(page_html)

    # Find activities
    pattern = r'href="(https?://[^"/]+/mod/([^/]+)/view\.php\?id=(\d+))"[^>]*>(.*?)</a>'
    matches = re.findall(pattern, page_html, re.DOTALL)

    activities = []
    seen = set()
    for full_url, mod_type, cmid, title_raw in matches:
        title = html.unescape(re.sub(r"<[^>]+>", "", title_raw)).strip()
        if (cmid, mod_type) not in seen and title:
            seen.add((cmid, mod_type))
            activities.append({
                "cmid": cmid,
                "type": mod_type,
                "title": title,
                "url": full_url
            })

    print(f"[*] Discovered {len(activities)} activities in course.")
    return activities


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Moodle Course Crawler")
    parser.add_argument("--url", required=True, help="Course View URL")
    parser.add_argument("--cookie", required=True, help="MoodleSession Cookie Value")
    parser.add_argument("--domain", default="lms.telkomuniversity.ac.id", help="Domain for Cookie")
    parser.add_argument("--out", default="./lms_dump", help="Output directory")

    args = parser.parse_args()
    sess = create_session(args.cookie, args.domain)
    acts = crawl_course(sess, args.url, args.out)
    for a in acts:
        print(f" - [{a['type'].upper()}] id={a['cmid']}: {a['title']} -> {a['url']}")
