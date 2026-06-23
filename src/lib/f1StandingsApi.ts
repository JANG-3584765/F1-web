import { TEAM_COLORS } from './teamColors'

const DRIVER_KR_NAMES: Record<string, string> = {
  // ── 2020s ──
  'Max Verstappen':      '막스 베르스타펜',
  'Liam Lawson':         '리암 로슨',
  'Lando Norris':        '랜도 노리스',
  'Oscar Piastri':       '오스카 피아스트리',
  'Charles Leclerc':     '샤를 르클레르',
  'Lewis Hamilton':      '루이스 해밀턴',
  'George Russell':      '조지 러셀',
  'Andrea Kimi Antonelli':'키미 안토넬리',
  'Fernando Alonso':     '페르난도 알론소',
  'Lance Stroll':        '랜스 스트롤',
  'Pierre Gasly':        '피에르 가슬리',
  'Jack Doohan':         '잭 두한',
  'Alexander Albon':     '알렉스 알본',
  'Alex Albon':          '알렉스 알본',
  'Carlos Sainz':        '카를로스 사인츠',
  'Yuki Tsunoda':        '유키 츠노다',
  'Isack Hadjar':        '아이작 하자르',
  'Esteban Ocon':        '에스테반 오콘',
  'Oliver Bearman':      '올리버 베어먼',
  'Nico Hülkenberg':     '니코 휠켄베르크',
  'Gabriel Bortoleto':   '가브리에우 보르톨레투',
  'Franco Colapinto':    '프랑코 콜라핀토',
  'Arvid Lindblad':      '아비드 린드블라드',
  'Sergio Pérez':        '세르히오 페레스',
  'Valtteri Bottas':     '발테리 보타스',
  'Guanyu Zhou':         '저우관위',
  'Colton Herta':        '콜튼 헤르타',
  'Nyck de Vries':       '닉 더프리스',
  'Logan Sargeant':      '로건 서전트',
  'Kevin Magnussen':     '케빈 마그누센',
  'Mick Schumacher':     '믹 슈마허',
  'Nikita Mazepin':      '니키타 마제핀',
  'Antonio Giovinazzi':  '안토니오 지오비나치',
  'Romain Grosjean':     '로맹 그로장',
  'Daniil Kvyat':        '다닐 크비얏',
  'Nicholas Latifi':     '니콜라스 라티피',
  'Pietro Fittipaldi':   '피에트로 피티팔디',
  // ── 2010s ──
  'Sebastian Vettel':    '세바스티안 베텔',
  'Jenson Button':       '젠슨 버튼',
  'Mark Webber':         '마크 웨버',
  'Felipe Massa':        '펠리페 마사',
  'Nico Rosberg':        '니코 로스베르크',
  'Daniel Ricciardo':    '다니엘 리카르도',
  'Ralf Schumacher':     '랄프 슈마허',
  'Kimi Räikkönen':      '키미 라이코넨',
  'Heikki Kovalainen':   '헤이키 코발라이넨',
  'Vitaly Petrov':       '비탈리 페트로프',
  'Adrian Sutil':        '아드리안 수틸',
  'Paul di Resta':       '폴 디 레스타',
  'Kamui Kobayashi':     '코바야시 카무이',
  'Pastor Maldonado':    '파스토르 말도나도',
  'Jean-Eric Vergne':    '장-에릭 베르뉴',
  'Jules Bianchi':       '쥘 비앙키',
  'Marcus Ericsson':     '마르쿠스 에릭손',
  'Felipe Nasr':         '펠리페 나스르',
  'Jolyon Palmer':       '졸리언 파머',
  'Esteban Gutierrez':   '에스테반 구티에레스',
  'Stoffel Vandoorne':   '스토펠 반두른',
  'Brendon Hartley':     '브렌던 하틀리',
  'Robert Kubica':       '로버트 쿠비차',
  // ── 2000s ──
  'Michael Schumacher':  '미하엘 슈마허',
  'Rubens Barrichello':  '루벤스 바리첼로',
  'David Coulthard':     '데이비드 쿨사드',
  'Mika Häkkinen':       '미카 하키넨',
  'Juan Pablo Montoya':  '후안 파블로 몬토야',
  'Jarno Trulli':        '야르노 트룰리',
  'Giancarlo Fisichella':'잔카를로 피시켈라',
  'Nick Heidfeld':       '닉 하이트펠트',
  'Takuma Sato':         '사토 타쿠마',
  'Tiago Monteiro':      '티아구 몬테이로',
  'Christijan Albers':   '크리스티얀 알버스',
  'Scott Speed':         '스캇 스피드',
  'Robert Doornbos':     '로버트 도른보스',
  'Narain Karthikeyan':  '나레인 카티케얀',
  'Anthony Davidson':    '앤서니 데이비슨',
  'Vitantonio Liuzzi':   '비탄토니오 리우치',
  'Christian Klien':     '크리스티안 클리엔',
  'Franck Montagny':     '프랑크 몽타니',
  'Pedro de la Rosa':    '페드로 데 라 로사',
  'Jos Verstappen':      '요스 베르스타펜',
  'Ricardo Zonta':       '리카르도 존타',
  // ── 1990s ──
  'Damon Hill':          '데이먼 힐',
  'Nigel Mansell':       '나이젤 만셀',
  'Alain Prost':         '알랭 프로스트',
  'Ayrton Senna':        '아일톤 세나',
  'Nelson Piquet':       '넬슨 피케',
  'Gerhard Berger':      '게르하르트 베르거',
  'Jean Alesi':          '장 알레시',
  'Eddie Irvine':        '에디 어바인',
  'Heinz-Harald Frentzen':'하인츠-하랄트 프렌첸',
  'Mika Salo':           '미카 살로',
  'Jacques Villeneuve':  '자크 빌뇌브',
  'Johnny Herbert':      '조니 허버트',
  'Olivier Panis':       '올리비에 파니스',
  'Mark Blundell':       '마크 블런델',
  'Ukyo Katayama':       '카타야마 우쿄',
  'Aguri Suzuki':        '스즈키 아구리',
  'Pedro Diniz':         '페드로 디니즈',
  'Alessandro Zanardi':  '알레산드로 자나르디',
  'Martin Brundle':      '마틴 브런들',
  'Andrea de Cesaris':   '안드레아 데 세자리스',
  'Bertrand Gachot':     '베르트랑 가쇼',
  'JJ Lehto':            'J.J. 레흐토',
  'Karl Wendlinger':     '카를 벤들링거',
  'Eric Bernard':        '에릭 베르나르',
  'Erik Comas':          '에릭 코마스',
  'Gianni Morbidelli':   '지아니 모르비델리',
  'Michael Bartels':     '미하엘 바텔스',
  'Taki Inoue':          '이노우에 타키',
  'Luca Badoer':         '루카 바도어',
  'Emanuele Naspetti':   '에마누엘레 나스페티',
  'Christian Fittipaldi':'크리스티안 피티팔디',
  'Pierluigi Martini':   '피에를루이지 마르티니',
  'Stefano Modena':      '스테파노 모데나',
  'Satoru Nakajima':     '나카지마 사토루',
  // ── 1980s ──
  'Niki Lauda':          '니키 라우다',
  'Keke Rosberg':        '케케 로스베르크',
  'Riccardo Patrese':    '리카르도 파트레제',
  'Michele Alboreto':    '미켈레 알보레토',
  'René Arnoux':         '르네 아르누',
  'Patrick Tambay':      '패트릭 탐베이',
  'Thierry Boutsen':     '티에리 부센',
  'Stefan Johansson':    '스테판 요한슨',
  'Elio de Angelis':     '엘리오 드 안젤리스',
  'Derek Warwick':       '데렉 워릭',
  'Alessandro Nannini':  '알레산드로 난니니',
  'Ivan Capelli':        '이반 카펠리',
  'Eddie Cheever':       '에디 치버',
  'Marc Surer':          '마크 슈러',
  'Teo Fabi':            '테오 파비',
  'Mauricio Gugelmin':   '마우리시오 구젤민',
  'Jonathan Palmer':     '조너선 팔머',
  'Philippe Alliot':     '필립 알리오',
  'Bruno Giacomelli':    '브루노 자코멜리',
  // ── 1970s ──
  'Emerson Fittipaldi':  '에머슨 피티팔디',
  'Jackie Stewart':      '재키 스튜어트',
  'Carlos Reutemann':    '카를로스 로이테만',
  'Ronnie Peterson':     '로니 피터슨',
  'Mario Andretti':      '마리오 안드레티',
  'Jody Scheckter':      '조디 셱터',
  'James Hunt':          '제임스 헌트',
  'Gilles Villeneuve':   '질 빌뇌브',
  'Alan Jones':          '앨런 존스',
  'Clay Regazzoni':      '클레이 레가조니',
  'Patrick Depailler':   '파트리크 드파이에',
  'Carlos Pace':         '카를로스 파체',
  'Jacques Laffite':     '자크 라피트',
  'Jochen Mass':         '요헨 마스',
  'John Watson':         '존 왓슨',
  'Vittorio Brambilla':  '비토리오 브람빌라',
  'François Cevert':     '프랑수아 세베르',
  'Jacky Ickx':          '재키 익스',
  'Rolf Stommelen':      '롤프 스토멜렌',
  'Hans-Joachim Stuck':  '한스-요아힘 슈투크',
  'Patrick Neve':        '패트릭 네브',
  'Emilio de Villota':   '에밀리오 데 비요타',
  // ── 1960s ──
  'Jim Clark':           '짐 클라크',
  'Jack Brabham':        '잭 브라밤',
  'Graham Hill':         '그레이엄 힐',
  'John Surtees':        '존 서티스',
  'Jochen Rindt':        '요헨 린트',
  'Dan Gurney':          '댄 거니',
  'Bruce McLaren':       '브루스 맥라렌',
  'Denny Hulme':         '데니 흄',
  'Denis Hulme':         '데니 흄',
  'Chris Amon':          '크리스 아몬',
  'Jo Siffert':          '요 지페르트',
  'Piers Courage':       '피어스 커리지',
  'Lorenzo Bandini':     '로렌초 반디니',
  'Giancarlo Baghetti':  '지안카를로 바게티',
  'Innes Ireland':       '이네스 아일랜드',
  'Richie Ginther':      '리치 긴더',
  'Tony Maggs':          '토니 매그스',
  'Willy Mairesse':      '윌리 메어세',
  'Trevor Taylor':       '트레버 테일러',
  'Peter Arundell':      '피터 아런델',
  // ── 1950s ──
  'Juan Manuel Fangio':  '후안 마누엘 판히오',
  'Alberto Ascari':      '알베르토 아스카리',
  'Giuseppe Farina':     '주세페 파리나',
  'Mike Hawthorn':       '마이크 호손',
  'Phil Hill':           '필 힐',
  'Stirling Moss':       '스털링 모스',
  'Peter Collins':       '피터 콜린스',
  'Tony Brooks':         '토니 브룩스',
  'Luigi Musso':         '루이지 무소',
  'Wolfgang von Trips':  '볼프강 폰 트립스',
  'Luigi Fagioli':       '루이지 파지올리',
  'Piero Taruffi':       '피에로 타루피',
  'Luigi Villoresi':     '루이지 빌로레시',
  'Harry Schell':        '해리 셸',
  'Roy Salvadori':       '로이 살바도리',
  'Maurice Trintignant': '모리스 트랭티냥',
  'José Froilán González':'호세 프로일란 곤살레스',
  'Reg Parnell':         '레그 파넬',
  'Louis Rosier':        '루이 로지에',
  'Emmanuel de Graffenried':'에마뉘엘 드 그라펜리트',
  'Yves Giraud-Cabantous':'이브 지로-카방투',
  'Robert Manzon':       '로베르 만종',
  'Onofre Marimón':      '오노프레 마리몬',
  'Elie Bayol':          '엘리 바욜',
  'Peter Whitehead':     '피터 화이트헤드',
  'Rodney Nuckey':       '로드니 너키',
  'Nino Farina':         '니노 파리나',
  'Juan Fangio':         '후안 판지오',
  'Johnnie Parsons':     '조니 파슨스',
  'Bill Holland':        '빌 홀랜드',
  'Prince Bira':         '프린스 비라',
  'Louis Chiron':        '루이 시롱',
  'Mauri Rose':          '마우리 로즈',
  'Dorino Serafini':     '도리노 세라피니',
  'Yves Cabantous':      '이브 지로카방투',
  'Raymond Sommer':      '레몽 소메르',
  'Cecil Green':         '세실 그린',
  'Philippe Étancelin':  '필리프 에탕슬랭',
  'Felice Bonetto':      '펠리체 보네토',
  'Eugène Chaboud':      '외젠 샤부',
  'Tony Bettenhausen':   '토니 베텐하우젠',
  'Joie Chitwood':       '조이 치트우드',
  'Toulo de Graffenried':'투로 드 그라펜리드',
  'Bob Gerard':          '밥 제라드',
  'Lee Wallard':         '리 월라드',
  'Charles Pozzi':       '찰스 포지',
  'Johnny Claes':        '조니 클라에스',
  'Pierre Levegh':       '피에르 르베크',
  'Cuth Harrison':       '커스 해리슨',
  'Andy Linden':         '앤디 린든',
  'Bobby Ball':          '바비 볼',
  'Carl Forberg':        '칼 포버그',
  'Consalvo Sanesi':     '콘살보 사네시',
  'Henry Banks':         '헨리 뱅크스',
  'Jack McGrath':        '잭 맥그래스',
  'Manny Ayulo':         '매니 아율로',
  'Mike Nazaruk':        '마이크 나자룩',
  'Peter Walker':        '피터 워커',
  'Rudi Fischer':        '루디 피셔',
  'Alan Brown':          '앨런 브라운',
  'Art Cross':           '아트 크로스',
  'Bill Vukovich':       '빌 부코비치',
  'Charles de Tornaco':  '샤를 드 토르나코',
  'Dennis Poore':        '데니스 푸어',
  'Duane Carter':        '듀안 카터',
  'Duncan Hamilton':     '던컨 해밀턴',
  'Eric Thompson':       '에릭 톰슨',
  'Jean Behra':          '장 베라',
  'Jim Rathmann':        '짐 래스먼',
  'Jimmy Bryan':         '지미 브라이언',
  'Ken Wharton':         '켄 워튼',
  'Peter Hirt':          '피터 히르트',
  'Roger Laurent':       '로저 로랑',
  'Sam Hanks':           '샘 행크스',
  'Troy Ruttman':        '트로이 루트먼',
  'Eddie Johnson':       '에디 존슨',
  'Fred Agabashian':     '프레드 아가바시안',
  'Hermann Lang':        '헤르만 랑',
  'Jacques Swaters':     '자크 스와터스',
  'Jimmy Daywalt':       '지미 데이월트',
  'Paul Russo':          '폴 루소',
  'Roberto Mieres':      '로베르토 미에레스',
  'Fred Wacker':         '프레드 웨커',
  'Hans Herrmann':       '한스 헤르만',
  'Karl Kling':          '카를 클링',
  'Sergio Mantovani':    '세르지오 만토바니',
  'Umberto Maglioli':    '움베르토 말리올리',
  'Bill Homeier':        '빌 호마이어',
  'Bob Sweikert':        '밥 스위커트',
  'Carlos Menditeguy':   '카를로스 멘디테기',
  'Cesare Perdisa':      '체사레 페르디사',
  'Eugenio Castellotti': '에우제니오 카스텔로티',
  'Jacques Pollet':      '자크 폴레',
  'Jimmy Davies':        '지미 데이비스',
  'Johnny Thomson':      '조니 톰슨',
  'Walt Faulkner':       '월트 포크너',
  'Bob Anderson':        '밥 앤더슨',
  'Bob Bondurant':       '밥 본듀란트',
  'Chris Irwin':         '크리스 어윈',
  'Chris Lawrence':      '크리스 로렌스',
  'Giacomo Russo':       '자코모 루소',
  'Guy Ligier':          '기 리지에',
  'Jo Bonnier':          '요 보니에',
  'John Taylor':         '존 테일러',
  'Ludovico Scarfiotti': '루도비코 스카르피오티',
  'Mike Parkes':         '마이크 파크스',
  'Mike Spence':         '마이크 스펜스',
  'Ronnie Bucknum':      '로니 버크넘',
  'Vic Wilson':          '빅 윌슨',
  'Brian Henton':        '브라이언 헨턴',
  'Chico Serra':         '치코 세라',
  'Derek Daly':          '데릭 데일리',
  'Didier Pironi':       '디디에 피로니',
  'Eliseo Salazar':      '엘리세오 살라자르',
  'Jean-Pierre Jarier':  '장피에르 자리어',
  'Manfred Winkelhock':  '만프레드 빙켈호크',
  'Mauro Baldi':         '마우로 발디',
  'Raul Boesel':         '하울 보에젤',
  'Slim Borgudd':        '슬림 보르구드',
  'Trintignant':         '모리스 트린티냥',
}

