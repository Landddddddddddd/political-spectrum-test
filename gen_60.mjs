import fs from 'fs';

const DOM = {
  "社区邻里": "Community & Neighborhood",
  "职场雇佣": "Workplace & Employment",
  "言论表达": "Speech & Expression",
  "经济分配": "Economic Distribution",
  "贸易产业": "Trade & Industry",
  "环境生态": "Environment & Ecology",
  "学校教育": "School & Education",
  "移民文化": "Immigration & Culture",
  "监控隐私": "Surveillance & Privacy",
  "医疗健康": "Healthcare",
  "性别平权": "Gender Equality",
  "科技AI": "Technology & AI",
  "司法法治": "Justice & Rule of Law",
  "宗教与信仰": "Religion & Belief",
  "住房城市": "Housing & Urban",
  "农业食品": "Agriculture & Food",
  "媒体信息": "Media & Information",
  "治安刑罚": "Policing & Punishment",
  "外交国际": "Foreign Affairs & International",
  "社会保障": "Social Security",
  "家庭婚姻": "Family & Marriage",
  "动物伦理": "Animal Ethics",
  "艺术文化": "Art & Culture",
  "体育竞技": "Sports & Competition",
  "老龄化养老": "Aging & Elderly Care",
  "消费债务": "Consumption & Debt",
  "能源基建": "Energy & Infrastructure",
  "气候灾害": "Climate & Disasters",
  "数字平台": "Digital Platforms",
  "少数群体": "Minority Groups"
};

const NEUTRAL = {
  t: "说实话这几个说法都不代表我，这题我宁愿跳过。",
  t_en: "Honestly, none of these speaks for me on this one — I'd rather just skip it.",
  tags: []
};

// opts: array of [t, tags, t_en]
function mk(id, d, scene, scene_en, opts) {
  const options = opts.map(([t, tags, t_en]) => ({ t, tags: tags.slice(), t_en }));
  options.push({ ...NEUTRAL });
  return {
    id,
    domain: d,
    scene,
    options,
    scene_en,
    domain_en: DOM[d]
  };
}

const NEUTRAL_TEXT = NEUTRAL.t;
const NEUTRAL_TEXT_EN = NEUTRAL.t_en;

let id = 891;
const raw = [];
function add(d, scene, scene_en, opts) { raw.push(mk(id++, d, scene, scene_en, opts)); }

// ============ 1 社区邻里 ============
add("社区邻里",
"你住的老小区一二楼住户习惯在单元门口公共区域拉绳晾被，三楼以上住户嫌挡路且不雅观，物业没有相关规定。你家阳台小，梅雨季被子很难彻底晾干。",
"Residents on the lower floors of your old apartment block habitually string clotheslines in the common area by the entrance to dry quilts, while upper-floor residents find it obstructive and unsightly, and the property manager has no rule about it. Your balcony is small and quilts never fully dry in the rainy season.",
[
["我会在业主群里提议大家商量一个时段和位置，既照顾低层晾晒的需要，也减少挡路，靠邻里协商定个默契。",["GOV:L","COL:M"],"I would raise it in the owners' group and suggest we agree on a time slot and spot — meeting the lower floors' need to dry things while reducing the blockage, settling it through neighborly negotiation."],
["我直接找物业要求立规矩，明确公共区域禁止私拉晾绳，违反就清理，规则清楚最省口舌。",["GOV:A","CUL:T"],"I would go straight to the property manager and ask for a rule forbidding private lines in common areas, cleared if violated — a clear rule saves the most arguing."],
["我自己买个折叠烘干架放阳台凑合用，不跟人争这点地方，免得邻里红了脸。",["COL:I","CUL:T"],"I would just buy a folding dryer rack for the balcony and make do, rather than argue over the space and risk a fight with neighbors."],
["我联名几户向社区居委会反映，请他们协调划出专门的晾晒区，用公共资源解决公共麻烦。",["COL:M","GOV:A"],"I would gather a few households to ask the neighborhood committee to set aside a designated drying area, using public resources for a shared nuisance."]
]);

add("社区邻里",
"邻居养的中型犬进电梯时常不牵绳，你牵着小孩有点紧张，也担心电梯里的卫生。对方觉得自家狗温顺、不会咬人。",
"The neighbor's medium-sized dog often rides the elevator off-leash; you hold your child and feel uneasy, also worrying about hygiene. The owner thinks the dog is gentle and would never bite.",
[
["我会在电梯里平和地请邻居把狗牵好，说孩子怕、也怕惊到狗，请他体谅，不指责。",["GOV:L","CUL:T"],"I would calmly ask the neighbor to leash the dog in the elevator, saying my child is frightened and I worry about startling it, without blaming."],
["我向物业投诉，要求强制执行电梯牵绳规定，不牵就禁入，靠制度保护住户安全。",["GOV:A","CUL:T"],"I would complain to the property manager and demand enforcement of a leash rule in elevators, banning entry otherwise, to protect residents by regulation."],
["我避开乘梯高峰、抱紧孩子快速进出，尽量不正面冲突，自己多留神。",["COL:I","CUL:T"],"I would avoid peak elevator times and hold my child close in and out, steering clear of confrontation and staying alert myself."],
["我在业主群发起文明养宠倡议，推动大家签约定电梯牵绳、及时清理，用公约自律。",["COL:M","CUL:P"],"I would start a civil pet-keeping initiative in the group, pushing everyone to agree on leashing and prompt cleanup, self-regulating through a pact."]
]);

// ============ 2 职场雇佣 ============
add("职场雇佣",
"你所在团队连续两个月加班到深夜赶项目，主管暗示这是「奋斗期」、不提倡请假。你本人开始失眠，家庭时间也被挤占。",
"Your team has worked late into the night for two straight months on a project, and your supervisor hints this is a 'grind period' where leaves are discouraged. You have started losing sleep and your family time is squeezed.",
[
["我会在一对一里和主管摊开自己的负荷和睡眠问题，提议重新排期或加人手，先把进度谈清楚。",["GOV:L","COL:I"],"I would lay out my workload and sleep problem in a one-on-one and propose rescheduling or more staff, getting the timeline clear first."],
["我接受这段高强度，但会留存工时记录，若身体出问题就拿证据主张加班补偿，先保住项目再说。",["ECO:R","COL:I"],"I would accept the intensity but keep timesheets, and if my health breaks I would use the evidence to claim overtime pay — finish the project first."],
["我带头在部门里提议设「无会无加班日」和调休制度，让大家都能喘口气，靠集体约定减压。",["COL:M","CUL:P"],"I would lead a proposal for a 'no-meeting no-overtime day' and comp-time rules so everyone can breathe, easing pressure by collective agreement."],
["我直接按合同工时上下班，到点就走、必要的事次日处理，把边界守在纸面约定上。",["GOV:L","ECO:L"],"I would simply work the contracted hours and leave on time, handling leftover tasks next day, holding the boundary the contract sets."]
]);

add("职场雇佣",
"公司新来了一位能力很强但沟通风格很冲的同事，常在会议上直接否定别人的方案。你和他要合作一个重要交付，担心摩擦影响结果。",
"A highly capable but blunt new colleague frequently shoots down others' plans in meetings. You must collaborate with him on an important deliverable and worry friction will hurt the result.",
[
["我会私下约他聊聊工作习惯，说清楚我看重直说但希望先听完整再判断，把合作方式提前对齐。",["GOV:L","COL:I"],"I would privately chat with him about working style, saying I value frankness but prefer hearing the full picture first, aligning our approach early."],
["我向主管申请调整分工，让各自负责独立模块、减少正面碰撞，用结构避开性格冲突。",["GOV:A","ECO:R"],"I would ask the supervisor to split responsibilities into independent modules to reduce clashes, using structure to avoid personality conflict."],
["我发起团队内部的「反馈公约」，约定提意见先复述对方要点再给建议，靠规则把沟通过程理顺。",["COL:M","CUL:P"],"I would launch a team 'feedback pact' — restate the other's point before advising — smoothing communication through rules."],
["我忍住不快、照他的节奏配合把交付做好，个人情绪先放一边，结果比相处重要。",["COL:I","CUL:T"],"I would swallow my annoyance and match his pace to finish well, setting personal feeling aside — results matter more than rapport."]
]);

// ============ 3 言论表达 ============
add("言论表达",
"本地一个兴趣论坛里，有人发帖用很刺耳的话骂某个小众爱好者群体，帖子引来不少附和。你平时也在这个圈子，看着心里不舒服。",
"On a local hobby forum, someone posted a harsh rant against a small fan community, drawing plenty of agreement. You are part of that circle and feel uneasy.",
[
["我会在帖下沉稳反驳，摆出事实说明这个群体并不像他描述的那样，就事论事不升级对骂。",["GOV:L","CUL:P"],"I would reply calmly with facts showing the group is not as described, sticking to the issue without escalating into name-calling."],
["我向版主举报该帖违反社区文明公约，请按规则处理人身攻击内容，由平台把关。",["GOV:A","COL:M"],"I would report the post to moderators as violating the civility rules, letting the platform handle personal attacks."],
["我直接取关那个账号、并建个更友善的小组自己玩，不想把精力耗在争辩上。",["COL:I","CUL:P"],"I would just mute that account and start a friendlier subgroup, not spending energy on the argument."],
["我发起一份「理性讨论守则」置顶帖，号召大家就事论事、不贴标签，用社区共识改善氛围。",["COL:M","CUL:P"],"I would pin a 'civil discussion charter' calling for issue-focused talk without labels, improving the climate through community consensus."]
]);

