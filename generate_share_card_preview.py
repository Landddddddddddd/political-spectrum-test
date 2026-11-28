# -*- coding: utf-8 -*-
"""生成「生成分享图」卡片的设计预览（模拟数据），与 ideology-test-adaptive.html 中
downloadCard() 的 canvas 版式一致。仅用于先看效果，不代表任何真实测试结果。"""
import math, os
from PIL import Image, ImageDraw, ImageFont

FONT_DIR = "C:/Windows/Fonts"
def f(size, bold=False):
    name = "msyhbd.ttc" if bold else "msyh.ttc"
    try:
        return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except Exception:
        return ImageFont.truetype(os.path.join(FONT_DIR, "msyh.ttc"), size)

W, H = 1080, 1440
BLUE = (59, 109, 240)
DARK = (31, 41, 51)
MUTE = (107, 119, 133)
GREY = (148, 163, 184)
GRID = (226, 232, 240)
AXIS = (203, 213, 225)

img = Image.new("RGBA", (W, H), (255, 255, 255, 255))
d = ImageDraw.Draw(img)

# 顶部蓝条
d.rectangle([0, 0, W, 14], fill=BLUE)

# 标题 + 签名 + 家族徽标
d.text((48, 60), "我的价值观光谱画像", font=f(42, True), fill=DARK)
sig = "LLPNSEKI"
d.text((48, 100), "签名 " + sig, font=f(20), fill=BLUE)
d.text((W - 48, 100), "· 自由左派", font=f(15, True), fill=BLUE, anchor="ra")

# 主阵营
d.text((48, 156), "社会民主主义", font=f(46, True), fill=BLUE)
desc = "强调通过民主制度与再分配实现经济平等，同时坚持公民自由与多元价值；在市场与社会保护之间寻求平衡。"
# 简单换行
def wrap(text, font, maxw):
    lines, cur = [], ""
    for ch in text:
        if d.textlength(cur + ch, font=font) > maxw:
            lines.append(cur); cur = ch
        else:
            cur += ch
    if cur: lines.append(cur)
    return lines
yl = 214
for ln in wrap(desc, f(17), W - 96):
    d.text((48, yl), ln, font=f(17), fill=DARK); yl += 26

# ===== 雷达 =====
cx, cy, R = W // 2, yl + 40 + 330, 270
labels = ["经济", "治理", "文化", "国际", "生态", "技术监控", "世俗信仰", "个人集体"]
vals = [-0.4, 0.2, 0.7, -0.3, 0.5, -0.2, 0.1, -0.3]  # dimPos 模拟值
n = 8
# 网格环
for ring in range(1, 5):
    rr = R * ring / 4
    pts = [(cx + rr * math.cos(-math.pi/2 + i * 2*math.pi/n),
            cy + rr * math.sin(-math.pi/2 + i * 2*math.pi/n)) for i in range(n + 1)]
    d.polygon(pts, outline=GRID)
# 轴线 + 标签
for i in range(n):
    a = -math.pi/2 + i * 2*math.pi/n
    px, py = cx + R*math.cos(a), cy + R*math.sin(a)
    d.line([cx, cy, px, py], fill=AXIS)
    lx, ly = cx + (R + 32)*math.cos(a), cy + (R + 32)*math.sin(a)
    d.text((lx, ly), labels[i], font=f(16, True), fill=DARK, anchor="mm")
# 数据多边形
dpts = []
for i in range(n):
    a = -math.pi/2 + i * 2*math.pi/n
    v = (vals[i] + 1) / 2
    rr = R * max(0.0, min(1.0, v))
    dpts.append((cx + rr*math.cos(a), cy + rr*math.sin(a)))
d.polygon(dpts, fill=(59, 109, 240, 56), outline=BLUE)
for p in dpts:
    d.ellipse([p[0]-4, p[1]-4, p[0]+4, p[1]+4], fill=BLUE)

# ===== 匹配阵营 =====
yl = cy + R + 56
d.text((48, yl), "匹配度最高的阵营", font=f(20, True), fill=BLUE); yl += 34
top = [("社会民主主义", "★", "92%"), ("社会自由主义", "", "+38"), ("进步主义", "", "+21"),
       ("绿色政治", "", "+14"), ("自由主义", "", "+9")]
for name, star, sc in top:
    txt = (star + " " if star else "") + name + "  （" + sc + "）"
    d.text((48, yl), txt, font=f(17, star != ""), fill=BLUE if star else DARK); yl += 32

# 页脚
d.text((48, H - 44), "8 维自我认知测试 · 教育用途", font=f(14), fill=GREY)
d.text((48, H - 22), "landddddddddddd.github.io/political-spectrum-test", font=f(14), fill=BLUE)

out = "C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/promo_images/share_card_preview.png"
img.convert("RGB").save(out)
print("saved:", out)
