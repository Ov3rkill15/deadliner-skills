#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Helper to inspect videos embedded in LMS courses:
1. Fetch YouTube subtitles / transcript using youtube-transcript-api.
2. If transcripts are disabled, download stream & extract keyframe contact sheets with ffmpeg.
"""

import argparse
import os
import subprocess
import sys


def get_transcript(video_id, out_txt):
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id, languages=["id", "en", "id-orig", "en-orig"])
        with open(out_txt, "w", encoding="utf-8") as f:
            for item in transcript:
                m = int(item.start) // 60
                s = int(item.start) % 60
                f.write(f"[{m:02d}:{s:02d}] {item.text}\n")
        print(f"[*] Saved transcript to {out_txt}")
        return True
    except Exception as e:
        print(f"[-] Transcript not available ({e}).")
        return False


def extract_keyframes(video_path, output_dir, timestamps):
    os.makedirs(output_dir, exist_ok=True)
    frames = []
    for idx, t in enumerate(timestamps):
        out_frame = os.path.join(output_dir, f"frame_{idx:02d}_{t}s.png")
        cmd = [
            "ffmpeg", "-loglevel", "error", "-y",
            "-ss", str(t),
            "-i", video_path,
            "-frames:v", "1",
            "-vf", "scale=800:-1",
            out_frame
        ]
        res = subprocess.run(cmd)
        if res.returncode == 0 and os.path.exists(out_frame):
            frames.append(out_frame)
    print(f"[*] Extracted {len(frames)} keyframes.")
    return frames


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Media Inspector for LMS Video Activities")
    parser.add_argument("--video-id", help="YouTube Video ID")
    parser.add_argument("--video-file", help="Local downloaded video file path")
    parser.add_argument("--out-dir", default="./video_analysis", help="Output directory")

    args = parser.parse_args()
    os.makedirs(args.out_dir, exist_ok=True)

    if args.video_id:
        out_txt = os.path.join(args.out_dir, f"{args.video_id}_transcript.txt")
        get_transcript(args.video_id, out_txt)

    if args.video_file and os.path.exists(args.video_file):
        # Sample frames every 60 seconds up to 15 mins
        timestamps = list(range(10, 900, 60))
        extract_keyframes(args.video_file, os.path.join(args.out_dir, "frames"), timestamps)
