const base = 'https://resad-secondbrain.zeabur.app'

const wishes = [
  { title: '台中舊城區徒步導覽活動企劃', category: 'event', description: '想辦一場台中舊城區的徒步導覽，帶大家認識中區的老屋與歷史。有活動企劃或導覽經驗的人，歡迎一起來！預計在2026年秋天舉辦，目標招募20位參加者。', author_name: '阿翔', author_social: '@hsiang_taichung' },
  { title: '獨立樂團現場演出合辦', category: 'event', description: '我們是一個三人小樂團，想找同樣有在玩音樂的朋友合辦一場 Live Show。場地已有初步接洽，缺的是另一組表演者和宣傳人手。', author_name: '米奇鼓手', author_social: '@mickey_drums' },
  { title: '台中在地品牌聯合快閃市集', category: 'event', description: '想號召台中的小農、手作品牌、設計師一起辦快閃市集。我負責統籌和場地，需要有辦市集經驗的人一起來做行政和宣傳。', author_name: '慢慢來選物', author_social: '' },
  { title: '地方刊物《台中腔》創刊計畫', category: 'media', description: '想創辦一本專門寫台中在地人物、空間、生活的獨立刊物。目前找文字編輯、攝影師和設計師，有志同道合的人一起聊聊！', author_name: '偷偷', author_social: '@resad1983' },
  { title: 'Podcast 節目《城市邊緣人》共同主持', category: 'media', description: '我已經跑了30集的城市議題 Podcast，想找一個有想法、敢講話的共同主持人。不需要有錄音經驗，但要對城市、文化、空間有感。', author_name: '城市遊走者', author_social: '@citywalker_pod' },
  { title: '東南亞新住民故事影像計畫', category: 'media', description: '想做一個紀錄片短片系列，拍台中東南亞新住民的日常與故事。找攝影師、剪輯師，或者願意擔任聯絡人的朋友一起加入。', author_name: '阿雯', author_social: '@wen_lens' },
  { title: '老屋空間活化提案徵件', category: 'space', description: '手上有一棟位於台中中區的老屋，想找有創意的人提案活化，可能是選品店、工作室或共享空間。歡迎個人或團隊提案討論！', author_name: '林老屋主', author_social: '' },
  { title: '青年共居空間共同發起人募集', category: 'collab', description: '想在台中發起一個青年共居計畫，有點類似合作公寓的概念，大家分擔房租、共用資源、互相支持。目前找對共居有興趣的3-4人來討論可行性。', author_name: '小海', author_social: '@kai_lives' },
  { title: '台中獨立書店生存調查研究', category: 'research', description: '想做一份關於台中獨立書店現況的田野調查，包含訪談店主、分析營運模式、整理成公開報告。找有質性研究或訪談經驗的夥伴一起進行。', author_name: '讀字人', author_social: '@readingperson_tc' },
]

const comments = [
  [
    { author_name: '小玲', author_social: '@ling_walk', content: '超想參加！我之前有辦過社區導覽，可以一起聊聊' },
    { author_name: '建宏', author_social: '', content: '中區老屋我很熟，有幾個點很適合帶人去，可以聯絡我' },
  ],
  [
    { author_name: 'Sam', author_social: '@sam_guitar', content: '我們也是樂團，主打後搖，有興趣合辦！' },
    { author_name: '場地小幫手', author_social: '', content: '有幾個場地可以推薦，價格合理，之前辦過類似活動' },
    { author_name: '阿柔', author_social: '@rou_event', content: '我可以幫忙宣傳設計，之前做過演出海報' },
  ],
  [
    { author_name: '手作皂皂', author_social: '@soap_handmade', content: '我有手工皂品牌，很想參加！請問攤位費大概怎麼算？' },
    { author_name: '青蔬農場', author_social: '', content: '小農這邊很有興趣，請問場地在哪一帶？' },
  ],
  [
    { author_name: '阿力', author_social: '@ali_writes', content: '我有在寫台中相關的文章，很想加入編輯團隊！' },
    { author_name: '攝影師Karen', author_social: '@karen_photo', content: '攝影這塊我可以貢獻，作品集可以給你看' },
    { author_name: '設計阿德', author_social: '@de_design', content: '刊物設計我很感興趣，之前有做過獨立誌' },
  ],
  [
    { author_name: '城市觀察家', author_social: '@observe_city', content: '聽過你的節目！很有質感，我對都更議題很有想法' },
    { author_name: 'Joyce', author_social: '@joyce_speaks', content: '我在媒體業工作，對這個主題很有共鳴，可以聊聊' },
  ],
  [
    { author_name: '影像工作者小朱', author_social: '@zhu_film', content: '這個題材很有價值，我有紀錄片拍攝經驗，想了解更多' },
    { author_name: '移民協會志工', author_social: '', content: '我在做東南亞新住民服務，可以幫忙聯繫受訪者' },
  ],
  [
    { author_name: '創業者阿豪', author_social: '@hao_startup', content: '老屋位置在哪？有沒有圖片可以看看？' },
    { author_name: '工作室主理人', author_social: '@studio_tc', content: '我在找空間，選品工作室這個方向蠻符合我的需求' },
    { author_name: '空間設計師Nini', author_social: '@nini_space', content: '如果需要空間規劃建議，我可以幫忙評估' },
  ],
  [
    { author_name: 'Eason', author_social: '@eason_home', content: '共居這個概念在台灣真的太少了，我很有興趣討論！' },
    { author_name: '大學剛畢業的Mei', author_social: '', content: '租房壓力好大，如果能共居真的很棒，想了解更多' },
  ],
  [
    { author_name: '書店老闆阿成', author_social: '@book_cheng', content: '我開書店10年了，很願意受訪，這個研究很有意義' },
    { author_name: '質性研究者', author_social: '@qualitative_r', content: '我是社科背景，有訪談經驗，想加入這個計畫' },
    { author_name: '愛書人小靜', author_social: '', content: '期待這份報告，希望能幫助到獨立書店' },
  ],
]

for (let i = 0; i < wishes.length; i++) {
  const res = await fetch(`${base}/api/wishes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wishes[i]),
  })
  const data = await res.json()
  const id = data.wish.id
  console.log(`✅ 許願 ${i + 1}：${data.wish.title} [${id}]`)

  for (const comment of comments[i]) {
    await fetch(`${base}/api/wishes/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    })
  }
  console.log(`   💬 新增 ${comments[i].length} 則留言`)
}

console.log('\n🎉 完成！')