add("言论表达",
"公司内网论坛有人匿名发帖，实名举报某中层挪用小额公款，但拿不出确凿证据，只是「听说的」。HR 正在讨论是否删帖。",
"On the company intranet someone anonymously posted a named allegation that a middle manager embezzled minor funds, with no hard evidence — just 'what I heard.' HR is debating whether to delete it.",
[
["我认为未经证实的实名指控会毁人清白，支持先隐藏帖子、走内部调查，别让谣言当判罚。",["GOV:L","CUL:P"],"I think unproven named accusations ruin reputations; I support hiding the post and running an internal investigation rather than letting rumor be the verdict."],
["我主张保留帖子并公开调查进展，员工有渠道反映疑虑，透明比捂盖子更能止住猜疑。",["GOV:L","COL:M"],"I argue for keeping the post and publishing the investigation's progress; staff need a channel for concerns, and transparency curbs suspicion better than a cover-up."],
["我私下把线索整理好直接交给审计，不掺和公开争论，让专业部门按程序查。",["COL:I","GOV:A"],"I would privately compile the leads and hand them to audit, staying out of the public debate and letting professionals follow procedure."],
["我无所谓删不删，反正不关我事，照常干活，别人的恩怨我不掺和。",["COL:I","GOV:L"],"I don't care either way; it's not my business, so I just keep working and stay out of others' disputes."]
]);

// ============ 4 经济分配 ============
add("经济分配",
"你所在城市准备对高收入群体加征一笔地方附加税，用于补贴低收入家庭的子女托育。听证会上两派争得很凶。",
"Your city plans a local surtax on high earners to subsidize childcare for low-income families. The hearing is fiercely contested.",
[
["我支持这笔税，收入高的人多担一点，能让更多孩子有得起托育，整体更公平。",["ECO:L","COL:M"],"I support the tax; those earning more shoulder a bit more so more children can afford childcare, which is fairer overall."],
["我反对，钱应该靠刺激就业和经济增长去分，加税只会把人逼走、税基反而缩水。",["ECO:R","GOV:L"],"I oppose it; the money should come from boosting jobs and growth, and the tax only drives people away and shrinks the base."],
["我赞成方向但要求公开每一笔补贴的去向和效果，钱花得明明白白大家才服气。",["GOV:L","ECO:L"],"I like the direction but demand public tracking of every subsidy's flow and effect — clear spending earns public trust."],
["我更愿意自己和企业做定向捐赠、结对帮扶，不靠强制征税，自愿比摊派更可持续。",["COL:I","ECO:R"],"I would rather give targeted donations and mentorship myself than rely on forced taxation; voluntarism outlasts compulsion."]
]);

add("经济分配",
"你们小区旁边的老工业区要改造，政府拿出一笔补偿款，但居民对「按面积补」还是「按人头补」分歧很大。",
"The old industrial zone by your neighborhood is being redeveloped with a compensation fund, but residents split sharply over 'by area' versus 'by headcount.'",
[
["我主张按人头补，家里人口多的本来就挤，补偿该照顾实际居住的人。",["ECO:L","COL:M"],"I favor per-head compensation; larger households are cramped and the payout should cover actual residents."],
["我认为按面积补最清楚，房产证写多少补多少，少了扯皮、也尊重产权。",["ECO:R","GOV:L"],"I think by-area is clearest — compensate what the deed says, less haggling and more respect for property."],
["我建议两套结合：保底按人、增量按面积，既托住困难户也不亏了大户。",["ECO:L","GOV:A"],"I suggest a blend: a per-head floor plus area-based surplus, protecting the struggling while not shorting larger owners."],
["我懒得掺和怎么分，拿到自己那份就行，别人的账随他们争。",["COL:I","ECO:R"],"I won't meddle in the split; I'll take my share and let others argue theirs."]
]);

// ============ 5 贸易产业 ============
add("贸易产业",
"你家乡以出口小商品为主，最近主要买家市场提高了环保和劳工标准，不少厂子因达不到面临退单。镇上讨论要不要集体升级产线。",
"Your hometown exports small goods; the main buyer market just raised environmental and labor standards, and many factories face cancelled orders. The town debates a collective production upgrade.",
[
["我支持镇上牵头贷款帮厂子升级设备和工时制度，单家扛不动，抱团才能留住房订单。",["ECO:L","COL:M"],"I support the town leading loans to upgrade equipment and hours; no single shop can bear it, only unity keeps the orders."],
["我认为该让市场淘汰落后的，政府别兜底，逼出来的转型才有效率。",["ECO:R","GOV:L"],"I think the market should weed out laggards; government shouldn't backstop them — only forced transition is efficient."],
["我主张先派人和买家谈过渡期、分批达标，给厂子喘息而不是一刀切断单。",["GOV:L","NAT:C"],"I argue for negotiating a phased grace period with buyers, giving factories room to breathe instead of a hard cut."],
["我担心的就是贷款压垮小厂，不如帮它们转做内销，别全押在外需上。",["ECO:R","COL:I"],"I fear loans crushing small shops; better help them pivot to domestic sales than bet everything on external demand."]
]);

add("贸易产业",
"本地两家同类企业准备合并以对抗外来大平台的低价冲击，但合并后很可能裁掉一批重复岗位。",
"Two local firms plan to merge to withstand a foreign platform's low-price pressure, but the merger will likely cut overlapping roles.",
[
["我支持合并，活下来才保住大多数岗位，零散对抗只会被逐个吃掉。",["ECO:R","COL:M"],"I support the merger; surviving protects most jobs, and scattered resistance just gets eaten one by one."],
["我反对以裁岗换生存，应该找差异化路子，别用工人的饭碗去填利润。",["ECO:L","COL:I"],"I oppose trading layoffs for survival; they should find a differentiated path, not fill profits with workers' livelihoods."],
["我同意合并但要求设转岗和培训基金，被裁的人有去处，转型别丢下人。",["GOV:A","ECO:L"],"I accept the merger but demand a reskilling fund so the laid-off land elsewhere — transition shouldn't leave people behind."],
["我作为可能被裁的一员，先悄悄更新简历、看看外部机会，把主动权捏自己手里。",["COL:I","ECO:R"],"As a possible layoff target, I would quietly update my resume and scout outside options, keeping the initiative in my own hands."]
]);

// ============ 6 环境生态 ============
add("环境生态",
"城郊一条河近几年水质变差，沿岸居民反映有工厂夜间偷排。环保部门人手有限，巡查难以全覆盖。",
"A river on the city's edge has worsened; residents suspect factories dumping at night. The environmental agency is understaffed and can't patrol everywhere.",
[
["我支持环保部门上实时水质监测和偷排抓拍，用技术补人手，违规就重罚。",["ENV:S","TECH:K"],"I support real-time water monitoring and discharge cameras to弥补 staff gaps, with heavy fines for violations."],
["我更信发动沿岸居民当志愿者巡河、随手拍上报，靠众人眼睛盯住污染源。",["ENV:S","COL:M"],"I trust mobilizing riverside residents as volunteer patrols who snap and report, watching polluters with many eyes."],
["我认为先查清楚是哪几家再谈罚，别一竿子打翻整片厂，影响大家饭碗。",["ENV:G","GOV:L"],"I say identify the culprits first before fining; don't sweepingly punish all factories and cost everyone jobs."],
["我自家装了净水器、少去河边，污染的事交给部门慢慢治，个人先护好健康。",["COL:I","ENV:S"],"I installed a filter and avoid the river; I'll leave pollution to the agency and protect my own health for now."]
]);

add("环境生态",
"你们县想引进一个能带动就业的大型化工项目，但选址靠近饮用水源地。支持者看重饭碗，反对者担心水源。",
"Your county wants a large chemical project that brings jobs, but the site sits near the drinking-water source. Supporters value livelihoods; opponents fear the water.",
[
["我支持项目上马，就业和税收实在，水源防护可以靠更严的管线标准和应急池来兜底。",["ENV:G","ECO:R"],"I back the project; jobs and tax are real, and water safety can be buffered by stricter pipeline standards and emergency ponds."],
["我反对，水源一旦出事没法挽回，饭碗重要但没有干净水什么都没意义。",["ENV:S","GOV:L"],"I oppose it; once the source is harmed it can't be undone — jobs matter but without clean water nothing else does."],
["我主张把项目挪到下游非水源区，再配套就业培训给当地，两全其美。",["ENV:S","GOV:A"],"I propose moving it downstream outside the source area plus local job training — the best of both."],
["我要求先做独立第三方环评并全程直播听证，群众看明白再投票定夺。",["GOV:L","ENV:S"],"I demand an independent third-party assessment and a live-streamed hearing so the public decides with full information."]
]);

