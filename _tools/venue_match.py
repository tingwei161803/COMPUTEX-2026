#!/usr/bin/env python3
"""
Shared venue/booth matcher.

The medical dataset (data/medical.js) lists companies but historically carried no
physical venue. The full COMPUTEX directory (data/exhibitors-computex.js) does:
each item has v (venue: T1 / T2 / TWTC) and b (booth no.). This module matches a
medical company back to that directory to recover (venue, booth).

Match order: COMPUTEX exhibitor-page URL hash -> normalized EN name -> ZH name.
Fallback when unmatched or the directory left venue blank: T2 — both the COMPUTEX
medical cluster and the entire InnoVEX zone sit in TaiNEX Hall 2 (南港展覽館 2 館).

Used by add_venue.py (back-fill existing data) and build_medical.py (pipeline).
"""
import json
import os
import re

VENUE_FALLBACK = "T2"


def load_js_obj(path, name=None):
    """Read a `window.X = <json>;` data file and return the parsed object.

    name: which `window.<name> = ...` to read (must be the file's last
    assignment). Omit when the file has a single assignment.
    """
    text = open(path, encoding="utf-8").read()
    pat = r"window\." + (re.escape(name) if name else r"\w+") + r"\s*=\s*"
    m = re.search(pat, text)
    if not m:
        raise ValueError(f"no `window.{name or 'X'} =` assignment found in {path}")
    body = text[m.end():].strip()
    if body.endswith(";"):
        body = body[:-1].rstrip()
    return json.loads(body)


def _hash_of(url):
    """COMPUTEX exhibitor URLs look like .../exhibitor/<HEXHASH>/info.html."""
    m = re.search(r"exhibitor/([0-9A-Fa-f]{20,})", url or "")
    return m.group(1).upper() if m else ""


def _norm(s):
    """Lowercase, keep only [a-z0-9] and CJK — strips spaces/punctuation/case."""
    return re.sub(r"[^0-9a-z一-鿿]", "", (s or "").lower())


def build_cpx_index(cpx_items):
    """Index COMPUTEX directory items by url-hash, normalized EN name, ZH name."""
    by_hash, by_ne, by_nz = {}, {}, {}
    for it in cpx_items:
        h = _hash_of(it.get("ue") or it.get("uz"))
        if h:
            by_hash.setdefault(h, it)
        ne = _norm(it.get("ne"))
        if ne:
            by_ne.setdefault(ne, it)
        nz = _norm(it.get("nz"))
        if nz:
            by_nz.setdefault(nz, it)
    return by_hash, by_ne, by_nz


def match_venue(index, ne="", nz="", url=""):
    """Return (venue_code, booth) for a company, with T2 fallback."""
    by_hash, by_ne, by_nz = index
    it = None
    h = _hash_of(url)
    if h and h in by_hash:
        it = by_hash[h]
    elif _norm(ne) and _norm(ne) in by_ne:
        it = by_ne[_norm(ne)]
    elif _norm(nz) and _norm(nz) in by_nz:
        it = by_nz[_norm(nz)]
    if it and it.get("v"):
        return it["v"], (it.get("b") or "")
    return VENUE_FALLBACK, ""
