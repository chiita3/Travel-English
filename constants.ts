import { Country, Scene } from './types';

export const COUNTRIES: { value: Country; label: string; voice: string }[] = [
  { value: Country.Australia, label: 'Australia', voice: 'Kore' },
  { value: Country.Brazil, label: 'Brazil', voice: 'Zephyr' },
  { value: Country.Canada, label: 'Canada', voice: 'Zephyr' },
  { value: Country.France, label: 'France', voice: 'Puck' },
  { value: Country.Germany, label: 'Germany', voice: 'Charon' },
  { value: Country.India, label: 'India', voice: 'Charon' },
  { value: Country.Ireland, label: 'Ireland', voice: 'Puck' },
  { value: Country.Italy, label: 'Italy', voice: 'Zephyr' },
  { value: Country.Japan, label: 'Japan', voice: 'Kore' },
  { value: Country.Mexico, label: 'Mexico', voice: 'Zephyr' },
  { value: Country.NewZealand, label: 'New Zealand', voice: 'Kore' },
  { value: Country.Nigeria, label: 'Nigeria', voice: 'Fenrir' },
  { value: Country.Philippines, label: 'Philippines', voice: 'Kore' },
  { value: Country.Singapore, label: 'Singapore', voice: 'Kore' },
  { value: Country.SouthAfrica, label: 'South Africa', voice: 'Kore' },
  { value: Country.SouthKorea, label: 'South Korea', voice: 'Kore' },
  { value: Country.Spain, label: 'Spain', voice: 'Puck' },
  { value: Country.Taiwan, label: 'Taiwan', voice: 'Kore' },
  { value: Country.Thailand, label: 'Thailand', voice: 'Kore' },
  { value: Country.UK, label: 'UK', voice: 'Puck' },
  { value: Country.USA, label: 'USA', voice: 'Zephyr' },
  { value: Country.Vietnam, label: 'Vietnam', voice: 'Kore' },
];

