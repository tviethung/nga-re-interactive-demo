const BARBER_LEVEL = {
  title: 'TIỆM LÀM ĐẸP LÚC 0 GIỜ',
  intro: '0 giờ đêm trong con hẻm dị giới, hai tiệm cắt tóc sáng đèn đón bạn.<br/>Đọc kỹ <b>📜 Nội Quy</b> trên cửa kính — một lựa chọn sai sẽ khiến bạn ở lại đây mãi mãi.',
  start: 'NODE_00',
  startLabel: 'BƯỚC VÀO HẺM ĐÊM (CHƠI NGAY)',
  rulesTitle: '⚠️ Nội Quy Khách Hàng Sau 0 Giờ',
  rules: '<li>Chuyên gia thật sự <b>không bao giờ tặng quà</b> trước khi làm việc.</li><li>Khi đắp mặt nạ thạch đen, <b>tuyệt đối không gạt tay hay mở mắt</b> cho đến khi nghe tiếng chuông.</li><li>Nếu lỡ bước vào phòng VIP bên phải, thứ duy nhất cứu mạng bạn là <b>đập vỡ ngay vật làm bằng sứ</b>.</li>',
  endings: {END_TRUE:'Đại Gia Dị Giới',END_SECRET:'Truyền Nhân Tiệm',END_NORMAL:'Thoát Thân',END_BAD:'Thế Thân Hà Mã'},
  nodes: {
    NODE_00: {
      id: "NODE_00",
      title: "00:00 • Cửa Tiệm Dị Giới",
      clipPath: "clips/CLIP_00_HOOK.mp4",
      keyPath: "keyframes/KEY_00_HOOK.jpg",
      danger: "74%",
      dangerNum: 74,
      timerSeconds: 15,
      promptQuestion: "CHỌN CHUYÊN GIA LÀM ĐẸP CHO BẠN!",
      subtitle: "0 giờ đêm, hai chuyên gia bước ra đón bạn: Thợ quấn băng gạc cục súc (trái) và Quý ông đầu Hà Mã lịch lãm cầm heo đất (phải). Hãy đọc 📜 Nội Quy trước khi chọn!",
      imgPrompt: "First-person POV standing outside two adjacent vintage barbershop entrances at midnight. Left: bandaged man in dark leather apron glaring coldly. Right: polite hippo-headed gentleman in velvet suit holding a glossy pink piggy bank. 9:16.",
      motionPrompt: "First-person POV subtle breathing camera. Bandaged man taps black scissors impatiently; hippo gentleman bows politely offering the pink piggy bank. Audio: crisp metallic scissors snipping, midnight rain pattering on cobblestone, hollow ceramic piggy bank rattle. Strictly NO background music, NO musical score, NO soundtrack.",
      defaultChoiceIndex: 1,
      choices: [
        { label: "👈 Chọn 1: Thợ Quấn Băng Gạc (Thái độ cục súc)", tag: "DANGER 40%", next: "NODE_A1" },
        { label: "👉 Chọn 2: Quý Ông Đầu Hà Mã (Tặng heo đất VIP)", tag: "DANGER 88%", next: "NODE_B1" }
      ]
    },
    NODE_A1: {
      id: "NODE_A1",
      title: "Nhánh A • Mặt Nạ Thạch Đen ASMR",
      clipPath: "clips/CLIP_A1_MUD_ASMR.mp4",
      keyPath: "keyframes/KEY_A1_MUD_ASMR.jpg",
      danger: "40%",
      dangerNum: 40,
      timerSeconds: 15,
      promptQuestion: "THẠCH ĐEN PHỦ KÍN MẶT! BẠN LÀM GÌ?",
      subtitle: "Thợ băng gạc đeo găng tay đen, bóp lớp thạch đen lạnh buốt đắp kín mặt bạn. Cơn ngạt thở ập đến, nhưng hãy nhớ Quy tắc số 2 trên cửa kính!",
      imgPrompt: "First-person POV lying back in a wooden barber chair. Bandaged specialist wearing black latex gloves squeezes glossy obsidian-black translucent jelly onto palms, macro ASMR detail, 9:16.",
      motionPrompt: "First-person POV. The bandaged man rubs glossy black jelly on his gloved hands and presses both hands directly over the camera lens until covered in dark gel. Audio: ultra-crisp ASMR thick wet gel squelching, black latex gloves rubbing together, muffled breathing. Strictly NO background music, NO musical score, NO soundtrack.",
      defaultChoiceIndex: 0,
      choices: [
        { label: "😌 Nhắm mắt & Nín thở chờ tiếng chuông (Đúng luật)", tag: "Kiên định", next: "NODE_A2_GOOD" },
        { label: "🖐️ Hoảng loạn gạt tay hắn ra & Mở mắt!", tag: "Phá luật", next: "NODE_A2_BAD" }
      ]
    },
    NODE_A2_GOOD: {
      id: "NODE_A2_GOOD",
      title: "Nhánh A • Hắc Ngọc Kết Tinh",
      clipPath: "clips/CLIP_A2_REWARD.mp4",
      keyPath: "keyframes/KEY_A2_REWARD.jpg",
      danger: "12%",
      dangerNum: 12,
      timerSeconds: 15,
      promptQuestion: "2 GÃ MẶT NẠ THỎ GÕ CỬA ĐÒI MUA HẮC NGỌC!",
      subtitle: "Keng! Lớp thạch đen bóc ra đã hút sạch lời nguyền và kết tinh thành Hắc Ngọc. Thợ băng gạc tặng bạn cả ví tiền dày! Ngoài cửa, 2 gã mặt nạ Thỏ vẫy chìa khóa Audi đòi mua lại viên ngọc.",
      imgPrompt: "First-person POV hands holding an open leather wallet overflowing with cash and a glowing black pearl. Outside the shop window, two rabbit-masked figures stand beside a black Audi sports car, 9:16.",
      motionPrompt: "First-person POV peeling off the black mask. The bandaged barber places a thick wallet of cash into viewer's hands while rabbit-masked men wave car keys outside. Audio: brass shop bell ding, leather wallet rustling, paper banknotes crisp fan sound, muffled knocking on glass window. Strictly NO background music, NO musical score, NO soundtrack.",
      defaultChoiceIndex: 0,
      choices: [
        { label: "🚗 Bán viên ngọc cho người Thỏ lấy siêu xe Audi", tag: "Đổi đời", next: "END_TRUE" },
        { label: "🤝 Từ chối người Thỏ, trao lại ngọc cho Thợ Băng Gạc", tag: "Ẩn số", next: "END_SECRET" }
      ]
    },
    NODE_A2_BAD: {
      id: "NODE_A2_BAD",
      title: "Nhánh A • Phá Vỡ Quy Tắc",
      clipPath: "clips/CLIP_A2_FAIL.mp4",
      keyPath: "keyframes/KEY_A2_FAIL.jpg",
      danger: "65%",
      dangerNum: 65,
      timerSeconds: 0,
      subtitle: "Bạn hoảng loạn hất tay hắn ra! Lớp thạch đen đổ vào bồn rửa sứ sôi trào đen đặc. Thợ Băng Gạc nổi giận mở cửa tống cổ bạn ra khỏi tiệm...",
      imgPrompt: "First-person POV swatting away the barber's gloved hands. A black vortex swirls inside the porcelain sink as the bandaged barber angrily points to the exit, 9:16.",
      motionPrompt: "First-person POV hands pushing the barber away. Camera pans to the sink filled with pitch-black liquid, then stumbles backward out the door. Audio: wet gel slapping, angry grunt, bubbling liquid swirling in porcelain sink, hurried footsteps. Strictly NO background music, NO musical score, NO soundtrack.",
      ending: {
        code: "END_NORMAL",
        rank: "RANK B • SỐNG SÓT",
        title: "😐 NORMAL ENDING: SỐNG SÓT NHƯNG TRẮNG TAY",
        desc: "Bạn đã vi phạm Quy tắc số 2 (Mở mắt khi đắp mặt nạ thạch đen). Dù giữ được mạng sống chạy ra phố đêm, bạn đã đánh mất cơ hội đổi đời của Thợ Băng Gạc."
      }
    },
    END_TRUE: {
      id: "END_TRUE",
      title: "🏆 TRUE ENDING • ĐẠI GIA DỊ GIỚI",
      clipPath: "clips/CLIP_A3_JACKPOT.mp4",
      keyPath: "keyframes/KEY_A3_JACKPOT.jpg",
      danger: "0%",
      dangerNum: 5,
      timerSeconds: 0,
      subtitle: "Hai VIP mặt nạ Thỏ Trắng & Đen đồng loạt cúi đầu 90 độ trao chìa khóa chiếc Audi R8 vào tay bạn. Bạn bước lên siêu xe rời khỏi khu phố đêm trong sự kính nể!",
      imgPrompt: "First-person POV standing in front of a sleek black Audi sports car flanked by two men in black and white rabbit masks handing over glowing car keys, 9:16.",
      motionPrompt: "First-person POV receiving car keys from two rabbit-masked men in suits beside a black Audi, headlights flashing brightly. Audio: electronic car key beep-beep unlock chirp, metallic key clinking into palm, low V10 sports car engine idle purr in the rain. Strictly NO background music, NO musical score, NO soundtrack.",
      ending: {
        code: "END_TRUE",
        rank: "RANK S • ĐẠI GIA DỊ GIỚI",
        title: "🏆 TRUE ENDING: SỐNG SÓT & NHẬN SIÊU XE AUDI",
        desc: "Chúc mừng! Bạn đã nhìn thấu cái bẫy ngoại hình, tuân thủ đúng Nội quy tiệm và thu về cả ví tiền lẫn chiếc siêu xe Audi R8 từ hai gã mặt nạ Thỏ!"
      }
    },
    END_SECRET: {
      id: "END_SECRET",
      title: "✨ SECRET ENDING • CHỦ TIỆM ĐÊM MỚI",
      clipPath: "clips/CLIP_A3_SECRET.mp4",
      keyPath: "keyframes/KEY_A3_SECRET.jpg",
      danger: "0%",
      dangerNum: 0,
      timerSeconds: 0,
      subtitle: "Thợ Băng Gạc sững người khi bạn không tham chiếc siêu xe. Hắn cúi đầu kính trọng đặt chiếc chìa khóa cổ và huy hiệu LUMIÈRE BARBERSHOP vào tay bạn!",
      imgPrompt: "First-person POV hands receiving an ancient golden key and a thick leather wallet from the bandaged specialist bowing deeply in warm golden light, 9:16.",
      motionPrompt: "First-person POV. The bandaged barber bows respectfully and places both the wallet and a glowing golden shop emblem into the viewer's hands. Audio: heavy brass key and metal emblem clinking softly onto skin, leather apron creak, calm ambient room tone. Strictly NO background music, NO musical score, NO soundtrack.",
      ending: {
        code: "END_SECRET",
        rank: "RANK S+ • KẾT CỤC ẨN (TOP 5%)",
        title: "✨ SECRET ENDING: TRUYỀN NHÂN TIỆM DỊ GIỚI",
        desc: "Bạn không bị mua chuộc bởi đám người Thỏ! Thợ Băng Gạc công nhận phẩm chất của bạn và truyền lại quyền làm chủ Tiệm Lumière."
      }
    },
    NODE_B1: {
      id: "NODE_B1",
      title: "Nhánh B • Món Quà Của Quý Ông Hà Mã",
      clipPath: "clips/CLIP_B1_HIPPO_GIFT.mp4",
      keyPath: "keyframes/KEY_B1_HIPPO_GIFT.jpg",
      danger: "88%",
      dangerNum: 88,
      timerSeconds: 15,
      promptQuestion: "HẮN GIƠ CỜ-LÊ TRONG GƯƠNG! PHẢN XẠ NGAY!",
      subtitle: "Quý ông Hà Mã đặt con Heo Đất sứ hồng TIPS vào tay bạn. Nhưng nhìn vào bóng phản chiếu trong gương kìa! Hắn đang đứng sát sau ghế và giơ cao chiếc Cờ-lê thép khổng lồ!",
      imgPrompt: "First-person POV sitting in a luxurious barber chair holding a pink ceramic piggy bank, while in the mirror reflection behind the seated customer the hippo-headed gentleman raises a giant steel wrench, 9:16.",
      motionPrompt: "First-person POV looking at the pink piggy bank in hands, then up at the mirror as the hippo-headed barber lifts a massive steel wrench. Audio: coins clinking inside ceramic piggy bank, low menacing hippo snort, heavy steel wrench scraping sound. Strictly NO background music, NO musical score, NO soundtrack.",
      defaultChoiceIndex: 1,
      choices: [
        { label: "🔨 Đập vỡ con Heo Đất sứ xuống bàn đá ngay! (Quy tắc 3)", tag: "Phản kích", next: "NODE_B2_ESCAPE" },
        { label: "🐷 Ôm chặt Heo Đất & Ngồi yên trên ghế", tag: "Nguy hiểm!", next: "END_BAD" }
      ]
    },
    NODE_B2_ESCAPE: {
      id: "NODE_B2_ESCAPE",
      title: "Nhánh B • Đập Heo Đất Phá Bùa",
      clipPath: "clips/CLIP_B2_SMASH.mp4",
      keyPath: "keyframes/KEY_B2_SMASH.jpg",
      danger: "45%",
      dangerNum: 45,
      timerSeconds: 0,
      subtitle: "XOẢNG! Bạn đập nát con heo đất sứ xuống bàn đá! Lửa nguyền màu tím phụt lên làm bùa chú phản phệ khiến gã Hà Mã đánh rơi cờ-lê ôm đầu gào thét trong gương!",
      imgPrompt: "First-person POV smashing the pink ceramic piggy bank onto the black marble counter in front of the mirror as purple curse smoke erupts and the hippo barber clutches his head in agony, 9:16.",
      motionPrompt: "First-person POV slamming the pink piggy bank onto the marble counter, shattering it into shards and coins with purple smoke erupting while the hippo barber in the mirror clutches his head. Audio: loud ceramic piggy bank shattering on stone floor, scattered porcelain shards clattering, rapid running footsteps on wet pavement. Strictly NO background music, NO musical score, NO soundtrack.",
      ending: {
        code: "END_NORMAL",
        rank: "RANK A • PHÁ BÙA THÀNH CÔNG",
        title: "😐 NORMAL ENDING: PHÁ VỠ LỜI NGUYỀN HÀ MÃ",
        desc: "Nhờ nhớ Quy tắc số 3 (Đập vỡ vật làm bằng sứ), bạn đã làm bùa chú phản phệ ngược lại Quý ông Hà Mã và giữ được cái đầu của mình!"
      }
    },
    END_BAD: {
      id: "END_BAD",
      title: "💀 BAD ENDING • VÒNG LẶP THẾ THÂN",
      clipPath: "clips/CLIP_B2_HIPPO_CURSE.mp4",
      keyPath: "keyframes/KEY_B2_HIPPO_CURSE.jpg",
      danger: "999%",
      dangerNum: 100,
      timerSeconds: 0,
      subtitle: "CỐP! Khói tím trùm kín mặt gương. Khi khói tan, ĐẦU VÀ HAI TAY CỦA BẠN đã biến thành Hà Mã mặc vest đỏ đô cầm heo đất TIPS! Còn gã chủ cũ hóa lại thành người mặc măng-tô đen cười lạnh bước ra cửa...",
      imgPrompt: "First-person POV looking into a barbershop mirror revealing the viewer now has a giant hippo head and grey hippo hands in a burgundy suit holding the TIPS piggy bank, while a pale human man behind smirks and walks out, 9:16.",
      motionPrompt: "First-person POV facing mirror as purple smoke transforms the seated customer into the hippo-headed barber while the pale human former-barber smirks and walks out the door. Audio: dull metallic thud, deep monstrous hippo breathing, ceramic piggy bank placed on wooden table, distant door creak. Strictly NO background music, NO musical score, NO soundtrack.",
      ending: {
        code: "END_BAD",
        rank: "RANK F • BỊ ĐOẠT XÁC",
        title: "💀 BAD ENDING: BỊ BIẾN THÀNH ÔNG CHỦ HÀ MÃ MỚI",
        desc: "Bạn đã sập bẫy ngoại hình lịch lãm! Kẻ nào ôm con heo đất sẽ phải mang chiếc đầu Hà Mã và đứng canh tiệm thay cho hắn mãi mãi."
      }
    }
  }
};