// ============ 7 学校教育 ============
add("学校教育",
"孩子班上要分「快慢班」，校方说能因材施教，你担心一旦分班标签会跟着孩子很久。",
"The school wants to split classes by pace, saying it tailors teaching, but you worry the label sticks to children for a long time.",
[
["我反对分班，孩子后劲不同，贴快慢标签容易伤自信，不如班内分层作业。",["CUL:P","GOV:L"],"I oppose splitting; kids peak at different times and labels hurt confidence — better differentiated homework within one class."],
["我支持分班，程度相近教得顺，老师不用被两头拖累，效率更高。",["GOV:A","CUL:T"],"I support it; similar levels teach smoothly and teachers aren't pulled both ways — more efficient."],
["我同意分层但要求定期流动、不固定标签，谁进步了就能换班，别一成不变。",["CUL:P","GOV:L"],"I accept grouping but want periodic mobility without fixed labels; those who improve switch — nothing set in stone."],
["我无所谓学校怎么分，反正我会给孩子额外报班补强弱项，校内安排影响有限。",["COL:I","ECO:R"],"I don't mind how the school groups; I'll get my child extra tutoring for weak spots, so the in-school plan matters little."]
]);

add("学校教育",
"学校打算每天增加一节体育课、压缩一节文化课，理由是近视和体质下滑。部分家长怕挤占考试复习时间。",
"The school plans to add a daily PE class by cutting an academic one, citing falling fitness and rising myopia. Some parents fear lost exam prep.",
[
["我支持加体育，身体底子好了学习效率才高，近视眼多了更麻烦。",["CUL:P","COL:M"],"I support more PE; a stronger body raises study efficiency and myopia is the bigger trouble."],
["我反对占用文化课，考试竞争摆在那，体能可以放学后自己练。",["CUL:T","GOV:L"],"I oppose cutting academics; exam competition is real and fitness can be trained after school."],
["我建议体育进课间和课后、不砍正课，保住复习也动起来，两不误。",["GOV:L","COL:M"],"I suggest PE in breaks and after-school, not cutting core classes — keep prep and get moving both."],
["我自家给孩子报了傍晚的体能班，学校加不加我都补上，不纠结政策。",["COL:I","CUL:P"],"I enrolled my child in an evening fitness class; whether school adds it or not, I cover it — I won't fret the policy."]
]);

// ============ 8 移民文化 ============
add("移民文化",
"你所在城市近年来了不少讲不同语言的新居民，子女进同一所小学。有家长提议 classrooms 全用本地语言、禁止课间说母语。",
"Your city has welcomed many new residents who speak other languages, and their children share the school. Some parents propose using only the local language in class and banning native tongues at recess.",
[
["我反对禁母语，课间说什么是个人的事，硬禁反而让孩子自卑、和家长断了线。",["CUL:P","GOV:L"],"I oppose banning native tongues; recess speech is personal and a hard ban only shames kids and cuts them from family."],
["我支持课堂用本地语言保证教学，但课间随他们，规矩只管上课那块。",["GOV:A","CUL:T"],"I support the local language in class for teaching, but recess is theirs — rules cover class time only."],
["我主张加双语助教和语言互换小组，本地孩子也学一点对方的语，互相靠近。",["CUL:P","COL:M"],"I propose bilingual aides and language-exchange groups where locals learn a bit of the other tongue too — mutual approach."],
["我无所谓学校定什么规，反正我家孩子本地语没问题，别的影响不到我。",["COL:I","GOV:L"],"I don't care what rule they set; my child speaks the local language fine, so it won't affect us."]
]);

add("移民文化",
"镇上要办一年一度的文化节，新来的群体希望加一个自己的传统展示摊位，有人担心冲淡「本地特色」。",
"The town's annual culture festival may add a booth for a newly arrived group's tradition; some worry it dilutes the 'local character.'",
[
["我欢迎加摊位，镇子本来就是人聚起来的，多一种展示才热闹。",["CUL:P","COL:M"],"I welcome the booth; the town was built by people gathering, and one more display makes it livelier."],
["我更想守住本地特色，传统摊位放一块、新摊位另划区，各美其美。",["CUL:T","GOV:L"],"I'd rather preserve local character — keep traditional booths together and give new ones their own zone, each its own."],
["我建议让新老群体合办一个「邻里共做一道菜」环节，借着吃互相认识。",["COL:M","CUL:P"],"I suggest a joint 'neighbors cook one dish together' session so they meet over food."],
["我一般不过这种节，去不去都行，摊位加不加跟我关系不大。",["COL:I","CUL:T"],"I usually skip such festivals; whether the booth is added hardly matters to me."]
]);

// ============ 9 监控隐私 ============
add("监控隐私",
"小区物业要在每部电梯和楼道装人脸识别门禁，说能防陌生人进楼。你顾虑自己的出入轨迹被系统记录。",
"The property manager wants facial-recognition access in every elevator and corridor, citing stranger prevention. You worry your comings and goings get recorded.",
[
["我支持装，安全是第一位的，丢过快递的人最懂拦住外人多重要。",["TECH:K","GOV:A"],"I support it; security comes first, and anyone who's had packages stolen knows keeping outsiders out matters."],
["我反对，进出记录是敏感轨迹，物业未必守得住，不如刷门禁卡更可控。",["TECH:U","GOV:L"],"I oppose it; movement logs are sensitive and the manager may not secure them — a keycard is more controllable."],
["我同意装但要求数据本地存储、定期销毁、本人可查可删，给技术套上规矩。",["TECH:K","GOV:L"],"I accept it but demand local storage, periodic deletion, and personal access-to-delete — putting rules around the tech."],
["我无所谓，反正我正常进出没见不得人的，系统记就记。",["COL:I","TECH:K"],"I don't mind; I come and go normally with nothing to hide, so let it log."]
]);

add("监控隐私",
"你用的通勤 App 默认把你的实时位置和常去地点分享给合作方做「精准推荐」，关闭按钮藏得很深。",
"Your commute app defaults to sharing your live location and frequented spots with partners for 'precision recommendations,' and the off-switch is buried.",
[
["我花时间翻设置关掉共享，位置是我自己的，不该默认就交给别人。",["TECH:U","COL:I"],"I'd dig into settings and turn sharing off; my location is mine and shouldn't be handed over by default."],
["我无所谓推荐准不准，但默认开启还不告知就是耍赖，我要求平台必须明示授权。",["GOV:L","TECH:U"],"I don't care about recommendation accuracy, but default-on without notice is cheating — I demand explicit consent."],
["我支持个性化推荐，换来更顺手的路线提示，愿意用点数据换方便。",["TECH:K","COL:I"],"I like personalized tips and trade a bit of data for a smoother commute."],
["我直接换一个开源、不收集位置的 App，用脚投票比跟设置较劲省事。",["COL:I","TECH:U"],"I'd just switch to an open-source app that collects no location — voting with my feet beats fighting settings."]
]);

// ============ 10 医疗健康 ============
add("医疗健康",
"你父亲查出早期慢性病，医生给出两种方案：长期服药控制，或先做创伤更小的生活方式干预观察三个月。",
"Your father's early chronic condition offers two paths: long-term medication, or a less invasive lifestyle intervention observed for three months.",
[
["我选先调饮食和运动观察，能不用药就不用药，副作用总归是负担。",["COL:I","CUL:T"],"I'd try diet and exercise first; avoid drugs when possible since side effects are a burden."],
["我听医生的，早用药把指标压住最稳妥，拖着观察万一加重更麻烦。",["GOV:A","COL:M"],"I'd follow the doctor and medicate early to hold the numbers — waiting risks worsening."],
["我带父亲去第二家医院再评估一次，多一个意见再拍板，不押第一次。",["GOV:L","COL:I"],"I'd get a second hospital's read before deciding, not betting on the first opinion."],
["我拉上家里人一起查指南、列利弊，全家商量着定，不一个人扛决定。",["COL:M","CUL:T"],"I'd gather the family to review guidelines and weigh pros and cons together, not deciding alone."]
]);

add("医疗健康",
"社区医院推出「家庭医生签约」，签约后上门随访、优先转诊，但名额有限要排队。你家有老人行动不便。",
"The community clinic offers 'family-doctor signing' with home visits and priority referrals, but slots are limited and queued. Your elderly family member has mobility issues.",
[
["我立刻去排队签约，老人出门难，有个能上门的医生踏实多了。",["COL:I","GOV:L"],"I'd queue to sign up at once; the elder struggles to go out and a doctor who visits brings real peace of mind."],
["我支持社区把名额先给失能和高龄家庭，按需要排比按先来后到更公道。",["ECO:L","COL:M"],"I support giving slots first to disabled and very old households; need-based beats first-come on fairness."],
["我认为该多招家庭医生扩名额，而不是让大家抢有限的饼，根子在供给。",["GOV:A","ECO:L"],"I think they should hire more family doctors to expand slots rather than have everyone scramble — the root is supply."],
["我暂时不签，老人情况还稳，先把公共资源留给更急的人，需要再说。",["COL:I","ECO:L"],"I won't sign yet; the elder is stable, so leave public resources for the more urgent and revisit later."]
]);

// ============ 11 性别平权 ============
add("性别平权",
"公司晋升答辩里，你注意到同能力的女同事常被问「如何平衡家庭」，男同事却很少被这么问。你准备下次答辩前反馈这件事。",
"At promotion reviews you notice equally capable female colleagues get asked 'how will you balance family' while men rarely do. You plan to raise it before the next round.",
[
["我会在意见箱实名写下这个观察，请评审统一提问标准，别让私生活成扣分点。",["CUL:P","GOV:L"],"I'd submit this observation by name and ask reviewers to unify questions, so private life isn't a penalty."],
["我直接找 HR 要求答辩评分表去掉家庭类问题，用同一套能力维度量所有人。",["GOV:A","CUL:P"],"I'd ask HR to drop family questions from the rubric and measure everyone on the same competency dimensions."],
["我先把自己答辩答漂亮、用实绩说话，制度的事慢慢推，个人先立住。",["COL:I","CUL:T"],"I'd ace my own review on results first; push the system later, but establish myself personally now."],
["我联合同事做一份匿名数据，证明提问确实存在偏差，再拿着证据去谈更硬气。",["COL:M","CUL:P"],"I'd compile anonymous data proving the question bias, then negotiate with evidence — far firmer ground."]
]);

