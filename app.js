/* Grammar Coach · Version 1
 * A small static app: the storage and analytics functions are intentionally
 * isolated so the local data layer can later be replaced by a remote API.
 */

const STORAGE_KEY = "grammar-coach-v1";
const ACCOUNTS_STORAGE_KEY = "grammar-coach-accounts-v1";
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
const TODAY = () => new Date().toISOString().slice(0, 10);

const topics = [
  {
    id: "subject-verb",
    title: "Subject–Verb Agreement",
    short: "Make subjects and verbs match.",
    rule: "A singular subject takes a singular verb. A plural subject takes a plural verb.",
    example: "The puppy runs fast. / The puppies run fast.",
    subSkills: ["Singular & plural subjects", "Tricky subjects", "There is / There are"],
    family: "subject-verb",
  },
  {
    id: "articles",
    title: "Articles — a / an / the",
    short: "Choose the article that fits.",
    rule: "Use a before a consonant sound, an before a vowel sound, and the for a specific thing.",
    example: "an hour · a uniform · the Pacific Ocean",
    subSkills: ["a or an", "Using the", "No article"],
    family: "articles",
  },
  {
    id: "simple-present",
    title: "Simple Present",
    short: "Talk about habits and facts.",
    rule: "Use the simple present for routines, facts and things that happen regularly.",
    example: "Mia walks to school every day.",
    subSkills: ["Third-person -s", "Questions & negatives", "Facts and routines"],
    family: "simple-present",
  },
  {
    id: "simple-past",
    title: "Simple Past",
    short: "Tell what happened before now.",
    rule: "Use the simple past for finished actions. Regular verbs often end in -ed; irregular verbs change form.",
    example: "We visited the museum. / We went home.",
    subSkills: ["Regular past verbs", "Irregular past verbs", "Past questions"],
    family: "simple-past",
  },
  {
    id: "present-continuous",
    title: "Present Continuous",
    short: "Describe actions happening now.",
    rule: "Use am, is or are + verb-ing for an action happening now or around now.",
    example: "I am reading. / They are preparing dinner.",
    subSkills: ["am / is / are", "Adding -ing", "Now vs every day"],
    family: "present-continuous",
  },
  {
    id: "present-perfect",
    title: "Present Perfect",
    short: "Connect past actions to now.",
    rule: "Use have or has + past participle for experiences, recent actions or actions that continue to now.",
    example: "She has finished her homework.",
    subSkills: ["have vs has", "Past participles", "since / for / already / yet"],
    family: "present-perfect",
  },
  {
    id: "prepositions",
    title: "Prepositions",
    short: "Show place, time and movement.",
    rule: "Prepositions connect words to show relationships such as place, time, direction or position.",
    example: "The keys are on the desk. We meet at noon.",
    subSkills: ["Place", "Time", "Movement"],
    family: "prepositions",
  },
  {
    id: "conjunctions",
    title: "Conjunctions",
    short: "Join ideas clearly.",
    rule: "Conjunctions join words, phrases or clauses. Choose one that shows the relationship between ideas.",
    example: "I stayed inside because it was raining.",
    subSkills: ["and / but / or", "because / so", "although / while"],
    family: "conjunctions",
  },
];