const DRIVER_ID_KR_NAMES: Record<string, string> = {
  simon: '앙드레 시몽',
  andre_pilette: '앙드레 필레트',
  shawe_taylor: '브라이언 쇼 테일러',
  guy_mairesse: '기 메레스',
  rol: '프랑코 롤',
  godia: '파코 고디아',
  nalon: '듀크 날론',
  force: '진 포스',
  schindler: '빌 쉰들러',
  gordini: '알도 고르디니',
  kelly: '조 켈리',
  louveau: '앙리 루보',
  pietsch: '파울 피치',
  grignard: '조르주 그리냐르',
  abecassis: '조지 아베카시스',
  parker: '필립 포더링엄-파커',
  scarborough: '칼 스카버러',
  murray: '데이비드 머레이',
  mackey: '빌 맥키',
  stevenson: '척 스티븐슨',
  john_james: '존 제임스',
  landi: '치코 란디',
  jover: '후안 호베르',
  branca: '토니 브랑카',
  richardson: '켄 리처드슨',
  dinsmore: '듀크 딘스모어',
  miller: '쳇 밀러',
  walt_brown: '월트 브라운',
  ward: '로저 워드',
  griffith: '클리프 그리피스',
  george_connor: '조지 코너',
  hellings: '맥 헬링스',
  mcdowell: '조니 맥도웰',
  james: '조 제임스',
  frere: '폴 프레르',
  reece: '지미 리스',
  riess: '프리츠 리스',
  macklin: '랜스 맥클린',
  brandon: '에릭 브랜던',
  ulmen: '토니 울멘',
  downing: '켄 다우닝',
  niedermayr: '헬무트 니더마이어',
  flinterman: '얀 플린터만',
  cantoni: '아이텔 칸토니',
  klenk: '한스 클렌크',
  rigsby: '짐 릭스비',
  comotti: '프랑코 코모티',
  graham_whitehead: '그레이엄 화이트헤드',
  klodwig: '에른스트 클로드비히',
  legat: '아르튀르 르가',
  obrien: "로버트 오브라이언",
  gaze: '토니 게이즈',
  fonder: '조지 폰더',
  mcalpine: '케네스 맥알파인',
  bianco: '지노 비앙코',
  crook: '토니 크룩',
  lof: '드리스 판 데르 로프',
  heeks: '빌리 힉스',
  charrington: '로빈 몽고메리-채링턴',
  brudes: '아돌프 브루데스',
  balsa: '마르셀 발사',
  hans_stuck: '한스 폰 슈투크',
  bechem: '귄터 베헴',
  carini: '피에로 카리니',
  krause: '루돌프 크라우제',
  terra: '막스 데 테라',
  schoeller: '루돌프 숄러',
  aston: '빌 애스턴',
  webb: '트래비스 웹',
  bayol: '엘리 바욜',
  helfrich: '테오 헬프리히',
  hartley: '진 하틀리',
  peters: '요제프 페터스',
  bob_scott: '밥 스콧',
  galvez: '오스카르 갈베스',
  john_barber: '존 바버',
  mccoy: '어니 맥코이',
  scherrer: '알베르트 셰러',
  seidel: '볼프강 자이델',
  mantz: '조니 만츠',
  jimmy_stewart: '지미 스튜어트',
  rolt: '토니 롤트',
  birger: '파블로 비르거',
  cruz: '아돌포 크루스',
  fairman: '잭 페어먼',
  teague: '마셜 티그',
  holmes: '재키 홈스',
  georges_berger: '조르주 베르거',
  barth: '에드가 바르트',
  flaherty: '팻 플래허티',
  ian_stewart: '이언 스튜어트',
  karch: '오스발트 카르흐',
  hoyt: '제리 호이트',
  freeland: '돈 프리랜드',
  crockett: '래리 크로켓',
  niday: '칼 나이데이',
  daponte: '호르헤 다폰테',
  beauman: '돈 보먼',
  marr: '레슬리 마',
  thorne: '레슬리 손',
  jackson: '지미 잭슨',
  gould: '호러스 굴드',
  elisian: '에드 엘리시언',
  armi: '프랭크 아미',
  volonterio: '오토리노 볼론테리오',
  bucci: '클레마르 부치',
  loyer: '로저 로이어',
  whitehouse: '빌 화이트하우스',
  flockhart: '론 플록하트',
  connor: "팻 오코너",
  riseley_prichard: '존 라이즐리-프리처드',
  kladis: '대니 클래디스',
  duncan: '렌 던컨',
  herman: '알 허먼',
  sparken: '마이크 스파켄',
  ramos: '에르난도 다 실바 라모스',
  fitch: '존 피치',
  weyant: '척 웨이언트',
  iglesias: '헤수스 이글레시아스',
  uria: '알베르토 우리아',
  templeman: '쇼티 템플먼',
  lucas: '장 뤼카',
  andrews: '키스 앤드루스',
  russo: '에디 루소',
  ray_crawford: '레이 크로퍼드',
  piotti: '루이지 피오티',
  keller: '알 켈러',
  boyd: '조니 보이드',
  portago: '알폰소 데 포르타고',
  de_portago: '알폰소 데 포르타고',
  gendebien: '올리비에 장드비앙',
  dick_rathmann: '딕 래스먼',
  gerini: '제리노 제리니',
  oscar_gonzalez: '오스카르 곤살레스',
  veith: '밥 베이스',
  christie: '밥 크리스티',
  garrett: '빌리 개럿',
  halford: '브루스 핼퍼드',
  milhoux: '앙드레 밀루',
  scotti: '피에로 스코티',
  titterington: '데즈먼드 티터링턴',
  scarlatti: '조르조 스카를라티',
  chapman: '콜린 채프먼',
  tolan: '조니 톨런',
  leston: '레스 레스턴',
  scott_Brown: '아치 스콧 브라운',
  turner: '잭 터너',
  emery: '폴 에머리',
  matta: '크리스티아누 다 마타',
  gene: '마르크 제네',
  firman: '랄프 퍼먼',
  wilson: '저스틴 윌슨',
  pizzonia: '안토니오 피초니아',
  kiesa: '니콜라스 키에사',
  baumgartner: '졸트 바움가르트너',
  glock: '티모 글록',
  piquet_jr: '넬슨 피케 주니어',
  nakajima: '나카지마 카즈키',
  bourdais: '세바스티앙 부르데',
  vergne: '장에릭 베르뉴',
  gutierrez: '에스테반 구티에레스',
  pic: '샤를 픽',
  garde: '기도 반 데르 가르데',
  chilton: '맥스 칠튼',
  sirotkin: '세르게이 시로트킨',
  gregory: '마스텐 그레고리',
  'lewis-evans': '스튜어트 루이스-에번스',
  macdowel: '마이크 맥도웰',
  bueb: '아이버 부엡',
  tomaso: '알레산드로 데 토마소',
  naylor: '브라이언 네일러',
  beaufort: '카렐 고댕 드 보포르',
  de_beaufort: '카렐 고댕 드 보포르',
  marsh: '토니 마시',
  'mackay-fraser': '허버트 맥케이-프레이저',
  edmunds: '돈 에드먼즈',
  england: '폴 잉글랜드',
  sachs: '에디 삭스',
  gibson: '딕 깁슨',
  magill: '마이크 매길',
  cheesbourg: '빌 치즈버그',
  george: '엘머 조지',
  rodriguez: '페드로 로드리게스',
  beltoise: '장피에르 벨투아즈',
  attwood: '리처드 애트우드',
  gavin: '조니 세르보-가뱅',
  oliver: '재키 올리버',
  bianchi: '뤼시앵 비앙키',
  elford: '빅 엘포드',
  redman: '브라이언 레드먼',
  moser: '실비오 모저',
  pescarolo: '앙리 페스카롤로',
  love: '존 러브',
  hahne: '후베르트 하네',
  ahrens: '쿠르트 아렌스',
  pretorius: '재키 프레토리우스',
  hobbs: '데이비드 홉스',
  widdows: '로빈 위도스',
  tingle: '샘 팅글',
  rooyen: '바질 반 루옌',
  jo_schlesser: '조 슐레서',
  unser: '바비 언서',
  solana: '모이세스 솔라나',
  brack: '빌 브랙',
  bell: '데릭 벨',
  adamich: '안드레아 드 아다미치',
  charlton: '데이브 찰턴',
  revson: '피터 레브슨',
  merzario: '아르투로 메르자리오',
  follmer: '조지 폴머',
  wilson_fittipaldi: '윌슨 피티팔디',
  lennep: '기스 반 레네프',
  hailwood: '마이크 헤일우드',
  beuttler: '마이크 보이틀러',
  galli: '난니 갈리',
  purley: '데이비드 펄리',
  bueno: '루이스 부에노',
  schenken: '팀 쉥켄',
  keizan: '에디 케이잔',
  williamson: '로저 윌리엄슨',
  wisell: '레이네 비셀',
  gethin: '피터 게틴',
  mcrae: '그레이엄 맥레이',
  gartner: '조 가트너',
  hesnault: '프랑수아 에스노',
  corrado_fabi: '코라도 파비',
  rothengatter: '후브 로텐가터',
  cecotto: '조니 체코토',
  bellof: '슈테판 벨로프',
  streiff: '필리프 스트라이프',
  thackwell: '마이크 색웰',
  mazzacane: '가스통 마차카네',
  burti: '루치아노 부르티',
  friesacher: '파트리크 프리자허',

  // ── 1950년대 ──
  graffenried: '툴로 드 그라펜리트',
  pagani: '넬로 파가니',
  hampshire: '데이비드 햄프셔',
  crossley: '제프 크로슬리',
  fry: '조 프라이',
  fohr: '마이런 포어',
  ader: '월트 에이더',
  gonzalez: '호세 프로일란 곤살레스',
  martin: '외젠 마르탱',
  biondetti: '클레멘테 비온데티',
  leslie_johnson: '레슬리 존슨',
  pian: '알프레도 피안',
  levrett: '베일리스 레브렛',
  cantrell: '빌 캔트럴',
  george_amick: '조지 에이믹',
  allison: '클리프 앨리슨',
  shelby: '캐럴 셸비',
  burgess: '이언 버지스',
  larson: '저드 라슨',
  filippis: '마리아 데 필리피스',
  la_caze: '로베르 라 카즈',
  guelfi: '앙드레 겔피',
  cabianca: '줄리오 카비안카',
  dempsey_wilson: '뎀프시 윌슨',
  foyt: 'A.J. 포이트',
  goethals: '크리스티안 게탈스',
  stacey: '앨런 스테이시',
  picard: '프랑수아 피카르',
  bridger: '톰 브리저',
  goldsmith: '폴 골드스미스',
  jerry_unser: '제리 언서',
  sutton: '렌 서튼',
  bisch: '아트 비시',
  blanchard: '해리 블랜처드',
  orey: '프리츠 도레이',
  bristow: '크리스 브리스토',
  cabral: '마리오 카브랄',
  davis: '콜린 데이비스',
  henry_taylor: '헨리 테일러',
  ashdown: '피터 애시다운',
  arnold: '척 아놀드',
  mcwithey: '짐 맥위디',
  constantine: '조지 콘스탄틴',
  said: '밥 세이드',
  cade: '필 케이드',
  piper: '데이비드 파이퍼',
  fontes: '아즈드루발 폰테스',
  mike_taylor: '마이크 테일러',
  branson: '돈 브랜슨',
  grim: '바비 그림',
  amick: '레드 에이믹',

  // ── 1960년대 ──
  ruby: '로이드 루비',
  hall: '짐 홀',
  drogo: '피에로 드로고',
  larreta: '알베르토 로드리게스 라레타',
  tingelstad: '버드 팅엘스타드',
  daigh: '척 데이그',
  gamble: '프레드 갬블',
  bonomi: '로베르토 보노미',
  lovely: '피트 러블리',
  munaron: '지노 무나론',
  drake: '밥 드레이크',
  estefano: '나시프 에스테파노',
  hurtubise: '짐 허투비스',
  weiler: '웨인 와일러',
  thiele: '알폰소 티엘레',
  owen: '아서 오언',
  reventlow: '랜스 레벤틀로',
  chimeri: '에토레 키메리',
  creus: '안토니오 크레우스',
  greene: '키스 그린',
  lewis: '재키 루이스',
  penske: '로저 펜스키',
  ryan: '피터 라이언',
  parnell: '팀 파넬',
  sharp: '해프 샤프',
  may: '마이클 메이',
  pirocchi: '레나토 피로키',
  ashmore: '게리 애시모어',
  starrabba: '가에타노 스타라바',
  ricardo_rodriguez: '리카르도 로드리게스',
  hansgen: '월트 한스겐',
  collomb: '베르나르 콜롱',
  vaccarella: '니노 바카렐라',
  ken_miles: '켄 마일스',
  bordeu: '후안 마누엘 보르데우',
  bussinello: '로베르토 부시넬로',
  natili: '마시모 나틸리',
  monteverdi: '피터 몬테베르디',
  lippi: '로베르토 리피',
  duke: '제프 듀크',
  'campbell-jones': '존 캠벨-존스',
  prinoth: '에르네스토 프리노트',
  boffa: '메나토 보파',
  lederle: '네빌 레더리',
  johnstone: '브루스 존스톤',
  schroeder: '롭 슈뢰더',
  pieterse: '어니 피터르세',
  settember: '토니 세템버',
  walter: '하이니 발터',
  chamberlain: '제이 챔벌린',
  serrurier: '더그 세루리에',
  harris: '마이크 해리스',
  mayer: '티미 메이어',
  hocking: '게리 호킹',
  vyver: '시드 반 데르 바이퍼',
  pon: '벤 폰',
  slotemaker: '롭 슬로테마커',
  abate: '카를로 아바테',
  shelly: '토니 셸리',
  schiller: '하인츠 실러',
  kuhnke: '쿠르트 쿤케',
  mitter: '게르하르트 미터',
  broeker: '피터 브뢰커',
  blokdyk: '트레버 블록다이크',
  niemann: '브라우슈 니만',
  klerk: '피터 드 클레르크',
  prophet: '데이비드 프로펫',
  raby: '이언 레이비',
  driver: '패디 드라이버',
  dochnal: '프랭크 도크널',
  vos: '어니 드 보스',
  monarch: '토머스 모나크',
  seiffert: '귄터 자이페르트',
  gardner: '프랭크 가드너',
  hawkins: '폴 호킨스',
  rhodes: '존 로즈',
  bassi: '조르조 바시',
  reed: '레이 리드',
  clapham: '데이비드 클래펌',
  blignaut: '알렉스 블리뇨',
  rees: '앨런 리스',
  williams: '조너선 윌리엄스',
  fisher: '마이크 피셔',
  botha: '루키 보타',
  wietzes: '에피 위체스',
  hart: '브라이언 하트',
  pease: '알 피스',
  miles: '존 마일스',
  eaton: '조지 이턴',
  cordts: '존 코드츠',

  // ── 1970년대 ──
  giunti: '이냐치오 준티',
  hutchison: '거스 허치슨',
  ganley: '하우든 갠리',
  donohue: '마크 도너휴',
  marko: '헬무트 마르코',
  mazet: '프랑수아 마제',
  Cannoc: '존 캐넌',
  barber: '스킵 바버',
  jean: '막스 장',
  roig: '알렉스 솔레르-로이그',
  walker: '데이비드 워커',
  craft: '크리스 크래프트',
  posey: '샘 포지',
  migault: '프랑수아 미고',
  opel: '리키 폰 오펠',
  pryce: '톰 프라이스',
  edwards: '가이 에드워즈',
  belso: '톰 벨쇠',
  quester: '디터 퀘스터',
  koinigg: '헬무트 코이니히',
  ian_scheckter: '이언 셱터',
  ashley: '이언 애슐리',
  robarts: '리처드 로바츠',
  schuppan: '번 슈팬',
  pilette: '테디 필레트',
  wilds: '마이크 와일즈',
  dolhem: '호세 돌렘',
  kinnunen: '레오 킨누넨',
  larrousse: '제라르 라루스',
  roos: '베르틸 로스',
  brise: '토니 브라이스',
  lombardi: '렐라 롬바르디',
  ertl: '하랄트 에르틀',
  evans: '밥 에번스',
  lunger: '브렛 룽거',
  palm: '토르스텐 팜',
  tunmer: '가이 튜너',
  jabouille: '장피에르 자부이유',
  crawford: '짐 크로퍼드',
  magee: '데미안 매기',
  zorzi: '렌조 조르지',
  nicholson: '존 니컬슨',
  morgan: '데이브 모건',
  wunderink: '로루프 분더링크',
  leclere: '미셸 르클레르',
  vonlanthen: '요 폰란텐',
  fushida: '후시다 히로시',
  nilsson: '군나르 닐손',
  perkins: '래리 퍼킨스',
  takahara: '다카하라 노리타케',
  pesenti_rossi: '알레산드로 페센티-로시',
  hoffmann: '잉고 호프만',
  hasemi: '하세미 마사히로',
  kessel: '로리스 케셀',
  ribeiro: '알렉스 히베이루',
  brown: '워릭 브라운',
  neve: '패트릭 네브',
  binder: '한스 빈더',
  hayje: '보이 하이에',
  hoshino: '호시노 가즈요시',
  andersson: '코니 안데르손',
  stuppacher: '오토 슈투파허',
  keegan: '루퍼트 키건',
  ongais: '대니 옹가이스',
  takahashi: '다카하시 구니미쓰',
  rebaque: '엑토르 레바케',
  rahal: '바비 라할',
  bleekemolen: '미하엘 블레케몰렌',
  leoni: '람베르토 레오니',
  zunino: '리카르도 수니노',
  lees: '제프 리스',
  lammers: '얀 라머스',
  gaillard: '파트리크 가이야르',
  needell: '티프 니들',

  // ── 1980년대 ──
  stohr: '지크프리트 슈퇴르',
  ghinzani: '피에르카를로 긴자니',
  gabbiani: '베페 가비아니',
  guerra: '미겔 앙헬 게라',
  londono: '리카르도 론도뇨',
  guerrero: '로베르토 게레로',
  paletti: '리카르도 팔레티',
  byrne: '토미 번',
  sullivan: '대니 설리번',
  acheson: '케니 애치슨',
  danner: '크리스티안 단너',
  dumfries: '조니 덤프리스',
  berg: '앨런 버그',
  caffi: '알렉스 카피',
  moreno: '로베르토 모레노',
  dalmas: '야닉 달마',
  fabre: '파스칼 파브르',
  campos: '아드리안 캄포스',
  forini: '프랑코 포리니',
  tarquini: '가브리엘레 타르퀴니',
  larini: '니콜라 라리니',
  gugelmin: '마우리시오 구젤민',
  sala: '루이스 페레스-살라',
  bailey: '줄리언 베일리',
  schlesser: '장루이 슐레서',
  schneider: '베른트 슈나이더',
  larrauri: '오스카르 라라우리',
  pirro: '에마누엘레 피로',
  grouillard: '올리비에 그루이야르',
  bernard: '에릭 베르나르',
  donnelly: '마틴 도넬리',
  lehto: 'J.J. 레흐토',
  raphanel: '피에르앙리 라파넬',
  barilla: '파올로 바릴라',
  weidler: '폴커 바이들러',
  foitek: '그레고어 포이테크',
  brabham: '데이비드 브라밤',

  // ── 1990년대 ──
  comas: '에릭 코마스',
  poele: '에릭 반 드 풀',
  fittipaldi: '크리스티안 피티팔디',
  belmondo: '폴 벨몬도',
  chiesa: '안드레아 키에사',
  mccarthy: '페리 매카시',
  andretti: '마이클 안드레티',
  barbazza: '파브리치오 바르바차',
  lamy: '페드로 라미',
  toshio_suzuki: '스즈키 도시오',
  gounon: '장마르크 구농',
  apicella: '마르코 아피첼라',
  frentzen: '하인츠-하랄트 프렌첸',
  beretta: '올리비에 베레타',
  lagorce: '프랑크 라고르스',
  ratzenberger: '롤란트 라첸베르거',
  adams: '필리프 아당',
  schiattarella: '도메니코 스키아타렐라',
  deletraz: '장드니 델레트라',
  noda: '노다 히데키',
  montermini: '안드레아 몬테르미니',
  boullion: '장크리스토프 부용',
  papis: '막시밀리아노 파피스',
  magnussen: '얀 마그누센',
  lavaggi: '조반니 라바지',
  rosset: '히카르도 호제트',
  fisichella: '잔카를로 피시켈라',
  marques: '타르소 마르케스',
  wurz: '알렉산더 부르츠',
  nakano: '나카노 신지',
  fontana: '노르베르토 폰타나',
  tuero: '에스테반 투에로',
  takagi: '다카기 도라노스케',
  sarrazin: '스테판 사라쟁',

  // ── 2000년대 ──
  bernoldi: '엔리케 베르놀디',
  enge: '토마시 엔게',
  yoong: '알렉스 융',
  mcnish: '앨런 맥니시',
  pantano: '조르조 판타노',
  bruni: '잔마리아 브루니',
  ide: '이데 유지',
  yamamoto: '야마모토 사콘',
  markus_winkelhock: '마르쿠스 빙켈호크',
  buemi: '세바스티앙 뷔에미',
  alguersuari: '하이메 알게르수아리',

  // ── 2010년대 ──
  chandhok: '카룬 찬도크',
  bruno_senna: '브루노 세나',
  grassi: '루카스 디 그라시',
  ambrosio: '제롬 당브로시오',
  stevens: '윌 스티븐스',
  lotterer: '앙드레 로테러',
  merhi: '로베르토 메르히',
  rossi: '알렉산더 로시',
  wehrlein: '파스칼 베를라인',
  haryanto: '리오 하리안토',

  // ── 2020년대 ──
  aitken: '잭 에이트킨',
  antonelli: '키미 안토넬리',
  hulkenberg: '니코 휠켄베르크',
}

