// 2026-09-05 每日题库扩展：追加 10 题（ID 561-570）
// 英文为源文本（scene_en/t_en 原创撰写），中文为高质量翻译
const fs = require('fs');
const base = 'C:/Users/xiaol/WorkBuddy/2026-08-02-19-46-55/';
const bank = JSON.parse(fs.readFileSync(base + 'question_bank.json', 'utf8'));

const news = [
  // 561 家庭婚姻
  {
    id: 561,
    domain: "家庭婚姻",
    domain_en: "Family and Marriage",
    scene: "米娅和丹尼尔订婚半年后，在一次家宴上，丹尼尔的父母把期望挑明了：按照家族传统，长子夫妇将来要住在父母附近，并成为他们晚年主要的照护者。丹尼尔表示认同，并提醒米娅：他的学费是父母付的，两人公寓的首付里也有父母的积蓄。而米娅在自己热爱的城市里打拼出了一番事业，她想象中的婚姻是两个平等的人自由协商彼此的义务，而不是原封不动地继承一份旧契约。婚期临近，两人必须决定这段婚姻究竟是什么：是一个把整个家族的诉求都吸纳进来的共同体，还是两个个体之间的约定——帮助亲人，凭的是选择与协商，而非默认条款。",
    scene_en: "Mia and Daniel have been engaged for six months when, at a family dinner, Daniel's parents make their expectation explicit: following family tradition, the eldest son and his wife will live near them and eventually become their primary caregivers. Daniel agrees, reminding Mia that his parents paid his tuition and helped with the down payment on the couple's apartment. Mia has built a career she loves in a city two hundred kilometers away, and she imagined a marriage between two equals who renegotiate obligations freely rather than inherit them. As the wedding approaches, the couple must decide what their marriage will be: a union that absorbs the claims of the wider family, or a pact between two individuals who help relatives by choice and negotiation rather than by default.",
    options: [
      {
        t: "我会对米娅说：婚姻从来不只是两个人的契约，它联结的是两个家庭。父母用二十年的心血和积蓄供儿子读书、帮他付首付，晚年换回子女在身边是天经地义。接受这段婚姻，就意味着接受这份亲情带来的义务。搬过去不是妥协，而是守护家庭运转千百年来的方式。",
        t_en: "I would tell Mia that marriage has never been a contract between two people alone; it joins families. Parents who spent twenty years and their savings on their son have earned proximity and care in return, and a spouse who accepts the marriage accepts its debts of gratitude. Moving is not surrender — it is keeping faith with how families have always worked.",
        tags: ["CUL:T", "COL:M"]
      },
      {
        t: "我会对丹尼尔说：没有人一出生就欠下一份既定的人生剧本。对父母的感恩是真的，但如果感恩必须按默认条款履行，那就成了绑架而不是爱。住多近、照顾谁、付出多少，应该由两个人自由商量，而且可以随时重新商量。一段以继承来的剧本开场的婚姻，只会在往后的岁月里积攒无声的怨恨。",
        t_en: "I would tell Daniel that no one is born owing a life plan. Gratitude to parents is real, but gratitude expressed under threat of default is extortion, not love. Every couple must be free to decide — together, and revisably — how close to live, whom to care for, and at what cost. A marriage that begins with an inherited script will breed quiet resentment for decades.",
        tags: ["CUL:P", "COL:I", "GOV:L"]
      },
      {
        t: "我会寻找中间路线：留在我们自己的城市和事业里，但承诺一份具体、不可讨价还价的支持计划——每月固定一笔钱、每晚视频、每月一个周末回去陪伴。义务可以用钱、用陪伴、用规划来履行，不一定非得靠住在一起。重要的是老人真正被照顾到，而不是租约上写着哪个地址。",
        t_en: "I would look for the middle path: stay in our own city and careers, but commit to a concrete, non-negotiable schedule of support — a fixed monthly sum, video calls every evening, and one weekend a month in the parents' home. Duty can be honored in money, presence and planning, not only in proximity. What matters is that the elders are genuinely cared for, not which address appears on the lease.",
        tags: ["CUL:T", "COL:I"]
      },
      {
        t: "我会把问题上移一层：这种撕裂不该由小夫妻独自承受，体面的社会本该分担。我会去推动公共长期照护体系——居家护理员、日间照料中心、喘息服务——让成年子女不必在爱父母和成为全职护工之间二选一，让伴侣之间不必因为养老默认条款而牺牲彼此。",
        t_en: "I would push the question upstream: couples should not be tearing each other apart over care that a decent society would fund. I would campaign for a public long-term-care system — home aides, day centers, respite care — so that adult children can love their parents without having to become their full-time nurses, and spouses can choose each other without defaulting into caregiving.",
        tags: ["ECO:L", "CUL:P"]
      }
    ]
  },
  // 562 动物伦理
  {
    id: 562,
    domain: "动物伦理",
    domain_en: "Animal Ethics",
    scene: "奥卡福博士在研究所动物实验伦理委员会握有决定性一票。一个团队申请用约四千只小鼠和六十只灵长类动物，测试一种针对儿童脑癌的新疗法——这种癌的五年存活率不足两成。该化合物已在类器官和计算机模型中表现良好，但监管机构要求在任何患儿用药之前必须经过活体试验。动物保护人士指出，实验将造成长期痛苦，而现代替代方法已足够可靠。研究人员则反驳说，任何模型都还无法预测一个完整的活体，推迟就意味着本可获救的孩子死去。她必须在数千个有感知的生命与「拯救其中一些孩子的机会」之间做出权衡——那是一个机会，不是确定。",
    scene_en: "Dr. Okafor holds the deciding vote on her institute's animal research board. A team is asking to run experiments on roughly 4,000 mice and 60 primates to test a promising therapy for a childhood brain cancer whose five-year survival rate is below twenty percent. The compound has already performed well in organoids and computer models, but regulators require live trials before any child can receive it. Animal advocates argue the experiments involve prolonged suffering and that modern alternatives are reliable enough to spare the animals. The researchers counter that no model yet predicts a whole living body, and that delaying means children who could have been treated will die. She must weigh thousands of sentient lives against a chance — not a certainty — of saving some of them.",
    options: [
      {
        t: "我会怀着沉重的心情批准这项研究。在模型还无法完全模拟一个活生生的孩子之前，残酷的算术就摆在那里：几千只小鼠和几十只灵长类，对面是五年存活率不到两成的孩子。我们明知故为地制造痛苦，这应该让我们寝食难安——而正因如此，我们更欠这些动物最高标准的福利保障。",
        t_en: "I would approve the research with a heavy heart. Until our models can faithfully mimic a living child, the brutal arithmetic holds: thousands of mice and dozens of primates set against children with a one-in-five chance of seeing their tenth birthday. Suffering we cause deliberately should haunt us, and it is precisely because it haunts us that we owe the animals the strictest humane standards available.",
        tags: ["TECH:K", "ENV:S"]
      },
      {
        t: "我会投反对票。有感知的生命不是实验器材，而「有机会，但不确定」恰恰是科学史上每一次过界行为所用的说辞。类器官、器官芯片和 AI 筛选技术每年都在进步；只要堵死旧捷径，资金和聪明才智就会更快流向替代方案。也许会有孩子在等待中离世——这场悲剧并不能授权我们去折磨其他生灵。",
        t_en: "I would vote no. Sentient beings are not laboratory equipment, and 'a chance, not a certainty' is exactly the reasoning that has justified every excess in the history of science. Organoids, organ-on-chip systems and AI screening keep improving; if we forbid the old shortcut, money and ingenuity will flow into alternatives faster. Some children may die waiting — and that tragedy still does not license us to torture other creatures.",
        tags: ["CUL:P", "TECH:U"]
      },
      {
        t: "我只批准一个大幅缩减的方案：用能得出统计学有效结论的最少动物数量、强制麻醉与人道终点、不打招呼的突击检查，以及一个有权中途叫停研究的独立监督委员会。科学之所以还能保有使用动物的权利，前提是把每只动物都当作需要逐案重新论证其痛苦是否正当的生命，而不是账面上一笔常设的开支。",
        t_en: "I would approve only a sharply reduced protocol: the minimum number of animals that can yield a statistically meaningful answer, mandatory anesthesia and humane endpoints, unannounced inspections, and an independent review empowered to halt the study mid-course. Science keeps its license to use animals only by treating each one as a being whose suffering must be justified anew, case by case — not as a standing budget line.",
        tags: ["GOV:A", "ENV:G"]
      },
      {
        t: "我会先问委员会一个不一样的问题：为什么一种如此罕见的儿童癌症会缺钱缺到要在这里争论四千只动物和六十只灵长类的地步？我会把票和条件绑定：要求设立一个国家资助的替代方法攻关计划，让十年后的委员会不必再面对这种表决。每一只动物都算数，改变制造这种困境的体制同样算数。",
        t_en: "I would ask the board a different question first: why is a childhood cancer this rare so underfunded that 4,000 mice and 60 primates are even being debated? I would tie my vote to demanding a funded national program in alternative methods, so that in ten years no one faces this vote again. Each individual animal counts; so does changing the system that produces the dilemma.",
        tags: ["ECO:L", "TECH:U"]
      }
    ]
  },
  // 563 艺术文化
  {
    id: 563,
    domain: "艺术文化",
    domain_en: "Arts and Culture",
    scene: "作为国家博物馆的理事，你要就馆里最负盛名的展馆投票表决：132 件青铜雕塑与饰板，是十九世纪一次殖民远征中劫掠而来。原属国的代表团已正式提出归还请求，称这些器物是从被焚毁的王宫里撕走的神圣祖先。馆长警告，归还可能让旗舰展厅空置、门票收入下滑，并为数千件其他藏品开启追索先例。桌面上的折中方案提议五年一续的借展、联合修复实验室，以及全部藏品的开放数字档案。你敬重的一位策展人低声说：博物馆的普世使命是真的，可入藏账册上的血也是真的。表决就在明天。",
    scene_en: "As a trustee of the national museum, you must vote on the fate of its most celebrated gallery: 132 bronze sculptures and plaques seized during a nineteenth-century colonial expedition. A delegation from the country of origin has formally requested their return, describing the objects as sacred ancestors ripped from a burned palace. The museum director warns that repatriation could empty the flagship gallery, cut ticket revenue, and open claims on thousands of other objects. A compromise on the table proposes five-year renewable loans, joint conservation labs, and an open digital archive of every object. A curator you respect says quietly that the museum's universal mission is real — but so is the blood on the acquisition ledger. The vote is tomorrow.",
    options: [
      {
        t: "我会投无条件归还一票。博物馆的合法性建立在权属的清白之上，任何文物保护的理由都洗不干净一场焚城掠夺。这些东西从来不是收藏家意义上的「艺术品」，它们是一个族谱的载体，故乡社群的声索权不会因为过了一个世纪就过期。哪怕让展厅空上一年也无妨——就让那份空旷告诉大家帝国拿走了什么。",
        t_en: "I would vote for full, unconditional return. A museum's legitimacy rests on the honesty of its ownership, and no conservation argument can launder a burned palace. These were never 'artworks' in the collectors' sense; they are records of a lineage, and their community's claim does not expire because a century has passed. Keep the gallery empty for a year if needed — let the emptiness teach what empire took.",
        tags: ["CUL:P", "NAT:C"]
      },
      {
        t: "我主张藏品留在原地。无论当年获取的原罪是什么，如今它们属于一座全球性机构：每年六百万观众——其中不少正来自原属国——能在安保完备、恒温恒湿、免费开放的展厅里看到它们。世界性博物馆不是帝国的战利品，而是人类最接近共享殿堂的东西。若按国界把收藏瓜分殆尽，每一块碎片能对话的人只会更少。",
        t_en: "I would vote to keep the collection where it is. Whatever the original sin of acquisition, the objects are now part of a global institution where six million people a year — many from the origin country itself — see them in a secure, climate-controlled, free-to-visit hall. Universal museums are not trophies of empire; they are the closest thing humanity has to shared civic temples. Divide the collection among national borders, and each fragment speaks to fewer people.",
        tags: ["CUL:T", "NAT:N"]
      },
      {
        t: "我会支持「借展+数字档案」的折中方案，并把它做得更实：轮换展出让两地公众都能看到，资助原属国的学生来参与策展与修复，并用两种语言把那段暴力的获取史写在展厅墙上。过去无法被「取消偷窃」，但未来的守护权可以真正共享——这比单方面扣留或单方面归还都走得更远。",
        t_en: "I would back the loan-and-archive compromise, and improve it: rotate the objects so both publics see them, fund students from the origin country to curate and conserve, and write the violent acquisition history onto the gallery wall in both languages. The past cannot be un-stolen, but the future custody can be genuinely shared — which is more than either unilateral keeping or unilateral returning achieves.",
        tags: ["NAT:C", "COL:M"]
      },
      {
        t: "我会按功能拆分处理：代表团指认为祖先之物的——宫廷饰板、纪念头像——立即归还；有据可查、当年确实经交易购得的器物留下。归还是修复，不是一场一刀切的仪式。每件文物离开故土的经过各有各的故事，假装它们共用同一个故事，本身就是另一种轻慢。",
        t_en: "I would split the collection by function: the objects the delegation identifies as ancestral — court plaques, commemorative heads — go home now; documented trade goods purchased at the time stay. Restitution should be repair, not a blanket ritual. Each object has its own story of how it left, and pretending they all share one story is its own kind of disrespect.",
        tags: ["CUL:P", "GOV:L"]
      }
    ]
  },
  // 564 体育竞技
  {
    id: 564,
    domain: "体育竞技",
    domain_en: "Sports and Competition",
    scene: "在国际田径联合会年度大会上，代表们就一项动议展开辩论：禁止昂贵的表现提升科技进入精英赛事——冷冻治疗舱、高原模拟帐篷、个性化碳纤维假肢，以及带能量回弹板的跑鞋。富国的体育项目主张：这些装备合法、安全，只是认真投资运动员的产物；穷国协会则反驳说，领奖台越来越是买来的，而不是拼来的——一个没有赞助商的天才短跑选手，如今正在输掉百分之几秒，也就是整段职业生涯。你握有决定票之一。禁令能让赛场公平，却会冻结创新、惩罚经营有方的项目，且在两百个国家几乎无法执行；放行则保住了对卓越的追求，却把不平等焊死在纪录簿里。",
    scene_en: "At the annual congress of an international athletics federation, delegates debate a motion to ban expensive performance technologies from elite competition — cryotherapy chambers, altitude-simulation tents, personalized carbon-fibre prosthetics, and running shoes with energy-return plates. Wealthy national programs argue the gear is legal, safe and simply the fruit of investing seriously in athletes; poorer federations counter that podiums are increasingly bought rather than earned, and that a sprinter with world-class talent but no sponsor now loses hundredths of a second — entire careers — to equipment budgets. You hold one of the deciding votes. A ban would level the field but freeze innovation, punish well-run programs, and be nearly impossible to enforce across two hundred countries; keeping the technologies open preserves the pursuit of excellence but hardens inequality into the record books.",
    options: [
      {
        t: "我会投票支持禁令。体育与公众的契约是：成绩衡量的是人——训练、勇气、天赋——而不是采购预算。一旦最有钱的协会可以用钱买下那百分之几秒，起跑线本身就是歪的。执行起来会很麻烦，搞创新的会抱怨，这我承认；但公平从来就不图省事。",
        t_en: "I would vote for the ban. Sport's contract with the public is that results measure humans — training, courage, talent — not procurement budgets. Once the richest federation can buy hundredths of a second, the starting line is already crooked. Yes, enforcement will be messy and some innovators will grumble; fairness was never supposed to be convenient.",
        tags: ["ECO:L", "GOV:A"]
      },
      {
        t: "我会投票否决禁令。精英体育从来就没有过公平的赛场——营养、教练、医疗团队样样都要钱，怎么没人提议禁掉这些？装备合法又安全，惩罚那些肯为运动员投入的项目，惩罚的就是卓越本身。穷协会想竞争，出路是拉赞助、建培养体系，而不是把前沿往回拖。",
        t_en: "I would vote the ban down. Elite sport has never been a level field — nutrition, coaching and medical teams all cost money, and no one proposes banning those. The gear is legal and safe; punishing programs that invest in their athletes punishes excellence itself. If a poorer federation wants to compete, the answer is sponsorship and development funds, not dragging the frontier backward.",
        tags: ["ECO:R", "TECH:K"]
      },
      {
        t: "我会动议修改提案：技术保持合法，但对最富有的项目征收一笔小额「技术发展费」，汇入共享装备基金，保证每一位打进决赛的运动员都能用上同代装备。让前沿继续前进——也让每一个凭实力站上跑道的选手，穿着同等水平的鞋站上去。",
        t_en: "I would amend the motion: keep the technologies legal, but levy a small federation-wide technology fee on the richest programs into a pooled equipment fund that guarantees every qualified finalist access to the same generation of gear. Let the frontier advance — and let everyone who earns a lane stand on it with equivalent shoes.",
        tags: ["ECO:L", "NAT:C"]
      },
      {
        t: "我会提议把赛事一分为二：一个开放的「无限制组」，任何安全的技术都放行；一个传统组，对装备设严格上限——就像方程式赛车与古典车赛并存。观众和运动员可以自己选择敬畏哪一种竞技，我们也用不着再假装一份规则能同时裁判人本主义者与工程师。",
        t_en: "I would propose splitting the sport: an open 'unlimited' class where any safe technology goes, and a traditional class with strict equipment caps — like formula racing alongside classic motoring. Fans and athletes can choose which contest deserves their awe, and we stop pretending a single rulebook can referee both the humanists and the engineers.",
        tags: ["TECH:K", "GOV:L"]
      }
    ]
  },
  // 565 老龄化养老
  {
    id: 565,
    domain: "老龄化养老",
    domain_en: "Aging and Elder Care",
    scene: "七十八岁的母亲确诊早期失智症后，三兄妹聚在她家的餐桌旁商量接下来的安排。大哥主张把她送进一家口碑很好的照护机构，全天候有专业人员值守，卖掉老宅支付费用——他称之为「诚实的选择」，因为硬撑着在家照护，迟早以一场危机收场。二姐坚持认为，母亲离开熟悉的一切会衰退得更快，提议兄妹轮流停薪留职在家照护。弟弟建议请住家护理员，让母亲留在自己的房子里，但费用会在四年内耗尽她的养老金和兄妹积蓄的一半。母亲在清醒的时刻只说了一句：她不愿成为负担，也同样不愿消失在「一栋满是陌生人的楼里」。",
    scene_en: "After their 78-year-old mother is diagnosed with early-stage dementia, three siblings gather at her kitchen table to plan what comes next. The eldest wants to move her into a well-reviewed residential facility with round-the-clock staff, selling the family house to cover the fees — 'the honest option,' he calls it, because pretending to manage at home will end in a crisis. The middle sister insists their mother would fade faster among strangers and proposes rotating home care, each sibling taking unpaid leave in shifts. The youngest suggests a live-in aide while keeping their mother in her own house, though the cost would exhaust her pension and half the siblings' combined savings within four years. Their mother, in a lucid moment, says only that she refuses to become a burden — and equally refuses to disappear into 'a building full of strangers.'",
    options: [
      {
        t: "我会选择机构，而且不粉饰这个决定。训练有素的护理员、夜班有人值守、有康复师，而不是儿子凌晨三点狼狈地独自硬撑——专业照护不等于抛弃，撑不住的业余照护才会出事。我常去看她，带着清醒的头脑和充沛的心力，这比睡不好觉地守在隔壁房间更有价值。",
        t_en: "I would choose the facility, and stop dressing it up. Trained staff, awake night shifts, physiotherapists — not a son quietly failing at three in the morning. Professional care is not abandonment; exhausted amateur care is how people get hurt. Visiting often, with a clear head and a full heart, is worth more to her than my poorly slept presence in the next room.",
        tags: ["ECO:R", "COL:I"]
      },
      {
        t: "我会值我的班。母亲用了三十年送我们上学、陪我们进医院、扶我们熬过失恋——家庭里的照护账本本来就不是用现金结清的。轮班居家照护当然苦，累工作、缺睡眠，但她能守着自己的水壶、自己的花园、窗外熟悉的风景——失智症老人在熟悉的生活里，能把「自己」保持得更久。有些债，只能用陪伴来还。",
        t_en: "I would take the shifts. Our mother spent thirty years getting us to school, to hospitals, through heartbreak; the ledger of care in a family is not meant to be settled in cash. Rotating home care is hard on careers and sleep, but she keeps her kettle, her garden, her view — and dementia patients keep their selves longer inside the lives they recognize. Some debts you pay in presence.",
        tags: ["CUL:T", "COL:M"]
      },
      {
        t: "我会选居家请护理员这条路，因为只有它让母亲继续做自己日子里的主人——她自己的门、自己的钥匙、想看的电视自己选。钱就是为这种时候准备的：一生的积蓄是用来买有尊严的最后一章的，不是留作遗产的。剩下的费用我们兄妹按各自能力分摊，并且每半年随着她的病情变化重新商量一次。",
        t_en: "I would back the aide-at-home plan, because it is the only option that keeps her the author of her own days — her door, her keys, her choice of television. The money is for exactly this: a life's savings exist to buy a dignified last chapter, not to bequeath. We siblings share the remaining cost in proportion to what we can each spare, and we revisit the plan every six months as her condition changes.",
        tags: ["GOV:L", "COL:I"]
      },
      {
        t: "我会对兄姐说：我们在这张餐桌上算的这笔账，才是真正的丑闻。这个国家的每个家庭都在私下里带着同样的悲伤重算同一笔账。我要加入全民长期照护保险的倡导运动——用一个公共资金池支付护理员、日间中心和机构费用——让「父母如何被照顾」不再由这个家庭存款的位数来决定。",
        t_en: "I would tell my siblings that our kitchen-table arithmetic is the real scandal. Every family in this country is re-running this same calculation in private grief. I would join the campaign for universal long-term-care insurance — a public pool that pays for aides, day centers and facilities — so that the question of how a parent is cared for stops being decided by the number of digits in the family's savings.",
        tags: ["ECO:L", "COL:M"]
      }
    ]
  },
  // 566 消费债务
  {
    id: 566,
    domain: "消费债务",
    domain_en: "Consumer Debt",
    scene: "你在一家非营利债务咨询中心做咨询师。一位三十四岁的外卖骑手坐在你对面：负债相当于十一个月的收入，摊在四个「先买后付」应用、三张信用卡和一笔年化三位数的发薪日贷款上。其中一部分付了母亲的医药费，还有一些买了一部手机和一台游戏机——他觉得孩子们辛苦一年后理应得到这些。正式的债务减免项目可以勾销一半欠款，但代价是六年无法获得信贷。个人破产申请几乎能清偿全部债务，却有公开记录、背负沉重污名，房东也已开始旁敲侧击。他抬起头问你该怎么办，还小声问了一句：那个不断借钱给他的系统，是不是才该被指责。",
    scene_en: "You are a counselor at a nonprofit debt-advice center. A 34-year-old delivery driver sits across from you with debts equal to eleven months of his income, spread across four 'buy now, pay later' apps, three credit cards, and a payday loan compounding at triple-digit interest. Some of it covered his mother's hospital bills; some bought a phone and a game console he felt his kids deserved after a hard year. A formal debt-relief program would erase half the balance but freeze his access to credit for six years. A personal-insolvency filing would clear almost everything but is publicly recorded, carries heavy stigma, and his landlord has begun asking questions. He looks up and asks what he should do — and, quietly, whether the system that kept offering him credit is the one that should be blamed.",
    options: [
      {
        t: "我会建议他申请个人破产。放贷方早就把他违约的风险算进了三位数的利率里——他们放贷时就预期会有人倒下，并且已经提前为这份风险收了钱。破产法存在的意义，正是让人可以破产而不被摧毁。孩子们需要的是一个还能正常生活的父亲，而不是一份漂亮的信用记录；污名褪去的速度，远比债务磨掉的速度快。",
        t_en: "I would tell him to take the insolvency. The lenders priced his default into those triple-digit rates; they lent expecting some borrowers to break, and were paid for that risk in advance. Insolvency law exists precisely so that a person can be bankrupt without being destroyed. His children need a father with a functioning life more than a clean credit file; the stigma will fade faster than the debt would.",
        tags: ["GOV:L", "ECO:L"]
      },
      {
        t: "我会先和他一起制定还款计划。协议是他亲手签的，承诺就是承诺，哪怕对面是一台写满掠夺性条款的机器。重组债务、把利率谈下来、卖掉游戏机、用五年还清——因为「从债务面前走开」这个习惯一旦养成，代价高过任何利率。债务减免项目可以做桥，但不能是终点。",
        t_en: "I would build him a repayment plan before anything else. He signed those agreements, and a promise is a promise even when the counterparty is a machine with predatory fine print. Restructure, negotiate the interest down, sell the console, and pay it back over five years — because the habit of walking away from debts, once learned, costs more than any interest rate. The relief program can be a bridge, not the destination.",
        tags: ["CUL:T", "ECO:R"]
      },
      {
        t: "我会征得他同意，把他这份档案隐去姓名后送到立法机构。对一个挣最低工资的人放出年化百分之三百的高利贷，不是平等主体之间的合同，而是一台把绝望转化为收益率的机器。他的案子需要的是利率上限、放贷前的偿付能力审查，以及让「先买后付」应用接受和银行同样的监管。一对一的咨询，救不了接下来的一百万份同样的档案。",
        t_en: "I would take his file — with his permission, name removed — to the legislature. A payday loan at three hundred percent interest to a man on minimum wage is not a contract between equals; it is a machine for converting desperation into yield. His case calls for an interest-rate cap, affordability checks before credit is extended, and 'buy now, pay later' apps brought under the same rules as banks. One-on-one advice will not stop the next million files like his.",
        tags: ["GOV:A", "ECO:L"]
      },
      {
        t: "我会推荐中间道路：申请债务减免项目，一半勾销、信用冻结六年——并把冻结重新解释为庇护而不是惩罚。六年不能借贷，也就是六年不能再把坑挖深；剩下的一半，他可以有尊严地按还得起的节奏偿还，让孩子亲眼看到他把欠的钱还完。全额偿还会压垮他，全额破产会给他贴上标签。",
        t_en: "I would recommend the middle road: the debt-relief program — half erased, credit frozen for six years — with the freeze reframed as shelter, not punishment. Six years without borrowing is six years in which he cannot dig the hole deeper, and the surviving half he can service with dignity at a pace that lets his kids watch him finish what he owes. Full repayment would break him; full insolvency would label him.",
        tags: ["ECO:L", "COL:M"]
      }
    ]
  },
  // 567 能源基建
  {
    id: 567,
    domain: "能源基建",
    domain_en: "Energy and Infrastructure",
    scene: "一个快速工业化的沿海地区每逢夏季轮流停电，同时背负着十五年内排放减半的国家指标。能源主管机构召集市民咨询委员会为三个方案排序，你是委员之一。方案 A：一批小型模块化核反应堆——近零碳、全天候，但造价高、审批慢，且十年前一场国外核事故的阴影仍在。方案 B：数吉瓦的风光电站加电网级储能——单位电量最便宜、上马最快，但要占用大量农田与荒漠栖息地，且在漫长的无风阴周里电网照样吃紧。方案 C：扩建现有燃气电厂——快速可靠，但等于锁定几十年的排放和对进口燃料的依赖。委员会的排序分量不轻；而四个月后，停电季就会回来。",
    scene_en: "A rapidly industrializing coastal region faces rolling blackouts each summer and a national mandate to cut emissions in half within fifteen years. The energy authority convenes a citizens' advisory panel, on which you serve, to rank three options. Option A: a fleet of small modular nuclear reactors — near-zero carbon and always-on, but expensive, slow to license, and haunted by a foreign reactor accident a decade ago. Option B: several gigawatts of solar and wind farms plus grid-scale batteries — the cheapest power per unit and quick to build, but consuming farmland and desert habitat, and leaving the region exposed during long windless, overcast weeks. Option C: expand the existing gas-fired plant — fast and dependable, but locking in decades of emissions and dependence on imported fuel. The panel's ranking carries real weight; the blackouts return in four months.",
    options: [
      {
        t: "我会把核反应堆排在第一位。气候的算术不近人情：一个到 2040 年还靠燃气保供的电网，就是一个完不成指标的电网，而电池至今扛不住连绵无风的两周。小型模块化反应堆具有非能动安全性，阻碍它的那种恐惧，本来就是对着上一代电站校准出来的。贵吗？贵。但应对一场紧急状态，哪个严肃的方案不贵？",
        t_en: "I would rank the reactors first. Climate arithmetic is unforgiving: a grid still burning gas for dependability in 2040 is a grid that fails its mandate, and batteries still cannot carry a windless fortnight. Small modular designs are passively safe, and the fear that stalls them was calibrated to an older generation of plants. Expensive? Yes. So is every serious response to an emergency.",
        tags: ["TECH:K", "ENV:G"]
      },
      {
        t: "我会把可再生能源排在第一位，不只是因为便宜。屋顶的光伏、归风机脚下的城镇共同持有的风电份额、每个变电站里的电池：一个去中心化的电网就算出事，也是一小块一小块地坏，而不是一瞬间全灭。是的，租用农地必须谨慎，无风的季节也还得让燃气顶一阵——但电池技术每年都在进步，这座桥每年都在变短。",
        t_en: "I would rank renewables first, and not only for the price. Solar panels on rooftops, wind shares owned by the towns beneath the turbines, batteries in every substation: a decentralized grid fails gracefully, in pieces, instead of catastrophically all at once. Yes, farmland must be leased carefully, and gas must back up the still weeks — but the battery chemistry improves every year, and every year the bridge gets shorter.",
        tags: ["ENV:G", "COL:M"]
      },
      {
        t: "我会把扩建燃气排在第一位，并把不便明说的话说出口：医院、水泵和冷链疫苗不是靠意愿运转的。反应堆十年内拿不到许可，可再生能源眼下还扛不住无风的一周，但燃气轮机能在下个停电季到来之前转起来。排放是笔严肃的债——而所有的债，都得先站稳脚跟再还，而不是在轮流停电里还。",
        t_en: "I would rank gas expansion first and say the quiet part aloud: hospitals, water pumps and cold-chain vaccines do not run on intentions. The reactors will not be licensed for a decade, the renewables cannot yet carry a windless week, but the gas turbines can be spinning before the next blackout season. Emissions are a serious debt — and like all debts, you service it from a position of stability, not from inside a rolling outage.",
        tags: ["ENV:S", "ECO:R"]
      },
      {
        t: "我会把三个选项都排在没人提的第四个选项后面：少用。工业需求响应合同、严苛到不近人情的建筑能效标准、贵到足以改变行为的晚高峰动态电价，加上节能改造的融资支持。最便宜、最快、最干净的每一兆瓦，都是从未被需求的每一兆瓦。发电方式最终躲不开——但一个不肯动自己用电曲线的地区，吵的这些电站将来一座也省不下。",
        t_en: "I would rank all three below the option nobody tabled: use less. Industrial demand-response contracts, brutal efficiency standards for buildings, dynamic pricing that makes the evening peak expensive enough to shift behavior, and financing for retrofits. The cheapest, fastest, cleanest megawatt is the one never demanded. Generation choices are unavoidable in the end — but a region that refuses to touch its consumption curve will need every one of the plants it is arguing about.",
        tags: ["ENV:G", "GOV:A"]
      }
    ]
  },
  // 568 气候灾害
  {
    id: 568,
    domain: "气候灾害",
    domain_en: "Climate Disasters",
    scene: "河畔小镇哈威克七年里被淹了三次，一次比一次损失惨重，中央政府给了它一次性的选择。方案一：加高堤防并建泵站，可保护大多数住宅约四十年，主要由国家拨款，但每户需终身缴纳维护费，还要把一线河滨花园让给混凝土。方案二：自愿收购——政府按灾前估值买下易涝房屋，并资助家庭迁往高处——小镇因此缩水三分之一，两所学校关闭，哈威克延续两百年的河畔社区认同就此终结。镇民大会上，一批年长的居民干脆两个都拒绝，坚称这条河历来有涨有落，搬走的邻居就是散了的邻居。话筒传到你手里，你有一分钟。",
    scene_en: "The river town of Harwick has flooded three times in seven years, each disaster costlier than the last, and the national government has offered a one-time choice. Plan One: a raised levee and pump system protecting most homes for perhaps forty years, funded largely by a national grant, but requiring every household to pay a lifelong maintenance levy and ceding a strip of riverfront gardens to concrete. Plan Two: a voluntary buyout — the state purchases flood-prone homes at pre-disaster value and helps families relocate uphill — shrinking the town by a third, closing two schools, and ending Harwick's two-hundred-year identity as a river community. At the town hall, an older faction simply refuses both, insisting the river has always risen and always fallen, and that neighbors who leave are neighbors lost. You have one minute at the microphone.",
    options: [
      {
        t: "我会发言支持修堤。两百年的小镇史不是可有可无的爱好；它是码头、节庆、祖坟和生计的总和，搬不到山上去。加固堤防昂贵而不完美——四十年也不是永远——但与河流谈判，这座镇子历来靠的就是工程。必要时把河滨花园浇上混凝土也认了；一个交出河岸的镇子，其实已经开始溶解了。",
        t_en: "I would speak for the levee. Two hundred years of town history is not a hobby; it is an inheritance of docks, festivals, graves and livelihoods that cannot be relocated uphill. Fortifying is expensive and imperfect — forty years is not forever — but engineering has always been how this town negotiated with the river. Pave the gardens if we must; a town that surrenders its riverfront has already begun to dissolve.",
        tags: ["TECH:K", "CUL:T"]
      },
      {
        t: "我会发言支持政府收购，尽管说这话很痛。对抗一条正在上涨的河，等于订购一份按期送达的悲伤：交维护费、失去花园，四十年后水照样赢——只是那时已没有补偿。趁现在按灾前估值成交、整建制地搬上山、还住同几条街，是所有结局里唯一能保住「哈威克人」这个整体的方案。社区的定义是邻居，不是洪泛区；选邻居。",
        t_en: "I would speak for the buyout, however much it hurts. Fighting a rising river is a subscription to grief: pay the levy, lose the gardens, and in forty years the water wins anyway — only then without compensation. Taking pre-disaster value now and relocating uphill together — as a town, to the same streets — is the only ending that keeps Harwick's people intact. A community is its neighbors, not its floodplain; choose the neighbors.",
        tags: ["ENV:G", "TECH:U"]
      },
      {
        t: "我会在话筒前把两个方案都拒绝。收购案是拿我们自己的灾难给我们付账；修堤案是抵押我们的花园，买断我们已不再做主的四十年。想卖的人尽管卖；留下的人就像历代农人那样接受这条河——沙袋、诚实的保险、邻居的船。不是每种风险都需要一个国家方案；有些风险，就是住在你祖辈住过的地方的代价。",
        t_en: "I would refuse both plans from the microphone. The buyout pays us with our own tragedy, and the levee mortgages our gardens to buy forty years of a life we no longer own. Let those who want to sell, sell; those who stay accept the water as farmers always have — with sandbags, honest insurance, and neighbors' boats. Not every risk needs a state solution; some are simply the terms of living where your people lived.",
        tags: ["CUL:T", "COL:I"]
      },
      {
        t: "我会用这一分钟换掉问题本身：凭什么像哈威克这样的小镇，要为一堵墙终身交费？制造这些暴雨的排放大多发生在别处、由盈利的产业排出。我会动议：镇里接受修堤——但附带条件，加入洪泛区小镇联盟，要求设立永久的国家级气候补偿基金，资金来自对高碳产业本身征收的附加费。适应的账单，应该寄给造成适应需求的人。",
        t_en: "I would use my minute to change the question: why should a town of Harwick's means pay a lifelong levy for a wall at all? The emissions that loaded these storms were mostly released elsewhere, by industries that profited. I would move that the town accept the levee — on condition of joining a coalition of floodplain towns demanding a permanent national climate-compensation fund, financed by a levy of its own on carbon-intensive industry. Adaptation should be billed to those who caused the adapting.",
        tags: ["ECO:L", "ENV:G"]
      }
    ]
  },
  // 569 数字平台
  {
    id: 569,
    domain: "数字平台",
    domain_en: "Digital Platforms",
    scene: "作为政策顾问，你要为部长写一页纸的建议，关于一项法案：要求所有社交平台在开户前用政府颁发的身份证件核验用户年龄，目的是让未成年人远离成瘾式信息流和猎食者。儿童保护组织支持法案，列举了有据可查的伤害。安全研究者则警告：这将废除所有人的匿名权，让举报人、家暴幸存者和不受欢迎的少数群体暴露于报复之下；而把身份与账号关联的中央数据库一旦建立，泄漏只是时间问题——这类数据库从无例外。平台提出折中方案：隐私保护的年龄验证——用密码学证明用户已成年而不记录其身份——对边缘个案不够精准，但什么都不收集，也就无物可失。表决在两周后；部长只信你的判断。",
    scene_en: "As a policy adviser, you must give your minister a one-page recommendation on a bill requiring every social platform to verify users' ages with government-issued ID before accounts can be opened — the aim: keep minors off addictive feeds and out of predators' reach. Child-safety organizations endorse it, citing documented harm. Security researchers warn it abolishes anonymity for everyone, exposing whistleblowers, abuse survivors and unpopular minorities to retaliation, and that a central database linking identities to accounts will eventually leak, as such databases always have. The platforms counter-propose privacy-preserving age verification — cryptography that proves a user is an adult without recording who they are — imperfect for edge cases, but collecting nothing that can be stolen or subpoenaed. The vote is in two weeks; the minister trusts your judgment.",
    options: [
      {
        t: "我会建议支持该法案。匿名是一种舒适，孩子的安全才是利害攸关。最需要躲在未验证账号后面的那些人——骚扰者、猎食者、敲诈者——恰恰是这块面具最不该保护的人。数据库的风险是待解决的工程问题，而「国家可能滥用」这种论证，一旦同样套用到我们早已信任的其他登记系统上，就不攻自破。",
        t_en: "I would recommend supporting the bill. Anonymity is a comfort; a child's safety is a stake. The people who most need to hide behind unverified accounts — harassers, predators, blackmailers — are precisely the ones the mask serves worst to protect us from. The database risks are engineering problems to be managed, and 'the state might misuse it' is an argument that dissolves the moment it is applied to every other registry we already trust with far more.",
        tags: ["SEC:E", "GOV:A"]
      },
      {
        t: "我会建议明确反对。举报人、敌意家庭屋顶下的异见少年、互相辨认的受虐幸存者、暴露即危险的少数群体——对他们而言，匿名不是舒适，而是活命的基础设施。而且把每个公民映射到每个账号的单一数据库，不是可以「缓解」的风险，而是抽屉里上膛的武器，等着一届意图更坏的政府。对孩子的伤害有些是真的；但没有哪一条，足以成为造这个抽屉的理由。",
        t_en: "I would recommend opposing it flatly. Whistleblowers, dissident teenagers under hostile roofs, abuse survivors finding each other, minorities for whom visibility means danger — for all of them, anonymity is not comfort but survival infrastructure. And a single database mapping every citizen to every account is not a risk to be mitigated; it is a loaded weapon in a drawer, waiting for a future government with worse intentions. Some harms to children are real; none of them justifies building that drawer.",
        tags: ["SEC:F", "GOV:L"]
      },
      {
        t: "我会建议把平台方的反提案写进法律：强制采用隐私保护的年龄验证——用密码学证明「已成年」而不存储身份——并资助一个独立审计机构为各方案认证。当然会有边缘个案漏网，青少年年龄估计也不完美；那就定好责任、逐步迭代。但设计原则必须守住：国家应当能核实「关于我们的事实」，而不是就此为我们建档。",
        t_en: "I would recommend writing the platforms' counter-proposal into law: mandate privacy-preserving age verification — cryptographic proofs that establish adulthood without storing identity — and fund an independent audit body to certify the schemes. Edge cases will slip through, and estimating teenagers' ages is imperfect; set liability and iterate. But the design principle holds: the state should be able to verify facts about us without compiling files on us.",
        tags: ["TECH:K", "SEC:F"]
      },
      {
        t: "我会建议把三种方案全部否掉，把责任移交给平台和家长：法律强制「儿童安全默认设置」——未成年人不得使用算法推荐流、单次使用时长硬性封顶、提供真正可用的家长控制——并让平台为违规担责，就像车企必须为安全带担责那样。查身份证把孩子当成国家的筛查问题；而真正危害他们的成瘾机器是产品设计的选择，产品设计的选择就该在设计环节被监管。",
        t_en: "I would reject all three framings and move the duty onto platforms and parents: legally mandated kid-safe defaults — no algorithmic feeds for minors, hard caps on session length, real parental controls — with platforms liable for violations, the way carmakers are liable for seatbelts. ID checks treat children as a state-screening problem; the addiction machinery that endangers them is a product-design choice, and product-design choices should be regulated at the point of design.",
        tags: ["GOV:A", "COL:I"]
      }
    ]
  },
  // 570 少数群体
  {
    id: 570,
    domain: "少数群体",
    domain_en: "Minority Groups",
    scene: "在某个山区省份，仍会说维利语的不足八千人，且大多年过五十。地区教育部门提议在本地小学开设可选的双语班：半天国语、半天维利语，由最后一代流利使用者执教，作为试点资助四年。支持者称之为这门千年语言最后的现实机会——连同织在其中的认同、歌谣与亲属称谓。反对者——包括一些说维利语的家长——则认为，课时是稀缺资源，花在维利语上就是从英语和国语里扣走的，那才是改变命运的通行证；文化传承的学费，不该由这个社区的孩子们来交。你是一个一年级孩子的家长，报名会就在今晚。",
    scene_en: "In a mountain province, fewer than eight thousand people still speak Vellish, most of them over fifty. The regional education authority proposes an optional bilingual track at the local primary school: half the day in the national language, half in Vellish, taught by the last generation of fluent teachers, subsidized as a four-year pilot. Supporters call it the last realistic chance for a thousand-year-old language and the identity, songs and kinship terms woven into it. Opponents — including some Vellish-speaking parents — argue that classroom hours are hours not spent on English and the national language, the real currencies of mobility, and that the community's children should not pay the tuition for cultural preservation. You are the parent of a first-grader; the enrollment meeting is tonight.",
    options: [
      {
        t: "我会给孩子报名，并在会上发言支持。语言不是一门课，而是一种切分世界的方式——亲属称谓、天气、幽默、上千首歌——语言死去时，那座档案馆会一起烧掉。英语孩子任何下午都能从屏幕里学到；维利语却只能从最后一批用它做梦的人身上「接住」。对她未来的孙辈而言，一年用维利语度过的课间，比任何一次考试的分数都值钱。",
        t_en: "I would enroll my child and speak for the track. A language is not a school subject; it is a way of parsing the world — kinship, weather, humor, a thousand songs — and when it dies, the archive burns with it. My child can learn English from a screen any afternoon; Vellish can only be caught from the last people who dream in it. A year of playgrounds in Vellish is worth more to her grandchildren than any exam score.",
        tags: ["CUL:T", "COL:M"]
      },
      {
        t: "我会让孩子留在普通班——怀着敬意，但不道歉。祖母的语言在我心里是爱，歌谣我会在家里传下去——但课时是孩子手里最稀缺的资源，我不会把它花在一种只剩八千位老人使用的语言上。评判她那一代的，将是工作与科学的语言；父母的职责是递给她仍然锋利的工具，而不是让她背负传家宝。",
        t_en: "I would keep my child in the standard track — with respect, and without apology. My grandmother's language lives in me as love, and I will pass on the songs at home; but school hours are the scarcest resource my child owns, and I will not spend them on a language with eight thousand aging speakers. Her generation will be judged by the languages of work and science, and a parent's job is to hand her tools that still cut, not heirlooms to carry.",
        tags: ["COL:I", "ECO:R"]
      },
      {
        t: "我会支持这个双语班，并且推得更远——把它变成常设项目，按其他科目同等标准拨款，并培训年轻流利使用者、付给他们真正的薪水。一个随最后一代教师一同到期的四年试点不是保护，是一场带预算的告别仪式。如果国家把维利语定为区域官方语言，学校、法院和诊所就都必须说它——活下去的关键是被需要，而不是被记得。",
        t_en: "I would support the track and push it further — make it permanent, funded like any other subject, with teacher training that pays young fluent speakers a real salary. A four-year pilot that expires with the last teachers is not preservation; it is a farewell ceremony with a budget line. If the state recognized Vellish as an official regional language, schools, courts and clinics would have to speak it too — and survival means being needed, not merely remembered.",
        tags: ["ECO:L", "GOV:A"]
      },
      {
        t: "我会提议改办周末社区学堂：由流利的长辈在周六教歌谣、讲故事、练会话，发一份适度津贴，正常课时则保持不动。文化传承应该由背负文化的人自己选择，由社群与支持者出资，绝不该强加进七岁孩子的课程表。如果孩子们因为快乐而来，这门语言就有机会；如果他们因为被迫而来，它其实已经死了。",
        t_en: "I would propose weekend community schools instead: fluent elders teaching songs, storytelling and conversation on Saturdays for a modest stipend, with the school day left intact. Preservation should be chosen by those who carry the culture, funded by the community and its allies, and never imposed through the timetable of seven-year-olds. If the children come because it is joyful, the language has a chance; if they come because it is compulsory, it is already dying.",
        tags: ["GOV:L", "COL:M"]
      }
    ]
  }
];

// 校验
const LEGAL = new Set(["ECO:L","ECO:R","GOV:A","GOV:L","CUL:T","CUL:P","NAT:N","NAT:C","ENV:G","ENV:S","TECH:K","TECH:U","SEC:E","SEC:F","COL:I","COL:M"]);
const maxId = Math.max(...bank.map(q => q.id));
if (maxId !== 560 || bank.length !== 560) { console.error('前置校验失败: count=' + bank.length + ' maxId=' + maxId); process.exit(1); }
for (const q of news) {
  if (!q.scene_en || q.scene_en.split(/\s+/).length < 90) { console.error('scene_en 过短: ' + q.id); process.exit(1); }
  for (const o of q.options) {
    for (const t of o.tags) if (!LEGAL.has(t)) { console.error('非法标签: ' + t + ' @Q' + q.id); process.exit(1); }
    if (!o.t_en || o.t_en.split(/\s+/).length < 40) { console.error('t_en 过短: ' + q.id); process.exit(1); }
  }
}
bank.push(...news);
fs.writeFileSync(base + 'question_bank.json', JSON.stringify(bank, null, 2), 'utf8');
console.log('追加完成，新总数:', bank.length, '最大ID:', Math.max(...bank.map(q => q.id)));
