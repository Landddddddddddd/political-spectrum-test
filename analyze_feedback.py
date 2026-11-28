#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
路径 B 分析器：读取旧批次回访问卷（self_label vs 系统判定），输出
  1) 真实自报立场分布
  2) 系统判定分布
  3) 系统判定 vs 自报 一致性矩阵（行=自报, 列=系统判定）
  4) 严格一致率 + 近似一致率
可累积：把新回传追加进 old_batch_feedback.csv 后重跑即可。
"""
import csv
import os
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(BASE, "old_batch_feedback.csv")

# 近似家族：自报 X 与系统判 Y 语义相近，视为"近似命中"（人工维护映射）
NEAR_FAMILY = {
    "新自由主义": "自由主义",
    "古典自由主义": "自由主义",
    "社会自由主义": "自由主义",
    "民主社会主义": "社会民主主义",
    "社会民主主义": "社会民主主义",
}


def load():
    rows = []
    with open(PATH, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            s = (r.get("self_label") or "").strip()
            c = (r.get("system_class") or "").strip()
            pid = (r.get("participant_id") or "").strip()
            if not s and not c:
                continue
            rows.append((pid, s, c))
    return rows


def main():
    rows = load()
    n = len(rows)
    print(f"样本量 n = {n}\n")

    selfc = Counter(s for _, s, _ in rows)
    sysc = Counter(c for _, _, c in rows)

    print("【真实自报立场分布】")
    for k, v in selfc.most_common():
        print(f"  {k}: {v}  ({v/n*100:.1f}%)")

    print("\n【系统判定分布】")
    for k, v in sysc.most_common():
        print(f"  {k}: {v}  ({v/n*100:.1f}%)")

    mat = defaultdict(int)
    for _, s, c in rows:
        mat[(s, c)] += 1
    selfs = sorted(selfc)
    syss = sorted(sysc)

    print("\n【一致性矩阵】（行=自报, 列=系统判定, 格=人数）")
    print("自报\\系统\t" + "\t".join(syss))
    for s in selfs:
        print(s + "\t" + "\t".join(str(mat[(s, c)]) for c in syss))

    match = sum(1 for _, s, c in rows if s == c)
    near = sum(1 for _, s, c in rows if s != c and NEAR_FAMILY.get(s) == c)
    print(f"\n严格一致率（自报==系统判定）：{match}/{n} = {match/n*100:.1f}%")
    print(f"含近似命中（见 NEAR_FAMILY 映射）：{(match+near)}/{n} = {(match+near)/n*100:.1f}%")

    # 错配明细
    mism = [(p, s, c) for p, s, c in rows if s != c and NEAR_FAMILY.get(s) != c]
    if mism:
        print("\n【完全错配（非近似）明细】")
        for p, s, c in mism:
            print(f"  {p}: 自报「{s}」→ 系统「{c}」")


if __name__ == "__main__":
    main()