const CONSTRUCTOR_KR_NAMES: Record<string, string> = {
  // ── 현대 (2009~) ──
  'Red Bull Racing':          '레드불',
  'Oracle Red Bull Racing':   '레드불',
  'Red Bull':                 '레드불',
  'McLaren':                  '맥라렌',
  'Ferrari':                  '페라리',
  'Mercedes':                 '메르세데스',
  'Aston Martin':             '애스턴 마틴',
  'Aston Martin Aramco':      '애스턴 마틴',
  'Alpine F1 Team':           '알핀',
  'Williams':                 '윌리엄스',
  'Racing Bulls':             '레이싱 불스',
  'RB F1 Team':               '레이싱 불스',
  'Haas F1 Team':             '하스',
  'Haas':                     '하스',
  'Kick Sauber':              '킥 자우버',
  'Sauber':                   '자우버',
  'Audi':                     '아우디',
  'Cadillac':                 '캐딜락',
  'Cadillac F1 Team':         '캐딜락',
  'Renault':                  '르노',
  'Honda':                    '혼다',
  'Honda Racing F1':          '혼다',
  'BMW Sauber':               'BMW 자우버',
  'Force India':              '포스 인디아',
  'Racing Point':             '레이싱 포인트',
  'Toro Rosso':               '토로 로소',
  'AlphaTauri':               '알파타우리',
  'Lotus F1':                 '로터스',
  'Brawn':                    '브라운 GP',
  'Toyota':                   '토요타',
  'Jordan':                   '조던',
  'BAR':                      'BAR',
  'Minardi':                  '미나르디',
  'Jaguar':                   '재규어',
  'Arrows':                   '애로우즈',
  'Prost':                    '프로스트',
  'Stewart':                  '스튜어트',
  'Super Aguri':              '슈퍼 아구리',
  'HRT':                      'HRT',
  'Marussia':                 '마루시아',
  'Caterham':                 '케이터햄',
  'Manor Marussia':           '마루시아',
  'Virgin':                   '버진',
  'Hispania':                 '히스파니아',
  // ── 클래식 (2008 이전) ──
  'Benetton':                 '베네통',
  'Tyrrell':                  '티렐',
  'Brabham':                  '브라밤',
  'Ligier':                   '리지에',
  'Cooper':                   '쿠퍼',
  'BRM':                      'BRM',
  'Matra':                    '마트라',
  'March':                    '마치',
  'Alfa Romeo':               '알파 로메오',
  'Lancia':                   '란치아',
  'Vanwall':                  '밴월',
  'Maserati':                 '마세라티',
  'Gordini':                  '고르디니',
  'Talbot-Lago':              '탈보-라고',
  'Kurtis Kraft':             '커티스 크래프트',
  'Deidt':                    '데이트',
  'ERA':                      'ERA',
  'Moore':                    '무어',
  'Simca':                    '심카',
  'Milano':                   '밀라노',
  'Schroeder':                '슈뢰더',
  'Sherman':                  '셔먼',
  'Connaught':                '코노트',
  'Frazer Nash':              '프레이저 내시',
  'HWM':                      'HWM',
  'Kuzma':                    '쿠즈마',
  'Lesovsky':                 '레소브스키',
  'Behra-Porsche':            '베라-포르쉐',
  'JBW':                      'JBW',
  'Porsche':                  '포르쉐',
  'Scarab':                   '스캐럽',
  'Team Lotus':               '로터스',
  'Eagle-Climax':             '이글',
  'Eagle-Weslake':            '이글',
  'Bellasi':                  '벨라시',
  'Boro':                     '보로',
  'Kojima':                   '코지마',
  'Parnelli':                 '파넬리',
  'Theodore':                 '시어도어',
  'AGS':                      'AGS',
  'Larrousse':                '라루스',
  'Spyker':                   '스파이커',
  'Lotus':                    '로터스',
  'Lotus-Ford':               '로터스',
  'Lotus-Climax':             '로터스',
  'Lotus-BRM':                '로터스',
  'Lotus-Honda':              '로터스',
  'Lotus-Lamborghini':        '로터스',
  'Brabham-Climax':           '브라밤',
  'Brabham-Repco':            '브라밤',
  'Brabham-Ford':             '브라밤',
  'Tyrrell-Ford':             '티렐',
  'Matra-Ford':               '마트라',
  'March-Ford':               '마치',
  'McLaren-Ford':             '맥라렌',
  'McLaren-Cosworth':         '맥라렌',
  'McLaren-Honda':            '맥라렌',
  'McLaren-TAG':              '맥라렌',
  'McLaren-Mercedes':         '맥라렌',
  'Williams-Ford':            '윌리엄스',
  'Williams-Cosworth':        '윌리엄스',
  'Williams-Honda':           '윌리엄스',
  'Williams-Renault':         '윌리엄스',
  'Williams-BMW':             '윌리엄스',
  'Williams-Mecachrome':      '윌리엄스',
  'Williams-Supertec':        '윌리엄스',
  'Williams-Mercedes':        '윌리엄스',
  'Ferrari-Lancia':           '페라리',
  'Cooper-Climax':            '쿠퍼',
  'Cooper-Maserati':          '쿠퍼',
  'Cooper-Ferrari':           '쿠퍼',
  'Lola':                     '롤라',
  'Leyton House':             '레이튼 하우스',
  'Osella':                   '오셀라',
  'Fittipaldi':               '피티팔디',
  'Wolf':                     '울프',
  'Shadow':                   '섀도',
  'Hesketh':                  '헤스케스',
  'Surtees':                  '서티스',
  'Penske':                   '펜스키',
  'Ensign':                   '엔사인',
  'ATS':                      'ATS',
  'Toleman':                  '톨레만',
  'Spirit':                   '스피릿',
  'RAM':                      'RAM',
  'Rial':                     '리알',
  'Coloni':                   '콜로니',
  'EuroBrun':                 '유로브룬',
  'Zakspeed':                 '작스피드',
  'Dallara':                  '달라라',
  'Andrea Moda':              '안드레아 모다',
  'Fondmetal':                '폰드메탈',
  'Simtek':                   '심텍',
  'Footwork':                 '풋워크',
  'Pacific':                  '퍼시픽',
  'Forti':                    '포르티',
  'Lola-Ferrari':             '롤라',
  'Jordan-Ford':              '조던',
  'Jordan-Peugeot':           '조던',
  'Jordan-Mugen-Honda':       '조던',
  'Jordan-Honda':             '조던',
  'Jordan-Hart':              '조던',
  'Benetton-Ford':            '베네통',
  'Benetton-Renault':         '베네통',
  'Benetton-Mecachrome':      '베네통',
  'Arrows-Ford':              '애로우즈',
  'Arrows-Cosworth':          '애로우즈',
  'Arrows-Supertec':          '애로우즈',
  'Prost-Peugeot':            '프로스트',
  'Prost-Mugen-Honda':        '프로스트',
  'BAR-Honda':                'BAR',
  'BAR-Supertec':             'BAR',
  'Minardi-Ford':             '미나르디',
  'Minardi-Cosworth':         '미나르디',
  'Minardi-Asiatech':         '미나르디',
  'Sauber-Mercedes':          '자우버',
  'Sauber-Ferrari':           '자우버',
  'Jaguar-Ford':              '재규어',
  'Stewart-Ford':             '스튜어트',
  'Ligier-Matra':             '리지에',
  'Ligier-Ford':              '리지에',
  'Ligier-Renault':           '리지에',
  'Shadow-Ford':              '섀도',
  'Hesketh-Ford':             '헤스케스',
  'Wolf-Ford':                '울프',
  'Fittipaldi-Ford':          '피티팔디',
  'Ensign-Ford':              '엔사인',
  'Osella-Ford':              '오셀라',
  'Dallara-Ford':             '달라라',
  'Pacific-Ford':             '퍼시픽',
  'Simtek-Ford':              '심텍',
  'Forti-Ford':               '포르티',
  'Toleman-Hart':             '톨레만',
  'March-Alfa Romeo':         '마치',
}