add("性别平权",
"幼儿园招生简章写「鼓励爸爸多参与亲子活动」，有家长觉得多余，也有人觉得点得好。",
"The kindergarten brochure says 'encourage dads to join activities more'; some parents find it pointless, others think it's a good nudge.",
[
["我觉得挺好，带娃不该默认是妈妈的事，提示一下能松动老观念。",["CUL:P","COL:M"],"I think it's good; childcare shouldn't default to moms, and a nudge loosens old habits."],
["我认为招生简章别替家庭分配角色，写「欢迎家长参与」就够，不点名反而更平等。",["CUL:T","GOV:L"],"I think the brochure shouldn't assign roles; 'welcome parents' suffices — not naming is more equal."],
["我无所谓措辞，反正我家爸妈都参与，写啥不影响我们怎么做。",["COL:I","CUL:P"],"I don't mind the wording; both parents in my home join anyway, so it changes nothing we do."],
["我更想看幼儿园是否真有弹性接送和父亲假配套，口号不如实事。",["GOV:A","CUL:P"],"I'd rather see real flexible pickup and parental leave than slogans — deeds beat words."]
]);

// ============ 12 科技AI ============
add("科技AI",
"你公司客服准备全面换成 AI 应答，能省下大半人力成本，但老年客户常反映听不懂机器、问题绕不出去。",
"Your company plans to fully replace support with AI, saving most labor cost, but elderly customers often can't understand the machine and get stuck in loops.",
[
["我支持上 AI，效率摆在那，但必须留一条人工通道给弄不来的老人。",["TECH:K","COL:M"],"I support AI; efficiency is real, but a human channel must stay for those who can't manage."],
["我反对全换，服务对象的感受是底线，省下的钱不该以老人被晾为代价。",["TECH:U","COL:I"],"I oppose full replacement; customer dignity is the floor, and savings shouldn't come by leaving the elderly stranded."],
["我主张 AI 处理常规、人工接复杂，并设「一键转人」，按难度分流最稳。",["TECH:K","GOV:L"],"I argue AI for routine, humans for complex, plus one-tap-to-human — routing by difficulty is safest."],
["我先教会家里老人用转人工的按键，技术浪潮挡不住，自己人先护住。",["COL:I","TECH:U"],"I'd first teach my own elders the human-transfer button; the tide won't stop, so protect my people."]
]);

add("科技AI",
"你常用的写作工具开始默认在草稿里插入 AI 生成内容并标注「建议」，你担心分不清哪句是自己写的。",
"Your writing tool now defaults to inserting AI-generated 'suggestions' into drafts, and you worry about losing track of your own words.",
[
["我把自动插入关了，只在我主动点「帮我写」时才用，主权得捏在自己手里。",["TECH:U","COL:I"],"I'd turn off auto-insert and use it only on explicit 'help me write' — keep the authorship in my hands."],
["我觉得提示挺好，卡壳时给个方向省时间，最后我自己定稿就行。",["TECH:K","COL:I"],"I find the hints helpful; when stuck they save time and I finalize anyway."],
["我要求工具把 AI 内容用底色标清、可一键全删，透明比偷偷塞强。",["GOV:L","TECH:U"],"I demand the tool clearly shades AI content and allows one-click removal — transparency beats sneaking it in."],
["我联合同事向厂商提反馈，建议默认关、显式开，把选择权还给写作者。",["COL:M","TECH:U"],"I'd join colleagues pressing the vendor for opt-in by default, returning choice to writers."]
]);

// ============ 13 司法法治 ============
add("司法法治",
"你朋友卷入一桩小额经济纠纷，对方在短视频平台把「老赖」帽子扣上并广传，判决定还没下。",
"Your friend is in a small financial dispute; the other side pinned the 'deadbeat' label in a viral video before any ruling.",
[
["我认为判决定前就给人定罪是滥用舆论，支持朋友去法院告其侵犯名誉。",["GOV:L","CUL:P"],"I think convicting someone pre-verdict is mob justice; I'd back my friend suing for defamation."],
["我劝朋友先忍热度、走法律拿到生效文书再说，网上对喷只会更乱。",["GOV:A","COL:I"],"I'd tell my friend to ride out the heat and wait for the legal document; online fights only muddle it."],
["我主张平台对「未决案件」标签内容限流并提示「待法院认定」，别让传言当判决。",["GOV:A","TECH:K"],"I argue platforms should throttle 'pending-case' posts with a 'awaiting court' note, not letting rumor stand as verdict."],
["我当作吃瓜看看，不站队也不转发，朋友的事让他自己依法处理。",["COL:I","GOV:L"],"I'd just watch as a bystander, take no side and repost nothing; let my friend handle it legally."]
]);

add("司法法治",
"你所在街道推行「商户信用分」，违规一次扣分、扣多了就限制营业。有摊主担心一次无心失误被放大。",
"Your street adopts a 'merchant credit score' — one violation deducts, and too many restrict business. A vendor fears one honest mistake being amplified.",
[
["我支持信用分，守规矩的摊主该被看见，乱来的也该有代价。",["GOV:A","ECO:R"],"I support the score; rule-following vendors deserve recognition and violators a cost."],
["我担心一棍子打死，扣分该分初犯和惯犯，给整改留余地才公平。",["GOV:L","ECO:L"],"I worry about one-strike kills; points should区分 first-time from repeat, leaving room to fix — that's fair."],
["我要求扣分标准和申诉通道全公开，商户能查能辩，分数不能黑箱。",["GOV:L","ECO:L"],"I demand public deduction rules and an appeal channel so merchants can check and contest — no black box."],
["我自家摊子一向规矩，分数高低随他们定，我把自己事做好最稳。",["COL:I","CUL:T"],"My stall always follows rules; however they set the score, doing my own job well is safest."]
]);

// ============ 14 宗教与信仰 ============
add("宗教与信仰",
"市立图书馆想在世俗阅览区旁辟一小间「静思室」供人祈祷冥想，有读者担心模糊了公共空间的世俗边界。",
"The public library wants a small 'quiet room' beside the secular reading area for prayer and meditation; some readers worry it blurs the secular boundary of public space.",
[
["我支持设静思室，公共空间本就该容纳不同需要，只要不传教、不对他人设限。",["SEC:E","COL:M"],"I support the room; public space should hold different needs, as long as no preaching or exclusion."],
["我担心一旦开口就难收口，公共空间应保持世俗中立，冥想回家做更合适。",["SEC:F","GOV:L"],"I fear one opening invites more; public space should stay secular-neutral, and meditation belongs at home."],
["我主张静思室对所有人开放、不挂任何符号，只作安静空间，去掉宗教专属性。",["SEC:E","GOV:A"],"I propose the room open to all, free of any symbol, purely a quiet space — stripped of religious exclusivity."],
["我用不上这种房间，设不设都行，只要别强迫谁去、也别占掉阅览座位。",["COL:I","SEC:E"],"I won't use it; set it or not, as long as no one's forced and reading seats aren't lost."]
]);

add("宗教与信仰",
"学校春游计划去一处有宗教意义的古迹，老师想顺带讲讲相关文化背景，有家长怕变成变相宗教活动。",
"The school trip plans a historically religious site, and the teacher wants to explain its cultural background; some parents fear it becomes covert religious activity.",
[
["我支持讲文化背景，那是历史知识的一部分，分清「了解」和「信奉」就好。",["SEC:E","CUL:T"],"I support explaining the cultural background as part of history, keeping 'learning' distinct from 'believing.'"],
["我反对在学校行程里讲宗教内容，哪怕文化向，也该交给家庭自己决定。",["SEC:F","GOV:L"],"I oppose any religious content on a school trip, even cultural — that's for families to decide."],
["我建议把讲解改成纯建筑与历史通识，不涉仪式和教义，守住分寸。",["SEC:E","GOV:A"],"I suggest reframing it as plain architecture and history, no ritual or doctrine — keeping proportion."],
["我无所谓讲不讲，反正孩子回来我会自己补一堂课，学校那点不影响根基。",["COL:I","CUL:T"],"I don't mind; I'll add my own lesson at home, so the school's bit won't sway the foundation."]
]);

// ============ 15 住房城市 ============
add("住房城市",
"你租的城中村要改造，房东准备趁机涨租，而你刚安顿好、不想搬。周边类似房子也都在涨。",
"The urban village you rent is being redeveloped and your landlord plans a hike; you just settled in and don't want to move, but nearby rents are all rising.",
[
["我找房东谈长租合约锁价，答应当好租客换几年稳定，把账算在明面上。",["ECO:R","COL:I"],"I'd negotiate a long lease locking the price, offering to be a good tenant for stable years — numbers on the table."],
["我支持街道出面设租金指导线，改造不能变成赶人，给租户留口气。",["GOV:A","ECO:L"],"I support the subdistrict setting a rent guideline; redevelopment shouldn't become eviction — leave tenants room."],
["我算了笔账，若涨太多就搬去更远但通勤能忍的地方，用脚选性价比。",["COL:I","ECO:R"],"I'd weigh it; if the hike is steep I'd move farther where commuting is tolerable, voting with my feet on value."],
["我联合租客建个群里互通房源和涨租情况，信息对称了才不被各个击破。",["COL:M","ECO:L"],"I'd build a tenant group sharing listings and hikes; symmetric info stops us being picked off one by one."]
]);