const questionPools = {
  "subject-verb": {
    multiple: [
      ["The basket of apples ___ on the bench.", ["are", "is", "be", "were"], "is", "The subject is basket, which is singular, so the verb is is."],
      ["My friends ___ soccer after school.", ["plays", "playing", "play", "has played"], "play", "Friends is plural, so use the plural verb play."],
      ["Neither of the answers ___ correct.", ["are", "were", "be", "is"], "is", "Neither is treated as singular here, so use is."],
      ["There ___ two pencils in the case.", ["is", "was", "are", "has"], "are", "The real subject is two pencils, so use the plural verb are."],
      ["The news ___ surprising today.", ["are", "were", "be", "is"], "is", "News looks plural but is usually an uncountable singular noun: the news is."],
      ["The group of hikers ___ ready to leave.", ["are", "is", "be", "were"], "is", "The subject is group, which is singular, so use is."],
      ["Both of the windows ___ open.", ["is", "are", "was", "be"], "are", "Both refers to two windows, so use the plural verb are."],
      ["A box of old photos ___ under the bed.", ["are", "is", "were", "be"], "is", "The subject is box, not photos. Box is singular, so use is."],
    ],
    fill: [
      ["The dog ___ (chase) the ball every morning.", "chases", "Dog is singular, so chase takes -s: chases."],
      ["My sister and I ___ (enjoy) science.", "enjoy", "Sister and I makes a plural subject, so use enjoy."],
      ["Each player ___ (bring) a water bottle.", "brings", "Each is singular, so the verb needs -s: brings."],
      ["The players ___ (need) new uniforms.", "need", "Players is plural, so use need without -s."],
      ["Every one of the rooms ___ (have) a window.", "has", "Every one is singular, so use has."],
      ["The list of ingredients ___ (include) three eggs.", "includes", "The subject is list, which is singular, so use includes."],
    ],
    correct: [
      ["The list of chores are on the fridge.", "The list of chores is on the fridge.", "The subject is list, not chores. List is singular, so use is."],
      ["She walk to school on Mondays.", "She walks to school on Mondays.", "She is third-person singular, so the present-tense verb needs -s."],
      ["The collection of shells are on the shelf.", "The collection of shells is on the shelf.", "The subject is collection, which is singular, so use is."],
      ["There is many reasons to practise.", "There are many reasons to practise.", "The real subject is many reasons, so use are."],
    ],
  },
  articles: {
    multiple: [
      ["The kookaburra sat on ___ old fence.", ["a", "an", "the", "no article"], "an", "Old begins with a vowel sound, so use an."],
      ["We saw ___ moon above the oval.", ["a", "an", "the", "no article"], "the", "There is one specific moon, so use the."],
      ["Can I borrow ___ pencil, please?", ["a", "an", "the", "no article"], "a", "Pencil begins with a consonant sound and is not specific, so use a."],
      ["She wants to be ___ artist.", ["a", "an", "the", "no article"], "an", "Artist begins with a vowel sound, so use an."],
      ["___ Great Barrier Reef is in Australia.", ["A", "An", "The", "No article"], "The", "The is used with the name of this specific natural feature."],
      ["I saw ___ eagle above the valley.", ["a", "an", "the", "no article"], "an", "Eagle begins with a vowel sound, so use an."],
      ["Please close ___ front door.", ["a", "an", "the", "no article"], "the", "The front door is a specific door in this context, so use the."],
      ["He packed ___ sandwich for lunch.", ["a", "an", "the", "no article"], "a", "Sandwich begins with a consonant sound and is not specific, so use a."],
    ],
    fill: [
      ["We waited for ___ hour before the bus arrived.", "an", "Hour begins with a vowel sound because the h is silent."],
      ["Luca found ___ uniform in the lost property box.", "a", "Uniform begins with a /y/ consonant sound, so use a."],
      ["Please pass me ___ red folder on the table.", "the", "The folder is specific because both people know which one it is."],
      ["We adopted ___ energetic puppy.", "an", "Energetic begins with a vowel sound, so use an."],
      ["She wore ___ blue jacket to school.", "a", "Blue begins with a consonant sound, so use a."],
      ["___ sun was warm this morning.", "The", "We use The for the specific sun."],
    ],
    correct: [
      ["Mia is an talented musician.", "Mia is a talented musician.", "Talented begins with a consonant sound, so use a."],
      ["We visited a Australian museum.", "We visited an Australian museum.", "Australian begins with a vowel sound, so use an."],
      ["He found an useful website.", "He found a useful website.", "Useful begins with a /y/ consonant sound, so use a."],
      ["She visited a Sydney Opera House.", "She visited the Sydney Opera House.", "The Sydney Opera House is a specific named place, so use the."],
    ],
  },
  "simple-present": {
    multiple: [
      ["Every Saturday, Mia ___ her bike.", ["ride", "rides", "riding", "rode"], "rides", "Mia is third-person singular, so ride becomes rides."],
      ["Water ___ at 100°C.", ["boil", "boils", "boiled", "is boiling"], "boils", "This is a general fact, so use the simple present: boils."],
      ["Leo and Sam ___ chess at lunch.", ["plays", "play", "playing", "played"], "play", "Leo and Sam is plural, so use play without -s."],
      ["My bus ___ at 8:10 each morning.", ["leave", "leaves", "leaving", "left"], "leaves", "Bus is singular, so the verb needs -s."],
      ["The library ___ at 5 pm.", ["close", "closes", "closing", "closed"], "closes", "Library is singular, so use closes for a regular schedule."],
      ["Jordan ___ basketball twice a week.", ["play", "plays", "playing", "played"], "plays", "Jordan is third-person singular, so use plays."],
      ["The trains ___ on time most mornings.", ["arrive", "arrives", "arrived", "arriving"], "arrive", "Trains is plural, so use arrive."],
      ["My teacher ___ us clear instructions.", ["give", "gives", "giving", "gave"], "gives", "Teacher is singular, so use gives."],
    ],
    fill: [
      ["The sun ___ (rise) in the east.", "rises", "This is a fact, and sun is singular, so use rises."],
      ["We ___ (not / watch) television on school nights.", "do not watch", "Use do not + the base verb for a plural subject in the simple present."],
      ["___ your brother ___ (like) spicy food?", "Does, like", "Use Does for he/she/it, followed by the base verb like."],
      ["A koala ___ (sleep) for many hours.", "sleeps", "Koala is singular, so use sleeps."],
      ["They ___ (not / need) extra help.", "do not need", "Use do not + the base verb with they."],
      ["___ your friends ___ (walk) home?", "Do, walk", "Use Do with plural friends, followed by the base verb walk."],
    ],
    correct: [
      ["The kangaroo jump over the fence.", "The kangaroo jumps over the fence.", "Kangaroo is singular, so the verb needs -s."],
      ["Do she practise piano every day?", "Does she practise piano every day?", "Use Does with she in a simple-present question."],
      ["The river flow through the town.", "The river flows through the town.", "River is singular, so the verb needs -s."],
      ["Does he likes science?", "Does he like science?", "After Does, use the base verb like."],
    ],
  },
  "simple-past": {
    multiple: [
      ["Yesterday, we ___ to the beach.", ["go", "goes", "went", "going"], "went", "Went is the irregular past form of go."],
      ["Ava ___ a model bridge last weekend.", ["build", "builds", "built", "building"], "built", "Built is the irregular past form of build."],
      ["I ___ a rainbow after the storm.", ["see", "saw", "seen", "seeing"], "saw", "Saw is the simple-past form of see."],
      ["They ___ their homework before dinner.", ["do", "does", "did", "doing"], "did", "Did is the simple-past form of do."],
      ["Nora ___ a letter to her cousin.", ["write", "writes", "wrote", "written"], "wrote", "Wrote is the simple-past form of write."],
      ["We ___ the match on Saturday.", ["win", "won", "winning", "wins"], "won", "Won is the simple-past form of win."],
      ["Ella ___ her keys at home.", ["leave", "left", "leaves", "leaving"], "left", "Left is the simple-past form of leave."],
      ["The storm ___ the power last night.", ["cut", "cuts", "cutting", "has cut"], "cut", "Cut has the same spelling in the present and simple past."],
    ],
    fill: [
      ["The class ___ (visit) the science centre on Tuesday.", "visited", "Visit is regular, so add -ed for the simple past."],
      ["Kai ___ (take) the earlier train.", "took", "Took is the irregular past form of take."],
      ["We ___ (not / hear) the bell.", "did not hear", "Use did not + the base verb hear for a negative past sentence."],
      ["The teacher ___ (explain) the experiment yesterday.", "explained", "Explain is regular, so add -ed for the simple past."],
      ["I ___ (forget) my lunch this morning.", "forgot", "Forgot is the simple-past form of forget."],
      ["They ___ (not / finish) the project.", "did not finish", "Use did not + the base verb finish for a negative past sentence."],
    ],
    correct: [
      ["She buyed a notebook yesterday.", "She bought a notebook yesterday.", "Bought is the irregular past form of buy."],
      ["Did you saw the match?", "Did you see the match?", "After Did, use the base verb see, not the past form saw."],
      ["We goed to the market.", "We went to the market.", "Went is the irregular past form of go."],
      ["Did she wrote the answer?", "Did she write the answer?", "After Did, use the base verb write."],
    ],
  },
  "present-continuous": {
    multiple: [
      ["I ___ a new novel at the moment.", ["read", "am reading", "reads", "reading"], "am reading", "Use am + verb-ing with I for an action happening now."],
      ["The students ___ their projects today.", ["is presenting", "are presenting", "present", "presented"], "are presenting", "Students is plural, so use are + presenting."],
      ["Look! The baby ___ .", ["smiles", "smiled", "is smiling", "smile"], "is smiling", "Look signals an action happening now: is smiling."],
      ["We ___ for the bus right now.", ["wait", "are waiting", "waited", "is waiting"], "are waiting", "We takes are + verb-ing: are waiting."],
      ["Tom ___ a sandwich in the kitchen.", ["make", "makes", "is making", "made"], "is making", "The sentence describes an action happening now, so use is making."],
      ["The dog ___ under the table right now.", ["sleeps", "is sleeping", "are sleeping", "slept"], "is sleeping", "Use is + sleeping because the dog is singular and the action is happening now."],
      ["You ___ very quickly today.", ["speak", "are speaking", "is speaking", "spoke"], "are speaking", "Use are + speaking with you for an action happening now."],
      ["Why ___ he ___ so loudly?", ["is / laughing", "are / laughing", "does / laugh", "is / laugh"], "is / laughing", "Use is + laughing with he for an action happening now."],
    ],
    fill: [
      ["She ___ (paint) a sunset at the moment.", "is painting", "Use is + painting because she is singular and the action is happening now."],
      ["The children ___ (play) in the garden.", "are playing", "Children is plural, so use are + playing."],
      ["I ___ (not / use) the computer right now.", "am not using", "With I, use am not + the -ing form."],
      ["The chef ___ (prepare) dinner now.", "is preparing", "Use is + preparing with the singular subject chef."],
      ["We ___ (wait) outside at the moment.", "are waiting", "Use are + waiting with we."],
      ["She ___ (not / listen) to music right now.", "is not listening", "Use is not + listening with she."],
    ],
    correct: [
      ["They is carrying their instruments.", "They are carrying their instruments.", "They is plural, so use are carrying."],
      ["I am write an email now.", "I am writing an email now.", "The verb after am needs the -ing form: writing."],
      ["The birds are fly over the lake.", "The birds are flying over the lake.", "The verb after are needs the -ing form: flying."],
      ["He am carrying the boxes.", "He is carrying the boxes.", "Use is with he in the present continuous."],
    ],
  },
  "present-perfect": {
    multiple: [
      ["She ___ finished her homework.", ["have", "has", "having", "had"], "has", "She is third-person singular, so use has + the past participle finished."],
      ["We ___ already seen that film.", ["has", "have", "having", "did"], "have", "We takes have in the present perfect: have seen."],
      ["Have you ___ your lunch yet?", ["eat", "ate", "eaten", "eating"], "eaten", "The present perfect uses have/has + a past participle: eaten."],
      ["Liam has lived here ___ 2022.", ["for", "since", "yet", "already"], "since", "Use since with a starting point in time, such as 2022."],
      ["They have played tennis ___ two hours.", ["since", "for", "yet", "just"], "for", "Use for with a length of time, such as two hours."],
      ["I ___ never tried surfing.", ["have", "has", "am", "did"], "have", "Use have with I in the present perfect: have tried."],
      ["Maya has ___ her project.", ["finish", "finished", "finishing", "finishes"], "finished", "Use has + the past participle finished."],
      ["Have they ___ the new library yet?", ["visit", "visited", "visiting", "visits"], "visited", "Use have + the past participle visited."],
    ],
    fill: [
      ["I have ___ (write) three pages today.", "written", "Written is the past participle used after have."],
      ["Has Ruby ___ (finish) the puzzle yet?", "finished", "Use has + the past participle finished."],
      ["We have lived in Perth ___ five years.", "for", "Use for with a duration or length of time."],
      ["She has ___ (choose) a topic.", "chosen", "Chosen is the past participle of choose."],
      ["We have known each other ___ 2020.", "since", "Use since with a starting point in time."],
      ["He has worked here ___ three months.", "for", "Use for with a length of time."],
    ],
    correct: [
      ["He have just arrived at school.", "He has just arrived at school.", "He is singular, so use has, not have."],
      ["I have went to the museum already.", "I have gone to the museum already.", "After have, use the past participle gone, not the simple past went."],
      ["They has already eaten.", "They have already eaten.", "They is plural, so use have."],
      ["She has saw that movie.", "She has seen that movie.", "After has, use the past participle seen, not saw."],
    ],
  },
  prepositions: {
    multiple: [
      ["The keys are ___ the desk.", ["at", "on", "to", "between"], "on", "Use on for something resting on a surface."],
      ["Our test begins ___ 9 o'clock.", ["in", "on", "at", "by"], "at", "Use at with a precise clock time."],
      ["We visit Nan ___ Sunday.", ["at", "on", "in", "to"], "on", "Use on with days of the week."],
      ["The cat ran ___ the room.", ["through", "at", "on", "between"], "through", "Through shows movement from one side of an inside space to another."],
      ["The shop is ___ the library and the bakery.", ["under", "between", "through", "at"], "between", "Use between for something in the middle of two things."],
      ["The ball rolled ___ the sofa.", ["under", "at", "to", "between"], "under", "Use under for something below or covered by the sofa."],
      ["Our holiday starts ___ July.", ["at", "on", "in", "by"], "in", "Use in with months."],
      ["Walk ___ the bridge carefully.", ["across", "at", "on", "between"], "across", "Across shows movement from one side of the bridge to the other."],
    ],
    fill: [
      ["The birds flew ___ the trees.", "above", "Above shows a higher position than the trees."],
      ["I left my shoes ___ the door.", "by", "By means next to or close to the door."],
      ["We travelled ___ Adelaide ___ Melbourne.", "from, to", "Use from for the starting point and to for the destination."],
      ["The museum is ___ the station and the park.", "between", "Use between for something in the middle of two places."],
      ["We arrived ___ Monday morning.", "on", "Use on with a day or date."],
      ["The rabbit hopped ___ the box.", "into", "Into shows movement from outside to inside."],
    ],
    correct: [
      ["Meet me in 3 pm.", "Meet me at 3 pm.", "Use at with a precise time."],
      ["The poster is at the wall.", "The poster is on the wall.", "Use on for something attached to a surface."],
      ["I will see you in Friday.", "I will see you on Friday.", "Use on with days of the week."],
      ["The plane flew on the clouds.", "The plane flew above the clouds.", "Use above to show a higher position than the clouds."],
    ],
  },
  conjunctions: {
    multiple: [
      ["I stayed inside ___ it was raining.", ["because", "or", "but", "and"], "because", "Because introduces the reason I stayed inside."],
      ["Would you like tea ___ hot chocolate?", ["and", "but", "or", "so"], "or", "Or gives a choice between two options."],
      ["It was cold, ___ we wore our jackets.", ["because", "so", "although", "or"], "so", "So introduces the result of it being cold."],
      ["I packed a hat ___ sunscreen.", ["but", "and", "because", "although"], "and", "And joins two things that are both included."],
      ["Although the trail was steep, we ___ reached the lookout.", ["but", "still", "or", "because"], "still", "Still shows that the result happened despite the difficulty."],
      ["I brought a jumper ___ the evening might be cold.", ["because", "or", "but", "and"], "because", "Because introduces the reason for bringing a jumper."],
      ["You can stay here ___ come with us.", ["and", "but", "or", "so"], "or", "Or gives a choice between staying and coming."],
      ["The road was busy, ___ we arrived on time.", ["because", "but", "or", "and"], "but", "But connects the busy road with the contrasting result."],
    ],
    fill: [
      ["Mia wanted to swim, ___ the pool was closed.", "but", "But connects two contrasting ideas."],
      ["Take an umbrella ___ the forecast says rain.", "because", "Because introduces the reason to take an umbrella."],
      ["The team trained hard, ___ they improved.", "so", "So introduces the result of training hard."],
      ["She practised every day, ___ she improved.", "so", "So introduces the result of practising every day."],
      ["We stayed home ___ the weather was stormy.", "because", "Because introduces the reason for staying home."],
      ["I like swimming, ___ my brother prefers cycling.", "but", "But connects two contrasting preferences."],
    ],
    correct: [
      ["I was tired because I went to bed early.", "I went to bed early because I was tired.", "Because should introduce the reason, not the result, in this sentence."],
      ["Although it was sunny but we took a jacket.", "Although it was sunny, we took a jacket.", "Although already shows contrast, so do not add but as well."],
      ["He was hungry, because he made a sandwich.", "He made a sandwich because he was hungry.", "Because should introduce the reason, so put the result first."],
      ["You may choose tea and juice.", "You may choose tea or juice.", "Or is used when someone must choose between two options."],
    ],
  },
};

