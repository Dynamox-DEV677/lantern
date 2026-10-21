// Every word on screen. Marathi first, then Hindi, then English — in that order, in Maharashtra.
// The Marathi and Hindi are first drafts: have a native speaker read them before relying on them.

// The electricity board. Change these lines for another state.
export const REGION = {
  phone: '1912',
  utility: { mr: 'महावितरण', hi: 'महावितरण', en: 'MSEDCL' },
};

export const LANGS = [
  { code: 'mr', name: 'मराठी', locale: 'mr-IN-u-nu-latn' },
  { code: 'hi', name: 'हिंदी', locale: 'hi-IN-u-nu-latn' },
  { code: 'en', name: 'English', locale: 'en-IN' },
];

const en = {
  lang_title: 'Choose language',
  setup_area_title: 'Where is your home?',
  setup_area_why: "Lantern counts your report together with your neighbours', so it can tell whether it's just your home or the whole area.",
  setup_privacy: 'Only a pincode and a building or lane name. No name, no phone number, no GPS, no account.',
  pincode: 'Pincode',
  place: 'Building or lane name',
  place_hint: 'Use the same name your neighbours will use — or send them your invite link.',
  continue: 'Continue',
  solo: 'Use it on my own for now',
  join_title: 'Join your neighbours?',
  join_yes: 'Join',
  join_other: 'Enter a different area',
  pin_invalid: 'Enter a 6-digit pincode.',
  place_required: 'Enter your building or lane name.',

  on_status: 'Power is on',
  on_last: 'Last cut: {when}, {dur}',
  on_last_unknown: 'Last cut: {when}, length not known',
  on_none: 'No cuts logged yet.',
  btn_out: 'Power just went',
  btn_out_aria: 'Power just went. Tap to log a power cut.',
  btn_back: "Power's back",
  btn_back_aria: "Power's back. Tap when the power returns.",

  out_status: 'Power is out',
  out_since: '{dur} so far',
  out_started: 'Since {time}',
  just_now: 'Just now',
  undo: 'Tapped by mistake? Undo',
  undone: 'Removed.',
  back_done: "Power's back after {dur}.",
  today: 'today',
  yesterday: 'yesterday',

  verdict_unknown: 'Not enough neighbours using Lantern yet to tell.',
  verdict_unknown_do: 'Look out of a window — are other homes dark too?',
  verdict_need: 'Lantern needs 3 phones here. It has {n}.',
  verdict_mcb_link: 'Lights on next door? Check your own MCB board',
  verdict_area_most: "{out} of {users} nearby are out — it's the area.",
  verdict_area_some: "{out} of {users} nearby are out — it's not just you.",
  verdict_area_do: 'Nothing to fix inside your home.',
  verdict_only: 'You may be the only one out.',
  verdict_only_sub: '{others} others nearby use Lantern, and none of them has reported a cut.',
  verdict_back_others: '{n} nearby say their power is back.',
  offline_status: "No internet — can't check on neighbours right now.",
  checked_at: 'Last checked {time}',
  checking: 'Checking on neighbours…',
  no_area: "You're using Lantern on your own. Add your area to see whether neighbours are out too.",
  add_area: 'Add your area',

  mcb_1: 'Check your MCB board — if a switch is down, push it up.',
  mcb_warn: "If it trips again straight away, stop. Don't keep resetting it. That means there's a fault — call an electrician.",
  mcb_rccb: "If it's the RCCB/ELCB that's tripped, that's an earth-leakage fault. Don't reset it repeatedly at all.",
  mcb_last: 'All switches up and still nothing? Check your meter, then call {utility} on {phone}.',

  est_bucket: 'On {bucket}, cuts here usually last about {dur}.',
  est_all: 'Cuts here usually last about {dur}.',
  est_n: 'From {n} past cuts.',
  est_longer: 'This one has already gone on longer than usual.',
  est_none: 'Not enough past cuts yet to guess how long this one will last.',
  b_weekday_morning: 'weekday mornings',
  b_weekday_afternoon: 'weekday afternoons',
  b_weekday_evening: 'weekday evenings',
  b_weekday_night: 'weekday nights',
  b_weekend_morning: 'weekend mornings',
  b_weekend_afternoon: 'weekend afternoons',
  b_weekend_evening: 'weekend evenings',
  b_weekend_night: 'weekend nights',

  report_title: 'Has anyone told {utility}?',
  report_none: 'No one here has said they called yet.',
  report_done: 'A neighbour called {utility} at {time}. No need to call again.',
  report_me: 'You called {utility} at {time}.',
  report_call: 'Call {phone}',
  report_call_aria: 'Call {utility} on {phone}',
  report_called_btn: "I've called",
  report_solo: 'Report to {utility} · {phone}',

  ask_title: 'Is the power back?',
  ask_body: "You tapped 'Power just went' at {time}.",
  ask_when: 'When did it come back?',
  ask_now: 'Yes — just now',
  ask_hour: 'Yes — about an hour ago',
  ask_unsure: "Yes, but I'm not sure when",
  ask_still: "No, it's still out",
  auto_closed: "Your last cut was open for over 12 hours, so it was closed without a time. It won't count in the averages.",

  log_title: 'My log',
  log_empty: 'No cuts yet. When the power goes, tap the big button.',
  log_count: '{n} cuts logged',
  log_total: '{dur} without power in total',
  log_longest: 'Longest: {dur} ({date})',
  log_shortest: 'Shortest: {dur}',
  log_common_time: 'Usual time: {part}',
  part_morning: 'morning',
  part_afternoon: 'afternoon',
  part_evening: 'evening',
  part_night: 'night',
  log_worst_day: 'Worst day: {day} ({n} cuts)',
  log_unknown: 'length not known',
  log_open: 'still out',
  log_area_title: 'Your area',
  log_area_line: '{n} cuts in the last 90 days · shortest {min} · longest {max}',
  log_area_none: 'No finished cuts recorded in your area yet.',
  log_only_known: 'Averages only use cuts with a real start and a real end.',

  nav_log: 'My log',
  nav_neighbours: 'Neighbours',
  nav_settings: 'Settings',
  nav_back: 'Back',

  nb_title: 'Neighbours',
  nb_count: '{n} phones in {place} use Lantern.',
  nb_rule: "Lantern only says whether it's just you once at least 3 phones here use it. Until then, it says it doesn't know.",
  nb_invite: 'Invite neighbours',
  nb_invite_text: 'Lantern tells us whether a power cut is just one flat or the whole area. Join {place}:',
  nb_copied: 'Link copied.',
  nb_link: 'Or send this link:',
  nb_offline: 'Connect to the internet to see your neighbours.',
  nb_solo: "You haven't added your area yet.",

  set_title: 'Settings',
  set_lang: 'Language',
  set_area: 'Change area',
  set_area_now: 'Area: {place} ({pin})',
  set_area_none: 'No area — using Lantern on your own.',
  privacy_title: 'What Lantern stores',
  privacy_1: 'On this phone: your cuts, your language and your area.',
  privacy_2: 'On the server, only if you add an area: your pincode and building name, the times you tap, and a random number for this phone. No name, no phone number, no GPS, no account.',
  privacy_3: 'Neighbours only ever see counts — never which home tapped.',
  privacy_4: "It does show when someone is home and awake. That's why there is no name on it, and why you can delete all of it here.",
  delete_btn: 'Delete all my data',
  delete_confirm: 'Delete every cut on this phone and on the server? This cannot be undone.',
  deleted: 'Deleted.',
  about: 'Made for Neighborhood Hacks 2026, with help from Claude Code, an AI coding assistant.',
  source: 'Source code',

  offline_chip: 'Offline — everything still works',
  pending_chip: 'Offline · {n} waiting to send',
  install: 'Add Lantern to home screen',
};