const CONSTRUCTOR_ID_KR_NAMES: Record<string, string> = {
  osca: 'OSCA',
  alta: '알타',
  pawl: '폴',
  hall: '홀',
  marchese: '마르케세',
  veritas: '베리타스',
  bromme: '브롬',
  trevis: '트레비스',
  watson: '왓슨',
  afm: 'AFM',
  bmw: 'BMW',
  stevens: '스티븐스',
  butterworth: '애스턴 버터워스',
  del_roy: '델 로이',
  emw: 'EMW',
  turner: '터너',
  phillips: '필립스',
  nichels: '니켈스',
  pankratz: '팬크라츠',
  klenk: '클렌크',
  epperly: '에퍼리',
  'arzani-volpini': '아르자니-볼피니',
  bugatti: '부가티',
  emeryson: '에머리슨',
  brp: 'BRP',
  stebro: '스테브로',
  scirocco: '시로코',
  lds: 'LDS',
  gilby: '길비',
  tomaso: '데 토마소',
  iso_marlboro: '이소 말보로',
  tecno: '테크노',
  martini: '마르티니',
  merzario: '메르자리오',
  eurobrun: '유로브룬',
  dunn: '던',
  enb: 'ENB',
  'de_tomaso-alfa_romeo': '데 토마소',
  onyx: '오닉스',
}

