#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ReportLab Academic Study Guide Generator Base Template
Provides:
- BaseDocTemplate with running header & footer ("Halaman X")
- Dynamic Table of Contents (2-pass)
- Clean typography (Arial / Consolas)
- Callout notes, preformatted code, styled tables, and Q&A flowables
"""

import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    PageBreak, Table, TableStyle, Preformatted, NextPageTemplate
)
from reportlab.platypus.tableofcontents import TableOfContents


# Safe font registration
def init_fonts():
    font_dir = r"C:\Windows\Fonts"
    try:
        pdfmetrics.registerFont(TTFont("Arial", os.path.join(font_dir, "arial.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Bold", os.path.join(font_dir, "arialbd.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-Italic", os.path.join(font_dir, "ariali.ttf")))
        pdfmetrics.registerFont(TTFont("Arial-BoldItalic", os.path.join(font_dir, "arialbi.ttf")))
        pdfmetrics.registerFont(TTFont("Mono", os.path.join(font_dir, "consola.ttf")))
        pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold",
                                      italic="Arial-Italic", boldItalic="Arial-BoldItalic")
    except Exception as e:
        print(f"[-] Font registration error: {e}. Falling back to standard Helvetica.")


NAVY = colors.HexColor("#1F3A5F")
LIGHT = colors.HexColor("#EEF3F9")
GREY = colors.HexColor("#555555")
GREEN = colors.HexColor("#1B5E20")


def get_styles():
    ss = {}
    ss["body"] = ParagraphStyle("body", fontName="Arial", fontSize=9.6, leading=13.6, alignment=TA_JUSTIFY, spaceAfter=3)
    ss["small"] = ParagraphStyle("small", parent=ss["body"], fontSize=8.2, leading=11, textColor=GREY, alignment=TA_LEFT)
    ss["src"] = ParagraphStyle("src", parent=ss["body"], fontSize=8.4, leading=11.2, textColor=GREEN, alignment=TA_LEFT, spaceBefore=1, spaceAfter=7)
    ss["h0"] = ParagraphStyle("h0", fontName="Arial-Bold", fontSize=20, leading=25, textColor=NAVY, spaceAfter=8, keepWithNext=True)
    ss["h1"] = ParagraphStyle("h1", fontName="Arial-Bold", fontSize=15, leading=19, textColor=NAVY, spaceBefore=10, spaceAfter=6, keepWithNext=True)
    ss["h2"] = ParagraphStyle("h2", fontName="Arial-Bold", fontSize=11.5, leading=15, textColor=colors.white, backColor=NAVY, borderPadding=(3, 4, 3, 4), spaceBefore=12, spaceAfter=8, keepWithNext=True)
    ss["h3"] = ParagraphStyle("h3", fontName="Arial-Bold", fontSize=10.3, leading=13.5, textColor=NAVY, spaceBefore=7, spaceAfter=3, keepWithNext=True)
    ss["q"] = ParagraphStyle("q", fontName="Arial-Bold", fontSize=9.8, leading=13.4, textColor=colors.HexColor("#0D2A4D"), backColor=LIGHT, borderPadding=(3, 4, 3, 4), spaceBefore=9, spaceAfter=5, keepWithNext=True, alignment=TA_LEFT)
    ss["a"] = ParagraphStyle("a", parent=ss["body"], leftIndent=6)
    ss["cell"] = ParagraphStyle("cell", fontName="Arial", fontSize=8.6, leading=11.2, alignment=TA_LEFT)
    ss["cellb"] = ParagraphStyle("cellb", parent=ss["cell"], fontName="Arial-Bold", textColor=colors.white)
    ss["code"] = ParagraphStyle("code", fontName="Mono", fontSize=7.9, leading=10, backColor=colors.HexColor("#F4F4F4"), borderColor=colors.HexColor("#CCCCCC"), borderWidth=0.5, borderPadding=4, leftIndent=6, rightIndent=6, spaceBefore=3, spaceAfter=7)
    ss["note"] = ParagraphStyle("note", parent=ss["body"], backColor=colors.HexColor("#FFF8E1"), borderColor=colors.HexColor("#FFB300"), borderWidth=0.6, borderPadding=5, spaceBefore=4, spaceAfter=8, alignment=TA_LEFT)
    ss["cover1"] = ParagraphStyle("cover1", fontName="Arial-Bold", fontSize=24, leading=30, textColor=NAVY, alignment=TA_CENTER, spaceAfter=10)
    ss["cover2"] = ParagraphStyle("cover2", fontName="Arial", fontSize=12, leading=17, textColor=GREY, alignment=TA_CENTER, spaceAfter=6)
    return ss


def sanitize_text(text):
    """Sanitize XML entities and replace unsupported Unicode subscripts."""
    sub_map = str.maketrans('₀₁₂₃₄₅₆₇₈₉', '0123456789')
    text = text.translate(sub_map)
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"__(.+?)__", r"<i>\1</i>", text)
    text = re.sub(r"`(.+?)`", r'<font name="Mono" size="8.6">\1</font>', text)
    return text.replace("\n", "<br/>")


class AcademicDocTemplate(BaseDocTemplate):
    def __init__(self, filename, title="", running_title="", **kwargs):
        super().__init__(
            filename, pagesize=A4,
            leftMargin=2.0 * cm, rightMargin=2.0 * cm,
            topMargin=2.0 * cm, bottomMargin=1.8 * cm,
            title=title, **kwargs
        )
        self.running_title = running_title
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[frame]),
            PageTemplate(id="main", frames=[frame], onPage=self.draw_decorations)
        ])

    def draw_decorations(self, canvas, doc):
        canvas.saveState()
        canvas.setFont("Arial", 7.8)
        canvas.setFillColor(GREY)
        canvas.drawString(2.0 * cm, A4[1] - 1.3 * cm, self.running_title)
        canvas.drawRightString(A4[0] - 2.0 * cm, 1.1 * cm, f"Halaman {doc.page}")
        canvas.setStrokeColor(colors.HexColor("#BBBBBB"))
        canvas.line(2.0 * cm, A4[1] - 1.45 * cm, A4[0] - 2.0 * cm, A4[1] - 1.45 * cm)
        canvas.restoreState()

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            name = flowable.style.name
            if name in ("h1", "h2"):
                level = 0 if name == "h1" else 1
                clean_text = re.sub(r"<[^>]+>", "", flowable.text)
                bookmark = f"toc_{id(flowable)}"
                self.canv.bookmarkPage(bookmark)
                self.notify("TOCEntry", (level, clean_text, self.page, bookmark))
