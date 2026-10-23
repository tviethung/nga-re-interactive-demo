const FOREST_LEVEL = {
  title: 'RỪNG SƯƠNG: CHỌN MỘT QUẢ TRỨNG',
  intro: 'Bạn lạc trong rừng sương, căn nhà ấm sáng ở cuối đường. Chọn một quả trứng, rồi quyết định sẽ cứu hay bỏ lại người bạn nhỏ. Không giới hạn thời gian đọc lựa chọn.',
  start: 'FOREST_01',
  startLabel: 'VÀO RỪNG SƯƠNG',
  rulesTitle: 'Cách chơi Rừng Sương',
  rules: '<li>Chọn trứng vàng hoặc trứng đá để gặp một người bạn nhỏ.</li><li>Xem hết cảnh rồi chọn hành động. Không đếm ngược và không tự chọn thay bạn.</li><li>Các cảnh nở trứng tự nối tiếp. Có bốn kết thúc; bạn có thể thử lại lựa chọn trước.</li>',
  endings: {FOREST_BIRD_SAVED:'Về nhà cùng Chim Đèn', FOREST_BIRD_LEFT:'Chim ở lại rừng', FOREST_TURTLE_SAVED:'Về nhà cùng Rùa Đá', FOREST_TURTLE_LEFT:'Rùa ở lại rừng'},
  nodes: {
    FOREST_01: {
      id:'FOREST_01', title:'01 • Chọn một quả trứng',
      clipPath:'clips/rung_suong/01_CHON_TRUNG.mp4', keyPath:'keyframes/rung_suong/01.jpg',
      decisionPath:'keyframes/rung_suong/01.jpg',
      promptQuestion:'Bạn chọn quả trứng nào?',
      subtitle:'Hai quả trứng nằm giữa rừng sương. Bạn chọn trứng vàng hay trứng đá?',
      choices:[{label:'Chọn trứng vàng',next:'FOREST_02'},{label:'Chọn trứng đá',next:'FOREST_04'}]
    },
    FOREST_02: {
      id:'FOREST_02', title:'02 • Chim Đèn nở',
      clipPath:'clips/rung_suong/02_CHIM_DEN_NO.mp4', keyPath:'keyframes/rung_suong/02.jpg',
      subtitle:'Một chú Chim Đèn nở ra. Ánh sáng nhỏ trên ngực nó soi rõ lối về nhà.', next:'FOREST_03'
    },
    FOREST_03: {
      id:'FOREST_03', title:'03 • Ánh sáng thu hút sói',
      clipPath:'clips/rung_suong/03_CHIM_BI_SOI_THAY_demo.mp4', keyPath:'keyframes/rung_suong/03.jpg',
      decisionPath:'keyframes/rung_suong/03.jpg',
      promptQuestion:'Bạn sẽ che chở chim hay bỏ lại?',
      subtitle:'Sói đã thấy ánh sáng. Bạn che chở chim và đi lối vòng, hay để chim lại rồi chạy về nhà?',
      choices:[{label:'Che chim, đi lối vòng',tag:'Bảo vệ',next:'FOREST_06'},{label:'Để chim lại, chạy về nhà',tag:'Bỏ lại',next:'FOREST_07'}]
    },
    FOREST_04: {
      id:'FOREST_04', title:'04 • Rùa Đá nở',
      clipPath:'clips/rung_suong/04_RUA_DA_NO.mp4', keyPath:'keyframes/rung_suong/04.jpg',
      subtitle:'Một chú Rùa Đá nở ra. Nó đi chậm, nhưng chiếc mai cứng giúp gạt gai, mở lối cho bạn.', next:'FOREST_05'
    },
    FOREST_05: {
      id:'FOREST_05', title:'05 • Rùa mắc chân',
      clipPath:'clips/rung_suong/05_RUA_MAC_RE.mp4', keyPath:'keyframes/rung_suong/05.jpg',
      decisionPath:'keyframes/rung_suong/05.jpg',
      promptQuestion:'Bạn cứu rùa hay chạy về nhà?',
      subtitle:'Rùa mắc chân rồi. Sói đang tới từ phía sau. Gỡ nó để cùng nấp trong hốc, hay chạy ngay về nhà?',
      choices:[{label:'Gỡ rùa, cùng nấp trong hốc',tag:'Cứu rùa',next:'FOREST_08'},{label:'Bỏ rùa, chạy về nhà',tag:'Bỏ lại',next:'FOREST_09'}]
    },
    FOREST_06: {
      id:'FOREST_06', title:'06 • Về nhà cùng Chim Đèn',
      clipPath:'clips/rung_suong/06_CUNG_CHIM_VE_NHA.mp4', keyPath:'keyframes/rung_suong/06.jpg',
      subtitle:'Bạn che ánh sáng của chim và chọn lối vòng. Hai bạn cùng về nhà.',
      ending:{code:'FOREST_BIRD_SAVED',title:'VỀ NHÀ CÙNG CHIM ĐÈN',desc:'Người bạn nhỏ ở bên bạn trong căn nhà ấm.',retry:'FOREST_01',retryLabel:'Chọn lại trứng'}
    },
    FOREST_07: {
      id:'FOREST_07', title:'07 • Chim ở lại rừng',
      clipPath:'clips/rung_suong/07_CHIM_O_LAI_RUNG.mp4', keyPath:'keyframes/rung_suong/07.jpg',
      subtitle:'Bạn về nhà một mình. Ánh sáng nhỏ của chim khuất dần trong sương.',
      ending:{code:'FOREST_BIRD_LEFT',title:'VỀ NHÀ MỘT MÌNH — CHIM ĐÈN CÒN Ở NGOÀI',desc:'Bạn không biết người bạn nhỏ sẽ đi đâu trong màn sương.',retry:'FOREST_03',retryLabel:'Thử lựa chọn khác',retryWaiting:true}
    },
    FOREST_08: {
      id:'FOREST_08', title:'08 • Về nhà cùng Rùa Đá',
      clipPath:'clips/rung_suong/08_CUNG_RUA_VE_NHA.mp4', keyPath:'keyframes/rung_suong/08.jpg',
      subtitle:'Bạn gỡ chân rùa, rồi cùng nó nấp sau bộ rễ. Khi sói đi xa, bạn bế người bạn nhỏ về nhà.',
      ending:{code:'FOREST_TURTLE_SAVED',title:'VỀ NHÀ CÙNG RÙA ĐÁ',desc:'Cả bốn chân đã tự do. Người bạn nhỏ cùng bạn ở trong nhà.',retry:'FOREST_01',retryLabel:'Chọn lại trứng'}
    },
    FOREST_09: {
      id:'FOREST_09', title:'09 • Rùa ở lại rừng',
      clipPath:'clips/rung_suong/09_RUA_O_LAI_RUNG.mp4', keyPath:'keyframes/rung_suong/09.jpg',
      subtitle:'Bạn chạy về nhà, để nó lại bên rễ cây. Sương phủ kín lối mòn. Bạn không biết sáng mai nó còn ở đó không.',
      ending:{code:'FOREST_TURTLE_LEFT',title:'VỀ NHÀ MỘT MÌNH — RÙA ĐÁ CÒN Ở NGOÀI',desc:'Sương che khuất bộ rễ. Không biết số phận của rùa ngoài rừng.',retry:'FOREST_05',retryLabel:'Thử lựa chọn khác',retryWaiting:true}
    }
  }
};