const chineseSubSkills = {
  "Singular & plural subjects": "单数和复数主语",
  "Tricky subjects": "容易混淆的主语",
  "There is / There are": "There is / There are 的用法",
  "a or an": "a 和 an 的选择",
  "Using the": "the 的用法",
  "No article": "零冠词的用法",
  "Third-person -s": "第三人称单数的 -s",
  "Questions & negatives": "疑问句和否定句",
  "Facts and routines": "事实和日常习惯",
  "Regular past verbs": "规则动词的过去式",
  "Irregular past verbs": "不规则动词的过去式",
  "Past questions": "过去时疑问句",
  "am / is / are": "am / is / are 的选择",
  "Adding -ing": "动词加 -ing",
  "Now vs every day": "正在发生和日常习惯的区别",
  "have vs has": "have 和 has 的选择",
  "Past participles": "过去分词",
  "since / for / already / yet": "since / for / already / yet 的用法",
  Place: "地点介词",
  Time: "时间介词",
  Movement: "移动方向介词",
  "and / but / or": "and / but / or 的用法",
  "because / so": "because / so 的用法",
  "although / while": "although / while 的用法",
};

const chineseTopicRules = {
  "subject-verb": "先找出真正的主语，再让动词和主语保持单复数一致。",
  articles: "a 用在辅音音素开头的单数名词前，an 用在元音音素开头的单数名词前，the 用来表示特定的人或事物。",
  "simple-present": "一般现在时用于表达事实、习惯和规律；第三人称单数主语后，动词通常要加 -s 或 -es。",
  "simple-past": "一般过去时用于表达已经完成的动作；规则动词通常加 -ed，不规则动词需要记住它的特殊形式。",
  "present-continuous": "现在进行时用 am、is 或 are 加动词 -ing 形式，表示现在正在发生的动作。",
  "present-perfect": "现在完成时用 have 或 has 加过去分词，表示过去发生但与现在有关的动作或经历。",
  prepositions: "介词用来表达地点、时间、方向或位置关系，要根据句子的意思选择。",
  conjunctions: "连词用来连接词语或句子，要根据前后两部分的逻辑关系选择。",
};

function buildChineseExplanation(topic, subSkill, questionType, correctAnswer) {
  const skill = chineseSubSkills[subSkill] || subSkill;
  const answer = `正确答案是“${correctAnswer}”。`;
  const rule = chineseTopicRules[topic.family];
  if (topic.family === "subject-verb") return `这道题考查“${skill}”。${answer}${rule} 不要只看动词旁边的名词，要先确认整个句子的真正主语。`;
  if (topic.family === "articles") return `这道题考查“${skill}”。${answer}${rule} 选择 a 还是 an 要听开头的声音，而不是只看第一个字母；表示特定事物时要用 the。`;
  if (topic.family === "simple-present") return `这道题考查“${skill}”。${answer}${rule} 如果主语是 he、she、it 或一个单数名词，动词要注意第三人称单数形式；疑问句和否定句中则要使用助动词。`;
  if (topic.family === "simple-past") return `这道题考查“${skill}”。${answer}${rule} 看到 yesterday、last week 等过去时间提示时，要使用过去式；Did 后面要回到动词原形。`;
  if (topic.family === "present-continuous") return `这道题考查“${skill}”。${answer}${rule} 先根据主语选择 am、is 或 are，再把主要动词变成 -ing 形式。`;
  if (topic.family === "present-perfect") return `这道题考查“${skill}”。${answer}${rule} I、we、you、they 通常搭配 have，he、she、it 通常搭配 has；since 接起点，for 接持续时间。`;
  if (topic.family === "prepositions") return `这道题考查“${skill}”。${answer}${rule} 先判断句子表达的是地点、具体时间、日期还是移动方向，再选择最准确的介词。`;
  if (topic.family === "conjunctions") return `这道题考查“${skill}”。${answer}${rule} because 表示原因，so 表示结果，but 和 although 表示转折，and 表示补充，or 表示选择。`;
  return `这道题考查“${skill}”。${answer}${rule}`;
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function escapeHTML(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function normalise(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[.!?,;:]+$/g, "").replace(/\s+/g, " ");
}
function normaliseSentence(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[.!?,;:]+/g, "").replace(/\s+/g, " ");
}
function answerMatches(question, answer) {
  if (normalise(answer) === normalise(question.correctAnswer)) return true;
  return question.questionType === "correct-sentence" && normaliseSentence(answer) === normaliseSentence(question.correctAnswer);
}
function answerDifferenceHint(question, answer) {
  if (question.questionType !== "correct-sentence") return "";
  const userWords = normaliseSentence(answer).split(" ").filter(Boolean);
  const correctWords = normaliseSentence(question.correctAnswer).split(" ").filter(Boolean);
  const firstDifference = userWords.findIndex((word, index) => word !== correctWords[index]);
  if (userWords.length === correctWords.length && firstDifference >= 0) {
    return `<p class="answer-check"><strong>Check this word:</strong> You typed “${escapeHTML(userWords[firstDifference])}”, but this sentence needs “${escapeHTML(correctWords[firstDifference])}”.</p>`;
  }
  return `<p class="answer-check"><strong>Check the sentence:</strong> Compare each word with the correct answer below.</p>`;
}
function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function skillKey(topicId, subSkill) { return `${topicId}::${subSkill}`; }
function getTopic(topicId) { return topics.find((topic) => topic.id === topicId) || topics[0]; }
function getSkillTitle(key) { const [topicId, subSkill] = key.split("::"); return `${getTopic(topicId).title} · ${subSkill}`; }

function questionFromPool(topic, subSkill, index, type, source) {
  const difficulty = index % 5 === 0 ? "starter" : index % 4 === 0 ? "challenge" : "core";
  const base = type === "multiple-choice"
    ? { prompt: source[0], options: source[1], correctAnswer: source[2], explanation: source[3] }
    : { prompt: source[0], options: [], correctAnswer: source[1], explanation: source[2] };
  return {
    id: `${topic.id}-${slug(subSkill)}-${String(index + 1).padStart(2, "0")}`,
    topic: topic.id,
    subSkill,
    yearLevel: "Year 6–7",
    difficulty,
    questionType: type,
    prompt: base.prompt,
    options: base.options,
    correctAnswer: base.correctAnswer,
    explanation: base.explanation,
    chineseExplanation: buildChineseExplanation(topic, subSkill, type, base.correctAnswer),
    commonErrorType: type === "correct-sentence" ? "Editing the sentence" : topic.id === "present-perfect" ? "Tense confusion" : "Form or agreement",
    exampleRule: topic.rule,
  };
}

function buildQuestionBank() {
  const bank = [];
  const questionsPerSkill = 18;
  topics.forEach((topic) => {
    topic.subSkills.forEach((subSkill, skillIndex) => {
      const pool = questionPools[topic.family];
      for (let i = 0; i < questionsPerSkill; i += 1) {
        const type = i < 8 ? "multiple-choice" : i < 14 ? "fill-blank" : "correct-sentence";
        const sourcePool = type === "multiple-choice" ? pool.multiple : type === "fill-blank" ? pool.fill : pool.correct;
        const source = sourcePool[(i + skillIndex) % sourcePool.length];
        bank.push(questionFromPool(topic, subSkill, (skillIndex * 10) + i, type, source));
      }
    });
  });
  return bank;
}

const questionBank = buildQuestionBank();