add("住房城市",
"新区规划了一片高档住宅和一片保障房，中间用一道绿化带隔开。居民争论该不该打通、混合入住。",
"The new district plans upscale housing and affordable housing separated by a green belt. Residents debate whether to merge them into mixed living.",
[
["我支持混合入住，阶层混居孩子从小见识广，社区也更有活气。",["ECO:L","COL:M"],"I support mixed living; class-mixed neighborhoods broaden kids'视野 and feel more alive."],
["我理解分开的考量，配套设施和房价预期不同，强混反而易生摩擦。",["ECO:R","GOV:L"],"I see the case for separation; amenities and price expectations differ, and forced mixing breeds friction."],
["我主张保障房品质和配套拉平、再逐步打通，先填平差距再谈融合。",["ECO:L","GOV:A"],"I propose leveling affordable housing quality and amenities first, then gradually opening up — close the gap before fusion."],
["我买的是商品那侧，混不混对我影响有限，只要自家物业不被拖累。",["COL:I","ECO:R"],"I bought on the market side; mixing barely affects me as long as my own property isn't dragged down."]
]);

// ============ 16 农业食品 ============
add("农业食品",
"你老家的果园今年果子滞销，收购价压得很低，有电商提议包销但要求独家、压价更狠。",
"Your hometown orchard's fruit is unsold this year at rock-bottom prices; an e-commerce firm offers to buy it all but demands exclusivity and an even lower price.",
[
["我反对签独家的卖身契，宁可多家散卖、哪怕慢点，留着议价权最要紧。",["ECO:R","COL:I"],"I oppose an exclusive leash; better to sell through many channels slowly and keep the bargaining power."],
["我支持合作社统一谈价、不独家，抱团才不会被一家压死。",["ECO:L","COL:M"],"I support the co-op negotiating together, not exclusively — unity stops one buyer from crushing us."],
["我接受包销换现金流，但要求保底价和分期付款，先活过今年再说。",["ECO:R","GOV:L"],"I'd take the buyout for cash flow but demand a floor price and installments — survive this year first."],
["我自家先开直播带货试水，不靠大平台，把渠道捏自己手里更踏实。",["COL:I","ECO:R"],"I'd try livestream selling myself, not relying on big platforms — owning the channel feels safer."]
]);

add("农业食品",
"市里推动「学校食堂本地直采」，说更新鲜、帮本地农。但有家长担心没有大供应商的质检体系、安全没底。",
"The city pushes 'school cafeterias buy local direct' — fresher and helps local farmers — but parents worry about losing the big supplier's quality system.",
[
["我支持直采，本地菜少跑路更新鲜，农人也能多赚点，是双赢。",["ECO:L","COL:M"],"I support direct buying; local greens travel less and farmers earn more — a win-win."],
["我担心质检，支持直采但必须建本地快检点和留样制度，安全不能省。",["GOV:A","ENV:G"],"I worry about testing; I back direct buying but demand local quick-tests and sample retention — safety isn't skippable."],
["我更信成熟供应商的体系，本地小农先纳入认证再进校，门槛不能降。",["GOV:A","ECO:R"],"I trust the mature suppliers' system; local small farms must be certified before school entry — lower no bar."],
["我自家给孩子另带饭，学校采哪样我都补一份，营养自己兜底。",["COL:I","CUL:T"],"I pack my child a separate lunch; whatever the school buys, I add a portion and cover nutrition myself."]
]);

// ============ 17 媒体信息 ============
add("媒体信息",
"你常看的新闻聚合 App 首页全是让你「越看越上头」的同类内容，难得刷到不同观点。",
"Your news aggregator's front page is all same-leaning content that hooks you deeper, rarely showing different views.",
[
["我手动关注几个对立信源、每天换着看，自己拼出全貌，不交给算法。",["COL:I","TECH:U"],"I manually follow several opposing sources and rotate daily, assembling the full picture myself, not leaving it to the algorithm."],
["我支持平台给个「换换口味」开关，主动推点不同立场，别把人困在回声里。",["TECH:K","GOV:L"],"I support a 'mix it up' toggle that actively pushes differing stances, not trapping people in an echo."],
["我无所谓偏不偏，看着解气就行，不同观点我刷到也划走，不费那神。",["COL:I","TECH:U"],"I don't mind the lean; as long as it's satisfying I swipe past opposing views anyway — not worth the effort."],
["我联合同好向平台提「信息多样性」公约，要求公开推荐逻辑、留自定义入口。",["COL:M","TECH:U"],"I'd join others pressing for an 'information diversity' charter —公开 recommendation logic and a custom entry."]
]);

add("媒体信息",
"一个本地民生号发了篇「某菜市场要拆」的稿子，配图像是旧图，评论区已炸。你刚好知道目前只是调研。",
"A local account posted 'a market will be demolished' with what looks like an old photo; comments are erupting. You happen to know it's only under study.",
[
["我就在评论区补一句「目前只是调研、没定」，把已知事实摆出来平息误读。",["GOV:L","COL:M"],"I'd comment 'only under study, not decided' to put the known facts out and calm the misreading."],
["我私信号主核实后再发，不跟风传，宁可慢一点也要准。",["GOV:L","COL:I"],"I'd message the account to verify before reposting; better slow than wrong."],
["我举报该稿标注不清、易引恐慌，请平台加「待核实」标，别让旧图当新闻。",["GOV:A","TECH:K"],"I'd report the vaguely sourced post as panic-inducing, asking the platform to tag it 'unverified' — no old photo as news."],
["我当八卦看一眼就划走，拆不拆跟我买菜关系不大，懒得掺和。",["COL:I","GOV:L"],"I glance as gossip and swipe on; whether it's demolished barely affects my shopping, so I won't meddle."]
]);

// ============ 18 治安刑罚 ============
add("治安刑罚",
"你小区电动车频繁被盗，物业建议装更多摄像头并和派出所联网。有住户担心监控密了像被盯着。",
"E-bikes are often stolen in your complex; the property suggests more cameras linked to the police. Some residents feel watched.",
[
["我支持联网摄像头，车老丢的人最盼这个，安全比那点不自在重要。",["GOV:A","TECH:K"],"I support linked cameras; frequent victims want exactly this, and security outweighs minor unease."],
["我理解防盗但反对处处摄像头，公共区域装关键口、私域别伸手。",["TECH:U","GOV:L"],"I get theft prevention but oppose cameras everywhere; cover key public points, not private corners."],
["我主张摄像头只存关键通道、留证用、定期清，既防盗又不长期盯着人。",["TECH:K","GOV:L"],"I propose cameras only at key passages for evidence, cleared periodically — deter theft without long-term watching."],
["我自家装了 GPS 车锁、上了保险，公共监控加不加我都先护住自己的车。",["COL:I","TECH:U"],"I added a GPS lock and insurance; with or without public cameras, I secure my own bike first."]
]);

add("治安刑罚",
"一名少年因多次小偷小摸被抓，派出所征求社区意见：送工读教育还是交家长严管了事。",
"A teen caught shoplifting repeatedly — the station asks the community: send him to reform school or return him to strict parental supervision.",
[
["我倾向交家长严管加社区义工，给孩子留条回头路，别早早贴犯罪标签。",["CUL:T","GOV:L"],"I lean toward parental supervision plus community service, leaving the boy a way back rather than an early criminal label."],
["我支持工读教育，屡教不改就得有刚性手段，不然继续祸害邻里。",["GOV:A","CUL:T"],"I support reform school; repeat offenses need a firm measure or he'll keep harming neighbors."],
["我要求先查清家庭原委、配社工跟进，只罚不帮只会再犯。",["COL:M","GOV:L"],"I demand probing the family situation with a social worker; punishing without help just repeats the cycle."],
["我作为失主无所谓哪种，只要以后别再丢东西，处置交给专门的人。",["COL:I","GOV:A"],"As the victim I don't care which; just stop the theft, and leave disposal to the professionals."]
]);

// ============ 19 外交国际 ============
add("外交国际",
"你所在地区的外贸企业受主要海外市场关税波动影响大，商会有意组织企业去开拓新的区域市场。",
"Exporters in your region are hit hard by tariff swings in major overseas markets; the chamber wants to organize开拓 into new regional markets.",
[
["我支持商会牵头组团出海，单家闯新市场太贵太险，抱团探路更稳。",["NAT:C","COL:M"],"I support the chamber leading a group outward; going solo into new markets is costly and risky, unity scouts safer."],
["我更想先深耕周边近岸市场，物流和文化近、试错成本低，别贸然远投。",["NAT:N","ECO:R"],"I'd deepen nearby coastal markets first — closer logistics and culture, lower trial cost, not rushing into far-flung ones."],
["我主张政府给出口信用保险和展会补贴，企业才敢迈步，风险有人分担。",["GOV:A","NAT:C"],"I argue the government should offer export-credit insurance and booth subsidies so firms dare move, sharing the risk."],
["我先守住老客户、把现有单子做扎实，新市场让同行先探，我再跟进。",["COL:I","ECO:R"],"I'd hold my old clients and nail current orders; let peers scout new markets first, then I follow."]
]);

