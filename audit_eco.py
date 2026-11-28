# -*- coding: utf-8 -*-
"""ECO 维度 tag 语义一致性审计。
给每个选项文字打「经济左右」语义分（关键词加权），与其实际 ECO tag 比对，
统计冲突率与方向，并输出高冲突样例供人工复核。
这是启发式审计，目的：定位是否存在「系统性」ECO 反转（整批 tag 标反）。
"""
import json, re

BANK = json.load(open('question_bank.json'))

# 强关键词：明确指向经济左（平等/再分配/公有/福利/国家调剂）
KW_L = {
    '再分配':3,' redistribution':0,
    '公有制':3,'公有':2,'国有':2,'集体所有':3,'共有':2,'全民':2,'公共品':2,'公共资金':3,
    '福利':3,'低保':3,'普惠':2,'社会保障':3,'社会救济':3,'托底':2,'兜底':2,
    '累进税':3,'税收调节':3,'加税':2,'富人税':3,'高税收':2,'税收':1,
    '反垄断':2,'限薪':3,'限高':3,'均富':3,'贫富差距':2,'贫富':1,'调剂':2,
    '劳工':2,'工会':2,'劳动者':2,'打工人':2,'员工权益':2,'工人':1,
    '公营':2,'国营':2,'计划经济':3,'配给':2,'统筹':2,'互助':2,'代际互助':3,
    '补贴':2,'财政补贴':3,'政府兜底':3,'公共资源':2,'公共供给':2,
    '安居':1,'公租房':3,'保障房':3,'廉租':3,'济困':3,'扶贫':3,
}
# 强关键词：明确指向经济右（自由市场/私有/去管制/减税/个人努力）
KW_R = {
    '自由市场':3,'市场化':3,'私有化':3,'私有产权':3,'私有':2,'民企':2,'民营':2,
    '减税':3,'降税':3,'低税收':3,'轻税':2,'税赋':1,
    '去管制':3,'放松管制':3,'减少管制':3,'松绑':2,'简政':2,'少干预':2,'不干预':2,'市场决定':3,
    '竞争':2,'自由竞争':3,'市场竞争':2,'优胜劣汰':3,'效率优先':3,'效率':1,
    '企业家':2,'创业':1,'资本':1,'投资':1,'股东':2,'股权激励':3,'分红':1,
    '个人努力':3,'自己奋斗':3,'自力更生':3,'自担':2,'自负盈亏':3,'自定':2,'自定规范':2,
    '用脚投票':3,'用户选择':2,'自愿':1,'自由选择':3,'成年人自己':3,'自己决定':2,
    '付费':1,'付费订阅':2,'增值包':2,'自费':2,'商业化':2,'盈利':1,'市场机制':3,
    '减支':2,'节流':2,'省钱':1,'降本':2,'削减':1,' austerity':0,
    '产权':2,'物业私有':2,'私产':3,
}
# 弱词（仅 +1，降低噪声）
WEAK_L = ['公平','均等','共享','公摊','公费','公办','公有化','公益','共担','共济','扶弱','救急','民生','照顾弱者','帮扶']
WEAK_R = ['自由','灵活','自主','自选','自选','个性化','市场','价格','成本','利润','绩效','激励','绩效','择优','优胜','高效','便利','便利消费','消费者','买方','卖方']

def sem_score(text):
    s=0
    for k,w in KW_L.items():
        if k in text: s-=w
    for k,w in KW_R.items():
        if k in text: s+=w
    for k in WEAK_L:
        if k in text: s-=1
    for k in WEAK_R:
        if k in text: s+=1
    return s

opts=[]
for q in BANK:
    for o in q.get('options',[]):
        tags=[t for t in o.get('tags',[]) if t.startswith('ECO:')]
        if not tags: continue
        # 一个选项可能同时有 ECO:L 和 ECO:R？理论上不应。取实际方向
        eco = tags[0].split(':')[1]
        # 若同选项同时出现 L 和 R，记为冲突型 tag（数据质量）
        both = 'L' in [t.split(':')[1] for t in tags] and 'R' in [t.split(':')[1] for t in tags]
        opts.append({'t':o['t'],'eco':eco,'sem':sem_score(o['t']),'both':both,'qid':q['id']})

# 同选项同时 L+R 的数据质量检查
both_issues=[o for o in opts if o['both']]
print(f"ECO 标注选项总数: {len(opts)}")
print(f"同一选项同时标 ECO:L 与 ECO:R 的(数据质量异常): {len(both_issues)}")

# 语义比对：sem 强负 => 应 L；强正 => 应 R；|sem|<=1 视为中性/模糊不计冲突
conflict_LasR=[]  # tag L 但语义强右
conflict_RasL=[]  # tag R 但语义强左
agree=0; neutral=0
for o in opts:
    if o['both']: continue
    if o['sem']<=-2 and o['eco']=='R': conflict_LasR.append(o)
    elif o['sem']>=2 and o['eco']=='L': conflict_RasL.append(o)
    elif (o['sem']<=-2 and o['eco']=='L') or (o['sem']>=2 and o['eco']=='R'): agree+=1
    else: neutral+=1

print(f"强语义信号选项中：")
print(f"  方向一致(正确): {agree}")
print(f"  中性/模糊(不计): {neutral}")
print(f"  冲突 tag=L 但语义右(应R): {len(conflict_LasR)}")
print(f"  冲突 tag=R 但语义左(应L): {len(conflict_RasL)}")
tot_strong=agree+len(conflict_LasR)+len(conflict_RasL)
if tot_strong:
    print(f"  => 强信号冲突率: {(len(conflict_LasR)+len(conflict_RasL))/tot_strong*100:.1f}%")

print("\n===== 冲突样例：tag=ECO:L 但文字明显偏右(市场化/私有/自由) =====")
for o in sorted(conflict_LasR,key=lambda x:-x['sem'])[:15]:
    print(f"  [sem={o['sem']:+} q{o['qid']}] {o['t'][:60]}")
print("\n===== 冲突样例：tag=ECO:R 但文字明显偏左(再分配/福利/公有) =====")
for o in sorted(conflict_RasL,key=lambda x:x['sem'])[:15]:
    print(f"  [sem={o['sem']:+} q{o['qid']}] {o['t'][:60]}")