function blankProfile() {
  return { name: "George", xp: 0, streak: 0, lastActiveDate: null, lastLessonTopic: "subject-verb", lessonsCompleted: 0 };
}
function baseState(mode = "fresh") {
  return {
    mode,
    view: "home",
    selectedTopic: "subject-verb",
    attempts: [],
    mistakes: [],
    reviews: {},
    profile: blankProfile(),
    resetModal: false,
    practice: { mode: "mixed", queue: [], index: 0, score: 0, answered: false, lastAnswer: "", showChinese: false, completed: false, error: "", sessionAnswers: [] },
  };
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
function answerForQuestion(question, isCorrect) {
  if (isCorrect) return question.correctAnswer;
  if (question.options.length) return question.options.find((option) => normalise(option) !== normalise(question.correctAnswer)) || "not sure";
  return question.questionType === "correct-sentence" ? "I am not sure yet." : "not sure";
}
function makeAttempt(question, isCorrect, timestamp, isReview = false) {
  const previous = stateForDemoAttemptsCount(question.id);
  return {
    questionId: question.id,
    topic: question.topic,
    subSkill: question.subSkill,
    difficulty: question.difficulty,
    questionType: question.questionType,
    userAnswer: answerForQuestion(question, isCorrect),
    isCorrect,
    timestamp,
    attemptNumber: previous + 1,
    confidence: null,
    isReview,
  };
}
function stateForDemoAttemptsCount(questionId) {
  return demoAttemptCounter[questionId] || 0;
}
const demoAttemptCounter = {};

function createDemoState() {
  const demo = baseState("demo");
  const quality = {
    "subject-verb": .54,
    articles: .71,
    "simple-present": .82,
    "simple-past": .77,
    "present-continuous": .76,
    "present-perfect": .61,
    prepositions: .86,
    conjunctions: .8,
  };
  const demoQuestions = questionBank.filter((_, index) => index % 5 === 0 || index % 7 === 1).slice(0, 54);
  demoQuestions.forEach((question, index) => {
    const topicQuality = quality[question.topic] || .75;
    const isCorrect = ((index * 17) % 100) / 100 < topicQuality;
    const attempt = makeAttemptForDemo(question, isCorrect, dateDaysAgo(Math.max(0, 11 - Math.floor(index / 5))), index % 9 === 0);
    demo.attempts.push(attempt);
    demoAttemptCounter[question.id] = (demoAttemptCounter[question.id] || 0) + 1;
    if (!isCorrect && demo.mistakes.length < 9) demo.mistakes.push(makeMistake(question, attempt, false));
  });
  demo.profile = { name: "George", xp: 1240, streak: 6, lastActiveDate: TODAY(), lastLessonTopic: "present-perfect", lessonsCompleted: 7 };
  const weak = skillKey("present-perfect", "since / for / already / yet");
  demo.reviews[weak] = { intervalIndex: 0, nextReview: TODAY(), consecutiveCorrect: 0, lastReviewed: dateDaysAgo(4) };
  const strong = skillKey("prepositions", "Time");
  demo.reviews[strong] = { intervalIndex: 3, nextReview: dateDaysAgo(-4).slice(0, 10), consecutiveCorrect: 4, lastReviewed: dateDaysAgo(1) };
  return demo;
}
function makeAttemptForDemo(question, isCorrect, timestamp, isReview) {
  return { ...makeAttemptWithCount(question, isCorrect, timestamp, isReview), attemptNumber: 1 };
}
function makeAttemptWithCount(question, isCorrect, timestamp, isReview) {
  return { questionId: question.id, topic: question.topic, subSkill: question.subSkill, difficulty: question.difficulty, questionType: question.questionType, userAnswer: answerForQuestion(question, isCorrect), isCorrect, timestamp, attemptNumber: 1, confidence: null, isReview };
}
function freshState() { return baseState("fresh"); }

function normaliseStudentState(saved, fallbackMode = "fresh", fallbackName = "George") {
  const defaults = baseState(fallbackMode);
  const source = saved && typeof saved === "object" ? saved : {};
  return {
    ...defaults,
    ...source,
    attempts: Array.isArray(source.attempts) ? source.attempts : [],
    mistakes: Array.isArray(source.mistakes) ? source.mistakes : [],
    reviews: source.reviews && typeof source.reviews === "object" ? source.reviews : {},
    profile: { ...defaults.profile, ...(source.profile || {}), name: source.profile?.name || fallbackName },
    practice: { ...defaults.practice, ...(source.practice || {}), sessionAnswers: Array.isArray(source.practice?.sessionAnswers) ? source.practice.sessionAnswers : [] },
  };
}
function loadAccountStore() {
  try {
    const savedAccounts = JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || "null");
    if (savedAccounts?.accounts && typeof savedAccounts.accounts === "object") {
      const builtInNames = { alex: "George", carina: "Carina", george: "Daniel" };
      const accounts = Object.fromEntries(Object.entries(savedAccounts.accounts).map(([id, value]) => {
        const account = normaliseStudentState(value, value?.mode || "fresh", builtInNames[id] || value?.profile?.name || id);
        if (builtInNames[id]) account.profile.name = builtInNames[id];
        return [id, account];
      }));
      const activeId = accounts[savedAccounts.activeId] ? savedAccounts.activeId : Object.keys(accounts)[0];
      return { activeId, accounts };
    }
    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const alex = legacy ? normaliseStudentState(legacy, legacy.mode || "demo", "George") : createDemoState();
    alex.profile.name = "George";
    const carina = freshState(); carina.profile.name = "Carina";
    const daniel = freshState(); daniel.profile.name = "Daniel";
    return { activeId: "alex", accounts: { alex: alex, carina: carina, george: daniel } };
  } catch (error) {
    const alex = createDemoState();
    alex.profile.name = "George";
    const carina = freshState(); carina.profile.name = "Carina";
    const daniel = freshState(); daniel.profile.name = "Daniel";
    return { activeId: "alex", accounts: { alex: alex, carina: carina, george: daniel } };
  }
}
const accountStore = loadAccountStore();
let activeAccountId = accountStore.activeId || "alex";
let state = normaliseStudentState(accountStore.accounts[activeAccountId] || createDemoState(), "demo", "George");
function saveState() {
  const payload = { ...state, practice: { ...state.practice, queue: state.practice.queue.slice(0, 10) } };
  accountStore.activeId = activeAccountId;
  accountStore.accounts[activeAccountId] = clone(payload);
  try { localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accountStore)); } catch (error) { setSaveStatus("Saved for this session"); }
  setSaveStatus("Saved just now");
}
function setSaveStatus(text) {
  const target = document.querySelector("#save-status-text");
  if (target) target.textContent = text;
}
function accountOptions() {
  return Object.entries(accountStore.accounts).map(([id, account]) => `<option value="${escapeHTML(id)}" ${id === activeAccountId ? "selected" : ""}>${escapeHTML(account.profile?.name || id)}</option>`).join("");
}
function switchAccount(accountId) {
  if (!accountStore.accounts[accountId] || accountId === activeAccountId) return;
  saveState();
  activeAccountId = accountId;
  const saved = accountStore.accounts[activeAccountId];
  state = normaliseStudentState(saved, saved.mode || "fresh", saved.profile?.name || activeAccountId);
  state.view = "home";
  state.practice = baseState().practice;
  saveState();
  renderApp();
}
function addAccount() {
  const name = window.prompt("Name for the new Grammar Coach account:");
  if (!name || !name.trim()) return;
  const cleanName = name.trim().slice(0, 24);
  const baseId = slug(cleanName) || "student";
  let accountId = baseId;
  let number = 2;
  while (accountStore.accounts[accountId]) { accountId = `${baseId}-${number}`; number += 1; }
  const account = freshState();
  account.profile.name = cleanName;
  accountStore.accounts[accountId] = account;
  switchAccount(accountId);
}

function getStats() {
  return topics.flatMap((topic) => topic.subSkills.map((subSkill) => {
    const key = skillKey(topic.id, subSkill);
    const attempts = state.attempts.filter((attempt) => skillKey(attempt.topic, attempt.subSkill) === key).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const recent = attempts.slice(-6);
    const previous = attempts.slice(-12, -6);
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const recentCorrect = recent.filter((attempt) => attempt.isCorrect).length;
    const previousCorrect = previous.filter((attempt) => attempt.isCorrect).length;
    const spacedAttempts = attempts.filter((attempt) => attempt.isReview);
    const spacedCorrect = spacedAttempts.filter((attempt) => attempt.isCorrect).length;
    const accuracy = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
    const recentAccuracy = recent.length ? Math.round((recentCorrect / recent.length) * 100) : accuracy;
    const spacedAccuracy = spacedAttempts.length ? Math.round((spacedCorrect / spacedAttempts.length) * 100) : accuracy;
    let trailingErrors = 0;
    for (let index = attempts.length - 1; index >= 0 && !attempts[index].isCorrect; index -= 1) trailingErrors += 1;
    let successStreak = 0;
    for (let index = attempts.length - 1; index >= 0 && attempts[index].isCorrect; index -= 1) successStreak += 1;
    const lastAttempt = attempts[attempts.length - 1];
    const ageDays = lastAttempt ? Math.max(0, Math.floor((Date.now() - new Date(lastAttempt.timestamp).getTime()) / 86400000)) : 99;
    const recency = lastAttempt ? Math.max(0, 100 - ageDays * 10) : 0;
    const weakness = attempts.length ? Math.round(Math.min(100, (.4 * (100 - recentAccuracy)) + (.25 * (100 - accuracy)) + (.2 * (100 - spacedAccuracy)) + (.15 * Math.min(100, trailingErrors * 25)))) : 34;
    const mastery = attempts.length ? Math.max(0, Math.min(92, Math.round((accuracy * .42) + (recentAccuracy * .23) + (spacedAccuracy * .17) + (Math.min(100, successStreak * 20) * .12) + (recency * .06) - (attempts.length < 5 ? 8 : 0)))) : 0;
    const trendValue = recent.length && previous.length ? recentAccuracy - Math.round((previousCorrect / previous.length) * 100) : 0;
    return {
      key, topicId: topic.id, topicTitle: topic.title, subSkill, attempts: attempts.length, accuracy, recentAccuracy, mastery, weakness, trendValue,
      trend: trendValue > 5 ? "Improving" : trendValue < -5 ? "Slipping" : "Steady",
      status: weakness >= 72 ? "Priority" : weakness >= 55 ? "Needs Practice" : weakness >= 35 ? "Developing" : "Strong",
      trailingErrors, successStreak, lastAttempt,
    };
  }));
}
function weakAreas(limit = 24) { return getStats().sort((a, b) => b.weakness - a.weakness || a.mastery - b.mastery).slice(0, limit); }
function overallAccuracy() { return state.attempts.length ? Math.round((state.attempts.filter((attempt) => attempt.isCorrect).length / state.attempts.length) * 100) : 0; }
function getLevel() { return Math.max(1, Math.floor(state.profile.xp / 250) + 1); }
function attemptsToday() { return state.attempts.filter((attempt) => attempt.timestamp.slice(0, 10) === TODAY()).length; }
function studyDays(days = 7) {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (days - 1));
  return new Set(state.attempts.filter((attempt) => new Date(attempt.timestamp) >= start).map((attempt) => attempt.timestamp.slice(0, 10))).size;
}
function statusClass(status) { return status.toLowerCase().replaceAll(" ", "-"); }
function renderBar(value, className = "") { return `<div class="thin-progress ${className}"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>`; }

function updateReviewSchedule(attempt) {
  const key = skillKey(attempt.topic, attempt.subSkill);
  const current = state.reviews[key] || { intervalIndex: -1, nextReview: TODAY(), consecutiveCorrect: 0, lastReviewed: null };
  if (attempt.isCorrect) {
    current.intervalIndex = Math.min(REVIEW_INTERVALS.length - 1, current.intervalIndex + 1);
    current.consecutiveCorrect += 1;
  } else {
    current.intervalIndex = Math.max(0, current.intervalIndex - 1);
    current.consecutiveCorrect = 0;
  }
  const next = new Date();
  next.setDate(next.getDate() + (attempt.isCorrect ? REVIEW_INTERVALS[current.intervalIndex] : 1));
  current.nextReview = next.toISOString().slice(0, 10);
  current.lastReviewed = attempt.timestamp;
  state.reviews[key] = current;
}
function dueReviews() {
  return getStats().filter((stat) => stat.attempts > 0 && state.reviews[stat.key] && state.reviews[stat.key].nextReview <= TODAY()).sort((a, b) => b.weakness - a.weakness);
}
function selectQuestions(mode, topicId = null, skill = null, questionCount = 10, excludeIds = []) {
  let pool = questionBank;
  if (skill) pool = pool.filter((question) => skillKey(question.topic, question.subSkill) === skill);
  else if (topicId) pool = pool.filter((question) => question.topic === topicId);
  else if (mode === "weak" || mode === "review") {
    const keys = (mode === "review" ? dueReviews() : weakAreas(5)).map((stat) => stat.key);
    pool = pool.filter((question) => keys.includes(skillKey(question.topic, question.subSkill)));
  }
  if (!pool.length) pool = questionBank;
  const excluded = new Set(excludeIds);
  const recentIds = new Set(state.attempts.slice(-18).map((attempt) => attempt.questionId));
  const ordered = [...pool].sort((a, b) => Number(recentIds.has(a.id)) - Number(recentIds.has(b.id)) || a.id.localeCompare(b.id));
  const fresh = ordered.filter((question) => !excluded.has(question.id));
  const fallback = ordered.filter((question) => excluded.has(question.id));
  return [...fresh, ...fallback].slice(0, questionCount).map((question) => question.id);
}