const mr = {
  lang_title: 'भाषा निवडा',
  setup_area_title: 'तुमचं घर कुठे आहे?',
  setup_area_why: 'Lantern तुमची नोंद शेजाऱ्यांच्या नोंदींसोबत मोजतं — म्हणजे वीज फक्त तुमच्या घरची गेली की पूर्ण भागाची, ते कळतं.',
  setup_privacy: 'फक्त पिनकोड आणि इमारत किंवा गल्लीचं नाव. नाव नाही, फोन नंबर नाही, GPS नाही, खातं नाही.',
  pincode: 'पिनकोड',
  place: 'इमारत किंवा गल्लीचं नाव',
  place_hint: 'शेजारी वापरतील तेच नाव लिहा — किंवा त्यांना तुमची आमंत्रण लिंक पाठवा.',
  continue: 'पुढे',
  solo: 'सध्या एकट्याने वापरा',
  join_title: 'शेजाऱ्यांसोबत जोडायचं?',
  join_yes: 'जोडा',
  join_other: 'वेगळा भाग लिहा',
  pin_invalid: '6 अंकी पिनकोड लिहा.',
  place_required: 'इमारत किंवा गल्लीचं नाव लिहा.',

  on_status: 'वीज आहे',
  on_last: 'मागच्या वेळी: {when}, {dur}',
  on_last_unknown: 'मागच्या वेळी: {when}, किती वेळ ते माहीत नाही',
  on_none: 'अजून एकही नोंद नाही.',
  btn_out: 'वीज गेली',
  btn_out_aria: 'वीज गेली. वीज गेल्याची नोंद करण्यासाठी दाबा.',
  btn_back: 'वीज आली',
  btn_back_aria: 'वीज आली. वीज परत आल्यावर दाबा.',

  out_status: 'वीज गेली आहे',
  out_since: '{dur} झाले',
  out_started: '{time} पासून',
  just_now: 'आत्ताच',
  undo: 'चुकून दाबलं? रद्द करा',
  undone: 'काढून टाकलं.',
  back_done: '{dur} नंतर वीज आली.',
  today: 'आज',
  yesterday: 'काल',

  verdict_unknown: 'सांगता येईल इतके शेजारी अजून Lantern वापरत नाहीत.',
  verdict_unknown_do: 'खिडकीतून बघा — आजूबाजूच्या घरांतही अंधार आहे का?',
  verdict_need: 'इथे 3 फोन लागतात. आत्ता {n} आहेत.',
  verdict_mcb_link: 'शेजारी दिवे चालू आहेत? तुमचा MCB बोर्ड तपासा',
  verdict_area_most: 'जवळच्या {users} पैकी {out} जणांची वीज गेली आहे — पूर्ण भागाची वीज गेली आहे.',
  verdict_area_some: 'जवळच्या {users} पैकी {out} जणांची वीज गेली आहे — फक्त तुमची नाही.',
  verdict_area_do: 'घरात काही तपासायची गरज नाही.',
  verdict_only: 'कदाचित फक्त तुमचीच वीज गेली आहे.',
  verdict_only_sub: 'जवळचे आणखी {others} जण Lantern वापरतात, आणि त्यांच्यापैकी कोणीही वीज गेल्याचं कळवलेलं नाही.',
  verdict_back_others: 'जवळच्या {n} जणांनी वीज आल्याचं कळवलं आहे.',
  offline_status: 'इंटरनेट नाही — आत्ता शेजाऱ्यांचं कळू शकत नाही.',
  checked_at: 'शेवटचं तपासलं: {time}',
  checking: 'शेजाऱ्यांचं तपासत आहे…',
  no_area: 'तुम्ही Lantern एकट्याने वापरत आहात. शेजाऱ्यांची वीज गेली का ते कळण्यासाठी तुमचा भाग जोडा.',
  add_area: 'तुमचा भाग जोडा',

  mcb_1: 'तुमचा MCB बोर्ड तपासा — एखादा स्विच खाली गेला असेल (MCB trip झाला असेल), तर तो वर करा.',
  mcb_warn: 'तो लगेच पुन्हा trip झाला, तर थांबा. पुन्हा पुन्हा वर करू नका. याचा अर्थ कुठेतरी बिघाड आहे — इलेक्ट्रिशियनला बोलवा.',
  mcb_rccb: 'RCCB/ELCB trip झाला असेल, तर तो अर्थ-लीकेजचा बिघाड आहे. तो वारंवार अजिबात वर करू नका.',
  mcb_last: 'सगळे स्विच वर आहेत आणि तरी वीज नाही? मीटर तपासा, मग {utility} ला {phone} वर फोन करा.',

  est_bucket: '{bucket} इथे वीज साधारण {dur} जाते.',
  est_all: 'इथे वीज साधारण {dur} जाते.',
  est_n: 'मागच्या {n} वेळांवरून.',
  est_longer: 'या वेळी नेहमीपेक्षा जास्त वेळ झाला आहे.',
  est_none: 'ही किती वेळ चालेल ते सांगण्याइतक्या मागच्या नोंदी अजून नाहीत.',
  b_weekday_morning: 'आठवड्याच्या दिवशी सकाळी',
  b_weekday_afternoon: 'आठवड्याच्या दिवशी दुपारी',
  b_weekday_evening: 'आठवड्याच्या दिवशी संध्याकाळी',
  b_weekday_night: 'आठवड्याच्या दिवशी रात्री',
  b_weekend_morning: 'शनिवार-रविवारी सकाळी',
  b_weekend_afternoon: 'शनिवार-रविवारी दुपारी',
  b_weekend_evening: 'शनिवार-रविवारी संध्याकाळी',
  b_weekend_night: 'शनिवार-रविवारी रात्री',

  report_title: '{utility} ला कोणी कळवलं का?',
  report_none: 'इथल्या कोणीही अजून फोन केल्याचं सांगितलेलं नाही.',
  report_done: 'एका शेजाऱ्याने {time} ला {utility} ला फोन केला. पुन्हा फोन करायची गरज नाही.',
  report_me: 'तुम्ही {time} ला {utility} ला फोन केला.',
  report_call: '{phone} ला फोन करा',
  report_call_aria: '{utility} ला {phone} वर फोन करा',
  report_called_btn: 'मी फोन केला',
  report_solo: '{utility} ला कळवा · {phone}',

  ask_title: 'वीज आली का?',
  ask_body: "तुम्ही {time} ला 'वीज गेली' दाबलं होतं.",
  ask_when: 'वीज कधी आली?',
  ask_now: 'हो — आत्ताच',
  ask_hour: 'हो — साधारण तासाभरापूर्वी',
  ask_unsure: 'हो, पण कधी ते माहीत नाही',
  ask_still: 'नाही, अजून गेलेलीच आहे',
  auto_closed: 'तुमची मागची नोंद 12 तासांहून जास्त वेळ उघडी होती, म्हणून ती वेळेशिवाय बंद केली. ती सरासरीत मोजली जाणार नाही.',

  log_title: 'माझी नोंदवही',
  log_empty: 'अजून एकही नोंद नाही. वीज गेली की मोठं बटण दाबा.',
  log_count: '{n} वेळा वीज गेली',
  log_total: 'एकूण {dur} वीज नव्हती',
  log_longest: 'सगळ्यात जास्त: {dur} ({date})',
  log_shortest: 'सगळ्यात कमी: {dur}',
  log_common_time: 'नेहमीची वेळ: {part}',
  part_morning: 'सकाळ',
  part_afternoon: 'दुपार',
  part_evening: 'संध्याकाळ',
  part_night: 'रात्र',
  log_worst_day: 'सगळ्यात वाईट दिवस: {day} ({n} वेळा)',
  log_unknown: 'किती वेळ ते माहीत नाही',
  log_open: 'अजून गेलेली',
  log_area_title: 'तुमचा भाग',
  log_area_line: 'मागच्या 90 दिवसांत {n} वेळा · सगळ्यात कमी {min} · सगळ्यात जास्त {max}',
  log_area_none: 'तुमच्या भागात अजून एकही पूर्ण नोंद नाही.',
  log_only_known: 'सरासरीत फक्त सुरुवात आणि शेवट दोन्ही माहीत असलेल्या नोंदी मोजल्या जातात.',

  nav_log: 'माझी नोंदवही',
  nav_neighbours: 'शेजारी',
  nav_settings: 'सेटिंग्ज',
  nav_back: 'मागे',

  nb_title: 'शेजारी',
  nb_count: '{place} मध्ये {n} फोनवर Lantern आहे.',
  nb_rule: 'इथे किमान 3 फोनवर Lantern असल्याशिवाय, वीज फक्त तुमची गेली का ते Lantern सांगत नाही. तोपर्यंत ते "माहीत नाही" असंच सांगतं.',
  nb_invite: 'शेजाऱ्यांना बोलवा',
  nb_invite_text: 'वीज फक्त एका घरची गेली की पूर्ण भागाची, ते Lantern सांगतं. {place} मध्ये जोडा:',
  nb_copied: 'लिंक कॉपी झाली.',
  nb_link: 'किंवा ही लिंक पाठवा:',
  nb_offline: 'शेजारी बघण्यासाठी इंटरनेट लागेल.',
  nb_solo: 'तुम्ही अजून तुमचा भाग जोडलेला नाही.',

  set_title: 'सेटिंग्ज',
  set_lang: 'भाषा',
  set_area: 'भाग बदला',
  set_area_now: 'भाग: {place} ({pin})',
  set_area_none: 'भाग नाही — Lantern एकट्याने वापरत आहात.',
  privacy_title: 'Lantern काय साठवतं',
  privacy_1: 'या फोनवर: तुमच्या नोंदी, तुमची भाषा आणि तुमचा भाग.',
  privacy_2: 'भाग जोडला तरच सर्व्हरवर: पिनकोड आणि इमारतीचं नाव, तुम्ही बटण दाबल्याच्या वेळा, आणि या फोनसाठी एक रँडम नंबर. नाव नाही, फोन नंबर नाही, GPS नाही, खातं नाही.',
  privacy_3: 'शेजाऱ्यांना फक्त आकडे दिसतात — कोणत्या घराने दाबलं ते कधीच नाही.',
  privacy_4: 'यावरून कोणी कधी घरी आणि जागं आहे ते कळू शकतं. म्हणूनच यात नाव नाही, आणि इथून सगळं पुसता येतं.',
  delete_btn: 'माझा सगळा डेटा पुसा',
  delete_confirm: 'या फोनवरच्या आणि सर्व्हरवरच्या सगळ्या नोंदी पुसायच्या? हे परत आणता येणार नाही.',
  deleted: 'पुसलं.',
  about: 'Neighborhood Hacks 2026 साठी बनवलं, Claude Code या AI कोडिंग सहाय्यकाच्या मदतीने.',
  source: 'सोर्स कोड',

  offline_chip: 'इंटरनेट नाही — तरीही सगळं चालतं',
  pending_chip: 'इंटरनेट नाही · {n} नोंदी पाठवायच्या बाकी',
  install: 'Lantern होम स्क्रीनवर ठेवा',
};

