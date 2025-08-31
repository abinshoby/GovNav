import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, Check, Clock, Bell, Baby, Briefcase, Heart, Home, TrendingUp, Brain, Shield, Eye, Users, Lock, ExternalLink, Languages } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import RealTimeVoiceAgent from './RealTimeVoiceAgent';

// Language support system (matching Gov Services AI)
type SupportedLanguage = 'en' | 'zh' | 'ar' | 'es' | 'vi' | 'it' | 'el' | 'hi' | 'ko' | 'th' | 'kau';

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voice?: string;
  rtl?: boolean;
}

const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', voice: 'en-AU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', voice: 'zh-CN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', voice: 'ar-SA', rtl: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', voice: 'es-ES' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', voice: 'vi-VN' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', voice: 'it-IT' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', voice: 'el-GR' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voice: 'hi-IN' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', voice: 'ko-KR' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', voice: 'th-TH' },
  { code: 'kau', name: 'Kaurna', nativeName: 'Kaurna', voice: 'en-AU' },
];

// Translation system
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    placeholder: "Type your question...",
    sendMessage: "Send",
    startListening: "Start voice input",
    stopListening: "Stop voice input",
    toggleSpeech: "Toggle speech output",
    aiAgentTitle: "Australian Government Services Assistant",
    aiResponse: "I matched the 'Job loss' life event. Here are services you may be eligible for.",
    checkEligibility: "Check Eligibility",
    compareServices: "Compare Services",
    setReminder: "Set Reminder",
    progressChecklist: "Progress Checklist",
    lifeEventMatched: "Life event matched",
    servicesRetrieved: "Services retrieved from Data.gov.au",
    checkingEligibility: "Checking eligibility",
    reminderCreated: "Reminder created",
    navigateByLifeEvents: "Navigate by Life Events",
    useLifeEvent: "Use this life event",
    cantFindWhat: "Can't find what you're looking for?",
    aiCanHelp: "Our AI Assistant can help you discover services based on your specific situation and needs.",
    tryAiInstead: "Try AI Assistant Instead",
    dataSources: "Data sources: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI aligned to Australian AI Technical Standard",
    realTimeMode: "Real-Time Voice",
    exitRealTime: "Exit Real-Time",
    stopAndListen: "Stop & Listen",
    realTimeActive: "Real-Time Mode Active",
    realTimeDescription: "Speak naturally - the AI will respond automatically. Click 'Stop & Listen' to interrupt responses.",
    realTimeConversationActive: "Real-time voice conversation active",
    listening: "Listening...",
    speaking: "Speaking...",
    processing: "Processing your request...",
    responding: "Responding...",
    ready: "Ready"
  },
  zh: {
    placeholder: "输入您的问题...",
    sendMessage: "发送",
    startListening: "开始语音输入",
    stopListening: "停止语音输入",
    toggleSpeech: "切换语音输出",
    aiAgentTitle: "澳大利亚政府服务助手",
    aiResponse: "我匹配了'失业'生活事件。以下是您可能符合条件的服务。",
    checkEligibility: "检查资格",
    compareServices: "比较服务",
    setReminder: "设置提醒",
    progressChecklist: "进度清单",
    lifeEventMatched: "生活事件匹配",
    servicesRetrieved: "从Data.gov.au检索的服务",
    checkingEligibility: "检查资格",
    reminderCreated: "提醒已创建",
    navigateByLifeEvents: "按生活事件导航",
    useLifeEvent: "使用此生活事件",
    cantFindWhat: "找不到您要找的内容？",
    aiCanHelp: "我们的AI助手可以根据您的具体情况和需求帮助您发现服务。",
    tryAiInstead: "改为尝试AI助手",
    dataSources: "数据来源：Data.gov.au，Transparency.gov.au",
    aiAligned: "AI遵循澳大利亚AI技术标准",
    realTimeMode: "实时语音",
    exitRealTime: "退出实时模式",
    stopAndListen: "停止并听取",
    realTimeActive: "实时模式已激活",
    realTimeDescription: "自然说话 - AI将自动响应。点击'停止并听取'以中断响应。",
    realTimeConversationActive: "实时语音对话已激活",
    listening: "正在聆听...",
    speaking: "正在说话...",
    processing: "正在处理您的请求...",
    responding: "正在响应...",
    ready: "准备就绪"
  },
  ar: {
    placeholder: "اكتب سؤالك...",
    sendMessage: "إرسال",
    startListening: "بدء الإدخال الصوتي",
    stopListening: "إيقاف الإدخال الصوتي",
    toggleSpeech: "تبديل الإخراج الصوتي",
    aiAgentTitle: "مساعد الخدمات الحكومية الأسترالية",
    aiResponse: "لقد طابقت حدث 'فقدان الوظيفة' في الحياة. إليك الخدمات التي قد تكون مؤهلاً لها.",
    checkEligibility: "فحص الأهلية",
    compareServices: "مقارنة الخدمات",
    setReminder: "تعيين تذكير",
    progressChecklist: "قائمة التقدم",
    lifeEventMatched: "تم مطابقة حدث الحياة",
    servicesRetrieved: "الخدمات المسترجعة من Data.gov.au",
    checkingEligibility: "فحص الأهلية",
    reminderCreated: "تم إنشاء التذكير",
    navigateByLifeEvents: "التنقل حسب أحداث الحياة",
    useLifeEvent: "استخدم هذا الحدث الحياتي",
    cantFindWhat: "لا يمكنك العثور على ما تبحث عنه؟",
    aiCanHelp: "يمكن لمساعد الذكاء الاصطناعي الخاص بنا مساعدتك في اكتشاف الخدمات بناءً على وضعك واحتياجاتك المحددة.",
    tryAiInstead: "جرب مساعد الذكاء الاصطناعي بدلاً من ذلك",
    dataSources: "مصادر البيانات: Data.gov.au، Transparency.gov.au",
    aiAligned: "الذكاء الاصطناعي متوافق مع المعيار التقني الأسترالي للذكاء الاصطناعي",
    realTimeMode: "الصوت في الوقت الفعلي",
    exitRealTime: "الخروج من الوقت الفعلي",
    stopAndListen: "توقف واستمع",
    realTimeActive: "نشط وضع الوقت الفعلي",
    realTimeDescription: "تحدث بشكل طبيعي - سيرد الذكاء الاصطناعي تلقائياً. اضغط على 'توقف واستمع' لمقاطعة الردود.",
    realTimeConversationActive: "محادثة صوتية في الوقت الفعلي نشطة",
    listening: "يستمع...",
    speaking: "يتحدث...",
    processing: "معالجة طلبك...",
    responding: "يرد...",
    ready: "جاهز"
  },
  es: {
    placeholder: "Escribe tu pregunta...",
    sendMessage: "Enviar",
    startListening: "Iniciar entrada de voz",
    stopListening: "Detener entrada de voz",
    toggleSpeech: "Alternar salida de voz",
    aiAgentTitle: "Asistente de Servicios del Gobierno Australiano",
    aiResponse: "Coincidí con el evento de vida 'Pérdida de trabajo'. Aquí están los servicios para los que puedes ser elegible.",
    checkEligibility: "Verificar Elegibilidad",
    compareServices: "Comparar Servicios",
    setReminder: "Establecer Recordatorio",
    progressChecklist: "Lista de Progreso",
    lifeEventMatched: "Evento de vida coincidente",
    servicesRetrieved: "Servicios recuperados de Data.gov.au",
    checkingEligibility: "Verificando elegibilidad",
    reminderCreated: "Recordatorio creado",
    navigateByLifeEvents: "Navegar por Eventos de Vida",
    useLifeEvent: "Usar este evento de vida",
    cantFindWhat: "¿No puedes encontrar lo que buscas?",
    aiCanHelp: "Nuestro Asistente de IA puede ayudarte a descubrir servicios basados en tu situación y necesidades específicas.",
    tryAiInstead: "Prueba el Asistente de IA en su lugar",
    dataSources: "Fuentes de datos: Data.gov.au, Transparency.gov.au",
    aiAligned: "IA alineada con el Estándar Técnico de IA Australiano",
    realTimeMode: "Voz en Tiempo Real",
    exitRealTime: "Salir del Tiempo Real",
    stopAndListen: "Parar y Escuchar",
    realTimeActive: "Modo Tiempo Real Activo",
    realTimeDescription: "Habla naturalmente - la IA responderá automáticamente. Haz clic en 'Parar y Escuchar' para interrumpir las respuestas.",
    realTimeConversationActive: "Conversación de voz en tiempo real activa",
    listening: "Escuchando...",
    speaking: "Hablando...",
    processing: "Procesando tu solicitud...",
    responding: "Respondiendo...",
    ready: "Listo"
  },
  vi: {
    placeholder: "Nhập câu hỏi của bạn...",
    sendMessage: "Gửi",
    startListening: "Bắt đầu nhập giọng nói",
    stopListening: "Dừng nhập giọng nói",
    toggleSpeech: "Chuyển đổi đầu ra giọng nói",
    aiAgentTitle: "Trợ lý Dịch vụ Chính phủ Úc",
    aiResponse: "Tôi đã khớp với sự kiện cuộc sống 'Mất việc làm'. Đây là các dịch vụ bạn có thể đủ điều kiện.",
    checkEligibility: "Kiểm tra Điều kiện",
    compareServices: "So sánh Dịch vụ",
    setReminder: "Đặt Nhắc nhở",
    progressChecklist: "Danh sách Tiến độ",
    lifeEventMatched: "Sự kiện cuộc sống khớp",
    servicesRetrieved: "Dịch vụ được truy xuất từ Data.gov.au",
    checkingEligibility: "Kiểm tra tính đủ điều kiện",
    reminderCreated: "Đã tạo lời nhắc",
    navigateByLifeEvents: "Điều hướng theo Sự kiện Cuộc sống",
    useLifeEvent: "Sử dụng sự kiện cuộc sống này",
    cantFindWhat: "Không thể tìm thấy những gì bạn đang tìm kiếm?",
    aiCanHelp: "Trợ lý AI của chúng tôi có thể giúp bạn khám phá các dịch vụ dựa trên tình huống và nhu cầu cụ thể của bạn.",
    tryAiInstead: "Thử Trợ lý AI thay thế",
    dataSources: "Nguồn dữ liệu: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI phù hợp với Tiêu chuẩn Kỹ thuật AI Úc",
    realTimeMode: "Giọng nói Thời gian Thực",
    exitRealTime: "Thoát Thời gian Thực",
    stopAndListen: "Dừng và Nghe",
    realTimeActive: "Chế độ Thời gian Thực Hoạt động",
    realTimeDescription: "Nói một cách tự nhiên - AI sẽ phản hồi tự động. Nhấp vào 'Dừng và Nghe' để ngắt phản hồi.",
    realTimeConversationActive: "Cuộc trò chuyện bằng giọng nói thời gian thực đang hoạt động",
    listening: "Đang nghe...",
    speaking: "Đang nói...",
    processing: "Đang xử lý yêu cầu của bạn...",
    responding: "Đang phản hồi...",
    ready: "Sẵn sàng"
  },
  it: {
    placeholder: "Digita la tua domanda...",
    sendMessage: "Invia",
    startListening: "Inizia input vocale",
    stopListening: "Ferma input vocale",
    toggleSpeech: "Attiva/disattiva output vocale",
    aiAgentTitle: "Assistente Servizi Governativi Australiani",
    aiResponse: "Ho abbinato l'evento di vita 'Perdita del lavoro'. Ecco i servizi per cui potresti essere idoneo.",
    checkEligibility: "Controlla Idoneità",
    compareServices: "Confronta Servizi",
    setReminder: "Imposta Promemoria",
    progressChecklist: "Lista di Controllo del Progresso",
    lifeEventMatched: "Evento di vita abbinato",
    servicesRetrieved: "Servizi recuperati da Data.gov.au",
    checkingEligibility: "Controllo dell'idoneità",
    reminderCreated: "Promemoria creato",
    navigateByLifeEvents: "Naviga per Eventi di Vita",
    useLifeEvent: "Usa questo evento di vita",
    cantFindWhat: "Non riesci a trovare quello che cerchi?",
    aiCanHelp: "Il nostro Assistente AI può aiutarti a scoprire servizi basati sulla tua situazione e necessità specifiche.",
    tryAiInstead: "Prova l'Assistente AI invece",
    dataSources: "Fonti dati: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI allineata allo Standard Tecnico AI Australiano",
    realTimeMode: "Voce in Tempo Reale",
    exitRealTime: "Esci da Tempo Reale",
    stopAndListen: "Ferma e Ascolta",
    realTimeActive: "Modalità Tempo Reale Attiva",
    realTimeDescription: "Parla naturalmente - l'AI risponderà automaticamente. Clicca su 'Ferma e Ascolta' per interrompere le risposte.",
    realTimeConversationActive: "Conversazione vocale in tempo reale attiva",
    listening: "In ascolto...",
    speaking: "Parlando...",
    processing: "Elaborando la tua richiesta...",
    responding: "Rispondendo...",
    ready: "Pronto"
  },
  el: {
    placeholder: "Πληκτρολογήστε την ερώτησή σας...",
    sendMessage: "Αποστολή",
    startListening: "Έναρξη φωνητικής εισόδου",
    stopListening: "Διακοπή φωνητικής εισόδου",
    toggleSpeech: "Εναλλαγή φωνητικής εξόδου",
    aiAgentTitle: "Βοηθός Υπηρεσιών Αυστραλιανής Κυβέρνησης",
    aiResponse: "Ταίριαξα το γεγονός ζωής 'Απώλεια εργασίας'. Εδώ είναι οι υπηρεσίες για τις οποίες μπορείτε να είστε επιλέξιμοι.",
    checkEligibility: "Έλεγχος Καταλληλότητας",
    compareServices: "Σύγκριση Υπηρεσιών",
    setReminder: "Ορισμός Υπενθύμισης",
    progressChecklist: "Λίστα Ελέγχου Προόδου",
    lifeEventMatched: "Γεγονός ζωής ταιριάζει",
    servicesRetrieved: "Υπηρεσίες που ανακτήθηκαν από το Data.gov.au",
    checkingEligibility: "Έλεγχος καταλληλότητας",
    reminderCreated: "Υπενθύμιση δημιουργήθηκε",
    navigateByLifeEvents: "Πλοήγηση ανά Γεγονότα Ζωής",
    useLifeEvent: "Χρησιμοποιήστε αυτό το γεγονός ζωής",
    cantFindWhat: "Δεν μπορείτε να βρείτε αυτό που ψάχνετε;",
    aiCanHelp: "Ο Βοηθός AI μας μπορεί να σας βοηθήσει να ανακαλύψετε υπηρεσίες βασισμένες στη συγκεκριμένη κατάσταση και ανάγκες σας.",
    tryAiInstead: "Δοκιμάστε τον Βοηθό AI αντί αυτού",
    dataSources: "Πηγές δεδομένων: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI ευθυγραμμισμένη με το Αυστραλιανό Τεχνικό Πρότυπο AI"
  },
  hi: {
    placeholder: "अपना प्रश्न टाइप करें...",
    sendMessage: "भेजें",
    startListening: "ध्वनि इनपुट शुरू करें",
    stopListening: "ध्वनि इनपुट रोकें",
    toggleSpeech: "ध्वनि आउटपुट टॉगल करें",
    aiAgentTitle: "ऑस्ट्रेलियाई सरकारी सेवा सहायक",
    aiResponse: "मैंने 'नौकरी खोना' जीवन घटना से मैच किया। यहाँ सेवाएं हैं जिनके लिए आप पात्र हो सकते हैं।",
    checkEligibility: "पात्रता जांचें",
    compareServices: "सेवाओं की तुलना करें",
    setReminder: "रिमाइंडर सेट करें",
    progressChecklist: "प्रगति चेकलिस्ट",
    lifeEventMatched: "जीवन घटना मैच हुई",
    servicesRetrieved: "Data.gov.au से सेवाएं प्राप्त की गईं",
    checkingEligibility: "पात्रता की जांच कर रहे हैं",
    reminderCreated: "रिमाइंडर बनाया गया",
    navigateByLifeEvents: "जीवन घटनाओं के द्वारा नेविगेट करें",
    useLifeEvent: "इस जीवन घटना का उपयोग करें",
    cantFindWhat: "जो आप खोज रहे हैं वह नहीं मिल रहा?",
    aiCanHelp: "हमारा AI सहायक आपकी विशिष्ट स्थिति और आवश्यकताओं के आधार पर सेवाओं की खोज में आपकी मदद कर सकता है।",
    tryAiInstead: "बजाय AI सहायक आज़माएं",
    dataSources: "डेटा स्रोत: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI ऑस्ट्रेलियाई AI तकनीकी मानक के साथ संरेखित"
  },
  ko: {
    placeholder: "질문을 입력하세요...",
    sendMessage: "보내기",
    startListening: "음성 입력 시작",
    stopListening: "음성 입력 중지",
    toggleSpeech: "음성 출력 토글",
    aiAgentTitle: "호주 정부 서비스 어시스턴트",
    aiResponse: "'직업 상실' 생활 이벤트와 매칭했습니다. 자격을 갖출 수 있는 서비스들입니다.",
    checkEligibility: "자격 확인",
    compareServices: "서비스 비교",
    setReminder: "알림 설정",
    progressChecklist: "진행 체크리스트",
    lifeEventMatched: "생활 이벤트 매칭됨",
    servicesRetrieved: "Data.gov.au에서 서비스 검색됨",
    checkingEligibility: "자격 확인 중",
    reminderCreated: "알림 생성됨",
    navigateByLifeEvents: "생활 이벤트별 탐색",
    useLifeEvent: "이 생활 이벤트 사용",
    cantFindWhat: "찾고 있는 것을 찾을 수 없나요?",
    aiCanHelp: "우리 AI 어시스턴트가 귀하의 특정 상황과 필요에 따라 서비스를 발견하는 데 도움을 줄 수 있습니다.",
    tryAiInstead: "대신 AI 어시스턴트 시도",
    dataSources: "데이터 소스: Data.gov.au, Transparency.gov.au",
    aiAligned: "호주 AI 기술 표준에 맞춘 AI"
  },
  th: {
    placeholder: "พิมพ์คำถามของคุณ...",
    sendMessage: "ส่ง",
    startListening: "เริ่มการป้อนเสียง",
    stopListening: "หยุดการป้อนเสียง",
    toggleSpeech: "สลับเอาต์พุตเสียง",
    aiAgentTitle: "ผู้ช่วยบริการรัฐบาลออสเตรเลีย",
    aiResponse: "ฉันจับคู่เหตุการณ์ชีวิต 'การตกงาน' ได้ นี่คือบริการที่คุณอาจมีสิทธิ์ได้รับ",
    checkEligibility: "ตรวจสอบคุณสมบัติ",
    compareServices: "เปรียบเทียบบริการ",
    setReminder: "ตั้งการเตือน",
    progressChecklist: "รายการตรวจสอบความคืบหน้า",
    lifeEventMatched: "เหตุการณ์ชีวิตตรงกัน",
    servicesRetrieved: "บริการที่ดึงมาจาก Data.gov.au",
    checkingEligibility: "กำลังตรวจสอบคุณสมบัติ",
    reminderCreated: "สร้างการเตือนแล้ว",
    navigateByLifeEvents: "นำทางตามเหตุการณ์ชีวิต",
    useLifeEvent: "ใช้เหตุการณ์ชีวิตนี้",
    cantFindWhat: "หาสิ่งที่คุณต้องการไม่เจอหรือ?",
    aiCanHelp: "ผู้ช่วย AI ของเราสามารถช่วยคุณค้นพบบริการตามสถานการณ์และความต้องการเฉพาะของคุณ",
    tryAiInstead: "ลองใช้ผู้ช่วย AI แทน",
    dataSources: "แหล่งข้อมูล: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI สอดคล้องกับมาตรฐานเทคนิค AI ของออสเตรเลีย"
  },
  kau: {
    placeholder: "Palti ninna ngapa-na...",
    sendMessage: "Yuki",
    startListening: "Kaurna-rla palti kura",
    stopListening: "Kaurna-rla palti yartappi",
    toggleSpeech: "Kaurna-rla palti wardli",
    aiAgentTitle: "Australian Government Services Kumanu",
    aiResponse: "Ngai 'work-na pardu' warni event parri-ani. Ninti services nindi yurramarna ngarrindji kana.",
    checkEligibility: "Yurramarna ngarrindji",
    compareServices: "Services parri-ani",
    setReminder: "Ngarrindje tika",
    progressChecklist: "Yarta checklist",
    lifeEventMatched: "Warni event parri-ani",
    servicesRetrieved: "Services Data.gov.au-rla tandanya",
    checkingEligibility: "Yurramarna ngarrindji",
    reminderCreated: "Ngarrindje tika",
    navigateByLifeEvents: "Warni events yurru navigate",
    useLifeEvent: "Warni event-na yurru",
    cantFindWhat: "Ninti yurru kaurna tandanya?",
    aiCanHelp: "Ngarai AI kumanu nindi ngarrindjeri parri-ani kana services ninna situation-rla.",
    tryAiInstead: "AI kumanu yurru warriapendi",
    dataSources: "Data tandanya: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI Australian Government Technical Standard yurru-rla"
  }
};