function attemptedIdsForSkills(skills) {
  const skillSet = new Set(skills);
  return state.attempts.filter((attempt) => skillSet.has(skillKey(attempt.topic, attempt.subSkill))).map((attempt) => attempt.questionId);
}

function attemptedIdsForSkill(skill) {
  return attemptedIdsForSkills([skill]);
}

function beginPracticeQueue(mode, queue) {
  const uniqueQueue = [...new Set(queue)].filter((questionId) => questionBank.some((question) => question.id === questionId)).slice(0, 10);
  state.practice = { ...baseState().practice, mode, queue: uniqueQueue, sessionAnswers: [] };
  state.view = "practice";
  saveState();
  renderApp();
}
function beginPractice(mode = "mixed", topicId = null, skill = null, questionCount = 10, excludeIds = []) {
  beginPracticeQueue(mode, selectQuestions(mode, topicId, skill, questionCount, excludeIds));
}
function sessionWrongAnswers() {
  return (state.practice.sessionAnswers || []).filter((answer) => !answer.isCorrect);
}
function selectSimilarQuestions(wrongAnswers, questionCount = 5) {
  const skills = [...new Set(wrongAnswers.map((answer) => {
    const question = questionBank.find((item) => item.id === answer.questionId);
    return question ? skillKey(question.topic, question.subSkill) : null;
  }).filter(Boolean))];
  if (!skills.length) return selectQuestions("weak", null, null, questionCount);
  const excludedIds = attemptedIdsForSkills(skills);
  const groups = skills.map((skill) => selectQuestions("skill", null, skill, 10, excludedIds));
  const similar = [];
  for (let index = 0; similar.length < questionCount; index += 1) {
    let added = false;
    groups.forEach((group) => {
      const questionId = group[index];
      if (questionId && !similar.includes(questionId) && similar.length < questionCount) {
        similar.push(questionId);
        added = true;
      }
    });
    if (!added) break;
  }
  return similar;
}
function currentQuestion() { return questionBank.find((question) => question.id === state.practice.queue[state.practice.index]); }

function makeMistake(question, attempt, reviewed = false, previousMistakes = 0) {
  return {
    id: `${attempt.questionId}-${attempt.timestamp}`,
    questionId: question.id,
    topic: question.topic,
    subSkill: question.subSkill,
    prompt: question.prompt,
    userAnswer: attempt.userAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    chineseExplanation: question.chineseExplanation,
    timestamp: attempt.timestamp,
    previousMistakes,
    reviewed,
  };
}

function submitAnswer(form) {
  const question = currentQuestion();
  if (!question || state.practice.answered) return;
  const formData = new FormData(form);
  const answer = String(formData.get("answer") || "").trim();
  if (!answer) { state.practice.error = "Choose or type an answer before checking."; renderApp(); return; }
  const isCorrect = answerMatches(question, answer);
  const attempt = { questionId: question.id, topic: question.topic, subSkill: question.subSkill, difficulty: question.difficulty, questionType: question.questionType, userAnswer: answer, isCorrect, timestamp: new Date().toISOString(), attemptNumber: state.attempts.filter((item) => item.questionId === question.id).length + 1, confidence: null, isReview: state.practice.mode === "review" };
  state.attempts.push(attempt);
  if (isCorrect) { state.practice.score += 1; state.profile.xp += 10; }
  else {
    const previousMistakes = state.mistakes.filter((mistake) => mistake.subSkill === question.subSkill && mistake.topic === question.topic).length;
    state.mistakes.unshift(makeMistake(question, attempt, false, previousMistakes));
  }
  updateReviewSchedule(attempt);
  updateStreak();
  const answered = attemptsToday();
  if (answered > 0 && answered % 10 === 0) state.profile.xp += 50;
  state.practice.sessionAnswers.push({ questionId: question.id, timestamp: attempt.timestamp, isCorrect });
  state.practice.answered = true;
  state.practice.lastAnswer = answer;
  state.practice.error = "";
  saveState();
  renderApp();
}
function updateStreak() {
  const today = TODAY();
  if (state.profile.lastActiveDate === today) return;
  const previous = state.profile.lastActiveDate ? new Date(`${state.profile.lastActiveDate}T00:00:00`) : null;
  const difference = previous ? Math.round((new Date(`${today}T00:00:00`) - previous) / 86400000) : 99;
  state.profile.streak = difference === 1 ? state.profile.streak + 1 : 1;
  state.profile.lastActiveDate = today;
}
function rebuildReviewSchedules() {
  state.reviews = {};
  [...state.attempts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).forEach((attempt) => {
    const key = skillKey(attempt.topic, attempt.subSkill);
    const current = state.reviews[key] || { intervalIndex: -1, nextReview: TODAY(), consecutiveCorrect: 0, lastReviewed: null };
    if (attempt.isCorrect) {
      current.intervalIndex = Math.min(REVIEW_INTERVALS.length - 1, current.intervalIndex + 1);
      current.consecutiveCorrect += 1;
    } else {
      current.intervalIndex = Math.max(0, current.intervalIndex - 1);
      current.consecutiveCorrect = 0;
    }
    const next = new Date(attempt.timestamp);
    next.setDate(next.getDate() + (attempt.isCorrect ? REVIEW_INTERVALS[Math.max(0, current.intervalIndex)] : 1));
    current.nextReview = next.toISOString().slice(0, 10);
    current.lastReviewed = attempt.timestamp;
    state.reviews[key] = current;
  });
}
function streakFromAttempts() {
  const dates = [...new Set(state.attempts.map((attempt) => attempt.timestamp.slice(0, 10)))].sort();
  if (!dates.length) return 0;
  let streak = 1;
  for (let index = dates.length - 1; index > 0; index -= 1) {
    const later = new Date(`${dates[index]}T00:00:00`);
    const earlier = new Date(`${dates[index - 1]}T00:00:00`);
    if (Math.round((later - earlier) / 86400000) !== 1) break;
    streak += 1;
  }
  return streak;
}
function recalculateXP() {
  const answerXP = state.attempts.filter((attempt) => attempt.isCorrect).length * 10;
  const practiceBonuses = Math.floor(state.attempts.length / 10) * 50;
  const lessonXP = (state.profile.lessonsCompleted || 0) * 50;
  state.profile.xp = answerXP + practiceBonuses + lessonXP;
}
function resetRecentProgress(requestedCount) {
  const count = Math.min(Math.max(0, Number(requestedCount) || 0), state.attempts.length);
  if (!count) { state.resetModal = false; renderApp(); return; }
  const removed = state.attempts.splice(-count, count);
  const removedIds = new Set(removed.map((attempt) => `${attempt.questionId}::${attempt.timestamp}`));
  state.mistakes = state.mistakes.filter((mistake) => !removedIds.has(`${mistake.questionId}::${mistake.timestamp}`));
  rebuildReviewSchedules();
  recalculateXP();
  state.profile.streak = streakFromAttempts();
  state.profile.lastActiveDate = state.attempts.length ? state.attempts[state.attempts.length - 1].timestamp.slice(0, 10) : null;
  state.practice = baseState().practice;
  state.resetModal = false;
  state.view = "home";
  saveState();
  renderApp();
}
function nextPracticeQuestion() {
  if (!state.practice.answered) return;
  if (state.practice.index >= state.practice.queue.length - 1) { state.practice.completed = true; state.profile.xp += sessionBonus(); saveState(); renderApp(); return; }
  state.practice.index += 1; state.practice.answered = false; state.practice.lastAnswer = ""; state.practice.showChinese = false; state.practice.error = ""; saveState(); renderApp();
}
function sessionBonus() { return state.practice.queue.length >= 10 ? (state.practice.mode === "weak" ? 30 : 50) : 0; }

function icon(name) {
  const icons = { home: "⌂", learn: "◈", practice: "✦", weak: "↘", mistakes: "⌁", review: "↻", progress: "▥", report: "◒" };
  return icons[name] || "•";
}
const navItems = [
  ["home", "Home"], ["learn", "Learn"], ["practice", "Practice"], ["weak", "Weak Areas"], ["mistakes", "Mistake Book"], ["review", "Review"], ["progress", "Progress"], ["report", "Weekly Report"],
];

function resetDialog() {
  if (!state.resetModal) return "";
  const attempts = state.attempts.length;
  return `<div class="modal-backdrop"><section class="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><button class="modal-close" aria-label="Close reset options" data-action="close-reset">×</button><p class="kicker">Safety first</p><h2 id="reset-title">How much progress should we reset?</h2><p>Choose only the most recent answers. Older learning records, mistakes and review history will stay safe.</p><div class="reset-options"><button class="reset-option" data-action="reset-recent" data-count="1" ${attempts < 1 ? "disabled" : ""}><strong>Last 1 answer</strong><span>Remove the latest question</span></button><button class="reset-option" data-action="reset-recent" data-count="5" ${attempts < 5 ? "disabled" : ""}><strong>Last 5 answers</strong><span>Remove the latest short set</span></button><button class="reset-option" data-action="reset-recent" data-count="10" ${attempts < 10 ? "disabled" : ""}><strong>Last 10 answers</strong><span>Remove the latest practice session</span></button><button class="reset-option is-danger" data-action="reset-recent" data-count="all" ${attempts < 1 ? "disabled" : ""}><strong>Reset all progress</strong><span>Requires one more confirmation</span></button></div><p class="modal-footnote">This changes only the <strong>${escapeHTML(state.profile.name || "current")}</strong> account. Other accounts are not affected.</p></section></div>`;
}

