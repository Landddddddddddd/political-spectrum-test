# -*- coding: utf-8 -*-
"""复刻 ideology-test-adaptive.html 的 render2D（默认 ECO x GOV），生成预览 PNG。
仅用于看版式/轴标，非线上代码。"""
from PIL import Image, ImageDraw, ImageFont

S = 460
pad = 52
ox, oy = pad, pad
sz = S - 2 * pad
# 模拟结果：ECO=+0.45（偏右=放任），GOV=-0.30（偏下=分权）
px, py = 0.45, -0.30
mx = ox + (px + 1) / 2 * sz
my = oy + (1 - (py + 1) / 2) * sz

img = Image.new("RGB", (S, S), "#ffffff")
d = ImageDraw.Draw(img)

def font(sz=20, bold=False):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", sz)
    except Exception:
        return ImageFont.load_default()

# 象限背景（四个浅色块，便于辨识两个轴）
d.rectangle([ox, oy, ox + sz / 2, oy + sz / 2], fill="#fdecea")      # 左上：计划+集权
d.rectangle([ox + sz / 2, oy, ox + sz, oy + sz / 2], fill="#e8f0fe")  # 右上：放任+集权
d.rectangle([ox, oy + sz / 2, ox + sz / 2, oy + sz], fill="#fef6e7")  # 左下：计划+分权
d.rectangle([ox + sz / 2, oy + sz / 2, ox + sz, oy + sz], fill="#e9f7ef")  # 右下：放任+分权

# 外框 + 中轴
d.rectangle([ox, oy, ox + sz, oy + sz], outline="#cbd5e1", width=2)
d.line([ox + sz / 2, oy, ox + sz / 2, oy + sz], fill="#94a3b8", width=2)
d.line([ox, oy + sz / 2, ox + sz, oy + sz / 2], fill="#94a3b8", width=2)

# 用户点 + 投影虚线
accent = "#3b6df0"
d.line([mx, my, ox + (px + 1) / 2 * sz, oy + sz / 2], fill=accent, width=1)
d.line([mx, my, ox + sz / 2, my], fill=accent, width=1)
d.ellipse([mx - 9, my - 9, mx + 9, my + 9], fill=accent, outline="#ffffff", width=3)

# 轴标（经典罗盘词）
f = font(20, True)
d.text((ox, oy - 30), "计划", font=f, fill="#1f2933")
d.text((ox + sz, oy - 30), "放任", font=f, fill="#1f2933", anchor="ra")
d.text((ox + sz / 2, oy - 30), "经济 →", font=font(17), fill="#1f2933", anchor="ma")
d.text((ox - 12, oy + 8), "集权", font=f, fill="#1f2933", anchor="ra")
d.text((ox - 12, oy + sz), "分权", font=f, fill="#1f2933", anchor="ra")
d.text((ox - 12, oy + sz / 2), "治理 ↑", font=font(17), fill="#1f2933", anchor="ra")

# 底部提示
d.text((S / 2, S - 16), "默认 2D 罗盘：横轴=经济  纵轴=治理（可在结果页横/纵轴下拉切换其他维度）",
       font=font(12), fill="#6b7785", anchor="ma")

img.save("promo_images/xy_2d_preview.png")
print("saved promo_images/xy_2d_preview.png")
