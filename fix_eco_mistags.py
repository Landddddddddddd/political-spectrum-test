# -*- coding: utf-8 -*-
"""精准修复 3 个 ECO 确凿错标：ECO:R -> ECO:L。
匹配 (qid, 文字子串) 精确定位选项，只改其 tags 里的 ECO:R。
同时写回 source question_bank.json 与 deploy/question_bank.json（均为本地，不部署）。
"""
import json, shutil, os

TARGETS = [
    (39,  "分配机制该往更平等的方向改"),
    (459, "我支持公共资助，纯市场化的媒体一定会先放弃"),
    (521, "设定最低价格保护或反不正当竞争审查"),
]

def fix(path):
    d = json.load(open(path, 'r', encoding='utf8'))
    hit = 0
    for q in d:
        for o in q.get('options', []):
            for (qid, sub) in TARGETS:
                if q['id'] == qid and sub in o.get('t', ''):
                    tags = o.get('tags', [])
                    if 'ECO:R' in tags:
                        o['tags'] = [t if t != 'ECO:R' else 'ECO:L' for t in tags]
                        print(f"  FIX q{q['id']}: tags -> {o['tags']}  | {o['t'][:30]}")
                        hit += 1
    json.dump(d, open(path, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    return hit

print("=== 修复 source question_bank.json ===")
h1 = fix('question_bank.json')
print("=== 同步 deploy/question_bank.json ===")
shutil.copy('question_bank.json', 'deploy/question_bank.json')
h2 = h1
print(f"命中修复数: source={h1}")
assert h1 == len(TARGETS), f"期望修复 {len(TARGETS)} 条，实际 {h1}"
print("OK: 3 条 ECO 错标已修正（本地，未部署）。")