function layout() {
  const topic = getTopic(state.profile.lastLessonTopic || state.selectedTopic);
  return `<div class="app-frame" id="app-frame">
    <aside class="sidebar" aria-label="Main navigation">
      <div class="brand"><span class="brand-mark">gc</span><span><span class="brand-name">Grammar Coach</span><span class="brand-tag">Year 6–7 English</span></span></div>
      <p class="sidebar-label">Your learning space</p>
      <nav class="nav-list">${navItems.map(([id, label]) => `<button class="nav-item ${state.view === id ? "is-active" : ""}" data-nav="${id}"><span class="nav-icon" aria-hidden="true">${icon(id)}</span><span>${label}</span></button>`).join("")}</nav>
      <div class="sidebar-footer">
        <div class="mode-card"><p>Explore with sample history, or start from zero.</p><div class="mode-toggle"><button class="mode-button ${state.mode === "fresh" ? "is-active" : ""}" data-action="mode" data-mode="fresh">Fresh</button><button class="mode-button ${state.mode === "demo" ? "is-active" : ""}" data-action="mode" data-mode="demo">Demo</button></div></div>
        <button class="nav-item" data-action="reset-progress" style="margin-top:8px;width:100%;"><span class="nav-icon" aria-hidden="true">⌫</span><span>Reset progress</span></button>
        <p class="sidebar-footnote">Saved privately in this browser.</p>
      </div>
    </aside>
    <div class="main-area">
      <header class="topbar"><div class="topbar-context"><button class="mobile-menu" data-action="toggle-sidebar" aria-label="Open navigation">☰</button><span>Grammar Coach</span><span aria-hidden="true">/</span><strong>${escapeHTML(navItems.find(([id]) => id === state.view)?.[1] || "Home")}</strong></div><div class="topbar-right"><span class="save-status"><span class="save-dot"></span><span id="save-status-text">Saved just now</span></span><div class="profile-chip"><span class="avatar">${escapeHTML((state.profile.name || "A").slice(0, 1).toUpperCase())}</span><label class="account-select-label" for="account-switcher">Account</label><select class="account-select" id="account-switcher" aria-label="Switch student account">${accountOptions()}</select><button class="add-account" data-action="add-account" aria-label="Add another account">＋</button></div></div></header>
      <main id="main-content" class="main-content"></main>
    </div>
  </div>${resetDialog()}`;
}

function pageIntro(kicker, title, description, action = "") {
  return `<div class="page-intro"><div><p class="kicker">${kicker}</p><h1 class="page-title">${title}</h1><p class="page-description">${description}</p></div>${action}</div>`;
}
function statCard(label, value, note, neutral = false) { return `<div class="stat-card"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-note ${neutral ? "neutral" : ""}">${note}</span></div>`; }
function renderHome() {
  const weak = weakAreas(3);
  const topic = getTopic(state.profile.lastLessonTopic || "present-perfect");
  const topicMastery = getStats().filter((stat) => stat.topicId === topic.id);
  const mastery = topicMastery.length ? Math.round(topicMastery.reduce((sum, stat) => sum + stat.mastery, 0) / topicMastery.length) : 0;
  const today = attemptsToday();
  const overall = overallAccuracy();
  return `${pageIntro("Good to see you", `Small steps. Strong grammar.`, `Learn the rule, try a question, and turn every mistake into a next step. Your coach is ready with ${questionBank.length} questions across ${topics.length} topics.`, `<button class="button button-primary" data-action="start-weak">Practice My Weak Areas <span aria-hidden="true">→</span></button>`)}
    <div class="hero-grid"><section class="hero-card"><p class="kicker">Today's goal</p><h2>${today ? "You have already started today." : "Ready for a focused grammar sprint?"}</h2><p>${today ? "Keep your streak going with a few more questions." : "Ten questions is enough to make a difference. Your feedback will shape what comes next."}</p><div class="goal-row"><div class="goal-number">${today}<span> / 10 questions</span></div><p class="goal-caption">about ${Math.max(0, 10 - today) * 1} min left</p></div>${renderBar(Math.min(100, (today / 10) * 100))}</section><div class="hero-side"><section class="streak-card"><div><h3>Current streak</h3><p>Come back tomorrow to keep it alive.</p></div><strong class="streak-value">${state.profile.streak}<small> days</small></strong></section><button class="continue-card" data-action="learn-topic" data-topic="${topic.id}"><span class="mini-label">Continue learning</span><strong>${topic.title}</strong><span class="continue-meta"><span>${mastery}% mastery</span><span class="mini-bar"><span style="width:${mastery}%"></span></span></span></button></div></div>
    <div class="section-heading"><h2>Learning snapshot</h2><p>Updated from this browser</p></div><div class="stat-grid">${statCard("XP", state.profile.xp.toLocaleString(), `Level ${getLevel()}`)}${statCard("Questions today", today, today >= 10 ? "Goal complete" : `${10 - today} to goal`, today >= 10)}${statCard("Weekly accuracy", `${overall}%`, state.attempts.length ? `${studyDays(7)} study days` : "Start practising", !state.attempts.length)}${statCard("Questions in bank", questionBank.length, "Across 8 topics", true)}</div>
    <div class="section-heading"><h2>Your next best practice</h2><p>Prioritised by weakness score</p></div><div class="content-grid"><section class="card card-pad"><div class="weak-list">${weak.map((item, index) => `<div class="weak-row"><span class="rank">${index + 1}</span><div class="weak-copy"><strong>${escapeHTML(item.subSkill)}</strong><small>${escapeHTML(item.topicTitle)} · ${item.attempts ? `${item.attempts} attempts` : "Not started"}</small>${renderBar(item.accuracy)}</div><span class="accuracy">${item.accuracy}%<small> accuracy</small></span></div>`).join("")}</div><div class="weak-footer"><a class="text-link" href="#" data-nav="weak">See all weak areas →</a><button class="button button-dark" data-action="start-weak">Practise these skills</button></div></section><section class="card card-pad"><p class="kicker">How it works</p><h2 style="margin:0;font-size:20px;letter-spacing:-.04em;">Learn → Practise → Understand</h2><p style="margin:10px 0 0;color:var(--ink-soft);font-size:12px;">Every answer gives you a clear reason. Your mistakes are saved in the Mistake Book, and the next practice set adjusts to what you need most.</p><div class="lesson-rule" style="margin:19px 0 0;"><strong>Coach tip</strong><p>${weak[0] && weak[0].attempts ? `Try ${weak[0].subSkill.toLowerCase()} again while the rule is fresh.` : "Start with one lesson, then try a Quick Check."}</p></div></section></div>`;
}

function renderLearn() {
  const selected = getTopic(state.selectedTopic);
  const stats = getStats().filter((stat) => stat.topicId === selected.id);
  const mastery = stats.length ? Math.round(stats.reduce((sum, item) => sum + item.mastery, 0) / stats.length) : 0;
  return `${pageIntro("Grammar library", "Learn the rule behind the answer.", "Pick a topic for a short explanation, examples, common mistakes and a Quick Check. Chinese explanations stay hidden until you ask for one.")}
    <div class="topic-grid">${topics.map((topic, index) => { const topicStats = getStats().filter((stat) => stat.topicId === topic.id); const value = topicStats.length ? Math.round(topicStats.reduce((sum, item) => sum + item.mastery, 0) / topicStats.length) : 0; return `<button class="topic-card ${topic.id === selected.id ? "is-selected" : ""}" data-action="select-topic" data-topic="${topic.id}"><span class="topic-number">${String(index + 1).padStart(2, "0")}</span><span class="topic-progress">${value}%</span><h3>${topic.title}</h3><p>${topic.short}</p></button>`; }).join("")}</div>
    <div class="section-heading"><h2>Lesson guide</h2><p>${selected.subSkills.length} sub-skills · ${mastery}% topic mastery</p></div><div class="lesson-layout"><section class="card"><div class="lesson-list">${["What is it?", "Grammar rule", "Examples", "Common mistakes", "Quick Check"].map((label, index) => `<button class="${index === 0 ? "is-active" : ""}"><strong>${label}</strong><small>${index === 0 ? selected.short : index === 1 ? "The one rule to remember" : index === 2 ? "See it in a sentence" : index === 3 ? "Catch the common trap" : "Try it now"}</small></button>`).join("")}</div></section><article class="card lesson-content"><div class="lesson-heading"><div><p class="kicker">${selected.title}</p><h2>${selected.short}</h2></div><span class="mastery-pill">${mastery}% mastery</span></div><div class="lesson-rule"><strong>Grammar rule</strong><p>${selected.rule}</p></div><div class="lesson-sections"><section><h3>Examples</h3><div class="lesson-example">${selected.example}</div></section><section><h3>Common mistakes</h3><ul><li>Checking only the word next to the verb.</li><li>Changing the verb form without checking the time clue.</li><li>Forgetting that meaning decides the right connector or article.</li></ul></section><section><h3>Sub-skills in this topic</h3><ul>${selected.subSkills.map((subSkill) => `<li>${subSkill}</li>`).join("")}</ul></section><section><h3>Quick reminder</h3><p>Say the whole sentence aloud. If it sounds unusual, look for the subject, time clue or relationship between ideas.</p></section></div><div class="lesson-actions"><button class="button button-primary" data-action="start-topic" data-topic="${selected.id}">Start practice <span aria-hidden="true">→</span></button><button class="button button-soft" data-action="start-topic" data-topic="${selected.id}" data-mode="quick">Quick Check · 1 question</button></div></article></div>`;
}