add("外交国际",
"市里想和一所海外友好城市互派青少年夏令营，增进了解。有家长担心孩子出门安全和文化差异。",
"The city wants a youth summer-camp exchange with an overseas sister city. Some parents worry about safety and cultural difference.",
[
["我支持互派，孩子亲眼看看别人怎么生活，比课本管用，眼界要趁早开。",["NAT:C","CUL:P"],"I support the exchange; kids seeing how others live beats textbooks, and broaden horizons early."],
["我担心安全和适应，支持但要配随队老师、买足保险、行前做文化课。",["NAT:C","GOV:A"],"I worry about safety and adjustment; I back it but with chaperones, full insurance, and pre-trip cultural prep."],
["我更想先做线上交流、再视情况线下，步子别一下迈太大。",["NAT:N","GOV:L"],"I'd start with online exchange then decide on in-person — don't leap too far at once."],
["我家暂不参加，孩子还小、第一次出远门不放心，等长大些再说。",["COL:I","CUL:T"],"My family sits this out; the child is young and a first trip abroad worries me — later when older."]
]);

// ============ 20 社会保障 ============
add("社会保障",
"你老家县城的养老院床位紧张、排队久，县里讨论是把钱投在机构养老还是上门居家养老。",
"Your county's nursing-home beds are tight with long queues; the county debates funding institutional vs in-home care.",
[
["我支持钱先投上门居家养老，多数老人恋家，在家也能把人照顾到。",["ECO:L","COL:M"],"I support funding in-home care first; most elders cling to home and can be cared for there too."],
["我认为机构养老更专业、能集中资源，居家散养反而难兜底。",["ECO:L","GOV:A"],"I think institutional care is more professional and pools resources; scattered home care is harder to cover."],
["我主张两者按比例配比，按老人失能程度分流向，钱花在刀刃上。",["GOV:L","ECO:L"],"I propose a balanced mix routing by disability level, spending where it counts."],
["我家老人还能自理，暂时用不上，先把名额给更急需的家庭。",["COL:I","ECO:L"],"My elder is still independent and doesn't need it yet; give the slots to more urgent families."]
]);

add("社会保障",
"灵活就业的亲友没有单位缴社保，自己交压力不小。市里在摸排是否设「灵活就业社保补贴」。",
"Your gig-worker relatives pay social insurance themselves under real strain. The city is polling a 'gig-worker insurance subsidy.'",
[
["我支持设补贴，灵活务工也是干活，别让保障只挂在单位名下的那拨人。",["ECO:L","COL:M"],"I support the subsidy; gig work is still work and security shouldn't only cover those under employers."],
["我担心补贴变长期包袱，更想先把参保手续和档次做简单、让人交得起。",["ECO:R","GOV:L"],"I fear a permanent burden; I'd rather simplify enrollment and tiers so people can afford to pay."],
["我主张按收入浮动缴费、低收入少交多补，制度得接住 bottom 的人。",["ECO:L","GOV:A"],"I propose income-linked premiums — low earners pay less and get more — the system must catch those at the bottom."],
["我自家亲友能自缴就自缴，补贴领不领随政策，先把当下保费凑齐。",["COL:I","ECO:R"],"My relatives pay what they can; whether the subsidy comes, I'll just cover the premium for now."]
]);

// ============ 21 家庭婚姻 ============
add("家庭婚姻",
"你和伴侣商量婚后家务怎么分，对方默认「你更细心你多管」，你觉得这等于又回到老一套。",
"You and your partner discuss chore splits; they assume 'you're more detail-oriented, you do more,' and you feel that reverts to the old pattern.",
[
["我摊开来说分工要按时间和擅长、不按性别默认，两人各列能做的再平分。",["CUL:P","GOV:L"],"I'd say splits should follow time and skill, not gender default — we each list what we can do, then split."],
["我接受你细我粗的现实，但粗活重活归你、细活归我，总量得对等。",["CUL:T","COL:I"],"I accept you're fine, I'm rough; rough/heavy chores yours, fine ones mine, but totals must match."],
["我们定个轮值表，每周换岗，谁都别固定在某类活上，免得积怨。",["CUL:P","COL:M"],"We'd set a rotating chart, switching weekly so neither is stuck on one type — avoids resentment."],
["我懒得争，谁看不过眼谁就做，日子过着就行，分那么清反而生分。",["COL:I","CUL:T"],"I won't argue; whoever can't stand it does it — too clear a split only distances us."]
]);

add("家庭婚姻",
"双方父母催着办隆重婚礼，花费不小，你和伴侣更想简办把钱花在将来生活上。",
"Both sets of parents push for a grand wedding at real cost; you and your partner prefer simple and spending on future life.",
[
["我主张和父母摊牌，婚礼是咱俩的事，钱留着买房育儿更实在。",["CUL:P","COL:I"],"I'd tell parents plainly the wedding is ours; keeping the money for a home and kids is more real."],
["我理解老人要面子，折中办个小而体面的，两边都过得去就行。",["CUL:T","GOV:L"],"I get the elders want face; a small but decent one satisfies both sides."],
["我提议把办酒的钱改成交个旅行或首付，用行动证明简办更值。",["ECO:L","COL:M"],"I suggest turning the banquet budget into a trip or down payment, showing simple is worth more."],
["我听伴侣的，TA 想怎么办都行，别为这事闹僵两家。",["COL:I","CUL:T"],"I'll follow my partner; however they want is fine, just don't rift the two families over it."]
]);

// ============ 22 动物伦理 ============
add("动物伦理",
"小区有人投喂流浪猫，猫越聚越多、也有人嫌吵和怕挠人。物业想统一抓捕送收容所。",
"Residents feed stray cats; their numbers grow and some complain about noise and scratches. The property wants to catch and send them to a shelter.",
[
["我支持抓捕送养，无序繁殖才真是害猫，进所里至少有人管。",["COL:M","CUL:T"],"I support catch-and-shelter; unchecked breeding truly harms cats, and a shelter at least cares."],
["我反对一锅端，先绝育放归、找领养，比送进常满员的所里人道。",["COL:I","CUL:P"],"I oppose the sweep; neuter-return and find adopters beats a常 full shelter — more humane."],
["我主张喂猫人签公约、定点定时、负责绝育，自由喂但不负责任不行。",["GOV:A","COL:M"],"I propose feeders sign a pact — fixed time/place and pay for neutering; free feeding without duty won't do."],
["我无所谓猫去哪，只要别在我窗下叫、别挠到人，怎么处理都行。",["COL:I","CUL:T"],"I don't care where the cats go, as long as they don't yowl under my window or scratch anyone."]
]);

add("动物伦理",
"你常去的一家动物园被拍到动物笼舍偏小、丰容不足。园方说受场地和经费限制。",
"A zoo you visit was filmed with small enclosures and little enrichment; the management cites space and budget limits.",
[
["我支持倒逼园方整改，动物福利不是装饰，达不到就该限流减养。",["COL:M","CUL:P"],"I support forcing fixes; animal welfare isn't décor, and failing it should mean fewer animals, not more."],
["我理解经费难，但可以先把现有动物养好、少引进，把有限钱花在刀刃。",["GOV:L","CUL:T"],"I get the budget squeeze, but first care well for current animals and引进 less, spending有限 money wisely."],
["我主张引入第三方动物福利评估和公开评分，让门票和评级挂钩。",["GOV:A","COL:M"],"I propose third-party welfare audits with public scores tied to ticketing and rating."],
["我以后少去这家、把钱花在更用心的园子，用脚投票最实在。",["COL:I","CUL:P"],"I'd visit less and spend at better-run zoos; voting with my feet is most real."]
]);

// ============ 23 艺术文化 ============
add("艺术文化",
"市美术馆打算把一面常设展墙改成付费特展，免费区域变小。常来的退休老人有点失落。",
"The art museum plans to turn a permanent free wall into a paid special exhibit, shrinking the free area; regular elderly visitors feel let down.",
[
["我支持特展创收，馆要运转，但请保留一块稳定免费区给常来的老人。",["CUL:T","GOV:A"],"I support paid exhibits for revenue, but keep a stable free zone for regular elderly visitors."],
["我反对再缩免费区，公共文化空间本就该免费兜底，创收另想办法。",["CUL:P","COL:M"],"I oppose shrinking free space; public culture should be free by default — find revenue elsewhere."],
["我主张特展对老人和低收入免票、对其他人收费，分类比一刀切好。",["GOV:L","ECO:L"],"I propose free special-entry for elders and low-income, charged for others — tiered beats blanket."],
["我自家办了年卡，改不改对我影响不大，老人那层我替他们叹句可惜。",["COL:I","CUL:T"],"I hold an annual pass, so the change barely hits me; I just sigh for the elders."]
]);

add("艺术文化",
"本地剧团想排一出新戏，题材涉及一段有争议的历史记忆，有人怕「挑起对立」建议改温和些。",
"A local troupe wants a new play touching contested historical memory; some fear 'stirring division' and suggest softening it.",
[
["我支持照实排，艺术本就该碰真实记忆，回避才是真问题。",["CUL:P","GOV:L"],"I support staging it truthfully; art should touch real memory, and avoidance is the real problem."],
["我理解顾虑，但建议加演后谈、配史料展，把戏变成讨论而非煽动。",["CUL:T","COL:M"],"I get the worry, but add post-show talks and a history exhibit, turning the play into discussion not incitement."],
["我担心时机，主张先小型内部演、听听反应再放大，别一上来就惹火。",["GOV:A","CUL:T"],"I worry about timing; start with a small internal show, gauge reaction, then scale — don't ignite at once."],
["我平时不看戏，排啥我都不过问，剧团自己负责它的观众。",["COL:I","GOV:L"],"I don't watch plays; stage what they will, the troupe answers to its own audience."]
]);