export const NATIONALITY_FLAGS: Record<string, string> = {
  'British':       'gb',
  'German':        'de',
  'Spanish':       'es',
  'Finnish':       'fi',
  'Brazilian':     'br',
  'Australian':    'au',
  'French':        'fr',
  'Dutch':         'nl',
  'Mexican':       'mx',
  'Canadian':      'ca',
  'Austrian':      'at',
  'Italian':       'it',
  'Belgian':       'be',
  'Swiss':         'ch',
  'Japanese':      'jp',
  'American':      'us',
  'New Zealander': 'nz',
  'Irish':         'ie',
  'South African': 'za',
  'Portuguese':    'pt',
  'Danish':        'dk',
  'Swedish':       'se',
  'Argentine':     'ar',
  'Venezuelan':    've',
  'Colombian':     'co',
  'Monegasque':    'mc',
  'Thai':          'th',
  'Chinese':       'cn',
  'Russian':       'ru',
  'Polish':        'pl',
  'Hungarian':     'hu',
  'Bahraini':      'bh',
  'Malaysian':     'my',
  'Indonesian':    'id',
  'Indian':        'in',
  'Czech':         'cz',
  'Slovak':        'sk',
  'Estonian':      'ee',
  'Lebanese':      'lb',
  'Uruguayan':     'uy',
  'Chilean':       'cl',
  'Cuban':         'cu',
  'Rhodesian':     'zw',
  'American-Italian': 'us',
  'East German':   'de',
  'Korean':        'kr',
}