export const SCENES: Scene[] = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    emoji: '🍽️',
    prompt: 'You are a friendly restaurant waiter. Start by greeting the user and asking if they are ready to order.',
    color: 'bg-rose-500',
    hoverColor: 'hover:bg-rose-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'Good evening! Table for two?', japanese: 'こんばんは！2名様でよろしいですか？' },
              { speaker: 'user', text: 'Yes, please. By the window if possible.', japanese: 'はい、お願いします。できれば窓際で。' },
              { speaker: 'model', text: 'Of course. Right this way. Here are your menus.', japanese: 'もちろんです。こちらへどうぞ。メニューです。' },
              { speaker: 'user', text: 'Thank you. What are the specials today?', japanese: 'ありがとう。今日のおすすめは何ですか？' },
            ],
            vocabulary: [
                { word: 'possible', japanese: '可能', definition: 'Able to be done or achieved. (実行または達成が可能であること。)' },
                { word: 'menu', japanese: 'メニュー', definition: 'A list of food and drinks available at a restaurant. (レストランで提供される食べ物と飲み物のリスト。)' },
                { word: 'specials', japanese: '本日のおすすめ', definition: 'Dishes that are not on the regular menu and are available for a limited time. (通常のメニューにはなく、期間限定で提供される料理。)' },
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop',
            examples: [
                { speaker: 'model', text: 'Are you ready to order, or do you need a few more minutes?', japanese: 'ご注文はお決まりですか？もう少しお時間が必要ですか？' },
                { speaker: 'user', text: "I'm ready. I'll have the salmon with a side of vegetables.", japanese: 'はい。サーモンと野菜の付け合わせをお願いします。' },
                { speaker: 'model', text: 'Excellent choice. And for your drink?', japanese: '素晴らしい選択ですね。お飲み物はいかがなさいますか？' },
                { speaker: 'user', text: 'Just water for me, please.', japanese: 'お水だけでお願いします。' },
            ],
            vocabulary: [
                { word: 'order', japanese: '注文する', definition: 'To request food or drink in a restaurant. (レストランで食べ物や飲み物を頼むこと。)' },
                { word: 'side of vegetables', japanese: '野菜の付け合わせ', definition: 'A smaller dish of vegetables served alongside the main course. (メインコースと一緒に出される野菜の小皿。)' },
                { word: 'drink', japanese: '飲み物', definition: 'A liquid for drinking; a beverage. (飲むための液体、飲料。)' },
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'How was everything?', japanese: 'お食事はいかがでしたか？' },
              { speaker: 'user', text: 'It was delicious, thank you. Could we have the check, please?', japanese: 'とても美味しかったです、ありがとう。お会計をお願いします。' },
              { speaker: 'model', text: 'Certainly. Will you be paying together or separately?', japanese: 'かしこまりました。お支払いはご一緒ですか、それとも別々ですか？' },
              { speaker: 'user', text: 'We\'ll pay together. Do you accept credit cards?', japanese: '一緒に支払います。クレジットカードは使えますか？' },
            ],
            vocabulary: [
                { word: 'delicious', japanese: '美味しい', definition: 'Having a very pleasant taste or smell. (非常に良い味や香りがすること。)' },
                { word: 'check', japanese: 'お会計', definition: 'A bill for food or drink at a restaurant. (レストランでの飲食代の請求書。)' },
                { word: 'separately', japanese: '別々に', definition: 'Individually; not together. (個々に、一緒ではなく。)' },
            ]
        }
    ]
  },
  {
    id: 'cafe',
    title: 'Cafe',
    emoji: '☕',
    prompt: 'You are a cheerful cafe barista. Start by greeting the user and asking what they would like to drink.',
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'Hi there! What can I get for you today?', japanese: 'こんにちは！今日は何になさいますか？' },
              { speaker: 'user', text: "I'd like a large latte, please.", japanese: 'ラテのLサイズをお願いします。' },
              { speaker: 'model', text: 'Sure. Anything else? A pastry perhaps?', japanese: 'かしこまりました。他には何か？ペイストリーはいかがですか？' },
              { speaker: 'user', text: 'No, that will be all. Thanks.', japanese: 'いいえ、それで全部です。ありがとう。' },
            ],
            vocabulary: [
                { word: 'latte', japanese: 'ラテ', definition: 'A coffee drink made with espresso and steamed milk. (エスプレッソとスチームミルクで作るコーヒー飲料。)' },
                { word: 'pastry', japanese: 'ペイストリー', definition: 'A sweet baked good, like a croissant or a Danish. (クロワッサンやデニッシュなどの甘い焼き菓子。)' },
                { word: 'perhaps', japanese: 'もしかしたら', definition: 'Used to express uncertainty or possibility; maybe. (不確実性や可能性を表すために使用される。たぶん。)' }
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1511920183276-5941c21675e4?q=80&w=1974&auto=format&fit=crop',
            examples: [
                { speaker: 'model', text: 'Welcome! What are we having?', japanese: 'いらっしゃいませ！何になさいますか？' },
                { speaker: 'user', text: 'Can I get an iced Americano with a little room for milk?', japanese: 'アイスアメリカーノにミルクを入れるスペースを少し空けてもらえますか？' },
                { speaker: 'model', text: 'You got it. For here or to go?', japanese: 'かしこまりました。店内でお召し上がりですか、お持ち帰りですか？' },
                { speaker: 'user', text: 'To go, please.', japanese: '持ち帰りでお願いします。' },
            ],
            vocabulary: [
                { word: 'iced Americano', japanese: 'アイスアメリカーノ', definition: 'Espresso shots topped with cold water to create a light layer of crema, served over ice. (エスプレッソショットに冷水を加えてクレマの薄い層を作り、氷の上から注いだもの。)' },
                { word: 'room for milk', japanese: 'ミルクを入れるスペース', definition: 'Leaving a small amount of space at the top of a drink to add milk or cream. (飲み物の上部にミルクやクリームを加えるための小さなスペースを残すこと。)' },
                { word: 'to go', japanese: '持ち帰り', definition: 'To be taken away from the cafe to be eaten or drunk elsewhere. (カフェから持ち出して他の場所で飲食すること。)' },
            ]
        }
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping',
    emoji: '🛍️',
    prompt: 'You are a helpful shop assistant in a clothing store. Greet the user and ask if they need any help.',
    color: 'bg-violet-500',
    hoverColor: 'hover:bg-violet-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'Hello, welcome! Let me know if you need any help.', japanese: 'こんにちは、ようこそ！何かお手伝いが必要でしたらお知らせください。' },
              { speaker: 'user', text: 'Thanks. Do you have this in a medium?', japanese: 'ありがとう。これのMサイズはありますか？' },
              { speaker: 'model', text: 'Let me check for you. Yes, here you go.', japanese: '確認しますね。はい、どうぞ。' },
              { speaker: 'user', text: 'Great, thank you. Can I try this on?', japanese: 'よかった、ありがとう。これを試着してもいいですか？' },
            ],
            vocabulary: [
                { word: 'medium', japanese: 'Mサイズ', definition: 'A standard size for clothes, between small and large. (SサイズとLサイズの中間の標準的な服のサイズ。)' },
                { word: 'check', japanese: '確認する', definition: 'To make sure of something. (何かを確かめること。)' },
                { word: 'try on', japanese: '試着する', definition: 'To put on an item of clothing to see if it fits or suits one. (服が合うか、似合うかを確認するために着てみること。)' },
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
            examples: [
                { speaker: 'model', text: 'Are you looking for anything in particular?', japanese: '何か特定のものを探していますか？' },
                { speaker: 'user', text: "Yes, I'm looking for a gift for my friend.", japanese: 'はい、友達へのプレゼントを探しています。' },
                { speaker: 'model', text: 'We have some lovely scarves over here. They are on sale.', japanese: 'こちらに素敵なスカーフがいくつかありますよ。セール中です。' },
                { speaker: 'user', text: "Perfect! I'll take this one. Could you gift wrap it for me?", japanese: '完璧です！これをください。ギフト用に包んでもらえますか？' },
            ],
            vocabulary: [
                { word: 'in particular', japanese: '特に', definition: 'Specifically; especially. (具体的に、特に。)' },
                { word: 'on sale', japanese: 'セール中', definition: 'Available for a lower price than usual. (通常より安い価格で入手できること。)' },
                { word: 'gift wrap', japanese: 'ギフト用に包む', definition: 'To wrap a present in decorative paper. (プレゼントを装飾用の紙で包むこと。)' },
            ]
        }
    ]
  },
  {
    id: 'hotel',
    title: 'Hotel',
    emoji: '🏨',
    prompt: 'You are a professional hotel receptionist. Greet the user and ask if they have a reservation.',
    color: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'Good afternoon, welcome. Do you have a reservation?', japanese: 'こんにちは、ようこそ。ご予約はありますか？' },
              { speaker: 'user', text: "Yes, I do. It's under the name Smith.", japanese: 'はい、あります。スミスという名前です。' },
              { speaker: 'model', text: 'Thank you, Mr. Smith. Could I see your passport, please?', japanese: 'ありがとうございます、スミス様。パスポートを拝見してもよろしいですか？' },
              { speaker: 'user', text: 'Certainly. Here you go.', japanese: 'もちろんです。はい、どうぞ。' },
            ],
            vocabulary: [
                { word: 'reservation', japanese: '予約', definition: 'An arrangement to have something (like a room) held for you. (部屋などを確保してもらうための手配。)' },
                { word: 'under the name', japanese: '〜の名前で', definition: 'Registered or booked using a specific name. (特定の名前を使って登録または予約されていること。)' },
                { word: 'certainly', japanese: 'もちろんです', definition: 'A polite way of saying "yes". (「はい」の丁寧な言い方。)' }
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop',
            examples: [
                { speaker: 'model', text: 'Welcome. How can I assist you today?', japanese: 'ようこそ。本日はどのようなご用件でしょうか？' },
                { speaker: 'user', text: "Hello, I'd like to check out, please.", japanese: 'こんにちは、チェックアウトをお願いします。' },
                { speaker: 'model', text: 'Of course. Your room number?', japanese: 'かしこまりました。お部屋番号をお願いします。' },
                { speaker: 'user', text: "It's 703. Here is my key card.", japanese: '703号室です。これがルームキーです。' },
            ],
            vocabulary: [
                { word: 'assist', japanese: '手伝う', definition: 'To help someone. (誰かを助けること。)' },
                { word: 'check out', japanese: 'チェックアウトする', definition: 'To leave a hotel after paying your bill. (請求書を支払った後、ホテルを出ること。)' },
                { word: 'key card', japanese: 'キーカード', definition: 'A plastic card used to open a door instead of a traditional key. (従来の鍵の代わりにドアを開けるために使用されるプラスチックカード。)' },
            ]
        }
    ]
  },
  {
    id: 'airport',
    title: 'Airport',
    emoji: '✈️',
    prompt: 'You are an airline check-in agent. Greet the user and ask for their passport and ticket.',
    color: 'bg-slate-500',
    hoverColor: 'hover:bg-slate-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-152459271464c-344b3bab3ea1?q=80&w=2070&auto=format&fit=crop',
            examples: [
              { speaker: 'model', text: 'Hello. Where are you flying to today?', japanese: 'こんにちは。本日はどちらへご出発ですか？' },
              { speaker: 'user', text: "I'm flying to Tokyo.", japanese: '東京へ行きます。' },
              { speaker: 'model', text: 'May I have your passport, please?', japanese: 'パスポートを拝見します。' },
              { speaker: 'user', text: 'Sure. And how many bags can I check in?', japanese: 'はい。荷物はいくつ預けられますか？' },
            ],
            vocabulary: [
                { word: 'fly to', japanese: '〜へ飛ぶ', definition: 'To travel by airplane to a destination. (飛行機で目的地へ旅行すること。)' },
                { word: 'passport', japanese: 'パスポート', definition: 'An official document for travel, proving identity and citizenship. (身元と国籍を証明する、旅行のための公式文書。)' },
                { word: 'check in', japanese: 'チェックインする', definition: 'To register for a flight and leave your bags. (フライトの搭乗手続きをして、手荷物を預けること。)' }
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop',
            examples: [
                { speaker: 'model', text: 'Your boarding pass and passport, please.', japanese: '搭乗券とパスポートをお願いします。' },
                { speaker: 'user', text: "Here you are. Which gate is it?", japanese: 'はい、どうぞ。ゲートはどちらですか？' },
                { speaker: 'model', text: "It's Gate B24. Boarding will start at 3:30 PM.", japanese: 'B24番ゲートです。ご搭乗は午後3時30分に開始します。' },
                { speaker: 'user', text: 'Thank you very much.', japanese: 'どうもありがとうございます。' },
            ],
            vocabulary: [
                { word: 'boarding pass', japanese: '搭乗券', definition: 'A card that a passenger must have to be allowed to get on an aircraft. (乗客が航空機に搭乗するために必要なカード。)' },
                { word: 'gate', japanese: 'ゲート', definition: 'The area in an airport where passengers wait before getting onto an aircraft. (空港で乗客が航空機に搭乗する前に待つ場所。)' },
                { word: 'boarding', japanese: '搭乗', definition: 'The process of getting on a plane. (飛行機に乗り込むプロセス。)' },
            ]
        }
    ]
  },
  {
    id: 'directions',
    title: 'Directions',
    emoji: '🗺️',
    prompt: 'You are a helpful local person on the street. The user will ask you for directions. Start by saying "Excuse me, can I help you?".',
    color: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    exampleSets: [
        {
            image: 'https://images.unsplash.com/photo-1527725922319-1a6c478687a8?q=80&w=2070&auto=format&fit=crop',
            examples: [
              { speaker: 'user', text: 'Excuse me, could you tell me how to get to the museum?', japanese: 'すみません、博物館への行き方を教えていただけますか？' },
              { speaker: 'model', text: 'Of course. Go straight ahead for two blocks, then turn left.', japanese: 'もちろんです。このまま2ブロックまっすぐ行って、左に曲がってください。' },
              { speaker: 'user', text: 'Is it far from here?', japanese: 'ここから遠いですか？' },
              { speaker: 'model', text: 'Not at all, it\'s about a five-minute walk.', japanese: 'いえ、全然。歩いて5分くらいですよ。' },
            ],
            vocabulary: [
                { word: 'museum', japanese: '博物館', definition: 'A building where important cultural, historical, or scientific objects are kept and shown to the public. (重要な文化的、歴史的、または科学的なオブジェが保管され、一般に公開されている建物。)' },
                { word: 'go straight ahead', japanese: 'まっすぐ進む', definition: 'Continuing in the same direction without turning. (曲がらずに同じ方向に進み続けること。)' },
                { word: 'blocks', japanese: 'ブロック', definition: 'The distance along a street from where one road crosses it to the next. (ある道路が交差する場所から次の交差点までの通り沿いの距離。)' }
            ]
        },
        {
            image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop',
            examples: [
                { speaker: 'user', text: 'Pardon me, I think I\'m lost. Where is the nearest subway station?', japanese: 'すみません、道に迷ったようです。最寄りの地下鉄の駅はどこですか？' },
                { speaker: 'model', text: 'No problem. The entrance is just around the corner, next to that big bank.', japanese: '大丈夫ですよ。入り口はすぐそこの角を曲がったところ、あの大きな銀行の隣です。' },
                { speaker: 'user', text: 'Oh, I see it. Thank you so much for your help!', japanese: 'ああ、見えました。助けてくれて本当にありがとうございます！' },
                { speaker: 'model', text: 'You\'re welcome! Have a good day.', japanese: 'どういたしまして！良い一日を。' },
            ],
            vocabulary: [
                { word: 'lost', japanese: '道に迷う', definition: 'Unable to find one\'s way. (道がわからなくなること。)' },
                { word: 'nearest', japanese: '最寄り', definition: 'Closest to a particular place. (特定の場所に最も近いこと。)' },
                { word: 'around the corner', japanese: '角を曲がったところ', definition: 'Very near. (すぐ近く。)' },
            ]
        }
    ]
  },
];