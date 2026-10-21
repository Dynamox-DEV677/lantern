// Every word on screen. English by default; Tamil and Hindi one tap away. Chennai.
// The Tamil and Hindi are first drafts: have a native speaker read them before relying on them.

// The electricity board. Change these lines for another state.
export const REGION = {
  phone: '9498794987', // TNPDCL's 24-hour Minnagam complaint line
  phoneLabel: '94987 94987',
  utility: { en: 'the EB', ta: 'மின்வாரியம்', hi: 'EB' },
};

export const LANGS = [
  { code: 'en', name: 'English', locale: 'en-IN' },
  { code: 'ta', name: 'தமிழ்', locale: 'ta-IN-u-nu-latn' },
  { code: 'hi', name: 'हिंदी', locale: 'hi-IN-u-nu-latn' },
];

const en = {
  setup_area_title: 'Where is your home?',
  setup_area_why: "Lantern counts your report together with your neighbours', so it can tell whether it's just your home or the whole area.",
  setup_privacy: 'Only a pincode and a building or street name. No name, no phone number, no GPS, no account.',
  pincode: 'Pincode',
  place: 'Building or street name',
  place_hint: 'Use the same name your neighbours will use — or send them your invite link.',
  continue: 'Continue',
  solo: 'Use it on my own for now',
  join_title: 'Join your neighbours?',
  join_yes: 'Join',
  join_other: 'Enter a different area',
  pin_invalid: 'Enter a 6-digit pincode.',
  place_required: 'Enter your building or street name.',

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
  report_line: 'TNPDCL Minnagam · 24 hours',
  report_none: 'No one here has said they called yet.',
  report_done: 'A neighbour called {utility} at {time}. No need to call again.',
  report_me: 'You called {utility} at {time}.',
  report_call: 'Call {phone}',
  report_call_aria: 'Call {utility} on {phone}',
  report_called_btn: "I've called",
  report_solo: 'Report to {utility} · {phone}',

  ask_title: 'Is the power back?',
  ask_body: "You tapped 'Power just went' at {time}.",
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

// Tamil as it's spoken in Chennai: "கரண்ட் போச்சு", not the textbook "மின்சாரம் தடைபட்டது".
const ta = {
  setup_area_title: 'உங்கள் வீடு எங்கே இருக்கு?',
  setup_area_why: 'Lantern உங்கள் தகவலை அக்கம்பக்கத்தினரின் தகவலோடு சேர்த்து எண்ணும் — அதனால் கரண்ட் உங்கள் வீட்டில் மட்டும் போனதா, முழு ஏரியாவிலும் போனதா என்று தெரியும்.',
  setup_privacy: 'பின்கோடும் கட்டடம் அல்லது தெருவின் பெயரும் மட்டும். பெயர் இல்லை, போன் நம்பர் இல்லை, GPS இல்லை, கணக்கு இல்லை.',
  pincode: 'பின்கோடு',
  place: 'கட்டடம் அல்லது தெருவின் பெயர்',
  place_hint: 'அக்கம்பக்கத்தினர் எழுதும் அதே பெயரை எழுதுங்கள் — அல்லது அவர்களுக்கு உங்கள் அழைப்பு லிங்கை அனுப்புங்கள்.',
  continue: 'தொடரவும்',
  solo: 'இப்போதைக்கு நான் மட்டும் பயன்படுத்துகிறேன்',
  join_title: 'அக்கம்பக்கத்தினருடன் சேரலாமா?',
  join_yes: 'சேருங்கள்',
  join_other: 'வேறு ஏரியாவை எழுதுங்கள்',
  pin_invalid: '6 இலக்க பின்கோடை எழுதுங்கள்.',
  place_required: 'கட்டடம் அல்லது தெருவின் பெயரை எழுதுங்கள்.',

  on_status: 'கரண்ட் இருக்கு',
  on_last: 'கடைசியாக: {when}, {dur}',
  on_last_unknown: 'கடைசியாக: {when}, எவ்வளவு நேரம் என்று தெரியாது',
  on_none: 'இன்னும் எதுவும் பதிவாகவில்லை.',
  btn_out: 'கரண்ட் போச்சு',
  btn_out_aria: 'கரண்ட் போச்சு. கரண்ட் போனதைப் பதிவு செய்ய அழுத்துங்கள்.',
  btn_back: 'கரண்ட் வந்துடுச்சு',
  btn_back_aria: 'கரண்ட் வந்துடுச்சு. கரண்ட் திரும்ப வந்ததும் அழுத்துங்கள்.',

  out_status: 'கரண்ட் இல்லை',
  out_since: '{dur} ஆச்சு',
  out_started: '{time} முதல்',
  just_now: 'இப்போதுதான்',
  undo: 'தவறுதலாக அழுத்தினீர்களா? நீக்குங்கள்',
  undone: 'நீக்கப்பட்டது.',
  back_done: '{dur} கழித்து கரண்ட் வந்தது.',
  today: 'இன்று',
  yesterday: 'நேற்று',

  verdict_unknown: 'சொல்லும் அளவுக்கு அக்கம்பக்கத்தினர் இன்னும் Lantern பயன்படுத்தவில்லை.',
  verdict_unknown_do: 'ஜன்னல் வழியாகப் பாருங்கள் — பக்கத்து வீடுகளிலும் இருட்டாக இருக்கிறதா?',
  verdict_need: 'இங்கே 3 போன்கள் வேண்டும். இப்போது {n} உள்ளன.',
  verdict_mcb_link: 'பக்கத்து வீட்டில் லைட் எரிகிறதா? உங்கள் MCB போர்டைப் பாருங்கள்',
  verdict_area_most: 'அருகிலுள்ள {users} பேரில் {out} பேருக்கு கரண்ட் இல்லை — முழு ஏரியாவிலும் போயிருக்கிறது.',
  verdict_area_some: 'அருகிலுள்ள {users} பேரில் {out} பேருக்கு கரண்ட் இல்லை — உங்களுக்கு மட்டும் இல்லை.',
  verdict_area_do: 'வீட்டுக்குள் எதையும் சரிசெய்ய வேண்டியதில்லை.',
  verdict_only: 'ஒருவேளை உங்களுக்கு மட்டும்தான் கரண்ட் போயிருக்கலாம்.',
  verdict_only_sub: 'அருகில் இன்னும் {others} பேர் Lantern பயன்படுத்துகிறார்கள்; அவர்களில் யாரும் கரண்ட் போனதாகச் சொல்லவில்லை.',
  verdict_back_others: 'அருகிலுள்ள {n} பேர் தங்களுக்கு கரண்ட் வந்துவிட்டதாகச் சொல்கிறார்கள்.',
  offline_status: 'இன்டர்நெட் இல்லை — இப்போது அக்கம்பக்கத்தைப் பார்க்க முடியாது.',
  checked_at: 'கடைசியாகப் பார்த்தது: {time}',
  checking: 'அக்கம்பக்கத்தைப் பார்க்கிறது…',
  no_area: 'நீங்கள் Lantern-ஐ தனியாகப் பயன்படுத்துகிறீர்கள். அக்கம்பக்கத்தினருக்கும் கரண்ட் போனதா என்று தெரிய, உங்கள் ஏரியாவைச் சேருங்கள்.',
  add_area: 'உங்கள் ஏரியாவைச் சேருங்கள்',

  mcb_1: 'உங்கள் MCB போர்டைப் பாருங்கள் — ஏதாவது சுவிட்ச் கீழே இறங்கியிருந்தால் (MCB trip ஆகியிருந்தால்), அதை மேலே தூக்குங்கள்.',
  mcb_warn: 'உடனே மறுபடியும் trip ஆனால், நிறுத்துங்கள். திரும்பத் திரும்ப மேலே தூக்காதீர்கள். எங்கோ கோளாறு இருக்கிறது என்று அர்த்தம் — எலக்ட்ரீஷியனைக் கூப்பிடுங்கள்.',
  mcb_rccb: 'RCCB/ELCB trip ஆகியிருந்தால், அது மின்கசிவு (earth leakage) கோளாறு. அதைத் திரும்பத் திரும்ப மேலே தூக்கவே கூடாது.',
  mcb_last: 'எல்லா சுவிட்சும் மேலே இருந்தும் கரண்ட் இல்லையா? மீட்டரைப் பாருங்கள், பிறகு மின்வாரியத்தை {phone} எண்ணில் அழையுங்கள்.',

  est_bucket: '{bucket} இங்கே கரண்ட் பொதுவாக சுமார் {dur} போகும்.',
  est_all: 'இங்கே கரண்ட் பொதுவாக சுமார் {dur} போகும்.',
  est_n: 'கடந்த {n} முறைகளை வைத்து.',
  est_longer: 'இந்த முறை வழக்கத்தைவிட அதிக நேரம் ஆகிவிட்டது.',
  est_none: 'இது எவ்வளவு நேரம் நீடிக்கும் என்று சொல்லும் அளவுக்குப் பழைய பதிவுகள் இன்னும் இல்லை.',
  b_weekday_morning: 'வார நாட்களில் காலையில்',
  b_weekday_afternoon: 'வார நாட்களில் மதியம்',
  b_weekday_evening: 'வார நாட்களில் மாலையில்',
  b_weekday_night: 'வார நாட்களில் இரவில்',
  b_weekend_morning: 'சனி, ஞாயிறு காலையில்',
  b_weekend_afternoon: 'சனி, ஞாயிறு மதியம்',
  b_weekend_evening: 'சனி, ஞாயிறு மாலையில்',
  b_weekend_night: 'சனி, ஞாயிறு இரவில்',

  report_title: 'மின்வாரியத்துக்கு யாராவது சொன்னார்களா?',
  report_line: 'TNPDCL மின்னகம் · 24 மணி நேரமும்',
  report_none: 'இங்கே யாரும் இன்னும் போன் செய்ததாகச் சொல்லவில்லை.',
  report_done: 'ஒரு பக்கத்து வீட்டுக்காரர் {time} மணிக்கு மின்வாரியத்துக்கு போன் செய்தார். மறுபடியும் அழைக்க வேண்டாம்.',
  report_me: 'நீங்கள் {time} மணிக்கு மின்வாரியத்துக்கு போன் செய்தீர்கள்.',
  report_call: '{phone} அழையுங்கள்',
  report_call_aria: 'மின்வாரியத்தை {phone} எண்ணில் அழையுங்கள்',
  report_called_btn: 'நான் போன் செய்துவிட்டேன்',
  report_solo: 'மின்வாரியத்துக்குச் சொல்லுங்கள் · {phone}',

  ask_title: 'கரண்ட் வந்துவிட்டதா?',
  ask_body: "நீங்கள் {time} 'கரண்ட் போச்சு' அழுத்தினீர்கள்.",
  ask_now: 'ஆமாம் — இப்போதுதான்',
  ask_hour: 'ஆமாம் — சுமார் ஒரு மணி நேரம் முன்பு',
  ask_unsure: 'ஆமாம், ஆனால் எப்போது என்று தெரியாது',
  ask_still: 'இல்லை, இன்னும் கரண்ட் இல்லை',
  auto_closed: 'உங்கள் கடைசிப் பதிவு 12 மணி நேரத்துக்கு மேல் திறந்திருந்தது, அதனால் நேரம் இல்லாமல் மூடப்பட்டது. அது சராசரியில் சேர்க்கப்படாது.',

  log_title: 'என் பதிவேடு',
  log_empty: 'இன்னும் எதுவும் இல்லை. கரண்ட் போனால், பெரிய பட்டனை அழுத்துங்கள்.',
  log_count: '{n} முறை கரண்ட் போனது',
  log_total: 'மொத்தம் {dur} கரண்ட் இல்லை',
  log_longest: 'அதிக நேரம்: {dur} ({date})',
  log_shortest: 'குறைந்த நேரம்: {dur}',
  log_common_time: 'வழக்கமான நேரம்: {part}',
  part_morning: 'காலை',
  part_afternoon: 'மதியம்',
  part_evening: 'மாலை',
  part_night: 'இரவு',
  log_worst_day: 'மோசமான நாள்: {day} ({n} முறை)',
  log_unknown: 'எவ்வளவு நேரம் என்று தெரியாது',
  log_open: 'இன்னும் இல்லை',
  log_area_title: 'உங்கள் ஏரியா',
  log_area_line: 'கடந்த 90 நாட்களில் {n} முறை · குறைந்தது {min} · அதிகம் {max}',
  log_area_none: 'உங்கள் ஏரியாவில் இன்னும் முடிந்த பதிவு எதுவும் இல்லை.',
  log_only_known: 'தொடக்கமும் முடிவும் தெரிந்த பதிவுகள் மட்டுமே சராசரியில் சேர்க்கப்படும்.',

  nav_log: 'என் பதிவேடு',
  nav_neighbours: 'அக்கம்பக்கம்',
  nav_settings: 'அமைப்புகள்',
  nav_back: 'பின்செல்',

  nb_title: 'அக்கம்பக்கம்',
  nb_count: '{place}-இல் {n} போன்களில் Lantern உள்ளது.',
  nb_rule: 'இங்கே குறைந்தது 3 போன்களில் Lantern வரும் வரை, கரண்ட் உங்களுக்கு மட்டும் போனதா என்று அது சொல்லாது. அதுவரை "தெரியாது" என்றே சொல்லும்.',
  nb_invite: 'அக்கம்பக்கத்தினரை அழையுங்கள்',
  nb_invite_text: 'கரண்ட் ஒரு வீட்டில் மட்டும் போனதா, முழு ஏரியாவிலும் போனதா என்று Lantern சொல்லும். {place}-இல் சேருங்கள்:',
  nb_copied: 'லிங்க் காப்பி ஆனது.',
  nb_link: 'அல்லது இந்த லிங்கை அனுப்புங்கள்:',
  nb_offline: 'அக்கம்பக்கத்தைப் பார்க்க இன்டர்நெட் வேண்டும்.',
  nb_solo: 'நீங்கள் இன்னும் உங்கள் ஏரியாவைச் சேர்க்கவில்லை.',

  set_title: 'அமைப்புகள்',
  set_lang: 'மொழி',
  set_area: 'ஏரியாவை மாற்றுங்கள்',
  set_area_now: 'ஏரியா: {place} ({pin})',
  set_area_none: 'ஏரியா இல்லை — Lantern-ஐ தனியாகப் பயன்படுத்துகிறீர்கள்.',
  privacy_title: 'Lantern எதைச் சேமிக்கிறது',
  privacy_1: 'இந்த போனில்: உங்கள் பதிவுகள், உங்கள் மொழி, உங்கள் ஏரியா.',
  privacy_2: 'ஏரியாவைச் சேர்த்தால் மட்டும் சர்வரில்: பின்கோடு, கட்டடத்தின் பெயர், நீங்கள் அழுத்திய நேரங்கள், இந்த போனுக்கான ஒரு ரேண்டம் எண். பெயர் இல்லை, போன் நம்பர் இல்லை, GPS இல்லை, கணக்கு இல்லை.',
  privacy_3: 'அக்கம்பக்கத்தினருக்கு எண்ணிக்கை மட்டுமே தெரியும் — எந்த வீடு அழுத்தியது என்பது ஒருபோதும் தெரியாது.',
  privacy_4: 'யார் எப்போது வீட்டில் விழித்திருக்கிறார்கள் என்பது இதிலிருந்து தெரியவரலாம். அதனால்தான் இதில் பெயர் இல்லை, இங்கிருந்து எல்லாவற்றையும் அழிக்கலாம்.',
  delete_btn: 'என் தரவு முழுவதையும் அழியுங்கள்',
  delete_confirm: 'இந்த போனிலும் சர்வரிலும் உள்ள எல்லாப் பதிவுகளையும் அழிக்கவா? இதைத் திரும்பப் பெற முடியாது.',
  deleted: 'அழிக்கப்பட்டது.',
  about: 'Neighborhood Hacks 2026-க்காக, Claude Code என்ற AI கோடிங் உதவியாளரின் உதவியுடன் உருவாக்கப்பட்டது.',
  source: 'சோர்ஸ் கோடு',

  offline_chip: 'இன்டர்நெட் இல்லை — ஆனாலும் எல்லாம் வேலை செய்யும்',
  pending_chip: 'இன்டர்நெட் இல்லை · {n} பதிவுகள் அனுப்பக் காத்திருக்கின்றன',
  install: 'Lantern-ஐ ஹோம் ஸ்கிரீனில் சேருங்கள்',
};

const hi = {
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
  report_line: 'TNPDCL मिन्नगम · 24 घंटे',
  report_none: 'यहाँ अभी किसी ने नहीं बताया कि उन्होंने फ़ोन किया है।',
  report_done: 'एक पड़ोसी ने {time} बजे {utility} को फ़ोन किया। दोबारा फ़ोन करने की ज़रूरत नहीं।',
  report_me: 'आपने {time} बजे {utility} को फ़ोन किया।',
  report_call: '{phone} पर फ़ोन करें',
  report_call_aria: '{utility} को {phone} पर फ़ोन करें',
  report_called_btn: 'मैंने फ़ोन कर दिया',
  report_solo: '{utility} को बताएँ · {phone}',

  ask_title: 'क्या बिजली आ गई?',
  ask_body: "आपने {time} बजे 'बिजली गई' दबाया था।",
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

export const STRINGS = { en, ta, hi };

export function langInfo(code) {
  return LANGS.find((l) => l.code === code) || LANGS[0];
}

export function makeT(code) {
  const table = STRINGS[code] || en;
  const fixed = { utility: REGION.utility[code] || REGION.utility.en, phone: REGION.phoneLabel };
  return (key, vars = {}) => {
    const s = table[key] ?? en[key] ?? key;
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : k in fixed ? fixed[k] : m));
  };
}

export function fmtDuration(ms, code) {
  const total = Math.max(0, Math.round(ms / 60e3));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (code === 'ta') {
    if (!h) return `${m} நிமிடம்`;
    return m ? `${h} மணி ${m} நிமி.` : `${h} மணி நேரம்`;
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