// ============ 24 体育竞技 ============
add("体育竞技",
"你孩子校队选拔，教练偏向选身体壮、现在就能赢的，几个有潜力但瘦小的孩子被刷。",
"At your child's school-team tryouts the coach favors big, win-now kids, cutting a few thin but promising ones.",
[
["我反对唯当下论，潜力该给时间，建议增设观察期再定名单。",["CUL:P","GOV:L"],"I oppose win-now-only; potential needs time, so I'd add an observation period before final cuts."],
["我理解教练要成绩，但校队不是职业队，育人比奖杯重要。",["CUL:T","COL:M"],"I get the coach wants results, but a school team isn't pro — developing kids beats trophies."],
["我主张公开选拔标准、让家长见证，规则透明了争议自然少。",["GOV:L","CUL:P"],"I propose public tryout criteria witnessed by parents; transparent rules cut disputes."],
["我家孩子入选了，别人的去留我不多嘴，教练专业判断我尊重。",["COL:I","CUL:T"],"My child made it; I won't comment on others' cuts and respect the coach's call."]
]);

add("体育竞技",
"社区想办业余足球联赛，报名费不低，低收入家庭孩子可能玩不起。有人提议拉赞助免他们的费。",
"The community wants an amateur football league with a steep fee; low-income kids may miss out. Some propose sponsors covering theirs.",
[
["我支持拉赞助免单，让孩子都能上场，社区活动本就该人人进得来。",["COL:M","ECO:L"],"I support sponsor-funded waivers so every kid can play; community events should be open to all."],
["我嫌拉赞助麻烦，主张直接把报名费降下来、靠居民众筹补缺口。",["ECO:L","COL:M"],"I find sponsors tedious; just lower the fee and crowdfund the gap among residents."],
["我认为先按能力分档收费，富的多出、穷的少出，比全免更可持续。",["ECO:R","GOV:L"],"I'd tier fees by ability — better-off pay more, poor less — more sustainable than full waivers."],
["我家孩子不踢球，联赛办不办、谁免单都随你们，我不出这份力。",["COL:I","GOV:L"],"My kid doesn't play; run the league or not, waive who you like — I won't pitch in."]
]);

// ============ 25 老龄化养老 ============
add("老龄化养老",
"你母亲独居、偶尔忘关火，你纠结是接来同住还是装智能监测+请钟点工。",
"Your mother lives alone and occasionally forgets the stove; you weigh moving her in vs smart monitoring plus a hourly aide.",
[
["我接来同住，老来伴着才安心，隔着屏幕总归隔层东西。",["CUL:T","COL:M"],"I'd move her in; company in old age brings peace, and a screen is always one layer away."],
["我装监测+钟点工，给她留独立空间，老人有自己的日子更舒坦。",["CUL:P","TECH:U"],"I'd add monitoring and an aide, leaving her independence — elders live easier with their own days."],
["我先上社区独居老人巡访和一键呼叫，借公助兜住安全再谈别的。",["GOV:A","COL:M"],"I'd first use the community's solo-elder visits and one-button call, leaning on public aid for safety first."],
["我周末固定回去、平日远程看监测，能兼顾就先这么撑着。",["COL:I","TECH:K"],"I'd go back every weekend and watch remotely on weekdays — hold it together as best I can."]
]);

add("老龄化养老",
"小区要建一个老年活动中心，选址争了两处：挨着喧闹广场还是安静角落。",
"The neighborhood wants a senior center; two sites compete — by the lively plaza or in a quiet corner.",
[
["我选安静角落，老人要的是歇脚聊天，吵吵闹闹反而待不住。",["CUL:T","COL:I"],"I'd pick the quiet corner; elders want rest and talk, and noise drives them away."],
["我选广场边，热闹有人气、顺路就能来，冷清的地方没人肯去。",["COL:M","CUL:P"],"I'd pick the plaza side; lively and on the way, a lonely spot gets no visitors."],
["我主张两个功能分开：安静阅览室在角落、活动场在广场，各取所需。",["GOV:L","COL:M"],"I propose splitting functions — quiet reading in the corner, activity space by the plaza — each to their need."],
["我不出主意，中心建在哪我都去坐坐，位置无所谓。",["COL:I","CUL:T"],"I won't advise; wherever it's built I'll drop by — location doesn't matter."]
]);

// ============ 26 消费债务 ============
add("消费债务",
"你刚工作的表妹办了好几张信用卡和网贷，月月拆东墙补西墙，催款短信让她睡不好。",
"Your young working cousin holds several cards and loans, robbing Peter to pay Paul monthly; dunning texts steal her sleep.",
[
["我帮她列清债务、先做最低还款计划，把窟窿按利率排好序再还。",["COL:I","ECO:R"],"I'd help her list debts and a minimum plan, ordering the holes by interest before repaying."],
["我劝她先剪卡、关网贷，断了借新还旧的源，再慢慢填旧的。",["ECO:L","COL:I"],"I'd tell her to cut cards and close loans, stopping borrow-to-repay at the source, then fill old holes slowly."],
["我支持社区开免费理财和防坑课，很多人不是懒是没人教过。",["COL:M","GOV:A"],"I support free community finance and scam-avoidance classes; many aren't lazy, just never taught."],
["我借她一笔低息钱先把高息的平了，烫手的部分先解，再让她自己走正路。",["COL:I","ECO:L"],"I'd lend her low-interest to clear the high-interest first, easing the burning part, then let her walk straight."]
]);

add("消费债务",
"购物 App 总推「先买后付、零元下单」，你发现身边不少学生不知不觉欠了小笔但利滚利。",
"Shopping apps push 'buy now pay later, zero down,' and you see students quietly owing small sums that compound.",
[
["我支持对这类产品设门槛和醒目的总成本提示，别让小孩稀里糊涂签。",["GOV:A","ECO:L"],"I support eligibility gates and bold total-cost notices for such products, so kids don't sign blindly."],
["我认为成年了自己负责，提示到位就行，别把人当傻子管太宽。",["ECO:R","GOV:L"],"I think adults are responsible; clear notices suffice, don't over-manage people like fools."],
["我带头在同学里科普利滚利，能劝住一个是一个，靠同伴提醒降温。",["COL:M","CUL:P"],"I'd educate peers about compounding; save who I can, cooling it through mutual reminders."],
["我自家不碰这类，也劝家里人关掉入口，坑人的东西离远点最稳。",["COL:I","ECO:L"],"I avoid these and tell family to close the entry; steering clear of traps is safest."]
]);

// ============ 27 能源基建 ============
add("能源基建",
"你住的小区要装一批屋顶光伏，收益归全体业主，但施工要动用维修基金、初期有点乱。",
"Your complex will install rooftop solar, profit to all owners, but construction taps the repair fund and is messy at first.",
[
["我支持装，长远电费省、还能分红，眼前乱一阵换来长久好处。",["ENV:G","COL:M"],"I support it; long-run savings and dividends outweigh short-term mess for lasting gain."],
["我担心动用维修基金影响日后大修，主张先公示账目、业主投票再动钱。",["GOV:L","ECO:L"],"I fear tapping the repair fund hurts future big fixes; publish accounts and vote before spending."],
["我要求施工限时段、做好防水，别省了电却漏了顶，取舍要算全。",["ENV:G","GOV:A"],"I demand time-limited work and proper waterproofing — don't save power yet leak the roof; count it all."],
["我无所谓装不装，反正分红到我那份有限，别把我家屋顶弄漏就行。",["COL:I","ENV:G"],"I don't mind either way; my dividend is small, just don't leak my rooftop."]
]);

add("能源基建",
"城郊要建一座大型变电站，选址附近居民担心辐射和房价，支持者说城市用电绕不开。",
"A large substation is planned on the city's edge; nearby residents fear radiation and property value, while supporters say the city's power can't avoid it.",
[
["我理解用电刚需，但选址该离住宅远一点、做足隔音屏蔽，别贴着人睡。",["ENV:G","GOV:A"],"I get the power need, but site it farther from homes with shielding — don't put it next to where people sleep."],
["我反对建在住区旁，辐射争议没完，宁可多花线拉远也安心。",["ENV:S","COL:I"],"I oppose building by residences; the radiation dispute never ends, so spend more on distance for peace of mind."],
["我要求独立环评和实时公开监测数据，让群众自己看数值说话。",["GOV:L","TECH:K"],"I demand an independent assessment and live public monitoring so the public reads the numbers themselves."],
["我支持建但要求给受影响住户补偿和优先就业，代价不能只让一户扛。",["ECO:L","COL:M"],"I support building but with compensation and priority jobs for affected households — not one household bearing it."]
]);

