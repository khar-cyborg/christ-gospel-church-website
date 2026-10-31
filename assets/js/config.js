// Church facts live here. Change a value once and every page picks it up.
window.CGC = {
  name: 'Christ Gospel Church',
  city: 'Coimbatore',
  address: {
    line1: '6, Sesi Avenue West, Church Road',
    line2: 'Cheran Ma Nagar Post, Coimbatore',
    line3: 'Tamil Nadu 641051',
    mapQuery: 'Christ Gospel Church, Sesi Avenue West, Church Road, Cheran Ma Nagar, Coimbatore, Tamil Nadu 641051',
  },
  phones: [
    { display: '095787 78787', tel: '+919578778787' },
    { display: '098656 36486', tel: '+919865636486' },
  ],
  // Prayer requests open a WhatsApp chat with this number (country code, no plus sign).
  whatsapp: '919578778787',

  logo: 'assets/img/logo.jpg',

  youtube: {
    url: 'https://www.youtube.com/@christgospelchurchcoimbatore',
    subscribe: 'https://www.youtube.com/@christgospelchurchcoimbatore?sub_confirmation=1',
    channelId: 'UCPq9wYMMW1CJLGOYb5J7Z3A',
    // YouTube's automatic playlists for this channel, always newest first.
    latestUploads: 'UULFPq9wYMMW1CJLGOYb5J7Z3A',
    latestStreams: 'UULVPq9wYMMW1CJLGOYb5J7Z3A',
    playlists: {
      sunday: 'PLQDm2yxWBFiTQqDetRdteKJyYr5jUYfNc',
      meditation: 'PLQDm2yxWBFiRd6oolf9_YPt9NN6oyZ2qm',
      anniversary: 'PLQDm2yxWBFiQCPi4k2i40kP5vXzhqt8iH',
    },
  },

  // Sunday service, India time. day: 0 is Sunday.
  service: { day: 0, startHour: 8, endHour: 11 },

  // Fill these in to show giving details on the Connect page. Blank values stay hidden.
  giving: {
    upi: '',
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  },

  // Dated services. Past dates drop off by themselves; add next year's as they are announced.
  // `sort` orders the list. `date` is optional when only the month is known.
  events: [
    {
      sort: '2026-12-25', date: '2026-12-25', replay: 'tuJWfA1egjY',
      title: { en: 'Christmas Service', ta: 'கிறிஸ்துமஸ் ஆராதனை' },
      note: { en: 'An early morning service. In 2025 it began around 5:45 AM.', ta: 'அதிகாலை ஆராதனை. 2025-ல் காலை சுமார் 5:45 மணிக்குத் தொடங்கியது.' },
    },
    {
      sort: '2026-12-31', date: '2026-12-31', replay: 'GtwuXpfSrU0',
      title: { en: 'Old Year and New Year Night', ta: 'பழைய ஆண்டு, புத்தாண்டு இரவு ஆராதனை' },
      note: { en: 'Worship through midnight into the new year. In 2025 it began around 10:30 PM.', ta: 'நள்ளிரவைக் கடந்து புத்தாண்டுக்குள் செல்லும் ஆராதனை. 2025-ல் இரவு சுமார் 10:30 மணிக்குத் தொடங்கியது.' },
    },
    {
      sort: '2027-03-26', date: '2027-03-26', replay: 'NeXqn1PHzXE',
      title: { en: 'Good Friday', ta: 'பெரிய வெள்ளி' },
      note: { en: 'In 2026 there were morning and evening services, from about 10:30 AM and 6:45 PM.', ta: '2026-ல் காலை சுமார் 10:30 மணிக்கும் மாலை சுமார் 6:45 மணிக்கும் ஆராதனைகள் நடந்தன.' },
    },
    {
      sort: '2027-03-28', date: '2027-03-28', replay: 'OEkbX-mmefY',
      title: { en: 'Resurrection Sunday', ta: 'உயிர்த்தெழுதல் ஞாயிறு' },
      note: { en: 'An early start. In 2025 the service began around 5:00 AM.', ta: 'அதிகாலையில் தொடங்கும் ஆராதனை. 2025-ல் காலை சுமார் 5:00 மணிக்குத் தொடங்கியது.' },
    },
    {
      sort: '2027-09-01', replay: 'fTL7Btjtq2E',
      month: { en: 'September 2027', ta: 'செப்டம்பர் 2027' },
      title: { en: '13th Anniversary Thanksgiving', ta: '13-ஆம் ஆண்டு நிறைவு நன்றி ஆராதனை' },
      note: { en: 'Our anniversary falls each September. Dates are announced nearer the time.', ta: 'ஒவ்வொரு செப்டம்பரிலும் ஆண்டு நிறைவு விழா நடைபெறும். தேதிகள் பின்னர் அறிவிக்கப்படும்.' },
    },
  ],

  // Rotated by day of the year. English: King James Version. Tamil: Tamil Union Version.
  verses: [
    { ref: { en: 'Isaiah 43:19', ta: 'ஏசாயா 43:19' }, en: 'Behold, I will do a new thing; now it shall spring forth; shall ye not know it? I will even make a way in the wilderness, and rivers in the desert.', ta: 'இதோ, நான் புதிய காரியத்தைச் செய்கிறேன்; இப்பொழுதே அது தோன்றும்; நீங்கள் அதை அறியீர்களா? நான் வனாந்தரத்திலே வழியையும், அவாந்தரவெளியிலே ஆறுகளையும் உண்டாக்குவேன்.' },
    { ref: { en: 'Psalm 150:6', ta: 'சங்கீதம் 150:6' }, en: 'Let every thing that hath breath praise the LORD. Praise ye the LORD.', ta: 'சுவாசமுள்ள யாவும் கர்த்தரைத் துதிப்பதாக. அல்லேலூயா.' },
    { ref: { en: 'John 3:16', ta: 'யோவான் 3:16' }, en: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', ta: 'தேவன், தம்முடைய ஒரேபேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்புகூர்ந்தார்.' },
    { ref: { en: 'Mark 16:15', ta: 'மாற்கு 16:15' }, en: 'Go ye into all the world, and preach the gospel to every creature.', ta: 'நீங்கள் உலகமெங்கும் போய், சர்வ சிருஷ்டிக்கும் சுவிசேஷத்தைப் பிரசங்கியுங்கள்.' },
    { ref: { en: 'Psalm 23:1', ta: 'சங்கீதம் 23:1' }, en: 'The LORD is my shepherd; I shall not want.', ta: 'கர்த்தர் என் மேய்ப்பராயிருக்கிறார்; நான் தாழ்ச்சியடையேன்.' },
    { ref: { en: 'Matthew 11:28', ta: 'மத்தேயு 11:28' }, en: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', ta: 'வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே! நீங்கள் எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாறுதல் தருவேன்.' },
    { ref: { en: 'Philippians 4:13', ta: 'பிலிப்பியர் 4:13' }, en: 'I can do all things through Christ which strengtheneth me.', ta: 'என்னைப் பெலப்படுத்துகிற கிறிஸ்துவினாலே எல்லாவற்றையும் செய்ய எனக்குப் பெலனுண்டு.' },
    { ref: { en: 'Psalm 119:105', ta: 'சங்கீதம் 119:105' }, en: 'Thy word is a lamp unto my feet, and a light unto my path.', ta: 'உம்முடைய வசனம் என் கால்களுக்குத் தீபமும், என் பாதைக்கு வெளிச்சமுமாயிருக்கிறது.' },
    { ref: { en: 'Jeremiah 33:3', ta: 'எரேமியா 33:3' }, en: 'Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.', ta: 'என்னை நோக்கிக் கூப்பிடு, அப்பொழுது நான் உனக்கு உத்தரவு கொடுத்து, நீ அறியாததும் உனக்கு எட்டாததுமான பெரிய காரியங்களை உனக்கு அறிவிப்பேன்.' },
    { ref: { en: 'Psalm 46:1', ta: 'சங்கீதம் 46:1' }, en: 'God is our refuge and strength, a very present help in trouble.', ta: 'தேவன் நமக்கு அடைக்கலமும் பெலனும், ஆபத்துக்காலத்தில் அநுகூலமான துணையுமானவர்.' },
    { ref: { en: 'Romans 8:28', ta: 'ரோமர் 8:28' }, en: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', ta: 'அன்றியும், அவருடைய தீர்மானத்தின்படி அழைக்கப்பட்டவர்களாய் தேவனிடத்தில் அன்புகூருகிறவர்களுக்கு, சகலமும் நன்மைக்கு ஏதுவாக நடக்கிறதென்று அறிந்திருக்கிறோம்.' },
  ],
};
