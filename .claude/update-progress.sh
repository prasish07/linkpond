#!/usr/bin/env python3
import subprocess, datetime, re

branch = subprocess.run(
    ['git', 'branch', '--show-current'], capture_output=True, text=True
).stdout.strip()
log = subprocess.run(
    ['git', 'log', '--oneline', '-5'], capture_output=True, text=True
).stdout.strip()
date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')

summary = (
    '\n## Last session\n\n'
    f'- Date: {date}\n'
    f'- Branch: `{branch}`\n\n'
    'Recent commits:\n'
    '```\n'
    f'{log}\n'
    '```\n'
)

with open('progress.md', 'r') as f:
    content = f.read()

if '## Last session' in content:
    content = re.sub(r'\n## Last session\n.*', summary, content, flags=re.DOTALL)
else:
    content = content.rstrip() + summary

with open('progress.md', 'w') as f:
    f.write(content)