export default function AIAgentScreen() {
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Array<{id: string, type: 'user' | 'agent', content: string, timestamp: Date}>>([]);
  
  // Voice assistance state
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);
  const [voiceActivityDetected, setVoiceActivityDetected] = useState(false);
  const [interruptRequested, setInterruptRequested] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const voiceDetectionRef = useRef<boolean>(false);

  const progressItems = [
    {
      status: 'completed',
      textKey: 'lifeEventMatched',
      icon: Check
    },
    {
      status: 'completed',
      textKey: 'servicesRetrieved',
      icon: Check
    },
    {
      status: 'in-progress',
      textKey: 'checkingEligibility',
      icon: Clock
    },
    {
      status: 'pending',
      textKey: 'reminderCreated',
      icon: Bell
    }
  ];

  const serviceCards = [
    {
      title: 'JobSeeker Payment',
      badges: [
        { text: 'Federal', type: 'federal' },
        { text: 'Services Australia', type: 'agency' }
      ],
      summary: 'Income support if you\'re 22+ and unemployed.',
      funding: '$9.2B (Transparency.gov.au 2024)',
      buttons: [
        { text: 'Apply Now', variant: 'default' },
        { text: 'Check Eligibility', variant: 'outline' }
      ],
      source: 'Data.gov.au',
      updated: 'Aug 2025'
    },
    {
      title: 'Disaster Recovery Payment',
      badges: [
        { text: 'Federal', type: 'federal' },
        { text: 'Services Australia', type: 'agency' }
      ],
      summary: 'One-off payment for people affected by declared disasters.',
      funding: '$2.1B (Transparency.gov.au 2024)',
      buttons: [
        { text: 'Learn More', variant: 'outline' },
        { text: 'Set Reminder', variant: 'outline' }
      ],
      source: 'Data.gov.au',
      updated: 'Aug 2025'
    }
  ];

  const lifeEvents = [
    {
      id: 'birth-of-child',
      title: 'Birth of a child',
      icon: Baby
    },
    {
      id: 'job-loss',
      title: 'Job loss',
      icon: Briefcase
    },
    {
      id: 'becoming-carer',
      title: 'Becoming a carer',
      icon: Heart
    },
    {
      id: 'disaster-recovery',
      title: 'Disaster recovery',
      icon: Home
    },
    {
      id: 'starting-business',
      title: 'Starting a business',
      icon: TrendingUp
    },
    {
      id: 'mental-health',
      title: 'Mental health',
      icon: Brain
    }
  ];

  const trustItems = [
    { icon: Shield, label: 'Privacy' },
    { icon: Eye, label: 'Transparency' },
    { icon: Users, label: 'Human-in-the-loop' },
    { icon: Lock, label: 'Accessibility' }
  ];

  // Translation helper function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Get current language config for text direction
  const getCurrentLanguageConfig = (): LanguageConfig => {
    return supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  };

  // Initialize speech services and audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }

      // Initialize Audio Context for voice activity detection
      const initializeAudioContext = async () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
          
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyserRef.current = analyser;
        } catch (error) {
          console.log('AudioContext initialization failed:', error);
        }
      };

      initializeAudioContext();

      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = supportedLanguages.find(l => l.code === language)?.voice || 'en-AU';
        recognitionInstance.maxAlternatives = 1;
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          setIsProcessingVoice(false);
        };
        
        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript && isRealTimeMode) {
            // Process real-time voice input
            processVoiceInput(finalTranscript.trim());
          } else if (!isRealTimeMode) {
            // Traditional mode - set message for manual send
            setMessage(finalTranscript || interimTranscript);
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
          if (isRealTimeMode && event.error !== 'no-speech') {
            // Restart recognition in real-time mode unless it's a critical error
            setTimeout(() => {
              if (isRealTimeMode && recognitionInstance.state !== 'listening') {
                recognitionInstance.start();
              }
            }, 1000);
          } else {
            setIsListening(false);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
          if (isRealTimeMode && !interruptRequested) {
            // Automatically restart in real-time mode
            setTimeout(() => {
              if (isRealTimeMode && recognitionInstance.state !== 'listening') {
                recognitionInstance.start();
              }
            }, 100);
          }
        };
        
        setRecognition(recognitionInstance);
      }
    }

    return () => {
      // Cleanup
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [language, isRealTimeMode]);

  // Voice activity detection
  const startVoiceActivityDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (audioContextRef.current && analyserRef.current) {
        const microphone = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current = microphone;
        microphone.connect(analyserRef.current);
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const checkVoiceActivity = () => {
          if (!analyserRef.current || !isRealTimeMode) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setVoiceVolume(volume);
          
          const isVoiceActive = volume > 15; // Threshold for voice activity
          setVoiceActivityDetected(isVoiceActive);
          voiceDetectionRef.current = isVoiceActive;
          
          if (isRealTimeMode) {
            requestAnimationFrame(checkVoiceActivity);
          }
        };
        
        checkVoiceActivity();
      }
    } catch (error) {
      console.log('Microphone access denied:', error);
    }
  };

  // Enhanced text-to-speech with interrupt capability
  const speak = (text: string, onComplete?: () => void) => {
    if (speechSynthesis && speechEnabled) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const langConfig = supportedLanguages.find(l => l.code === language);
      if (langConfig?.voice) {
        utterance.lang = langConfig.voice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        currentUtteranceRef.current = utterance;
      };
      
      utterance.onend = () => {
        currentUtteranceRef.current = null;
        if (onComplete) onComplete();
      };
      
      utterance.onerror = () => {
        currentUtteranceRef.current = null;
        if (onComplete) onComplete();
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  // Streaming text-to-speech for real-time responses
  const speakStreaming = (text: string) => {
    if (!speechEnabled) return;
    
    const words = text.split(' ');
    let currentIndex = 0;
    
    const speakNextChunk = () => {
      if (currentIndex >= words.length || interruptRequested) return;
      
      const chunk = words.slice(currentIndex, currentIndex + 10).join(' ');
      currentIndex += 10;
      
      speak(chunk, () => {
        if (currentIndex < words.length && !interruptRequested) {
          setTimeout(speakNextChunk, 100);
        }
      });
    };
    
    speakNextChunk();
  };

  // Process voice input in real-time mode
  const processVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsProcessingVoice(true);
    
    // Interrupt any ongoing speech
    if (currentUtteranceRef.current) {
      setInterruptRequested(true);
      speechSynthesis?.cancel();
    }
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: transcript,
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, userMessage]);
    
    // Simulate real-time AI processing with streaming response
    const aiResponseId = (Date.now() + 1).toString();
    const responses = [
      t('aiResponse'),
      "I understand you're looking for government services. Let me help you find the right support.",
      "Based on what you've told me, I can connect you with several relevant services from Data.gov.au.",
      "I've found some services that match your needs. Would you like me to check your eligibility?",
      "I can also set up reminders for important deadlines or help you compare different options."
    ];
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Start streaming response
    let currentResponse = '';
    setStreamingResponse('');
    
    const words = selectedResponse.split(' ');
    let wordIndex = 0;
    
    const streamNextWord = () => {
      if (wordIndex < words.length && !interruptRequested) {
        currentResponse += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        setStreamingResponse(currentResponse);
        wordIndex++;
        
        streamingTimeoutRef.current = setTimeout(streamNextWord, 150);
      } else {
        // Complete the response
        const aiResponse = {
          id: aiResponseId,
          type: 'agent' as const,
          content: currentResponse,
          timestamp: new Date()
        };
        
        setConversations(prev => [...prev, aiResponse]);
        setStreamingResponse('');
        setIsProcessingVoice(false);
        setInterruptRequested(false);
        
        // Speak the complete response
        speak(currentResponse);
      }
    };
    
    // Start streaming after a brief delay
    setTimeout(streamNextWord, 500);
  };

  // Voice input controls
  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechSynthesis && speechEnabled) {
      speechSynthesis.cancel();
    }
  };

  // Real-time conversation mode toggle
  const toggleRealTimeMode = async () => {
    const newMode = !isRealTimeMode;
    setIsRealTimeMode(newMode);
    setConversationActive(newMode);
    
    if (newMode) {
      // Start real-time mode
      await startVoiceActivityDetection();
      if (recognition && !isListening) {
        recognition.start();
      }
    } else {
      // Stop real-time mode
      setInterruptRequested(true);
      if (recognition && isListening) {
        recognition.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      setStreamingResponse('');
      setIsProcessingVoice(false);
    }
  };

  // Interrupt current speech/processing
  const interruptConversation = () => {
    setInterruptRequested(true);
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    if (streamingTimeoutRef.current) {
      clearTimeout(streamingTimeoutRef.current);
    }
    setStreamingResponse('');
    setIsProcessingVoice(false);
    
    // Reset interrupt flag after a delay
    setTimeout(() => setInterruptRequested(false), 500);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (isRealTimeMode) {
      // In real-time mode, process immediately
      processVoiceInput(message);
      setMessage('');
    } else {
      // Traditional mode
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: message,
        timestamp: new Date()
      };
      
      setConversations(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
      
      // Simulate AI response with service results
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'agent' as const,
          content: t('aiResponse'),
          timestamp: new Date()
        };
        
        setConversations(prev => [...prev, aiResponse]);
        setIsTyping(false);
        
        // Speak the response if speech is enabled
        speak(t('aiResponse'));
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when conversations update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isTyping, streamingResponse]);

  // Cleanup effects when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, []);

  // Handle real-time mode state changes
  useEffect(() => {
    if (!isRealTimeMode) {
      // Cleanup when exiting real-time mode
      setInterruptRequested(true);
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      setStreamingResponse('');
      setIsProcessingVoice(false);
      setVoiceActivityDetected(false);
      setConversationActive(false);
    }
  }, [isRealTimeMode]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-heading text-gray-900 mb-4">
          Using AI to Help Australians Navigate Government Services
        </h1>
        <p className="text-subheading text-gray-600 mb-8 max-w-2xl mx-auto">
          Find the right support during life events—faster, simpler, clearer.
          {isRealTimeMode && (
            <span className="block mt-2 text-accent-yellow font-medium">
              🎤 Real-time voice mode active - speak naturally for instant assistance
            </span>
          )}
        </p>
      </div>

      {/* Real-time Mode Banner */}
      {isRealTimeMode && (
        <div className="mb-6 bg-gradient-to-r from-accent-yellow/20 to-nav-teal/20 border-l-4 border-accent-yellow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent-yellow rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-medium text-gov-navy">Real-Time Voice Agent Active</h3>
                <p className="text-sm text-gray-600">
                  Speak naturally - the AI will respond automatically. Click "Stop & Listen" to interrupt responses.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRealTimeMode}
              className="border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white"
            >
              Exit Real-Time
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Left Column - AI Assistant Chat */}
        <Card className={`${isRealTimeMode ? 'h-[600px]' : 'h-[500px]'} flex flex-col ${isRealTimeMode ? 'ring-2 ring-accent-yellow/50' : ''}`}>
          <CardHeader className="border-b bg-gradient-to-r from-nav-teal/5 to-gov-navy/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isRealTimeMode ? 'bg-accent-yellow animate-pulse' : 'bg-nav-teal'
                }`}>
                  <Bot className={`w-5 h-5 ${isRealTimeMode ? 'text-gov-navy' : 'text-white'}`} />
                </div>
                <div>
                  <span>{t('aiAgentTitle')}</span>
                  {isRealTimeMode && (
                    <div className="text-xs text-nav-teal font-medium">Real-Time Mode Active</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRealTimeMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleRealTimeMode}
                  className={`text-xs px-3 ${isRealTimeMode ? 'bg-accent-yellow text-gov-navy hover:bg-accent-yellow/90' : ''}`}
                >
                  {isRealTimeMode ? 'Exit Real-Time' : 'Real-Time Voice'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSpeech}
                  title={t('toggleSpeech')}
                  className={`h-8 w-8 p-0 ${speechEnabled ? 'text-nav-teal' : 'text-gray-400'}`}
                >
                  {speechEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
                  <SelectTrigger className="w-16 h-8">
                    <Languages className="h-3 w-3" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Enhanced Voice Status Bar */}
          {(isListening || speechSynthesis?.speaking || isProcessingVoice || streamingResponse) && (
            <div className="bg-gradient-to-r from-nav-teal/10 to-gov-navy/10 px-4 py-2 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  {isListening ? (
                    <>
                      <Mic className="w-4 h-4 text-nav-teal animate-pulse" />
                      <span className="text-nav-teal font-medium">
                        Listening in {getCurrentLanguageConfig().nativeName}
                        {isRealTimeMode && ' (Real-time)'}...
                      </span>
                      {isRealTimeMode && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1 h-3 bg-nav-teal rounded opacity-50"></div>
                          <div 
                            className="w-1 bg-nav-teal rounded transition-all duration-100" 
                            style={{height: `${Math.min(voiceVolume / 10, 3)}rem`}}
                          ></div>
                          <div className="w-1 h-3 bg-nav-teal rounded opacity-50"></div>
                        </div>
                      )}
                    </>
                  ) : speechSynthesis?.speaking ? (
                    <>
                      <Volume2 className="w-4 h-4 text-gov-navy animate-pulse" />
                      <span className="text-gov-navy font-medium">
                        Speaking in {getCurrentLanguageConfig().nativeName}...
                      </span>
                    </>
                  ) : isProcessingVoice ? (
                    <>
                      <Brain className="w-4 h-4 text-accent-yellow animate-spin" />
                      <span className="text-accent-yellow font-medium">Processing your request...</span>
                    </>
                  ) : streamingResponse ? (
                    <>
                      <Bot className="w-4 h-4 text-nav-teal animate-pulse" />
                      <span className="text-nav-teal font-medium">Responding...</span>
                    </>
                  ) : null}
                </div>
                
                {/* Interrupt button for real-time mode */}
                {isRealTimeMode && (speechSynthesis?.speaking || streamingResponse) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={interruptConversation}
                    className="text-xs h-6 px-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Stop & Listen
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {conversations.map((conv) => (
                <div key={conv.id} className={`flex ${conv.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${conv.type === 'user' ? 'text-right' : ''}`}>
                    <div 
                      className={`rounded-lg px-4 py-3 ${
                        conv.type === 'user' 
                          ? 'bg-gov-navy text-white' 
                          : 'bg-nav-teal text-white'
                      }`}
                      style={{direction: getCurrentLanguageConfig().rtl ? 'rtl' : 'ltr'}}
                    >
                      {conv.type === 'agent' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4" />
                          <span className="text-xs font-medium">AI Agent</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{conv.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conv.type === 'user' ? 'You' : 'AI Agent'} • {conv.timestamp.toLocaleTimeString(getCurrentLanguageConfig().code)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Response */}
              {streamingResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="bg-nav-teal text-white rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 animate-pulse" />
                        <span className="text-xs font-medium">AI Agent (Real-time)</span>
                      </div>
                      <p className="text-sm leading-relaxed">{streamingResponse}<span className="animate-pulse">|</span></p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">AI Agent • Streaming...</div>
                  </div>
                </div>
              )}

              {/* Traditional Typing Indicator */}
              {isTyping && !streamingResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <div className="bg-nav-teal text-white rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-medium">AI Agent</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Row */}
          <div className="border-t p-4" style={{direction: getCurrentLanguageConfig().rtl ? 'rtl' : 'ltr'}}>
            {isRealTimeMode ? (
              /* Real-time mode input */
              <div className="flex items-center justify-center space-x-4 py-2">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Real-time voice conversation active</div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${conversationActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-500">
                      {isListening ? 'Listening...' : speechSynthesis?.speaking ? 'Speaking...' : 'Ready'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRealTimeMode}
                  className="text-xs"
                >
                  Exit Real-time
                </Button>
              </div>
            ) : (
              /* Traditional input mode */
              <div className="flex space-x-2">
                <Input
                  placeholder={t('placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  dir={getCurrentLanguageConfig().rtl ? 'rtl' : 'ltr'}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? t('stopListening') : t('startListening')}
                  className={isListening ? 'bg-red-50 border-red-200 text-red-600' : ''}
                  disabled={isRealTimeMode}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={handleSendMessage} disabled={!message.trim()} title={t('sendMessage')}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column - Progress and Service Results */}
        <div className="space-y-6">
          {/* Progress Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-nav-teal" />
                <span>{t('progressChecklist')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-100' :
                        item.status === 'in-progress' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'in-progress' ? 'text-yellow-600 animate-pulse' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        item.status === 'completed' ? 'text-green-700 line-through' :
                        item.status === 'in-progress' ? 'text-yellow-700 font-medium' :
                        'text-gray-500'
                      }`}>
                        {t(item.textKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Service Results */}
          <Card>
            <CardHeader>
              <CardTitle>Found Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceCards.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-nav-teal/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{service.title}</h4>
                    <div className="flex space-x-1">
                      {service.badges.map((badge, badgeIndex) => (
                        <Badge 
                          key={badgeIndex} 
                          variant="outline" 
                          className={`text-xs ${
                            badge.type === 'federal' ? 'border-gov-navy text-gov-navy' : 'border-nav-teal text-nav-teal'
                          }`}
                        >
                          {badge.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.summary}</p>
                  <p className="text-xs text-gray-500 mb-3">{service.funding}</p>
                  <div className="flex space-x-2 mb-3">
                    {service.buttons.map((button, buttonIndex) => (
                      <Button 
                        key={buttonIndex} 
                        variant={button.variant as any} 
                        size="sm" 
                        className="text-xs"
                      >
                        {button.text}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Source: {service.source}</span>
                    <span>Updated: {service.updated}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Life Events Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>{t('navigateByLifeEvents')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {lifeEvents.map((event) => {
              const IconComponent = event.icon;
              return (
                <div 
                  key={event.id} 
                  className="flex flex-col items-center p-4 border rounded-lg hover:border-nav-teal/30 hover:bg-nav-teal/5 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-nav-teal/10 rounded-full flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-nav-teal" />
                  </div>
                  <span className="text-sm text-center font-medium text-gray-700 mb-3">{event.title}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => {
                      const eventMessage = `Help me with ${event.title.toLowerCase()}`;
                      
                      if (isRealTimeMode) {
                        // In real-time mode, process immediately
                        processVoiceInput(eventMessage);
                      } else {
                        // Traditional mode
                        setMessage(eventMessage);
                        setTimeout(() => {
                          if (eventMessage.trim()) {
                            const userMessage = {
                              id: Date.now().toString(),
                              type: 'user' as const,
                              content: eventMessage,
                              timestamp: new Date()
                            };
                            
                            setConversations(prev => [...prev, userMessage]);
                            setMessage('');
                            setIsTyping(true);
                            
                            setTimeout(() => {
                              const aiResponse = {
                                id: (Date.now() + 1).toString(),
                                type: 'agent' as const,
                                content: t('aiResponse'),
                                timestamp: new Date()
                              };
                              
                              setConversations(prev => [...prev, aiResponse]);
                              setIsTyping(false);
                              speak(t('aiResponse'));
                            }, 1500);
                          }
                        }, 100);
                      }
                    }}
                  >
                    {t('useLifeEvent')}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="mb-8 bg-gradient-to-r from-nav-teal/5 to-gov-navy/5">
        <CardContent className="p-8 text-center">
          <h3 className="text-subheading text-gray-900 mb-4">{t('cantFindWhat')}</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('aiCanHelp')}
          </p>
          <Button className="bg-nav-teal hover:bg-nav-teal/90">
            {t('tryAiInstead')}
          </Button>
        </CardContent>
      </Card>

      {/* Trust & Compliance Footer */}
      <div className="border-t pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gov-navy/10 rounded-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-gov-navy" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            );
          })}
        </div>
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>{t('dataSources')}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
          <p className="text-xs text-gray-500">{t('aiAligned')}</p>
        </div>
      </div>
    </div>
  );
}