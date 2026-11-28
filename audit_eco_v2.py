# -*- coding: utf-8 -*-
"""ECO tag 语义审计 v2：处理否定语境（不/别/反对/而非… + 关键词 -> 反转符号）。
目的：在 v1 误报后，给出更可靠的「文字立场 vs tag」冲突估计，并人工核对真冲突。
"""
import json, re
BANK = json.load(open('question_bank.json'))

KW_L = ['再分配','公有制','公有','国有','集体所有','共有','全民','公共品','公共资金','福利','低保','普惠',
        '社会保障','社会救济','托底','兜底','累进税','税收调节','加税','富人税','反垄断','限薪','限高','均富',
        '贫富','劳工','工会','劳动者','打工人','员工权益','公营','国营','配给','统筹','互助','代际互助',
        '补贴','财政补贴','政府兜底','公共资源','公共供给','公租房','保障房','廉租','济困','扶贫','平等','公平分配']
KW_R = ['自由市场','市场化','私有化','私有产权','私有','民企','民营','减税','降税','低税收','轻税','去管制',
        '放松管制','减少管制','松绑','简政','少干预','不干预','市场决定','竞争','自由竞争','优胜劣汰','效率优先',
        '企业家','创业','资本','股东','股权激励','分红','个人努力','自己奋斗','自力更生','自负盈亏','用脚投票',
        '自愿','自由选择','付费','付费订阅','增值包','自费','商业化','盈利','市场机制','产权','私产','减支','降本']

NEG = ['不','别','无','没','非','反对','而非','拒绝','抵制','慎','莫','勿','避免','不该','不能','不愿','不是','难以','未必']

def tagged_sign(text, kws):
    """返回该文本对 ECO 的语义倾向：负=左, 正=右；带否定反转。"""
    s=0
    for kw in kws:
        idx = text.find(kw)
        if idx<0: continue
        # 检查 kw 前 4 字内是否有否定词
        pre = text[max(0,idx-4):idx]
        negated = any(n in pre for n in NEG)
        delta = -1 if kw in KW_L else +1
        if negated: delta = -delta
        s += delta
    return s

opts=[]
for q in BANK:
    for o in q.get('options',[]):
        eco=[t for t in o.get('tags',[]) if t.startswith('ECO:')]
        if len(eco)>=2:
            continue  # 混合双标，单独处理
        if not eco: continue
        tag = eco[0].split(':')[1]
        s = tagged_sign(o['t'], KW_L+KW_R)
        opts.append({'t':o['t'],'tag':tag,'s':s,'qid':q['id']})

# 冲突：语义强左(s<=-2)却 tag=R；语义强右(s>=2)却 tag=L
conf=[o for o in opts if (o['s']<=-2 and o['tag']=='R') or (o['s']>=2 and o['tag']=='L')]
agree=[o for o in opts if (o['s']<=-2 and o['tag']=='L') or (o['s']>=2 and o['tag']=='R')]
print(f"单极 ECO 选项: {len(opts)}")
print(f"强信号一致(正确): {len(agree)}")
print(f"强信号冲突(文字与tag相反): {len(conf)}")
if agree or conf:
    print(f"  => 强信号冲突率: {len(conf)/(len(conf)+len(agree))*100:.1f}%")
print("\n===== 真冲突项（人工核对用，全文）=====")
for o in sorted(conf,key=lambda x:abs(x['s']),reverse=True)[:25]:
    print(f"[s={o['s']:+} tag={o['tag']} q{o['qid']}] {o['t']}")
