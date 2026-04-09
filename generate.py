#!/usr/bin/env python3
"""
generate.py — Static page generator for ryanschill.co

Reads projects.json and posts.json, renders HTML card fragments,
and injects them into templates. Output files overwrite the live
work/index.html, writing/index.html, and index.html.

Usage:
    python generate.py

Never edit the generated files directly. Edit the templates in
_templates/ and the data in projects.json / posts.json instead.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
TEMPLATES = ROOT / "_templates"
PROJECTS = ROOT / "projects.json"
POSTS = ROOT / "posts.json"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_json(path: Path) -> list:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: {path} not found.", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"ERROR: {path} contains invalid JSON — {e}", file=sys.stderr)
        sys.exit(1)


def load_template(name: str) -> str:
    path = TEMPLATES / name
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        print(f"ERROR: Template {path} not found.", file=sys.stderr)
        sys.exit(1)


def inject(template: str, slot: str, content: str) -> str:
    """Replace everything between GENERATED markers with content."""
    open_marker = f"<!-- GENERATED:{slot} -->"
    close_marker = f"<!-- /GENERATED:{slot} -->"
    pattern = re.compile(
        re.escape(open_marker) + r".*?" + re.escape(close_marker),
        re.DOTALL
    )
    replacement = f"{open_marker}\n{content}\n          {close_marker}"
    result, count = pattern.subn(replacement, template)
    if count == 0:
        print(f"WARNING: Slot '{slot}' not found in template.", file=sys.stderr)
    return result


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  Written: {path.relative_to(ROOT)}")


def tags_html(tags: list, indent: int = 0) -> str:
    pad = " " * indent
    spans = [f'{pad}<span class="tag tag--{t["type"]}">{t["label"]}</span>' for t in tags]
    return "\n".join(spans)


# ---------------------------------------------------------------------------
# Work page card renderers
# ---------------------------------------------------------------------------

def render_work_card_featured(p: dict) -> str:
    badge = (
        f'\n              <span class="work-card__badge">{p["badge"]}</span>'
        if p.get("badge") else ""
    )
    ext = ' target="_blank" rel="noopener"' if p.get("externalLink") else ""
    title_style = ' style="text-transform: none;"' if p.get("titleNoTransform") else ""
    title_inner = f'<span{title_style}>{p["title"]}</span>' if p.get("titleNoTransform") else p["title"]

    return f"""        <article class="work-card work-card--featured reveal-up">
          <a href="{p['link']}" class="work-card__link" aria-label="View case study: {p['title']}"{ext}>
            <div class="work-card__media">
              <img
                src="{p['thumbnail']}"
                alt="{p['thumbnailAlt']}"
                width="1200"
                height="675"
                loading="eager"
              >{badge}
            </div>
          </a>
          <div class="work-card__body">
            <div class="work-card__meta">
              <span class="work-card__year">{p['year']}</span>
              <span class="work-card__type">{p['projectType']}</span>
            </div>
            <h2 class="work-card__title">
              <a href="{p['link']}"{ext}>{title_inner}</a>
            </h2>
            <p class="work-card__desc">
              {p['description']}
            </p>
            <div class="work-card__footer">
              <div class="tags">
{tags_html(p['tags'], indent=16)}
              </div>
              <a href="{p['link']}"{ext} class="work-card__cta btn btn--primary btn--arrow btn--sm">
                {p['ctaLabel']}
              </a>
            </div>
          </div>
        </article>"""


def render_work_card_secondary(p: dict, delay_ms: int) -> str:
    ext = ' target="_blank" rel="noopener"' if p.get("externalLink") else ""
    title_style = ' style="text-transform: none;"' if p.get("titleNoTransform") else ""
    title_inner = f'<span{title_style}>{p["title"]}</span>' if p.get("titleNoTransform") else p["title"]
    btn_class = "btn--primary" if p.get("caseStudy") else "btn--outline"

    return f"""          <article class="work-card reveal-up" style="--reveal-delay: {delay_ms}ms">
            <a href="{p['link']}" class="work-card__link" aria-label="View case study: {p['title']}"{ext}>
              <div class="work-card__media">
                <img
                  src="{p['thumbnail']}"
                  alt="{p['thumbnailAlt']}"
                  width="800"
                  height="450"
                  loading="lazy"
                >
              </div>
            </a>
            <div class="work-card__body">
              <div class="work-card__meta">
                <span class="work-card__year">{p['year']}</span>
                <span class="work-card__type">{p['projectType']}</span>
              </div>
              <h2 class="work-card__title">
                <a href="{p['link']}"{ext}>{title_inner}</a>
              </h2>
              <p class="work-card__desc">
                {p['description']}
              </p>
              <div class="work-card__footer">
                <div class="tags">
{tags_html(p['tags'], indent=18)}
                </div>
                <a href="{p['link']}"{ext} class="work-card__cta btn {btn_class} btn--arrow btn--sm">
                  {p['ctaLabel']}
                </a>
              </div>
            </div>
          </article>"""


def render_work_cards(projects: list) -> str:
    featured = [p for p in projects if p.get("featured")]
    secondary = [p for p in projects if not p.get("featured")]

    parts = []

    for p in featured:
        parts.append(render_work_card_featured(p))

    # Group secondary cards into rows of 2
    for i in range(0, len(secondary), 2):
        row_cards = secondary[i:i + 2]
        delay = 100
        card_html = []
        for p in row_cards:
            card_html.append(render_work_card_secondary(p, delay))
            delay += 100
        parts.append(
            '        <div class="work-grid-row">\n'
            + "\n\n".join(card_html)
            + "\n\n        </div>"
        )

    return "\n\n".join(parts)


# ---------------------------------------------------------------------------
# Home page work showcase renderers (hero / pair / secondary tiers)
# ---------------------------------------------------------------------------

def render_home_work_hero(p: dict) -> str:
    """Full-width cinematic hero — the flagship project."""
    ext = ' target="_blank" rel="noopener"' if p.get("externalLink") else ""
    badge_html = (
        f'\n                <span class="work-hero__badge">{p["badge"]}</span>'
        if p.get("badge") else ""
    )
    title_style = ' style="text-transform: none;"' if p.get("titleNoTransform") else ""
    title_inner = f'<span{title_style}>{p["title"]}</span>' if p.get("titleNoTransform") else p["title"]

    return f"""          <article class="work-hero reveal-up" aria-labelledby="hero-project-{p['id']}">
            <a href="{p['link']}"{ext} tabindex="-1" aria-hidden="true">
              <div class="work-hero__media">
                <img
                  src="{p['thumbnail']}"
                  alt="{p['thumbnailAlt']}"
                  width="1200"
                  height="525"
                  loading="lazy"
                >{badge_html}
              </div>
            </a>
            <div class="work-hero__body">
              <span class="work-hero__num" aria-hidden="true">01</span>
              <div class="work-hero__content">
                <p class="work-hero__eyebrow">{p['projectType']} · {p['year']}</p>
                <h3 id="hero-project-{p['id']}" class="work-hero__title">
                  <a href="{p['link']}"{ext}>{title_inner}</a>
                </h3>
                <p class="work-hero__desc">{p['description']}</p>
                <div class="work-hero__footer">
                  <div class="tags">
{tags_html(p['tags'], indent=20)}
                  </div>
                  <a href="{p['link']}"{ext} class="btn btn--primary btn--arrow">{p['ctaLabel']}</a>
                </div>
              </div>
            </div>
          </article>"""


def render_home_work_pair_item(p: dict, variant: str, delay_ms: int) -> str:
    """One item in the side-by-side pair. variant: 'image-lead' or 'text-lead'."""
    ext = ' target="_blank" rel="noopener"' if p.get("externalLink") else ""
    title_style = ' style="text-transform: none;"' if p.get("titleNoTransform") else ""
    title_inner = f'<span{title_style}>{p["title"]}</span>' if p.get("titleNoTransform") else p["title"]
    delay_attr = f' style="--reveal-delay: {delay_ms}ms"' if delay_ms else ""

    return f"""            <article class="work-pair__item work-pair__item--{variant} reveal-up"{delay_attr} aria-labelledby="pair-project-{p['id']}">
              <a href="{p['link']}"{ext} tabindex="-1" aria-hidden="true">
                <div class="work-pair__media">
                  <img
                    src="{p['thumbnail']}"
                    alt="{p['thumbnailAlt']}"
                    width="800"
                    height="600"
                    loading="lazy"
                  >
                </div>
              </a>
              <div class="work-pair__body">
                <p class="work-pair__eyebrow">{p['projectType']} · {p['year']}</p>
                <h3 id="pair-project-{p['id']}" class="work-pair__title">
                  <a href="{p['link']}"{ext}>{title_inner}</a>
                </h3>
                <p class="work-pair__desc">{p['description']}</p>
                <div class="work-pair__footer">
                  <div class="tags">
{tags_html(p['tags'], indent=20)}
                  </div>
                  <a href="{p['link']}"{ext} class="btn btn--ghost btn--arrow btn--sm">{p['ctaLabel']}</a>
                </div>
              </div>
            </article>"""


def render_home_work_pair(projects: list) -> str:
    """Two featured projects side by side — first is image-lead, second is text-lead."""
    variants = ["image-lead", "text-lead"]
    delays = [0, 150]
    items = [
        render_home_work_pair_item(p, variants[i], delays[i])
        for i, p in enumerate(projects[:2])
    ]
    return (
        "          <div class=\"work-pair\">\n"
        + "\n\n".join(items)
        + "\n          </div>"
    )


def render_home_work_secondary(projects: list) -> str:
    """Compact typographic list for remaining projects."""
    items = []
    for i, p in enumerate(projects):
        ext = ' target="_blank" rel="noopener"' if p.get("externalLink") else ""
        num = str(i + 4).zfill(2)
        delay_attr = f' style="--reveal-delay: {i * 100}ms"' if i > 0 else ""

        items.append(
            f"""            <a href="{p['link']}"{ext} class="work-secondary__item reveal-up"{delay_attr}>
              <span class="work-secondary__num" aria-hidden="true">{num}</span>
              <span class="work-secondary__info">
                <span class="work-secondary__title">{p['title']}</span>
                <span class="work-secondary__type">{p['projectType']} · {p['year']}</span>
              </span>
              <span class="work-secondary__tags" aria-hidden="true">
{tags_html(p['tags'], indent=16)}
              </span>
              <span class="work-secondary__arrow" aria-hidden="true">→</span>
            </a>"""
        )

    return (
        "          <div class=\"work-secondary\" role=\"list\" aria-label=\"More projects\">\n"
        + "\n\n".join(items)
        + "\n          </div>"
    )


def render_home_project_cards(projects: list) -> str:
    hero = [p for p in projects if p.get("homeDisplay") == "hero"]
    pair = [p for p in projects if p.get("homeDisplay") == "pair"]
    secondary = [p for p in projects if p.get("homeDisplay") == "secondary"]

    parts = []
    if hero:
        parts.append(render_home_work_hero(hero[0]))
    if pair:
        parts.append(render_home_work_pair(pair))
    if secondary:
        parts.append(render_home_work_secondary(secondary))

    return "\n\n".join(parts)


# ---------------------------------------------------------------------------
# Post card renderers
# ---------------------------------------------------------------------------

def render_post_card(post: dict, featured: bool = False) -> str:
    featured_class = " writing-card--featured" if featured else ""
    return f"""          <article class="writing-card{featured_class}">
            <div class="writing-card__body">
              <div class="writing-card__meta">
                <time datetime="{post['date']}" class="writing-card__date">{post['dateDisplay']}</time>
                <span class="writing-card__cat tag tag--{post['categoryType']}">{post['category']}</span>
              </div>
              <h3 class="writing-card__title">
                <a href="/writing/{post['slug']}/">{post['title']}</a>
              </h3>
              <p class="writing-card__excerpt">
                {post['excerpt']}
              </p>
              <a href="/writing/{post['slug']}/" class="card-writing__link">
                Read <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>"""


def render_post_cards(posts: list) -> str:
    parts = []
    for post in posts:
        parts.append(render_post_card(post, featured=post.get("featured", False)))
    return "\n\n".join(parts)


def render_home_post_card(post: dict) -> str:
    return f"""          <article class="card card-writing card--lift reveal-up">
            <p class="card-writing__meta">
              <time datetime="{post['date']}">{post['dateDisplay']}</time>
              <span class="card-writing__cat">{post['category']}</span>
            </p>
            <h3 class="card-writing__title">
              <a href="/writing/{post['slug']}/">{post['title']}</a>
            </h3>
            <p class="card-writing__excerpt">
              {post['excerpt']}
            </p>
            <a href="/writing/{post['slug']}/" class="card-writing__link">
              Read <span aria-hidden="true">→</span>
            </a>
          </article>"""


def render_home_post_cards(posts: list) -> str:
    # Homepage teaser shows the 3 most recent posts (sorted by date descending)
    recent = sorted(posts, key=lambda p: p["date"], reverse=True)[:3]
    parts = []
    for i, post in enumerate(recent):
        card = render_home_post_card(post)
        if i > 0:
            # Add reveal delay for staggered animation
            card = card.replace(
                'class="card card-writing card--lift reveal-up"',
                f'class="card card-writing card--lift reveal-up" style="--reveal-delay: {i * 100}ms"'
            )
        parts.append(card)
    return "\n\n".join(parts)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Loading data...")
    projects = load_json(PROJECTS)
    posts = load_json(POSTS)

    print("Generating work/index.html...")
    work_template = load_template("work.html")
    work_html = inject(work_template, "work-cards", render_work_cards(projects))
    write(ROOT / "work" / "index.html", work_html)

    print("Generating writing/index.html...")
    writing_template = load_template("writing.html")
    writing_html = inject(writing_template, "post-cards", render_post_cards(posts))
    write(ROOT / "writing" / "index.html", writing_html)

    print("Generating index.html...")
    home_template = load_template("home.html")
    home_html = inject(home_template, "home-project-cards", render_home_project_cards(projects))
    home_html = inject(home_html, "home-post-cards", render_home_post_cards(posts))
    write(ROOT / "index.html", home_html)

    print("\nDone. 3 files generated.")


if __name__ == "__main__":
    main()