const SYLLABLE_ONSETS: Record<string, string> = {
  b: 'ㅂ', c: 'ㅋ', d: 'ㄷ', f: 'ㅍ', g: 'ㄱ', h: 'ㅎ', j: 'ㅈ', k: 'ㅋ', l: 'ㄹ',
  m: 'ㅁ', n: 'ㄴ', p: 'ㅍ', q: 'ㅋ', r: 'ㄹ', s: 'ㅅ', t: 'ㅌ', v: 'ㅂ', w: 'ㅇ',
  x: 'ㅅ', y: 'ㅇ', z: 'ㅈ',
}

const SYLLABLE_NUCLEI: Record<string, string> = {
  a: 'ㅏ', e: 'ㅔ', i: 'ㅣ', o: 'ㅗ', u: 'ㅜ', y: 'ㅣ',
}

const SYLLABLE_CODA: Record<string, string> = {
  n: 'ㄴ', m: 'ㅁ', l: 'ㄹ', r: 'ㄹ', g: 'ㄱ', k: 'ㄱ', p: 'ㅂ', b: 'ㅂ', t: 'ㅅ', d: 'ㄷ', s: 'ㅅ',
}

const HANGUL_BASE = 0xac00
const ONSET_ORDER = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
const NUCLEUS_ORDER = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
const CODA_ORDER = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