const hi = {
  lang_title: 'भाषा चुनें',
  setup_area_title: 'आपका घर कहाँ है?',
  setup_area_why: 'Lantern आपकी रिपोर्ट को पड़ोसियों की रिपोर्ट के साथ गिनता है — ताकि पता चले कि बिजली सिर्फ़ आपके घर की गई है या पूरे इलाके की।',
  setup_privacy: 'सिर्फ़ पिनकोड और बिल्डिंग या गली का नाम। न नाम, न फ़ोन नंबर, न GPS, न अकाउंट।',
  pincode: 'पिनकोड',
  place: 'बिल्डिंग या गली का नाम',
  place_hint: 'वही नाम लिखें जो पड़ोसी लिखेंगे — या उन्हें अपना इनवाइट लिंक भेजें।',
  continue: 'आगे',
  solo: 'अभी अकेले इस्तेमाल करें',
  join_title: 'पड़ोसियों से जुड़ें?',
  join_yes: 'जुड़ें',
  join_other: 'दूसरा इलाका लिखें',
  pin_invalid: '6 अंकों का पिनकोड लिखें।',
  place_required: 'बिल्डिंग या गली का नाम लिखें।',

  on_status: 'बिजली है',
  on_last: 'पिछली बार: {when}, {dur}',
  on_last_unknown: 'पिछली बार: {when}, कितनी देर यह पता नहीं',
  on_none: 'अभी तक कोई रिकॉर्ड नहीं।',
  btn_out: 'बिजली गई',
  btn_out_aria: 'बिजली गई। बिजली जाने का रिकॉर्ड करने के लिए दबाएँ।',
  btn_back: 'बिजली आ गई',
  btn_back_aria: 'बिजली आ गई। बिजली लौटने पर दबाएँ।',

  out_status: 'बिजली गई है',
  out_since: '{dur} हो गए',
  out_started: '{time} से',
  just_now: 'अभी-अभी',
  undo: 'गलती से दबाया? हटाएँ',
  undone: 'हटा दिया।',
  back_done: '{dur} बाद बिजली आई।',
  today: 'आज',
  yesterday: 'कल',

  verdict_unknown: 'अभी इतने पड़ोसी Lantern इस्तेमाल नहीं करते कि बताया जा सके।',
  verdict_unknown_do: 'खिड़की से देखिए — क्या आसपास के घरों में भी अँधेरा है?',
  verdict_need: 'यहाँ 3 फ़ोन चाहिए। अभी {n} हैं।',
  verdict_mcb_link: 'पड़ोस में बत्ती जल रही है? अपना MCB बोर्ड देखिए',
  verdict_area_most: 'पास के {users} में से {out} की बिजली गई है — पूरे इलाके की गई है।',
  verdict_area_some: 'पास के {users} में से {out} की बिजली गई है — सिर्फ़ आपकी नहीं।',
  verdict_area_do: 'घर में कुछ ठीक करने की ज़रूरत नहीं।',
  verdict_only: 'शायद सिर्फ़ आपकी ही बिजली गई है।',
  verdict_only_sub: 'पास के {others} और लोग Lantern इस्तेमाल करते हैं, और उनमें से किसी ने बिजली जाने की बात नहीं बताई।',
  verdict_back_others: 'पास के {n} लोगों ने बताया है कि उनकी बिजली आ गई है।',
  offline_status: 'इंटरनेट नहीं है — अभी पड़ोसियों का पता नहीं चल सकता।',
  checked_at: 'आख़िरी बार देखा: {time}',
  checking: 'पड़ोसियों का पता कर रहे हैं…',
  no_area: 'आप Lantern अकेले इस्तेमाल कर रहे हैं। पड़ोसियों की बिजली गई या नहीं, यह जानने के लिए अपना इलाका जोड़ें।',
  add_area: 'अपना इलाका जोड़ें',

  mcb_1: 'अपना MCB बोर्ड देखिए — अगर कोई स्विच नीचे है, तो उसे ऊपर कीजिए।',
  mcb_warn: 'अगर वह तुरंत फिर से ट्रिप हो जाए, तो रुक जाइए। बार-बार ऊपर मत कीजिए। इसका मतलब कहीं खराबी है — इलेक्ट्रीशियन को बुलाइए।',
  mcb_rccb: 'अगर RCCB/ELCB ट्रिप हुआ है, तो यह अर्थ-लीकेज की खराबी है। उसे बार-बार बिल्कुल ऊपर मत कीजिए।',
  mcb_last: 'सारे स्विच ऊपर हैं और फिर भी बिजली नहीं? मीटर देखिए, फिर {utility} को {phone} पर फ़ोन कीजिए।',

  est_bucket: '{bucket} यहाँ बिजली आम तौर पर {dur} जाती है।',
  est_all: 'यहाँ बिजली आम तौर पर {dur} जाती है।',
  est_n: 'पिछले {n} कट के आधार पर।',
  est_longer: 'इस बार आम से ज़्यादा देर हो चुकी है।',
  est_none: 'यह कितनी देर चलेगा, यह बताने लायक पिछले रिकॉर्ड अभी नहीं हैं।',
  b_weekday_morning: 'हफ़्ते के दिनों में सुबह',
  b_weekday_afternoon: 'हफ़्ते के दिनों में दोपहर को',
  b_weekday_evening: 'हफ़्ते के दिनों में शाम को',
  b_weekday_night: 'हफ़्ते के दिनों में रात को',
  b_weekend_morning: 'शनिवार-रविवार को सुबह',
  b_weekend_afternoon: 'शनिवार-रविवार को दोपहर में',
  b_weekend_evening: 'शनिवार-रविवार को शाम को',
  b_weekend_night: 'शनिवार-रविवार को रात में',

  report_title: 'क्या किसी ने {utility} को बताया?',
  report_none: 'यहाँ अभी किसी ने नहीं बताया कि उन्होंने फ़ोन किया है।',
  report_done: 'एक पड़ोसी ने {time} बजे {utility} को फ़ोन किया। दोबारा फ़ोन करने की ज़रूरत नहीं।',
  report_me: 'आपने {time} बजे {utility} को फ़ोन किया।',
  report_call: '{phone} पर फ़ोन करें',
  report_call_aria: '{utility} को {phone} पर फ़ोन करें',
  report_called_btn: 'मैंने फ़ोन कर दिया',
  report_solo: '{utility} को बताएँ · {phone}',

  ask_title: 'क्या बिजली आ गई?',
  ask_body: "आपने {time} बजे 'बिजली गई' दबाया था।",
  ask_when: 'बिजली कब आई?',
  ask_now: 'हाँ — अभी-अभी',
  ask_hour: 'हाँ — करीब एक घंटा पहले',
  ask_unsure: 'हाँ, पर पता नहीं कब',
  ask_still: 'नहीं, अभी भी गई है',
  auto_closed: 'आपकी पिछली रिपोर्ट 12 घंटे से ज़्यादा खुली थी, इसलिए उसे बिना समय के बंद कर दिया। वह औसत में नहीं गिनी जाएगी।',

  log_title: 'मेरा रिकॉर्ड',
  log_empty: 'अभी कोई रिकॉर्ड नहीं। बिजली जाए तो बड़ा बटन दबाइए।',
  log_count: '{n} बार बिजली गई',
  log_total: 'कुल {dur} बिना बिजली',
  log_longest: 'सबसे लंबा: {dur} ({date})',
  log_shortest: 'सबसे छोटा: {dur}',
  log_common_time: 'आम तौर पर: {part}',
  part_morning: 'सुबह',
  part_afternoon: 'दोपहर',
  part_evening: 'शाम',
  part_night: 'रात',
  log_worst_day: 'सबसे बुरा दिन: {day} ({n} बार)',
  log_unknown: 'कितनी देर यह पता नहीं',
  log_open: 'अभी भी गई है',
  log_area_title: 'आपका इलाका',
  log_area_line: 'पिछले 90 दिनों में {n} बार · सबसे छोटा {min} · सबसे लंबा {max}',
  log_area_none: 'आपके इलाके में अभी कोई पूरा रिकॉर्ड नहीं है।',
  log_only_known: 'औसत में सिर्फ़ वही रिकॉर्ड गिने जाते हैं जिनका शुरू और ख़त्म दोनों पता हो।',

  nav_log: 'मेरा रिकॉर्ड',
  nav_neighbours: 'पड़ोसी',
  nav_settings: 'सेटिंग्स',
  nav_back: 'वापस',

  nb_title: 'पड़ोसी',
  nb_count: '{place} में {n} फ़ोन पर Lantern है।',
  nb_rule: 'जब तक यहाँ कम से कम 3 फ़ोन पर Lantern न हो, यह नहीं बताता कि बिजली सिर्फ़ आपकी गई है। तब तक यह कहता है कि पता नहीं।',
  nb_invite: 'पड़ोसियों को बुलाएँ',
  nb_invite_text: 'Lantern बताता है कि बिजली सिर्फ़ एक घर की गई है या पूरे इलाके की। {place} से जुड़ें:',
  nb_copied: 'लिंक कॉपी हो गया।',
  nb_link: 'या यह लिंक भेजें:',
  nb_offline: 'पड़ोसी देखने के लिए इंटरनेट चाहिए।',
  nb_solo: 'आपने अभी अपना इलाका नहीं जोड़ा है।',

  set_title: 'सेटिंग्स',
  set_lang: 'भाषा',
  set_area: 'इलाका बदलें',
  set_area_now: 'इलाका: {place} ({pin})',
  set_area_none: 'कोई इलाका नहीं — Lantern अकेले इस्तेमाल हो रहा है।',
  privacy_title: 'Lantern क्या रखता है',
  privacy_1: 'इस फ़ोन पर: आपके रिकॉर्ड, आपकी भाषा और आपका इलाका।',
  privacy_2: 'इलाका जोड़ने पर ही सर्वर पर: पिनकोड और बिल्डिंग का नाम, आपने बटन कब दबाया, और इस फ़ोन का एक रैंडम नंबर। न नाम, न फ़ोन नंबर, न GPS, न अकाउंट।',
  privacy_3: 'पड़ोसियों को सिर्फ़ गिनती दिखती है — कभी नहीं कि किस घर ने दबाया।',
  privacy_4: 'इससे पता चल सकता है कि कोई कब घर पर और जागा है। इसीलिए इसमें कोई नाम नहीं है, और यहाँ से सब मिटाया जा सकता है।',
  delete_btn: 'मेरा सारा डेटा मिटाएँ',
  delete_confirm: 'इस फ़ोन और सर्वर से सारे रिकॉर्ड मिटाएँ? यह वापस नहीं होगा।',
  deleted: 'मिटा दिया।',
  about: 'Neighborhood Hacks 2026 के लिए बनाया, Claude Code नाम के AI कोडिंग सहायक की मदद से।',
  source: 'सोर्स कोड',

  offline_chip: 'इंटरनेट नहीं — फिर भी सब चलता है',
  pending_chip: 'इंटरनेट नहीं · {n} रिपोर्ट भेजनी बाकी',
  install: 'Lantern को होम स्क्रीन पर रखें',
};

