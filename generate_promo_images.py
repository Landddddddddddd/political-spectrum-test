# -*- coding: utf-8 -*-
import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch

# ---------- chinese font ----------
FONT_PATH = 'C:/Windows/Fonts/msyh.ttc'
font_manager.fontManager.addfont(FONT_PATH)
YAHEI = font_manager.FontProperties(fname=FONT_PATH).get_name()
plt.rcParams['font.family'] = YAHEI
plt.rcParams['axes.unicode_minus'] = False

OUT = r'C:\Users\xiaol\WorkBuddy\2026-08-02-19-46-55\promo_images'
os.makedirs(OUT, exist_ok=True)

# 8 dimensions, neutral "values spectrum" framing (no political hotwords)
DIMS = [
    ('经济', '市场', '平等'),
    ('治理', '秩序', '自由'),
    ('文化', '传统', '进步'),
    ('国家', '民族', '世界'),
    ('环境', '增长', '可持续'),
    ('科技', '审慎', '革新'),
    ('安全', '管控', '开放'),
    ('平权', '差异', '均等'),
]
labels = [f"{d[0]}\n{d[1]} / {d[2]}" for d in DIMS]

# example profile: progressive / socially-minded leaning (0=left pole, 1=right pole)
vals = [0.72, 0.32, 0.80, 0.42, 0.82, 0.62, 0.40, 0.70]

# ================= 1. RADAR =================
angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False).tolist()
vals_c = vals + vals[:1]
ang_c = angles + angles[:1]

fig = plt.figure(figsize=(10, 10), dpi=108)
fig.patch.set_facecolor('#FBF7F0')
ax = plt.subplot(111, polar=True)
ax.set_facecolor('#FBF7F0')
ax.plot(ang_c, vals_c, color='#534AB7', linewidth=3)
ax.fill(ang_c, vals_c, color='#7F77DD', alpha=0.30)
ax.set_xticks(angles)
ax.set_xticklabels(labels, fontsize=19, fontproperties=YAHEI, color='#26215C')
ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
ax.set_yticklabels(['', '0.4', '', '0.8', ''], fontsize=13, color='#888780')
ax.set_ylim(0, 1)
ax.grid(color='#D3D1C7', linewidth=1.1)
ax.spines['polar'].set_color('#D3D1C7')
ax.set_title('你的 8 维价值观光谱', fontsize=34, fontproperties=YAHEI,
             color='#26215C', pad=26)
plt.tight_layout()
plt.savefig(os.path.join(OUT, 'radar.png'), dpi=108, bbox_inches='tight',
            facecolor=fig.get_facecolor())
plt.close()

# ================= 2. DIMS EXPLAIN =================
fig = plt.figure(figsize=(10.8, 14.4), dpi=100)
ax = fig.add_axes([0, 0, 1, 1]); ax.axis('off')
ax.set_xlim(0, 1); ax.set_ylim(0, 1)
ax.add_patch(plt.Rectangle((0, 0), 1, 1, color='#FBF7F0'))
plt.text(0.5, 0.945, '价值观 8 维光谱', fontsize=42, ha='center',
         fontproperties=YAHEI, color='#26215C')
plt.text(0.5, 0.905, '不是非左即右，而是八个维度各自站哪', fontsize=20,
         ha='center', fontproperties=YAHEI, color='#888780')
row_h = 0.088
top = 0.85
for i, (name, l, r) in enumerate(DIMS):
    y = top - i * row_h
    ax.add_patch(FancyBboxPatch((0.07, y - row_h * 0.40), 0.86, row_h * 0.78,
                 boxstyle='round,pad=0.005,rounding_size=0.02',
                 linewidth=1.6, edgecolor='#7F77DD', facecolor='#EEEDFE'))
    plt.text(0.5, y, '· ' + name + ' ·', fontsize=23, ha='center', va='center',
             fontproperties=YAHEI, color='#534AB7')
    plt.text(0.14, y, l, fontsize=21, ha='left', va='center',
             fontproperties=YAHEI, color='#0F6E56')
    plt.text(0.86, y, r, fontsize=21, ha='right', va='center',
             fontproperties=YAHEI, color='#993C1D')
    ax.add_line(plt.Line2D([0.30, 0.45], [y, y], color='#B4B2A9', linewidth=1.3))
    ax.add_line(plt.Line2D([0.55, 0.70], [y, y], color='#B4B2A9', linewidth=1.3))
plt.text(0.5, 0.045, '测完看看你在每一维站在哪一端 →', fontsize=21,
         ha='center', fontproperties=YAHEI, color='#534AB7')
plt.savefig(os.path.join(OUT, 'dims.png'), dpi=100, facecolor=fig.get_facecolor())
plt.close()

# ================= 3. COVER =================
from PIL import Image, ImageDraw, ImageFont
W, H = 1080, 1440
img = Image.new('RGB', (W, H), (243, 238, 255))
# soft vertical gradient overlay
topc = (233, 225, 255)
botc = (251, 247, 240)
grad = Image.new('RGB', (W, H))
for y in range(H):
    t = y / H
    c = tuple(int(topc[k] * (1 - t) + botc[k] * t) for k in range(3))
    grad.paste(c, (0, y, W, y + 1))
img = Image.blend(img, grad, 0.55)
d = ImageDraw.Draw(img)
f_small = ImageFont.truetype(FONT_PATH, 30)
f_tag = ImageFont.truetype(FONT_PATH, 34)
f_big = ImageFont.truetype(FONT_PATH, 78)
f_mid = ImageFont.truetype(FONT_PATH, 40)
f_card = ImageFont.truetype(FONT_PATH, 36)

# top tag pill
d.rounded_rectangle([360, 90, 720, 150], radius=30, fill=(83, 74, 183))
d.text((540, 120), '自我认知 · 趣味测试', font=f_tag, fill=(255, 255, 255), anchor='mm')

# big title
d.text((540, 360), '测完我的', font=f_big, fill=(38, 33, 92), anchor='mm')
d.text((540, 460), '价值观光谱', font=f_big, fill=(38, 33, 92), anchor='mm')
d.text((540, 575), '我直接沉默了…', font=f_big, fill=(212, 83, 126), anchor='mm')

# result card placeholder
cx0, cy0, cx1, cy1 = 140, 720, 940, 1080
d.rounded_rectangle([cx0, cy0, cx1, cy1], radius=28, fill=(255, 255, 255),
                    outline=(127, 119, 221), width=4)
d.text((540, 800), '你的值观光谱结果', font=f_card, fill=(83, 74, 183), anchor='mm')
d.text((540, 870), '经济·平等  治理·自由  文化·进步', font=f_mid, fill=(40, 40, 40), anchor='mm')
d.text((540, 940), '环境·可持续  科技·革新  平权·均等', font=f_mid, fill=(40, 40, 40), anchor='mm')
d.text((540, 1020), '— 8 维一键生成，链接在主页 —', font=f_small, fill=(136, 135, 128), anchor='mm')

# bottom hint
d.text((540, 1300), '链接在主页简介 ↓ 测完来评论区报你的类型', font=f_mid,
       fill=(83, 74, 183), anchor='mm')

img.save(os.path.join(OUT, 'cover.png'))

print('SAVED:', os.listdir(OUT))