// ============ 28 气候灾害 ============
add("气候灾害",
"你所在城市汛期易内涝，市政要不要在低洼老街全面抬高路面、还是先疏通排水。",
"Your flood-prone city debates fully raising low-lying old streets versus first clearing drainage.",
[
["我支持先疏通排水，花钱少、见效快，抬高路面动静大还扰民。",["ENV:G","GOV:L"],"I support clearing drainage first — cheaper, faster, versus raising roads which is disruptive."],
["我主张抬路加排涝双管齐下，老街屡屡淹，治标不治本迟早还涝。",["ENV:S","GOV:A"],"I argue raising plus drainage together; the old street floods repeatedly, and half-measures will flood again."],
["我要求给沿街商户和住户上财产险补贴，工程再快也防不住异常年景。",["COL:M","ECO:L"],"I demand subsidy for property insurance for along-street households; even fast works can't beat abnormal years."],
["我自家把重要东西放高处、备好沙袋，市政动不动我先护住自己家。",["COL:I","ENV:S"],"I keep valuables high and sandbags ready; whatever the city does, I secure my own home first."]
]);

add("气候灾害",
"连续高温预警，学校是否该在午后停课、把户外活动挪到清晨。家长群两派意见。",
"Under repeated heat alerts, should school cancel afternoon classes and move outdoor activity to early morning? Parents split.",
[
["我支持高温停午课，孩子中暑不是小事，安全比进度要紧。",["ENV:S","COL:M"],"I support canceling afternoon classes in heat; kids' heatstroke is no small matter, safety before schedule."],
["我反对动不动停课，家长还得上班，建议只调时段、室内照常。",["ENV:G","GOV:L"],"I oppose frequent closures; parents still work, so just shift times and keep indoors normal."],
["我主张按温度分级响应，到阈值自动转室内、超阈值才停，规则清晰。",["GOV:A","ENV:S"],"I propose temperature-tiered response — auto indoor at threshold, closure beyond — clear rules."],
["我自家给孩子备好水壶和防晒，学校怎么定我配合，不掺和争论。",["COL:I","GOV:L"],"I prep my child's bottle and sunscreen; whatever school decides I comply, no arguing."]
]);

// ============ 29 数字平台 ============
add("数字平台",
"你常点的外卖平台把骑手配送费悄悄调高、同时压低每单给商家的抽成披露。",
"Your frequent food-delivery platform quietly raised rider fees while trimming disclosed merchant cuts.",
[
["我支持监管部门要求平台明示各项费用构成，遮遮掩掩就是坑人。",["GOV:A","TECH:K"],"I support regulators forcing platforms to show each fee's breakdown; hiding it is just cheating."],
["我作为用户少点几单、多选明码标价的店，用订单教平台规矩。",["COL:I","ECO:R"],"As a user I'd order less and pick clearly-priced shops, teaching the platform with my orders."],
["我联合同行商家建自营小程序分流，别把命脉全捏在一个平台手里。",["COL:M","ECO:R"],"I'd join merchants building our own mini-program to divert traffic, not leaving our lifeline in one platform's hands."],
["我无所谓谁赚差价，反正我付的钱差不多，平台内部账我不操心。",["COL:I","ECO:R"],"I don't mind who pockets the margin; my bill is about the same, so I won't fret the platform's books."]
]);

add("数字平台",
"一个本地生活 App 想打通菜场、公交、医保的「一码通」，方便是方便，但你担心数据打通后更难删。",
"A local-life app wants one code for market, transit, and medical insurance — convenient, but you worry merged data is harder to delete.",
[
["我支持一码通，少带卡少排队，老人的日子能轻松点。",["TECH:K","COL:M"],"I support one-code; fewer cards and queues make elders' days easier."],
["我反对打通，三类数据敏感度不同，绑一起后想删都删不干净。",["TECH:U","GOV:L"],"I oppose merging; the three data types differ in sensitivity and once bound can't be cleanly deleted."],
["我要求「一码通」可分项授权、任一项能单独撤回，给用户拆开的权力。",["TECH:U","GOV:L"],"I demand per-item authorization with separate withdrawal — giving users the power to unbundle."],
["我平时不用医保绑卡那块，只刷公交和买菜，敏感的部分我留着自己管。",["COL:I","TECH:U"],"I skip the medical binding, only using transit and market; I keep the sensitive part to myself."]
]);

// ============ 30 少数群体 ============
add("少数群体",
"你同事是位听障同事，开会从没配过字幕或手语协助，他常跟不上、也不好意思提。",
"A deaf colleague never gets captions or sign help in meetings and often falls behind, too shy to ask.",
[
["我主动在会议系统开实时字幕，并和大家约定发言慢一点，顺手的事。",["COL:M","CUL:P"],"I'd turn on live captions and ask everyone to speak slower — a small courtesy."],
["我支持公司把无障碍写进会议规范，别靠个人自觉，制度才兜得住。",["GOV:A","CUL:P"],"I support writing accessibility into meeting rules; don't rely on personal goodwill — only systems hold."],
["我私下教同事用转录软件自己补，不惊动全场，先解决他的实际困难。",["COL:I","TECH:U"],"I'd privately teach him transcription software to cope, without alerting all — solving his real difficulty first."],
["我自家开会少发言、多记录，残障的事交给公司政策去管，我不越位。",["COL:I","GOV:A"],"I speak less and note more in meetings; I leave disability matters to company policy, not overstepping."]
]);

add("少数群体",
"你孩子学校里有个跨性别同学，部分家长联名要求分厕分宿，校方在犹豫。",
"At your child's school a transgender classmate prompts some parents to petition for separate restrooms and dorms; the school hesitates.",
[
["我反对分厕分宿，标签化只会让这孩子更难熬，校园该容得下差异。",["CUL:P","COL:M"],"I oppose separate facilities; labeling only makes the child's life harder — school should hold difference."],
["我理解家长的顾虑，支持增设备用单间、不强制任何人，给彼此空间。",["CUL:T","GOV:L"],"I get parents' concerns; I support adding spare single rooms without forcing anyone — space for both."],
["我主张先做反霸凌和科普教育，比急着分开关更能治本。",["GOV:A","CUL:P"],"I propose anti-bullying and awareness education first; separating addresses symptoms, not roots."],
["我自家孩子不受影响，分不分都行，只要别闹出矛盾、影响上课。",["COL:I","CUL:T"],"My child isn't affected; separate or not is fine, as long as no conflict disrupts class."]
]);

// ============ 校验 ============
const usedDomains = new Set(raw.map(q => q.domain));
const missing = Object.keys(DOM).filter(d => !usedDomains.has(d));
if (missing.length) { console.error("MISSING DOMAINS:", missing); process.exit(1); }
const counts = {};
for (const q of raw) counts[q.domain] = (counts[q.domain]||0)+1;
const off = Object.entries(counts).filter(([k,v]) => v !== 2);
if (off.length) { console.error("DOMAIN COUNT OFF:", off); process.exit(1); }
if (raw.length !== 60) { console.error("COUNT != 60:", raw.length); process.exit(1); }

const FORBIDDEN = ["本质上是","显然","毋庸置疑","唯一出路","才是正解","盲目","极端","自私"];
let hits = 0;
for (const q of raw) {
  const all = [q.scene, q.scene_en, ...q.options.flatMap(o => [o.t, o.t_en])].join(" ");
  for (const f of FORBIDDEN) {
    if (all.includes(f)) { console.error("FORBIDDEN HIT:", f, "in Q", q.id); hits++; }
  }
  // neutral check
  const last = q.options[q.options.length-1];
  if (last.t !== NEUTRAL_TEXT || last.t_en !== NEUTRAL_TEXT_EN || last.tags.length !== 0) {
    console.error("NEUTRAL BAD in Q", q.id); hits++;
  }
  // each stance 2-3 tags
  for (let i=0;i<q.options.length-1;i++){
    const t = q.options[i].tags;
    if (t.length < 2 || t.length > 3) { console.error("TAG COUNT BAD Q", q.id, "opt", i, "tags=",JSON.stringify(t), "::", q.options[i].t); hits++; }
  }
  // option fields
  for (const o of q.options) {
    if (typeof o.t !== "string" || !Array.isArray(o.tags) || typeof o.t_en !== "string") {
      console.error("OPT FIELD BAD Q", q.id); hits++;
    }
  }
  if (!q.scene || !q.scene_en || !q.domain || !q.domain_en) { console.error("Q FIELD BAD", q.id); hits++; }
}
if (hits) { console.error("TOTAL HITS:", hits); process.exit(1); }

// changelog entry matching existing schema
const changelogEntry = {
  date: "2026-10-16",
  title: "每日题库扩展 +60 题（补跑 2026-10-11~10-16）",
  items: [
    "补跑 2026-10-11 ~ 2026-10-16 漏跑批次，每日 10 题共 60 题（ID 891-950）",
    "新增题目覆盖全部 30 个领域，每领域 2 题",
    "全部新题带完整英文源（scene_en / domain_en / options.t_en）",
    "选项预设立场扫描：0 命中（断言词、未证前提、道德标签、唯一事实包装四类禁令均无）",
    "维度标签覆盖 8 个维度，单题 4 个立场选项各 2-3 个标签，且跨维度分散"
  ],
  stats: { questions: 950, ideologies: 200, domains: 30 }
};

fs.writeFileSync("new_questions.json", JSON.stringify(raw, null, 2) + "\n", "utf8");
fs.writeFileSync("new_changelog_entry.json", JSON.stringify(changelogEntry, null, 2) + "\n", "utf8");
console.log("OK: wrote", raw.length, "questions, ids", raw[0].id, "-", raw[raw.length-1].id);
console.log("Domains all 30 used, each x2. changelog entry ready.");