function makeHangul(onset: string, nucleus: string, coda = '') {
  const onsetIndex = ONSET_ORDER.indexOf(onset)
  const nucleusIndex = NUCLEUS_ORDER.indexOf(nucleus)
  const codaIndex = CODA_ORDER.indexOf(coda)
  if (onsetIndex < 0 || nucleusIndex < 0 || codaIndex < 0) return ''
  return String.fromCharCode(HANGUL_BASE + onsetIndex * 588 + nucleusIndex * 28 + codaIndex)
}

function approximateLatinName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/(\s+|-|')/)
    .map(part => {
      if (/^(\s+|-|')$/.test(part)) return part
      const letters = part.toLowerCase().replace(/[^a-z]/g, '')
      if (!letters) return part

      const syllables: string[] = []
      let i = 0
      while (i < letters.length) {
        let onset = 'ㅇ'
        if (SYLLABLE_ONSETS[letters[i]] && !SYLLABLE_NUCLEI[letters[i]]) {
          onset = SYLLABLE_ONSETS[letters[i]]
          i++
        }

        const vowel = letters[i]
        const nucleus = SYLLABLE_NUCLEI[vowel] ?? 'ㅡ'
        if (SYLLABLE_NUCLEI[vowel]) i++

        let coda = ''
        if (i < letters.length && SYLLABLE_CODA[letters[i]] && !SYLLABLE_NUCLEI[letters[i + 1]]) {
          coda = SYLLABLE_CODA[letters[i]]
          i++
        }

        syllables.push(makeHangul(onset, nucleus, coda))
      }

      return syllables.join('')
    })
    .join('')
}

// 악센트 제거 후 재시도 → 'Nico Hulkenberg' 가 'Nico Hülkenberg' 항목을 찾을 수 있도록
const DRIVER_KR_NAMES_STRIPPED: Record<string, string> = Object.fromEntries(
  Object.entries(DRIVER_KR_NAMES).map(([k, v]) => [
    k.normalize('NFD').replace(/[̀-ͯ]/g, ''),
    v,
  ])
)

export function getDriverKrName(originalName: string, driverId?: string) {
  const stripped = originalName.normalize('NFD').replace(/[̀-ͯ]/g, '')
  return (driverId ? DRIVER_ID_KR_NAMES[driverId] : undefined)
    ?? DRIVER_KR_NAMES[originalName]
    ?? DRIVER_KR_NAMES_STRIPPED[stripped]
    ?? approximateLatinName(originalName)
}

function getConstructorKrName(name: string, constructorId?: string): string {
  if (constructorId && CONSTRUCTOR_ID_KR_NAMES[constructorId]) return CONSTRUCTOR_ID_KR_NAMES[constructorId]
  if (CONSTRUCTOR_KR_NAMES[name]) return CONSTRUCTOR_KR_NAMES[name]
  const dashIdx = name.indexOf('-')
  if (dashIdx > 0) {
    const base = name.substring(0, dashIdx).trim()
    if (CONSTRUCTOR_KR_NAMES[base]) return CONSTRUCTOR_KR_NAMES[base]
  }
  return approximateLatinName(name)
}

export interface DriverStandingRow {
  position:       number | null
  driverId:       string
  code:           string
  name:           string
  originalName:   string
  nationality:    string
  flagCode:       string
  team:           string
  teamColor:      string
  points:         number
  wins:           number
  positionChange?: number | null
  podiums?:        number
}

export interface ConstructorStandingRow {
  position:       number | null
  constructorId:  string
  name:           string
  originalName:   string
  nationality:    string
  flagCode:       string
  teamColor:      string
  points:         number
  wins:           number
  positionChange?: number | null
  podiums?:        number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDriverRow(s: any): DriverStandingRow {
  const originalName = `${s.Driver.givenName} ${s.Driver.familyName}`
  const krName = getDriverKrName(originalName, s.Driver.driverId)
  const teamRaw: string = s.Constructors?.[0]?.name ?? ''
  const teamKr = getConstructorKrName(teamRaw, s.Constructors?.[0]?.constructorId)
  return {
    position:    s.position ? Number(s.position) : null,
    driverId:    s.Driver.driverId,
    code:        s.Driver.code ?? '',
    name:        krName,
    originalName,
    nationality: s.Driver.nationality ?? '',
    flagCode:    NATIONALITY_FLAGS[s.Driver.nationality] ?? '',
    team:        teamKr,
    teamColor:   TEAM_COLORS[teamKr] ?? '#888888',
    points:      Number(s.points),
    wins:        Number(s.wins),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseConstructorRow(s: any): ConstructorStandingRow {
  const originalName: string = s.Constructor.name
  const nameKr = getConstructorKrName(originalName, s.Constructor.constructorId)
  return {
    position:      s.position ? Number(s.position) : null,
    constructorId: s.Constructor.constructorId,
    name:          nameKr,
    originalName,
    nationality:   s.Constructor.nationality ?? '',
    flagCode:      NATIONALITY_FLAGS[s.Constructor.nationality] ?? '',
    teamColor:     TEAM_COLORS[nameKr] ?? '#888888',
    points:        Number(s.points),
    wins:          Number(s.wins),
  }
}

async function fetchDriverStandingsRaw(year: number, round?: number): Promise<{ round: number; rows: DriverStandingRow[] } | null> {
  try {
    const path = round != null ? `${year}/${round}/driverStandings.json` : `${year}/driverStandings.json`
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${path}?limit=200`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    const list = data.MRData?.StandingsTable?.StandingsLists?.[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standings: any[] = list?.DriverStandings
    if (!standings?.length) return null
    return { round: Number(list?.round ?? 0), rows: standings.map(parseDriverRow) }
  } catch {
    return null
  }
}

async function fetchConstructorStandingsRaw(year: number, round?: number): Promise<{ round: number; rows: ConstructorStandingRow[] } | null> {
  try {
    const path = round != null ? `${year}/${round}/constructorStandings.json` : `${year}/constructorStandings.json`
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${path}?limit=200`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    const list = data.MRData?.StandingsTable?.StandingsLists?.[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standings: any[] = list?.ConstructorStandings
    if (!standings?.length) return null
    return { round: Number(list?.round ?? 0), rows: standings.map(parseConstructorRow) }
  } catch {
    return null
  }
}

async function fetchPodiumCounts(year: number): Promise<{ drivers: Record<string, number>; constructors: Record<string, number> } | null> {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/results.json?limit=1000`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const races: any[] = data.MRData?.RaceTable?.Races ?? []
    const drivers: Record<string, number> = {}
    const constructors: Record<string, number> = {}
    for (const race of races) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const result of (race.Results ?? []) as any[]) {
        const pos = Number(result.position)
        if (pos >= 1 && pos <= 3) {
          const dId: string = result.Driver?.driverId
          const cId: string = result.Constructor?.constructorId
          if (dId) drivers[dId] = (drivers[dId] ?? 0) + 1
          if (cId) constructors[cId] = (constructors[cId] ?? 0) + 1
        }
      }
    }
    return { drivers, constructors }
  } catch {
    return null
  }
}

export async function fetchDriverStandings(year: number, round?: number): Promise<DriverStandingRow[] | null> {
  const result = await fetchDriverStandingsRaw(year, round)
  return result?.rows ?? null
}

export async function fetchConstructorStandings(year: number, round?: number): Promise<ConstructorStandingRow[] | null> {
  const result = await fetchConstructorStandingsRaw(year, round)
  return result?.rows ?? null
}

export async function fetchEnrichedStandings(year: number): Promise<{
  drivers: DriverStandingRow[] | null
  constructors: ConstructorStandingRow[] | null
}> {
  const isConstructorYear = year >= 1958

  const [driverResult, constructorResult, podiumCounts] = await Promise.all([
    fetchDriverStandingsRaw(year),
    isConstructorYear ? fetchConstructorStandingsRaw(year) : Promise.resolve(null),
    fetchPodiumCounts(year),
  ])

  if (!driverResult) return { drivers: null, constructors: constructorResult?.rows ?? null }

  const currentRound = driverResult.round
  let prevDriverRows: DriverStandingRow[] | null = null
  let prevConstructorRows: ConstructorStandingRow[] | null = null

  if (currentRound > 1) {
    ;[prevDriverRows, prevConstructorRows] = await Promise.all([
      fetchDriverStandings(year, currentRound - 1),
      isConstructorYear && constructorResult ? fetchConstructorStandings(year, currentRound - 1) : Promise.resolve(null),
    ])
  }

  const prevDriverPos = new Map<string, number | null>(
    (prevDriverRows ?? []).map(r => [r.driverId, r.position])
  )
  const prevConstructorPos = new Map<string, number | null>(
    (prevConstructorRows ?? []).map(r => [r.constructorId, r.position])
  )

  const drivers = driverResult.rows.map(r => ({
    ...r,
    positionChange:
      r.position !== null && prevDriverPos.has(r.driverId) && prevDriverPos.get(r.driverId) !== null
        ? (prevDriverPos.get(r.driverId) as number) - r.position
        : null,
    podiums: podiumCounts?.drivers[r.driverId] ?? 0,
  }))

  const constructors = constructorResult
    ? constructorResult.rows.map(r => ({
        ...r,
        positionChange:
          r.position !== null &&
          prevConstructorPos.has(r.constructorId) &&
          prevConstructorPos.get(r.constructorId) !== null
            ? (prevConstructorPos.get(r.constructorId) as number) - r.position
            : null,
        podiums: podiumCounts?.constructors[r.constructorId] ?? 0,
      }))
    : null

  return { drivers, constructors }
}
