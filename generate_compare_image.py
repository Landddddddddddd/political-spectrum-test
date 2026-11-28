# -*- coding: utf-8 -*-
import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

FONT_PATH = 'C:/Windows/Fonts/msyh.ttc'
font_manager.fontManager.addfont(FONT_PATH)
YAHEI = font_manager.FontProperties(fname=FONT_PATH).get_name()
plt.rcParams['font.family'] = YAHEI
plt.rcParams['axes.unicode_minus'] = False

OUT = r'C:\Users\xiaol\WorkBuddy\2026-08-02-19-46-55\promo_images'
os.makedirs(OUT, exist_ok=True)

DIMS = [('经济', '市场', '平等'), ('治理', '秩序', '自由'), ('文化', '传统', '进步'),
        ('国家', '民族', '世界'), ('环境', '增长', '可持续'), ('科技', '审慎', '革新'),
        ('安全', '管控', '开放'), ('平权', '差异', '均等')]
labels = [d[0] for d in DIMS]

# example: you (progressive/equal) vs friend (market/order/trad)
user = [0.72, 0.32, 0.80, 0.42, 0.82, 0.62, 0.40, 0.70]
friend = [0.35, 0.66, 0.40, 0.62, 0.45, 0.45, 0.66, 0.38]

angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()


def close(v):
    return v + v[:1]


auc, afc, angc = close(user), close(friend), angles + angles[:1]

fig = plt.figure(figsize=(10.8, 14.4), dpi=100)
fig.patch.set_facecolor('#FBF7F0')

fig.text(0.5, 0.955, '和闺蜜测了同一个价值观光谱', fontsize=36, ha='center',
         fontproperties=YAHEI, color='#26215C')
fig.text(0.5, 0.912, '结果截然相反', fontsize=32, ha='center',
         fontproperties=YAHEI, color='#D4537E')

ax = fig.add_axes([0.06, 0.40, 0.88, 0.45], polar=True)
ax.set_facecolor('#FBF7F0')
ax.plot(angc, auc, color='#534AB7', lw=2.6)
ax.fill(angc, auc, color='#7F77DD', alpha=0.25)
ax.plot(angc, afc, color='#D4537E', lw=2.6)
ax.fill(angc, afc, color='#ED93B1', alpha=0.20)
ax.set_xticks(angles)
ax.set_xticklabels(labels, fontsize=18, fontproperties=YAHEI, color='#26215C')
ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
ax.set_yticklabels(['', '0.4', '', '0.8', ''], fontsize=12, color='#888780')
ax.set_ylim(0, 1)
ax.grid(color='#D3D1C7', lw=1.1)
ax.spines['polar'].set_color('#D3D1C7')
ax.legend(['你', '朋友'], loc='upper right', fontsize=18, frameon=False)

# bottom: top-3 divergent dimensions
diff = [u - f for u, f in zip(user, friend)]
order = sorted(range(8), key=lambda i: -abs(diff[i]))[:3]
ax2 = fig.add_axes([0, 0, 1, 0.34]); ax2.axis('off')
ax2.set_xlim(0, 1); ax2.set_ylim(0, 1)
ax2.add_patch(plt.Rectangle((0, 0), 1, 1, color='#FBF7F0'))
ax2.text(0.5, 0.92, '分歧最大的 3 维', fontsize=26, ha='center',
         fontproperties=YAHEI, color='#534AB7')
y = 0.78
for i in order:
    name, l, r = DIMS[i]
    u_pole = r if user[i] > 0.5 else l
    f_pole = r if friend[i] > 0.5 else l
    cu = '#0F6E56' if user[i] < 0.5 else '#993C1D'
    cf = '#0F6E56' if friend[i] < 0.5 else '#993C1D'
    ax2.text(0.12, y, '· ' + name + '：', fontsize=21, ha='left', va='center',
             fontproperties=YAHEI, color='#26215C')
    ax2.text(0.42, y, '你 ' + u_pole, fontsize=21, ha='left', va='center',
             fontproperties=YAHEI, color=cu)
    ax2.text(0.68, y, '朋友 ' + f_pole, fontsize=21, ha='left', va='center',
             fontproperties=YAHEI, color=cf)
    y -= 0.18
ax2.text(0.5, 0.06, '测完拉朋友一起对线，太好玩了 →', fontsize=20, ha='center',
         fontproperties=YAHEI, color='#888780')

plt.savefig(os.path.join(OUT, 'compare.png'), dpi=100, facecolor=fig.get_facecolor())
plt.close()
print('SAVED compare.png')