const STRINGS = { en, mr, hi };

export function langInfo(code) {
  return LANGS.find((l) => l.code === code) || LANGS[2];
}

export function makeT(code) {
  const table = STRINGS[code] || en;
  const fixed = { utility: REGION.utility[code] || REGION.utility.en, phone: REGION.phone };
  return (key, vars = {}) => {
    const s = table[key] ?? en[key] ?? key;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : k in fixed ? fixed[k] : m));
  };
}

export function fmtDuration(ms, code) {
  const total = Math.max(0, Math.round(ms / 60e3));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (code === 'mr') {
    if (!h) return `${m} मिनिटे`;
    return m ? `${h} तास ${m} मि.` : `${h} तास`;
  }
  if (code === 'hi') {
    const hours = h === 1 ? 'घंटा' : 'घंटे';
    if (!h) return `${m} मिनट`;
    return m ? `${h} ${hours} ${m} मि.` : `${h} ${hours}`;
  }
  if (!h) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function fmtTime(ms, code) {
  return new Intl.DateTimeFormat(langInfo(code).locale, { hour: 'numeric', minute: '2-digit' }).format(ms);
}

export function fmtDate(ms, code) {
  return new Intl.DateTimeFormat(langInfo(code).locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(ms);
}

export function dayName(day, code) {
  // 2023-01-01 was a Sunday, so day 0..6 maps onto 1..7 Jan.
  return new Intl.DateTimeFormat(langInfo(code).locale, { weekday: 'long' }).format(new Date(2023, 0, 1 + day));
}

// "today 7:42 pm", "yesterday 9:10 am", or "Mon 20 Oct"
export function fmtWhen(ms, code, now = Date.now()) {
  const t = makeT(code);
  const d = new Date(ms);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (d >= start) return `${t('today')} ${fmtTime(ms, code)}`;
  if (d >= start.getTime() - 86400e3) return `${t('yesterday')} ${fmtTime(ms, code)}`;
  return fmtDate(ms, code);
}