function renderQuestionInput(question) {
  if (question.questionType === "multiple-choice") return `<div class="question-form">${question.options.map((option, index) => `<label class="option-label"><input type="radio" name="answer" value="${escapeHTML(option)}" ${state.practice.answered && normalise(state.practice.lastAnswer) === normalise(option) ? "checked" : ""} ${state.practice.answered ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></label>`).join("")}</div>`;
  const placeholder = question.questionType === "fill-blank" ? "Type the missing word or words…" : "Type the corrected sentence…";
  return `<div class="question-form"><input class="answer-input" name="answer" type="text" autocomplete="off" placeholder="${placeholder}" value="${state.practice.answered ? escapeHTML(state.practice.lastAnswer) : ""}" ${state.practice.answered ? "disabled" : ""}></div>`;
}
function practiceModeLabel(mode) {
  if (mode === "weak") return "Targeted practice";
  if (mode === "review") return "Spaced review";
  if (mode === "retry") return "Retry incorrect answers";
  if (mode === "similar") return "Similar practice";
  return "Practice";
}
function renderCompletionNextSteps() {
  const wrongAnswers = sessionWrongAnswers();
  if (!wrongAnswers.length) return `<div class="completion-actions"><button class="button button-primary" data-nav="home">Back to home</button><button class="button button-soft" data-action="start-weak">Practise weak areas</button></div>`;
  const count = wrongAnswers.length;
  return `<div class="completion-next"><p class="kicker">Choose your next step</p><h3>Turn these mistakes into progress.</h3><p>You can see the exact answers again, or practise the same skills with new questions.</p><div class="completion-choice-grid"><button class="completion-choice" data-action="retry-mistakes"><strong>Redo ${count} incorrect ${count === 1 ? "answer" : "answers"}</strong><span>See the same ${count === 1 ? "question" : "questions"} again and check your understanding.</span></button><button class="completion-choice" data-action="similar-mistakes"><strong>Practise 5 similar questions</strong><span>New questions on the same grammar skills, so the rule sticks.</span></button></div><div class="completion-actions"><button class="button button-ghost" data-nav="home">Back to home</button></div></div>`;
}
function renderPractice() {
  if (!state.practice.queue.length) beginPractice("mixed");
  if (state.practice.completed) return `${pageIntro("Practice complete", "Nice work — you showed up for your grammar.", `You answered ${state.practice.queue.length} questions and earned ${state.practice.score * 10 + sessionBonus()} XP from this session.`)}<section class="completion-card"><div class="completion-icon">✓</div><h2>Session finished</h2><p>Your next review is already being scheduled from the answers you gave.</p><div class="completion-stats"><div><strong>${state.practice.score}/${state.practice.queue.length}</strong><span>correct</span></div><div><strong>+${state.practice.score * 10 + sessionBonus()}</strong><span>XP earned</span></div><div><strong>${overallAccuracy()}%</strong><span>overall accuracy</span></div></div>${renderCompletionNextSteps()}</section>`;
  const question = currentQuestion();
  if (!question) { state.practice.completed = true; return renderPractice(); }
  const topic = getTopic(question.topic);
  return `<div class="practice-shell">${pageIntro(practiceModeLabel(state.practice.mode), `${topic.title}`, `Question ${state.practice.index + 1} of ${state.practice.queue.length} · ${question.subSkill}`)}<div class="practice-header"><div class="practice-progress"><strong>${state.practice.score}</strong> correct so far</div><span class="tag orange">${question.questionType === "multiple-choice" ? "Multiple choice" : question.questionType === "fill-blank" ? "Fill in the blank" : "Correct the sentence"}</span></div><section class="question-card"><div class="question-meta"><span class="tag">${question.subSkill}</span><span class="tag neutral">${question.difficulty}</span><span class="tag neutral">${question.yearLevel}</span></div><h2>${escapeHTML(question.prompt)}</h2><form id="question-form" data-action="submit-answer">${renderQuestionInput(question)}<div class="question-footer"><span class="hint">Take your time — accuracy matters more than speed.</span>${state.practice.answered ? `<button class="button button-dark" type="button" data-action="next-question">${state.practice.index === state.practice.queue.length - 1 ? "Finish session" : "Next question"} <span aria-hidden="true">→</span></button>` : `<button class="button button-primary" type="submit">Check answer <span aria-hidden="true">→</span></button>`}</div>${state.practice.error ? `<p class="feedback is-wrong" style="margin-bottom:0;padding:11px;font-size:12px;">${state.practice.error}</p>` : ""}</form>${state.practice.answered ? renderFeedback(question) : ""}</section></div>`;
}
function renderFeedback(question) {
  const correct = answerMatches(question, state.practice.lastAnswer);
  return `<div class="feedback ${correct ? "is-correct" : "is-wrong"}"><div class="feedback-heading"><h3>${correct ? "Correct — nice thinking." : "Not quite yet. Now you know why."}</h3><span class="status-pill ${correct ? "strong" : "priority"}">${correct ? "+10 XP" : "Learn from this"}</span></div><p>${escapeHTML(question.explanation)}</p>${correct ? "" : answerDifferenceHint(question, state.practice.lastAnswer)}<div class="feedback-details"><div class="feedback-detail"><span>Your answer</span><strong>${escapeHTML(state.practice.lastAnswer)}</strong></div><div class="feedback-detail"><span>Correct answer</span><strong>${escapeHTML(question.correctAnswer)}</strong></div></div><div class="feedback-actions"><button class="button button-soft button-small" type="button" data-action="try-similar" data-skill="${skillKey(question.topic, question.subSkill)}" data-question-id="${question.id}">Try similar questions · 5 new</button><button class="button button-ghost button-small" type="button" data-action="toggle-chinese">${state.practice.showChinese ? "Hide 中文解释" : "中文解释"}</button></div>${state.practice.showChinese ? `<p class="chinese-note">${escapeHTML(question.chineseExplanation)}</p>` : ""}</div>`;
}

function renderWeakAreas() {
  const list = weakAreas();
  const top = list.slice(0, 3);
  return `${pageIntro("Coach's recommendation", "Practise what needs you most.", "Weakness is calculated at sub-skill level from recent performance, overall accuracy, spaced-review results and consecutive errors.", `<button class="button button-primary" data-action="start-weak">Practice Weak Areas <span aria-hidden="true">→</span></button>`)}<div class="weak-top-grid">${top.map((item, index) => `<article class="weak-feature"><span class="rank">${index + 1}</span><h3>${escapeHTML(item.subSkill)}</h3><p>${escapeHTML(item.topicTitle)}</p><div class="score-line"><span>Weakness score</span><strong>${item.weakness}</strong></div>${renderBar(item.weakness)}</article>`).join("")}</div><section class="card table-card"><div class="table-header"><h2>All sub-skills</h2><span class="parent-note">Higher weakness = higher priority</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Skill</th><th>Accuracy</th><th>Mastery</th><th>Attempts</th><th>Trend</th><th>Status</th><th></th></tr></thead><tbody>${list.map((item) => `<tr><td><strong>${escapeHTML(item.subSkill)}</strong><small>${escapeHTML(item.topicTitle)}</small></td><td><strong>${item.accuracy}%</strong>${renderBar(item.accuracy)}</td><td>${item.mastery}%</td><td>${item.attempts}</td><td class="${item.trendValue > 5 ? "trend-up" : item.trendValue < -5 ? "trend-down" : "trend-flat"}">${item.trendValue > 5 ? "↑" : item.trendValue < -5 ? "↓" : "→"} ${item.trend}</td><td><span class="status-pill ${statusClass(item.status)}">${item.status}</span></td><td><button class="button button-ghost button-small" data-action="practice-skill" data-skill="${item.key}">Practise</button></td></tr>`).join("")}</tbody></table></div></section>`;
}

function renderMistakes() {
  return `${pageIntro("Your learning notes", "The Mistake Book.", "Every wrong answer becomes a useful note: what you chose, what works, and why. Mark a note reviewed when the rule feels clear.")}${state.mistakes.length ? `<div class="mistake-list">${state.mistakes.map((mistake) => `<article class="mistake-card ${mistake.reviewed ? "is-reviewed" : ""}"><div class="mistake-heading"><div><p class="kicker">${escapeHTML(getTopic(mistake.topic).title)} · ${escapeHTML(mistake.subSkill)}</p><h3>${escapeHTML(mistake.prompt)}</h3></div>${mistake.reviewed ? `<span class="review-check">✓ Reviewed</span>` : `<span class="status-pill priority">Needs a retry</span>`}</div><div class="mistake-question">${escapeHTML(mistake.prompt)}</div><div class="mistake-meta"><span>Your answer: <strong>${escapeHTML(mistake.userAnswer)}</strong></span><span>Correct: <strong>${escapeHTML(mistake.correctAnswer)}</strong></span><span>${new Date(mistake.timestamp).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span><span>${mistake.previousMistakes || 0} previous on this skill</span></div><p class="mistake-explanation">${escapeHTML(mistake.explanation)}</p><div class="mistake-actions"><button class="button button-soft button-small" data-action="retry-mistake" data-question-id="${mistake.questionId}">Try again</button><button class="button button-ghost button-small" data-action="practice-skill" data-skill="${skillKey(mistake.topic, mistake.subSkill)}">Practise this skill · 5 new</button>${mistake.reviewed ? "" : `<button class="button button-ghost button-small" data-action="review-mistake" data-id="${escapeHTML(mistake.id)}">Mark reviewed</button>`}</div></article>`).join("")}</div>` : `<section class="card empty-state"><strong>Your Mistake Book is empty.</strong><span>That is a good thing. Try a practice question and your notes will appear here when you need them.</span></section>`}`;
}

function renderReview() {
  const due = dueReviews();
  const upcoming = getStats().filter((item) => item.attempts > 0 && state.reviews[item.key] && state.reviews[item.key].nextReview > TODAY()).sort((a, b) => state.reviews[a.key].nextReview.localeCompare(state.reviews[b.key].nextReview)).slice(0, 4);
  return `${pageIntro("Spaced review", due.length ? `${due.length} skills are ready to revisit.` : "Nothing urgent today.", due.length ? "Short review sessions protect what you have learned. Start with the highest-priority skill." : "You are all caught up. A little practice today will create the next review reminder.", due.length ? `<button class="button button-primary" data-action="start-review">Review due skills <span aria-hidden="true">→</span></button>` : `<button class="button button-soft" data-action="start-practice">Start a practice set <span aria-hidden="true">→</span></button>`)}<div class="review-grid"><section class="review-list">${due.length ? due.map((item) => `<article class="review-card"><div><p class="kicker">Due today</p><h3>${escapeHTML(item.subSkill)}</h3><p>${escapeHTML(item.topicTitle)} · ${item.mastery}% mastery · ${item.accuracy}% accuracy</p></div><div><span class="review-due">${item.weakness >= 70 ? "High priority" : "Ready now"}</span><button class="button button-dark button-small" style="margin-left:7px" data-action="review-skill" data-skill="${item.key}">Review</button></div></article>`).join("") : `<section class="card empty-state"><strong>Review queue clear</strong><span>Keep learning and the coach will space your next review at 1, 3, 7, 14 or 30 days.</span></section>`}</section><aside class="review-side"><h2>Your review rhythm</h2><p>Correct answers move a skill to a longer interval. A mistake brings it back sooner so the rule gets another chance.</p><div class="interval-list">${REVIEW_INTERVALS.map((days, index) => `<div class="interval-item"><span>Level ${index + 1}</span><strong>${days} day${days === 1 ? "" : "s"}</strong></div>`).join("")}</div>${upcoming.length ? `<p style="margin:20px 0 8px;color:#ffbd8f;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.08em;">Coming up</p><div class="interval-list">${upcoming.map((item) => `<div class="interval-item"><span>${escapeHTML(item.subSkill)}</span><strong>${state.reviews[item.key].nextReview.slice(5).replace("-", "/")}</strong></div>`).join("")}</div>` : ""}</aside></div>`;
}

function renderProgress() {
  const stats = getStats();
  const mastery = stats.length ? Math.round(stats.reduce((sum, item) => sum + item.mastery, 0) / stats.length) : 0;
  const mastered = stats.filter((item) => item.mastery >= 80).length;
  const topicsWithData = topics.map((topic) => { const items = stats.filter((item) => item.topicId === topic.id); return { ...topic, value: Math.round(items.reduce((sum, item) => sum + item.mastery, 0) / items.length) }; });
  return `${pageIntro("Your journey", "Progress you can feel.", "Mastery grows through repeated success over time. Accuracy tells you how you did; mastery tells you how ready you are to use the skill again.")}
    <div class="progress-layout"><section class="progress-hero"><p class="kicker">Overall mastery</p><h2>${mastery}% and moving</h2><div class="progress-ring" style="--progress:${mastery * 3.6}deg"><div class="ring" style="--progress:${mastery * 3.6}deg"><strong>${mastery}%</strong></div><div class="progress-hero-copy"><strong>Level ${getLevel()}</strong><p>${state.profile.xp.toLocaleString()} XP collected</p><p>${mastered} of ${stats.length} sub-skills mastered</p></div></div></section><section class="card card-pad"><div class="section-heading" style="margin:0 0 16px"><h2>Mastery by topic</h2><p>8-topic curriculum</p></div><div class="bar-list">${topicsWithData.map((topic) => `<div class="bar-row"><div><div class="bar-label"><strong>${escapeHTML(topic.title)}</strong><span>${topic.value}%</span></div><div class="bar"><span style="width:${topic.value}%"></span></div></div><div class="bar-value">${topic.value >= 80 ? "✓" : ""}</div></div>`).join("")}</div></section></div>
    <div class="section-heading"><h2>Milestones</h2><p>Keep the habit small and regular</p></div><section class="card card-pad"><div class="milestone-list"><div class="milestone"><span class="milestone-dot">✦</span><div><strong>${state.profile.streak >= 3 ? "Three-day rhythm" : "First practice"}</strong><span>${state.profile.streak >= 3 ? `${state.profile.streak}-day streak — consistency is a superpower.` : "Answer a few questions to start your streak."}</span></div></div><div class="milestone"><span class="milestone-dot">↗</span><div><strong>${state.profile.xp >= 1000 ? "1,000 XP club" : "First 100 XP"}</strong><span>${state.profile.xp >= 1000 ? "You are building real momentum." : `${Math.max(0, 100 - state.profile.xp)} XP to go.`}</span></div></div><div class="milestone"><span class="milestone-dot">✓</span><div><strong>${mastered ? `${mastered} skill${mastered === 1 ? "" : "s"} mastered` : "First skill mastered"}</strong><span>${mastered ? "Spaced review is helping it stick." : "Keep practising one sub-skill until your mastery reaches 80%."}</span></div></div></div></section>`;
}

function rangeAttempts(daysAgoStart, daysAgoEnd) {
  const now = Date.now();
  return state.attempts.filter((attempt) => { const age = (now - new Date(attempt.timestamp).getTime()) / 86400000; return age >= daysAgoStart && age < daysAgoEnd; });
}
function accuracyOf(attempts) { return attempts.length ? Math.round((attempts.filter((item) => item.isCorrect).length / attempts.length) * 100) : null; }
function renderReport() {
  const current = rangeAttempts(0, 7);
  const previous = rangeAttempts(7, 14);
  const currentAccuracy = accuracyOf(current) ?? 0;
  const previousAccuracy = accuracyOf(previous) ?? 0;
  const comparison = topics.map((topic) => { const now = current.filter((item) => item.topic === topic.id); const before = previous.filter((item) => item.topic === topic.id); return { topic, now: accuracyOf(now) ?? 0, before: accuracyOf(before) ?? 0, delta: (accuracyOf(now) ?? 0) - (accuracyOf(before) ?? 0) }; }).sort((a, b) => b.delta - a.delta);
  const weakest = weakAreas(1)[0];
  const commonError = state.mistakes.length ? state.mistakes.reduce((acc, mistake) => { const label = mistake.topic === "present-perfect" ? "Tense confusion" : mistake.topic === "articles" ? "Article choice" : mistake.topic === "conjunctions" ? "Joining ideas" : "Form or agreement"; acc[label] = (acc[label] || 0) + 1; return acc; }, {}) : {};
  const commonErrorType = Object.entries(commonError).sort((a, b) => b[1] - a[1])[0]?.[0] || "No pattern yet";
  const focus = weakAreas(2);
  return `${pageIntro("For you and your family", "Weekly Report.", "A one-minute view of the learning that happened this week, what improved, and what to focus on next.", `<span class="parent-note">Parent-friendly summary</span>`)}<div class="report-grid">${statCard("Questions answered", current.length, `${studyDays(7)} study days`, true)}${statCard("Accuracy", `${currentAccuracy}%`, `${previousAccuracy}% last week`, currentAccuracy >= previousAccuracy)}${statCard("Change", `${currentAccuracy - previousAccuracy >= 0 ? "+" : ""}${currentAccuracy - previousAccuracy} pts`, "vs previous week", currentAccuracy < previousAccuracy)}${statCard("Current streak", `${state.profile.streak} days`, `Level ${getLevel()}`, true)}</div><div class="report-two-column"><section class="report-card"><h2>Biggest improvement</h2><div class="report-highlight"><div><span>This week</span><strong>${comparison[0]?.now || 0}%</strong></div><span class="report-arrow">→</span><div><span>Last week</span><strong>${comparison[0]?.before || 0}%</strong><small>${escapeHTML(comparison[0]?.topic.title || "Your first topic")}</small></div></div><p class="report-note">${comparison[0] && comparison[0].delta > 0 ? `${comparison[0].topic.title} improved by ${comparison[0].delta} points. That usually means the rule is starting to feel familiar.` : "Keep collecting a few more answers so your next report can show a clearer trend."}</p></section><section class="report-card"><h2>Needs attention</h2><p style="margin:0;color:var(--ink-soft);font-size:12px;">Weakest skill</p><strong style="display:block;margin-top:4px;font-size:18px;">${weakest ? escapeHTML(weakest.subSkill) : "Not enough data yet"}</strong><p style="margin:3px 0 15px;color:var(--muted);font-size:11px;">${weakest ? `${weakest.accuracy}% accuracy · ${weakest.topicTitle}` : "Complete a practice question to begin."}</p><p style="margin:0;color:var(--ink-soft);font-size:12px;">Most common error</p><strong style="display:block;margin-top:4px;font-size:15px;">${commonErrorType}</strong></section></div><div class="section-heading"><h2>Recommended focus for next week</h2><p>Based on weakness score</p></div><section class="report-card"><ol class="focus-list">${focus.map((item) => `<li><span>${escapeHTML(item.subSkill)} <small style="color:var(--muted)">· ${escapeHTML(item.topicTitle)}</small></span></li>`).join("")}</ol><div class="lesson-rule" style="margin-bottom:0;"><strong>Coach's suggestion</strong><p>Start with one short lesson, then do a 10-question targeted practice set. Review mistakes the next day.</p></div></section>`;
}

function renderApp() {
  document.querySelector("#app").innerHTML = layout();
  const main = document.querySelector("#main-content");
  const views = { home: renderHome, learn: renderLearn, practice: renderPractice, weak: renderWeakAreas, mistakes: renderMistakes, review: renderReview, progress: renderProgress, report: renderReport };
  main.innerHTML = (views[state.view] || renderHome)();
}

const app = document.querySelector("#app");
app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-nav], [data-action]");
  if (!target) return;
  const nav = target.dataset.nav;
  const action = target.dataset.action;
  // The question form carries a data-action for submit handling, but its
  // children still need their native click behaviour (radio selection and
  // text-input focus). Do not cancel those clicks at the document level.
  if (action === "submit-answer") return;
  event.preventDefault();
  if (nav) { state.view = nav; document.querySelector("#app-frame")?.classList.remove("sidebar-open"); if (nav === "learn" && !state.selectedTopic) state.selectedTopic = "subject-verb"; renderApp(); return; }
  if (action === "toggle-sidebar") { document.querySelector("#app-frame")?.classList.toggle("sidebar-open"); return; }
  if (action === "mode") { const nextMode = target.dataset.mode; const nextState = nextMode === "demo" ? createDemoState() : freshState(); nextState.profile.name = state.profile.name; state = nextState; state.mode = nextMode; saveState(); renderApp(); return; }
  if (action === "add-account") { addAccount(); return; }
  if (action === "reset-progress") { state.resetModal = true; renderApp(); return; }
  if (action === "close-reset") { state.resetModal = false; renderApp(); return; }
  if (action === "reset-recent") { const count = target.dataset.count; if (count === "all") { if (window.confirm(`Reset all progress for ${state.profile.name || "this account"}? This cannot be undone.`)) resetRecentProgress(state.attempts.length); } else resetRecentProgress(Number(count)); return; }
  if (action === "start-weak") { beginPractice("weak"); return; }
  if (action === "retry-mistakes") { beginPracticeQueue("retry", sessionWrongAnswers().map((answer) => answer.questionId)); return; }
  if (action === "similar-mistakes") { beginPracticeQueue("similar", selectSimilarQuestions(sessionWrongAnswers(), 5)); return; }
  if (action === "start-practice") { beginPractice("mixed"); return; }
  if (action === "start-review") { beginPractice("review"); return; }
  if (action === "start-topic") { const quick = target.dataset.mode === "quick"; beginPractice(quick ? "quick" : "topic", target.dataset.topic, null, quick ? 1 : 10); return; }
  if (action === "select-topic") { state.selectedTopic = target.dataset.topic; saveState(); renderApp(); return; }
  if (action === "learn-topic") { state.selectedTopic = target.dataset.topic; state.view = "learn"; saveState(); renderApp(); return; }
  if (action === "practice-skill") { beginPractice("similar", null, target.dataset.skill, 5, attemptedIdsForSkill(target.dataset.skill)); return; }
  if (action === "retry-mistake") { beginPracticeQueue("retry", [target.dataset.questionId]); return; }
  if (action === "review-skill") { beginPractice("review", null, target.dataset.skill); return; }
  if (action === "next-question") { nextPracticeQuestion(); return; }
  if (action === "try-similar") { beginPractice("similar", null, target.dataset.skill, 5, attemptedIdsForSkill(target.dataset.skill)); return; }
  if (action === "toggle-chinese") { state.practice.showChinese = !state.practice.showChinese; renderApp(); return; }
  if (action === "review-mistake") { const mistake = state.mistakes.find((item) => item.id === target.dataset.id); if (mistake) { mistake.reviewed = true; saveState(); renderApp(); } }
});
app.addEventListener("change", (event) => { if (event.target.matches("#account-switcher")) switchAccount(event.target.value); });
app.addEventListener("submit", (event) => { if (event.target.matches("#question-form")) { event.preventDefault(); submitAnswer(event.target); } });
renderApp();
