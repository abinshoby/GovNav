import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Check,
  Clock,
  Bell,
  ExternalLink,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Circle,
  Info,
  ShieldCheck,
  Baby,
  Briefcase,
  Heart,
  Zap,
  Building,
  Brain,
  ThumbsUp,
  ThumbsDown,
  X,
  Languages,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import RealTimeVoiceAgent from "./RealTimeVoiceAgent";

interface ChatAssistantScreenProps {
  onBack: () => void;
}

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read";
  actions?: Array<{
    text: string;
    type: "primary" | "secondary";
    onClick?: () => void;
  }>;
}

type Jurisdiction = "Federal" | "State" | "Local";
interface ServiceItem {
  service_id: string;
  name: string;
  agency: string;
  jurisdiction: Jurisdiction;
  life_events: string[];
  eligibility: string;
  apply_url: string;
  funding?: string;
  source: "Data.gov.au" | "Transparency.gov.au";
  last_updated: string;
  stateCode?: string;
}

// Minimal seed data (swap for real API later)
const servicesData: ServiceItem[] = [
  {
    service_id: "svc_001",
    name: "JobSeeker Payment",
    agency: "Services Australia",
    jurisdiction: "Federal",
    life_events: ["job_loss"],
    eligibility:
      "Aged 22+ and unemployed; meet income/asset tests; actively seeking work.",
    apply_url: "https://www.servicesaustralia.gov.au/jobseeker",
    funding: "$9.2B (2024)",
    source: "Data.gov.au",
    last_updated: "2025-08-30",
  },
  {
    service_id: "svc_002",
    name: "Employment Support Service (NSW)",
    agency: "NSW Government",
    jurisdiction: "State",
    life_events: ["job_loss"],
    eligibility:
      "Resident in NSW; currently unemployed; willing to participate in training.",
    apply_url: "https://www.service.nsw.gov.au/",
    funding: "Program funding (see Transparency.gov.au)",
    source: "Transparency.gov.au",
    last_updated: "2025-08-30",
    stateCode: "NSW",
  },
  {
    service_id: "svc_003",
    name: "Disaster Recovery Payment",
    agency: "Services Australia",
    jurisdiction: "Federal",
    life_events: ["disaster"],
    eligibility:
      "Directly affected by a declared disaster in Australia.",
    apply_url: "https://www.servicesaustralia.gov.au/disaster",
    funding: "$2.1B (2024)",
    source: "Data.gov.au",
    last_updated: "2025-08-30",
  },
];

interface Agent {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  status: "online" | "busy" | "away" | "offline";
  responseTime: string;
}

// Language support system
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
    welcome: "Hello! I'm Services Agent, your Advisor. I can match your situation to services from Data.gov.au and show funding/performance info from Transparency.gov.au. Tell me what's happening (e.g., \"I lost my job\").",
    placeholder: "Type your message...",
    sendMessage: "Send",
    startListening: "Start voice input",
    stopListening: "Stop voice input",
    toggleSpeech: "Toggle speech output",
    backToMenu: "Back to main menu",
    yourServiceAdvisor: "Your Service Advisor",
    chooseLifeEvent: "Choose Your Life Event",
    progressStatus: "Progress Status",
    recentConversations: "Recent Conversations",
    hadBaby: "Had a Baby",
    lostJob: "Lost My Job",
    becomingCarer: "Becoming a Carer",
    affectedDisaster: "Affected by Disaster",
    startBusiness: "Start a Business",
    mentalHealthSupport: "Mental Health Support",
    useLifeEvent: "Use this life event",
    lifeEventMatched: "Life event matched",
    servicesRetrieved: "Services retrieved from Data.gov.au",
    checkingEligibility: "Checking eligibility",
    reminderCreated: "Reminder created",
    suggestedServices: "Suggested Services",
    applyNow: "Apply Now",
    checkEligibility: "Check Eligibility",
    sourcesUsed: "Sources Used",
    escalateToHuman: "Escalate to human",
    confidenceHigh: "Confidence: High",
    helpful: "Helpful",
    notAccurate: "Not accurate",
    whatsWrong: "What was inaccurate or could be improved?",
    cancel: "Cancel",
    aiStandardCompliant: "This assistant follows the Australian Government AI Technical Standard.",
    whyThisAnswer: "Why this answer?",
    dataUse: "Data use",
    talkToHuman: "Talk to a human",
    normalMode: "Normal mode",
    readableMode: "Readable mode",
    call: "Call",
    video: "Video"
  },
  zh: {
    welcome: "您好！我是服务代理，您的顾问。我可以将您的情况与Data.gov.au的服务匹配，并显示Transparency.gov.au的资金/绩效信息。请告诉我发生了什么（例如，我失业了）。",
    placeholder: "输入您的消息...",
    sendMessage: "发送",
    startListening: "开始语音输入",
    stopListening: "停止语音输入",
    toggleSpeech: "切换语音输出",
    backToMenu: "返回主菜单",
    yourServiceAdvisor: "您的服务顾问",
    chooseLifeEvent: "选择您的生活事件",
    progressStatus: "进度状态",
    recentConversations: "最近的对话",
    hadBaby: "生孩子",
    lostJob: "失业",
    becomingCarer: "成为护理者",
    affectedDisaster: "受灾影响",
    startBusiness: "创业",
    mentalHealthSupport: "心理健康支持",
    useLifeEvent: "使用此生活事件",
    lifeEventMatched: "生活事件匹配",
    servicesRetrieved: "从Data.gov.au检索的服务",
    checkingEligibility: "检查资格",
    reminderCreated: "提醒已创建",
    suggestedServices: "建议的服务",
    applyNow: "立即申请",
    checkEligibility: "检查资格",
    sourcesUsed: "使用的来源",
    escalateToHuman: "转人工服务",
    confidenceHigh: "置信度：高",
    helpful: "有帮助",
    notAccurate: "不准确",
    whatsWrong: "什么不准确或可以改进？",
    cancel: "取消",
    aiStandardCompliant: "此助手遵循澳大利亚政府AI技术标准。",
    whyThisAnswer: "为什么是这个答案？",
    dataUse: "数据使用",
    talkToHuman: "与人工对话",
    normalMode: "正常模式",
    readableMode: "易读模式",
    call: "通话",
    video: "视频"
  },
  ar: {
    welcome: "مرحباً! أنا وكيل الخدمات، مستشارك. يمكنني مطابقة وضعك مع الخدمات من Data.gov.au وإظهار معلومات التمويل/الأداء من Transparency.gov.au. أخبرني ما يحدث (مثل فقدت وظيفتي).",
    placeholder: "اكتب رسالتك...",
    sendMessage: "إرسال",
    startListening: "بدء الإدخال الصوتي",
    stopListening: "إيقاف الإدخال الصوتي",
    toggleSpeech: "تبديل الإخراج الصوتي",
    backToMenu: "العودة إلى القائمة الرئيسية",
    yourServiceAdvisor: "مستشار الخدمة الخاص بك",
    chooseLifeEvent: "اختر حدث حياتك",
    progressStatus: "حالة التقدم",
    recentConversations: "المحادثات الأخيرة",
    hadBaby: "رُزق بطفل",
    lostJob: "فقد الوظيفة",
    becomingCarer: "أصبح مقدم رعاية",
    affectedDisaster: "متأثر بكارثة",
    startBusiness: "بدء عمل تجاري",
    mentalHealthSupport: "دعم الصحة النفسية",
    useLifeEvent: "استخدم هذا الحدث الحياتي",
    lifeEventMatched: "تم مطابقة الحدث الحياتي",
    servicesRetrieved: "الخدمات المسترجعة من Data.gov.au",
    checkingEligibility: "فحص الأهلية",
    reminderCreated: "تم إنشاء التذكير",
    suggestedServices: "الخدمات المقترحة",
    applyNow: "تقدم الآن",
    checkEligibility: "فحص الأهلية",
    sourcesUsed: "المصادر المستخدمة",
    escalateToHuman: "الانتقال إلى المساعدة البشرية",
    confidenceHigh: "الثقة: عالية",
    helpful: "مفيد",
    notAccurate: "غير دقيق",
    whatsWrong: "ما الذي كان غير دقيق أو يمكن تحسينه؟",
    cancel: "إلغاء",
    aiStandardCompliant: "يتبع هذا المساعد المعيار التقني للذكاء الاصطناعي للحكومة الأسترالية.",
    whyThisAnswer: "لماذا هذه الإجابة؟",
    dataUse: "استخدام البيانات",
    talkToHuman: "التحدث مع إنسان",
    normalMode: "الوضع العادي",
    readableMode: "الوضع القابل للقراءة",
    call: "اتصال",
    video: "فيديو"
  },
  es: {
    welcome: "¡Hola! Soy Agente de Servicios, tu asesor. Puedo relacionar tu situación con servicios de Data.gov.au y mostrar información de financiación/rendimiento de Transparency.gov.au. Dime qué está pasando (ej. Perdí mi trabajo).",
    placeholder: "Escribe tu mensaje...",
    sendMessage: "Enviar",
    startListening: "Iniciar entrada de voz",
    stopListening: "Detener entrada de voz",
    toggleSpeech: "Alternar salida de voz",
    backToMenu: "Volver al menú principal",
    yourServiceAdvisor: "Tu Asesor de Servicios",
    chooseLifeEvent: "Elige Tu Evento de Vida",
    progressStatus: "Estado del Progreso",
    recentConversations: "Conversaciones Recientes",
    hadBaby: "Tuve un Bebé",
    lostJob: "Perdí Mi Trabajo",
    becomingCarer: "Convirtiéndome en Cuidador",
    affectedDisaster: "Afectado por Desastre",
    startBusiness: "Iniciar un Negocio",
    mentalHealthSupport: "Apoyo de Salud Mental",
    useLifeEvent: "Usar este evento de vida",
    lifeEventMatched: "Evento de vida coincidente",
    servicesRetrieved: "Servicios recuperados de Data.gov.au",
    checkingEligibility: "Verificando elegibilidad",
    reminderCreated: "Recordatorio creado",
    suggestedServices: "Servicios Sugeridos",
    applyNow: "Aplicar Ahora",
    checkEligibility: "Verificar Elegibilidad",
    sourcesUsed: "Fuentes Utilizadas",
    escalateToHuman: "Escalar a humano",
    confidenceHigh: "Confianza: Alta",
    helpful: "Útil",
    notAccurate: "No preciso",
    whatsWrong: "¿Qué fue impreciso o se puede mejorar?",
    cancel: "Cancelar",
    aiStandardCompliant: "Este asistente sigue el Estándar Técnico de IA del Gobierno Australiano.",
    whyThisAnswer: "¿Por qué esta respuesta?",
    dataUse: "Uso de datos",
    talkToHuman: "Hablar con un humano",
    normalMode: "Modo normal",
    readableMode: "Modo legible",
    call: "Llamar",
    video: "Video"
  },
  vi: {
    welcome: "Xin chào! Tôi là Đại lý Dịch vụ, cố vấn của bạn. Tôi có thể phù hợp tình huống của bạn với các dịch vụ từ Data.gov.au và hiển thị thông tin tài trợ/hiệu suất từ Transparency.gov.au. Hãy cho tôi biết điều gì đang xảy ra (ví dụ: Tôi bị mất việc).",
    placeholder: "Nhập tin nhắn của bạn...",
    sendMessage: "Gửi",
    startListening: "Bắt đầu nhập giọng nói",
    stopListening: "Dừng nhập giọng nói",
    toggleSpeech: "Chuyển đổi đầu ra giọng nói",
    backToMenu: "Quay lại menu chính",
    yourServiceAdvisor: "Cố vấn Dịch vụ của Bạn",
    chooseLifeEvent: "Chọn Sự kiện Cuộc sống của Bạn",
    progressStatus: "Trạng thái Tiến trình",
    recentConversations: "Cuộc trò chuyện Gần đây",
    hadBaby: "Có Em bé",
    lostJob: "Mất Việc",
    becomingCarer: "Trở thành Người chăm sóc",
    affectedDisaster: "Bị ảnh hưởng bởi Thảm họa",
    startBusiness: "Khởi nghiệp",
    mentalHealthSupport: "Hỗ trợ Sức khỏe Tâm thần",
    useLifeEvent: "Sử dụng sự kiện cuộc sống này",
    lifeEventMatched: "Sự kiện cuộc sống phù hợp",
    servicesRetrieved: "Dịch vụ được truy xuất từ Data.gov.au",
    checkingEligibility: "Kiểm tra tính đủ điều kiện",
    reminderCreated: "Đã tạo lời nhắc",
    suggestedServices: "Dịch vụ Được đề xuất",
    applyNow: "Áp dụng Ngay",
    checkEligibility: "Kiểm tra Điều kiện",
    sourcesUsed: "Nguồn Đã sử dụng",
    escalateToHuman: "Chuyển lên con người",
    confidenceHigh: "Độ tin cậy: Cao",
    helpful: "Hữu ích",
    notAccurate: "Không chính xác",
    whatsWrong: "Điều gì không chính xác hoặc có thể cải thiện?",
    cancel: "Hủy bỏ",
    aiStandardCompliant: "Trợ lý này tuân theo Tiêu chuẩn Kỹ thuật AI của Chính phủ Úc.",
    whyThisAnswer: "Tại sao lại có câu trả lời này?",
    dataUse: "Sử dụng dữ liệu",
    talkToHuman: "Nói chuyện với con người",
    normalMode: "Chế độ bình thường",
    readableMode: "Chế độ dễ đọc",
    call: "Gọi",
    video: "Video"
  },
  it: {
    welcome: "Ciao! Sono l'Agente dei Servizi, il tuo consulente. Posso abbinare la tua situazione ai servizi di Data.gov.au e mostrare informazioni sui finanziamenti/prestazioni da Transparency.gov.au. Dimmi cosa sta succedendo (es. Ho perso il lavoro).",
    placeholder: "Digita il tuo messaggio...",
    sendMessage: "Invia",
    startListening: "Inizia input vocale",
    stopListening: "Ferma input vocale",
    toggleSpeech: "Attiva/disattiva output vocale",
    backToMenu: "Torna al menu principale",
    yourServiceAdvisor: "Il Tuo Consulente di Servizio",
    chooseLifeEvent: "Scegli il Tuo Evento di Vita",
    progressStatus: "Stato del Progresso",
    recentConversations: "Conversazioni Recenti",
    hadBaby: "Ho avuto un Bambino",
    lostJob: "Ho perso il Lavoro",
    becomingCarer: "Diventando un Caregiver",
    affectedDisaster: "Colpito da Disastro",
    startBusiness: "Avviare un'Attività",
    mentalHealthSupport: "Supporto per la Salute Mentale",
    useLifeEvent: "Usa questo evento di vita",
    lifeEventMatched: "Evento di vita abbinato",
    servicesRetrieved: "Servizi recuperati da Data.gov.au",
    checkingEligibility: "Controllo dell'idoneità",
    reminderCreated: "Promemoria creato",
    suggestedServices: "Servizi Suggeriti",
    applyNow: "Applica Ora",
    checkEligibility: "Controlla Idoneità",
    sourcesUsed: "Fonti Utilizzate",
    escalateToHuman: "Passa a un umano",
    confidenceHigh: "Confidenza: Alta",
    helpful: "Utile",
    notAccurate: "Non accurato",
    whatsWrong: "Cosa era impreciso o potrebbe essere migliorato?",
    cancel: "Annulla",
    aiStandardCompliant: "Questo assistente segue lo Standard Tecnico AI del Governo Australiano.",
    whyThisAnswer: "Perché questa risposta?",
    dataUse: "Uso dei dati",
    talkToHuman: "Parla con un umano",
    normalMode: "Modalità normale",
    readableMode: "Modalità leggibile",
    call: "Chiama",
    video: "Video"
  },
  el: {
    welcome: "Γεια σας! Είμαι ο Πράκτορας Υπηρεσιών, ο σύμβουλός σας. Μπορώ να ταιριάξω την κατάστασή σας με υπηρεσίες από το Data.gov.au και να δείξω πληροφορίες χρηματοδότησης/απόδοσης από το Transparency.gov.au. Πείτε μου τι συμβαίνει (π.χ. Έχασα τη δουλειά μου).",
    placeholder: "Πληκτρολογήστε το μήνυμά σας...",
    sendMessage: "Αποστολή",
    startListening: "Έναρξη φωνητικής εισόδου",
    stopListening: "Διακοπή φωνητικής εισόδου",
    toggleSpeech: "Εναλλαγή φωνητικής εξόδου",
    backToMenu: "Επιστροφή στο κύριο μενού",
    yourServiceAdvisor: "Ο Σύμβουλος Υπηρεσιών σας",
    chooseLifeEvent: "Επιλέξτε το Γεγονός Ζωής σας",
    progressStatus: "Κατάσταση Προόδου",
    recentConversations: "Πρόσφατες Συνομιλίες",
    hadBaby: "Απέκτησα Μωρό",
    lostJob: "Έχασα τη Δουλειά μου",
    becomingCarer: "Γίνομαι Φροντιστής",
    affectedDisaster: "Επηρεάστηκα από Καταστροφή",
    startBusiness: "Έναρξη Επιχείρησης",
    mentalHealthSupport: "Υποστήριξη Ψυχικής Υγείας",
    useLifeEvent: "Χρησιμοποιήστε αυτό το γεγονός ζωής",
    lifeEventMatched: "Γεγονός ζωής ταιριάζει",
    servicesRetrieved: "Υπηρεσίες που ανακτήθηκαν από το Data.gov.au",
    checkingEligibility: "Έλεγχος καταλληλότητας",
    reminderCreated: "Υπενθύμιση δημιουργήθηκε",
    suggestedServices: "Προτεινόμενες Υπηρεσίες",
    applyNow: "Εφαρμόστε Τώρα",
    checkEligibility: "Έλεγχος Καταλληλότητας",
    sourcesUsed: "Πηγές που Χρησιμοποιήθηκαν",
    escalateToHuman: "Μεταφορά σε άνθρωπο",
    confidenceHigh: "Εμπιστοσύνη: Υψηλή",
    helpful: "Χρήσιμο",
    notAccurate: "Όχι ακριβές",
    whatsWrong: "Τι ήταν ανακριβές ή θα μπορούσε να βελτιωθεί;",
    cancel: "Ακύρωση",
    aiStandardCompliant: "Αυτός ο βοηθός ακολουθεί το Τεχνικό Πρότυπο AI της Αυστραλιανής Κυβέρνησης.",
    whyThisAnswer: "Γιατί αυτή η απάντηση;",
    dataUse: "Χρήση δεδομένων",
    talkToHuman: "Μιλήστε με άνθρωπο",
    normalMode: "Κανονική λειτουργία",
    readableMode: "Λειτουργία ανάγνωσης",
    call: "Κλήση",
    video: "Βίντεο"
  },
  hi: {
    welcome: "नमस्ते! मैं सेवा एजेंट हूं, आपका सलाहकार। मैं आपकी स्थिति को Data.gov.au की सेवाओं से मैच कर सकता हूं और Transparency.gov.au से फंडिंग/प्रदर्शन जानकारी दिखा सकता हूं। मुझे बताएं कि क्या हो रहा है (जैसे मैंने अपनी नौकरी खो दी)।",
    placeholder: "अपना संदेश टाइप करें...",
    sendMessage: "भेजें",
    startListening: "ध्वनि इनपुट शुरू करें",
    stopListening: "ध्वनि इनपुट रोकें",
    toggleSpeech: "ध्वनि आउटपुट टॉगल करें",
    backToMenu: "मुख्य मेनू पर वापस जाएं",
    yourServiceAdvisor: "आपका सेवा सलाहकार",
    chooseLifeEvent: "अपना जीवन घटना चुनें",
    progressStatus: "प्रगति स्थिति",
    recentConversations: "हाल की बातचीत",
    hadBaby: "बच्चा हुआ",
    lostJob: "नौकरी खो गई",
    becomingCarer: "देखभालकर्ता बन रहे हैं",
    affectedDisaster: "आपदा से प्रभावित",
    startBusiness: "व्यवसाय शुरू करें",
    mentalHealthSupport: "मानसिक स्वास्थ्य सहायता",
    useLifeEvent: "इस जीवन घटना का उपयोग करें",
    lifeEventMatched: "जीवन घटना मैच हुई",
    servicesRetrieved: "Data.gov.au से सेवाएं प्राप्त की गईं",
    checkingEligibility: "पात्रता की जांच कर रहे हैं",
    reminderCreated: "रिमाइंडर बनाया गया",
    suggestedServices: "सुझाई गई सेवाएं",
    applyNow: "अभी लागू करें",
    checkEligibility: "पात्रता जांचें",
    sourcesUsed: "उपयोग किए गए स्रोत",
    escalateToHuman: "मानव के पास भेजें",
    confidenceHigh: "विश्वास: उच्च",
    helpful: "सहायक",
    notAccurate: "सटीक नहीं",
    whatsWrong: "क्या गलत था या सुधार हो सकता है?",
    cancel: "रद्द करें",
    aiStandardCompliant: "यह सहायक ऑस्ट्रेलियाई सरकार AI तकनीकी मानक का पालन करता है।",
    whyThisAnswer: "यह उत्तर क्यों?",
    dataUse: "डेटा उपयोग",
    talkToHuman: "मानव से बात करें",
    normalMode: "सामान्य मोड",
    readableMode: "पठनीय मोड",
    call: "कॉल",
    video: "वीडियो"
  },
  ko: {
    welcome: "안녕하세요! 저는 서비스 에이전트, 귀하의 어드바이저입니다. Data.gov.au의 서비스와 귀하의 상황을 매칭하고 Transparency.gov.au의 자금/성과 정보를 보여드릴 수 있습니다. 무슨 일이 일어나고 있는지 말씀해 주세요 (예: 직장을 잃었습니다).",
    placeholder: "메시지를 입력하세요...",
    sendMessage: "보내기",
    startListening: "음성 입력 시작",
    stopListening: "음성 입력 중지",
    toggleSpeech: "음성 출력 토글",
    backToMenu: "메인 메뉴로 돌아가기",
    yourServiceAdvisor: "귀하의 서비스 어드바이저",
    chooseLifeEvent: "인생 이벤트 선택",
    progressStatus: "진행 상태",
    recentConversations: "최근 대화",
    hadBaby: "아기가 태어났어요",
    lostJob: "직장을 잃었어요",
    becomingCarer: "간병인이 되고 있어요",
    affectedDisaster: "재해 영향받음",
    startBusiness: "사업 시작",
    mentalHealthSupport: "정신 건강 지원",
    useLifeEvent: "이 인생 이벤트 사용",
    lifeEventMatched: "인생 이벤트 매칭됨",
    servicesRetrieved: "Data.gov.au에서 서비스 검색됨",
    checkingEligibility: "자격 확인 중",
    reminderCreated: "알림 생성됨",
    suggestedServices: "제안된 서비스",
    applyNow: "지금 신청",
    checkEligibility: "자격 확인",
    sourcesUsed: "사용된 소스",
    escalateToHuman: "인간에게 에스컬레이션",
    confidenceHigh: "신뢰도: 높음",
    helpful: "도움이 됨",
    notAccurate: "정확하지 않음",
    whatsWrong: "무엇이 부정확했거나 개선될 수 있나요?",
    cancel: "취소",
    aiStandardCompliant: "이 어시스턴트는 호주 정부 AI 기술 표준을 따릅니다.",
    whyThisAnswer: "이 답변은 ��인가요?",
    dataUse: "데이터 사용",
    talkToHuman: "인간과 대화",
    normalMode: "일반 모드",
    readableMode: "읽기 모드",
    call: "통화",
    video: "비디오"
  },
  th: {
    welcome: "สวัสดี! ฉันคือเอเจนต์บริการ ที่ปรึกษาของคุณ ฉันสามารถจับคู่สถานการณ์ของคุณกับบริการจาก Data.gov.au และแสดงข้อมูลการระดมทุน/ประสิทธิภาพจาก Transparency.gov.au บอกฉันว่าเกิดอะไรขึ้น (เช่น ฉันตกงาน)",
    placeholder: "พิมพ์ข้อความของคุณ...",
    sendMessage: "ส่ง",
    startListening: "เริ่มการป้อนเสียง",
    stopListening: "หยุดการป้อนเสียง",
    toggleSpeech: "สลับเอาต์พุตเสียง",
    backToMenu: "กลับไปที่เมนูหลัก",
    yourServiceAdvisor: "ที่ปรึกษาบริการของคุณ",
    chooseLifeEvent: "เลือกเหตุการณ์ชีวิตของคุณ",
    progressStatus: "สถานะความคืบหน้า",
    recentConversations: "การสนทนาล่าสุด",
    hadBaby: "มีลูก",
    lostJob: "ตกงาน",
    becomingCarer: "กลายเป็นผู้ดูแล",
    affectedDisaster: "ได้รับผลกระทบจากภัยพิบัติ",
    startBusiness: "เริ่มธุรกิจ",
    mentalHealthSupport: "การสนับสนุนสุขภาพจิต",
    useLifeEvent: "ใช้เหตุการณ์ชีวิตนี้",
    lifeEventMatched: "เหตุการณ์ชีวิตตรงกัน",
    servicesRetrieved: "บริการที่ดึงมาจาก Data.gov.au",
    checkingEligibility: "กำลังตรวจสอบคุณสมบัติ",
    reminderCreated: "สร้างการเตือนแล้ว",
    suggestedServices: "บริการที่แนะนำ",
    applyNow: "สมัครเลย",
    checkEligibility: "ตรวจสอบคุณสมบัติ",
    sourcesUsed: "แหล่งที่ใช้",
    escalateToHuman: "ส่งต่อให้คน",
    confidenceHigh: "ความเชื่อมั่น: สูง",
    helpful: "มีประโยชน์",
    notAccurate: "ไม่ถูกต้อง",
    whatsWrong: "อะไรไม่ถูกต้องหรือสามารถปรับปรุงได้?",
    cancel: "ยกเลิก",
    aiStandardCompliant: "ผู้ช่วยนี้ปฏิบัติตามมาตรฐานเทคนิค AI ของรัฐบาลออสเตรเลีย",
    whyThisAnswer: "ทำไมถึงตอบแบบนี้?",
    dataUse: "การใช้ข้อมูล",
    talkToHuman: "พูดคุยกับคน",
    normalMode: "โหมดปกติ",
    readableMode: "โหมดอ่านง่าย",
    call: "โทร",
    video: "วิดีโอ"
  },
  kau: {
    welcome: "Niina marni! Ngai Services Agent, ninna kumanu. Ngai nindi parri-ani kana Services Australia Data.gov.au-rla, maka ngarrpani funding/performance-na ngarrindjeri-rla Transparency.gov.au-rla. Ngarrpani nindi ngai palti kana (wardli-rla 'Ngai yukani ngai work-na').",
    placeholder: "Palti ninna ngapa-na...",
    sendMessage: "Yuki",
    startListening: "Kaurna-rla palti kura",
    stopListening: "Kaurna-rla palti yartappi",
    toggleSpeech: "Kaurna-rla palti wardli",
    backToMenu: "Warrabarna yurritya-rla",
    yourServiceAdvisor: "Ninna Service Kumanu",
    chooseLifeEvent: "Yurru ninna warni-na event",
    progressStatus: "Yarta Status",
    recentConversations: "Ngarrungi palti",
    hadBaby: "Kumbu tambulda",
    lostJob: "Work-na pardu",
    becomingCarer: "Kumanu tampandi",
    affectedDisaster: "Disaster-na tampandi",
    startBusiness: "Business kura",
    mentalHealthSupport: "Mental Health kumanu",
    useLifeEvent: "Warni event-na yurru",
    lifeEventMatched: "Warni event parri-ani",
    servicesRetrieved: "Services Data.gov.au-rla tandanya",
    checkingEligibility: "Yurramarna ngarrindji",
    reminderCreated: "Ngarrindje tika",
    suggestedServices: "Tarnpani Services",
    applyNow: "Yurra warriapendi",
    checkEligibility: "Yurramarna ngarrindji",
    sourcesUsed: "Tandanya yurru",
    escalateToHuman: "Miyurna tampandi",
    confidenceHigh: "Ngarringga: Patpa",
    helpful: "Kumanu",
    notAccurate: "Kaurna palti",
    whatsWrong: "Ninti palti kaurna tampandi?",
    cancel: "Pardu",
    aiStandardCompliant: "AI kumanu Australian Government Technical Standard yurru-rla.",
    whyThisAnswer: "Ninti itya answer?",
    dataUse: "Data yurru",
    talkToHuman: "Miyurna palti",
    normalMode: "Kaurna mode",
    readableMode: "Padna mode",
    call: "Call",
    video: "Video"
  }
};

export default function ChatAssistantScreen({
  onBack,
}: ChatAssistantScreenProps) {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice assistance state
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice'>('chat');

  // AI Technical Standard compliance state
  const [trustBarOpen, setTrustBarOpen] = useState(true);
  const [dataDrawerOpen, setDataDrawerOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [consentStoreChat, setConsentStoreChat] =
    useState(false);
  const [consentUseLocation, setConsentUseLocation] =
    useState(false);
  const [feedbackOpenForMsg, setFeedbackOpenForMsg] = useState<
    string | null
  >(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [confidenceByMsgId, setConfidenceByMsgId] = useState<
    Record<string, "high" | "medium" | "low">
  >({});
  const [readableMode, setReadableMode] = useState(false);

  // Interaction state
  const [suggestedServices, setSuggestedServices] = useState<
    ServiceItem[]
  >([]);
  const [showSources, setShowSources] = useState(false);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [eligibilityService, setEligibilityService] =
    useState<ServiceItem | null>(null);
  const [eligibilityForm, setEligibilityForm] = useState({
    age: "",
    employment: "",
    income: "",
  });
  const [eligibilityResult, setEligibilityResult] = useState<
    "eligible" | "unclear" | null
  >(null);

  // Life-event status
  const [selectedLifeEvent, setSelectedLifeEvent] = useState<
    string | null
  >(null);
  const [lifeEventMatched, setLifeEventMatched] =
    useState(false);
  const [servicesRetrieved, setServicesRetrieved] =
    useState(false);
  const [eligibilityChecking, setEligibilityChecking] =
    useState(false);

  const [currentAgent] = useState<Agent>({
    id: "agent-001",
    name: "Services Agent",
    title: "Advisor",
    department: "Services Australia",
    avatar: "SA",
    status: "online",
    responseTime: "Usually responds within 2 minutes",
  });

  // Translation helper function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "agent",
      content: t("welcome"),
      timestamp: new Date(Date.now() - 120000),
      status: "read",
    },
  ]);

  // Initialize speech services
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }

      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = supportedLanguages.find(l => l.code === language)?.voice || 'en-AU';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };
        
        recognitionInstance.onerror = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, [language]);

  // Text-to-speech function
  const speak = (text: string) => {
    if (speechSynthesis && speechEnabled) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const langConfig = supportedLanguages.find(l => l.code === language);
      if (langConfig?.voice) {
        utterance.lang = langConfig.voice;
      }
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate AI response
  const simulateAgentResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Mock response logic
    setTimeout(() => {
      const responseId = `agent-${Date.now()}`;
      const mockResponse = "I understand you're looking for assistance. Based on your message, I can help you find relevant government services. Let me search our Data.gov.au resources for you.";
      
      const newMessage: Message = {
        id: responseId,
        type: "agent",
        content: mockResponse,
        timestamp: new Date(),
        status: "read",
        actions: [
          {
            text: t("checkEligibility"),
            type: "primary",
            onClick: () => {
              setEligibilityOpen(true);
              setEligibilityService(servicesData[0]);
            }
          },
          {
            text: t("sourcesUsed"),
            type: "secondary",
            onClick: () => setShowSources(true)
          }
        ]
      };
      
      setMessages(prev => [...prev, newMessage]);
      setConfidenceByMsgId(prev => ({ ...prev, [responseId]: "high" }));
      
      // Speak the response if speech is enabled
      if (speechEnabled) {
        speak(mockResponse);
      }
      
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: message.trim(),
        timestamp: new Date(),
        status: "sent",
      };

      setMessages(prev => [...prev, newMessage]);
      simulateAgentResponse(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  const handleSpeechToggle = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechEnabled) {
      speechSynthesis?.cancel();
    }
  };

  const handleLifeEventSelect = (eventType: string) => {
    setSelectedLifeEvent(eventType);
    setLifeEventMatched(true);
    setServicesRetrieved(true);
    
    // Filter services based on life event
    const relevantServices = servicesData.filter(service => 
      service.life_events.includes(eventType)
    );
    setSuggestedServices(relevantServices);
    
    // Simulate AI message for life event
    const lifeEventMessage: Message = {
      id: `life-event-${Date.now()}`,
      type: "agent",
      content: `I matched the '${eventType}' life event. Here are services you may be eligible for.`,
      timestamp: new Date(),
      status: "read",
    };
    
    setMessages(prev => [...prev, lifeEventMessage]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCurrentLanguageConfig = (): LanguageConfig => {
    return supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  };

  const currentLangConfig = getCurrentLanguageConfig();

  return (
    <div className="flex h-screen bg-gray-50" dir={currentLangConfig.rtl ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="ml-2">{t("backToMenu")}</span>
              </Button>
              
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>{supportedLanguages.find(l => l.code === language)?.nativeName}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.nativeName}</span>
                        <span className="text-gray-500 text-sm">({lang.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gov-navy text-white rounded-full flex items-center justify-center">
                {currentAgent.avatar}
              </div>
              <div>
                <h2 className="font-medium text-gray-900">{currentAgent.name}</h2>
                <p className="text-sm text-gray-600">{currentAgent.title}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <Circle className="w-2 h-2 fill-current mr-1" />
                  {currentAgent.status}
                </p>
              </div>
            </div>
          </div>

          {/* Life Events Quick Actions */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t("chooseLifeEvent")}
            </h3>
            <div className="space-y-2">
              {[
                { id: 'job_loss', icon: Briefcase, key: 'lostJob' },
                { id: 'birth', icon: Baby, key: 'hadBaby' },
                { id: 'carer', icon: Heart, key: 'becomingCarer' },
                { id: 'disaster', icon: Zap, key: 'affectedDisaster' },
                { id: 'business', icon: Building, key: 'startBusiness' },
                { id: 'mental_health', icon: Brain, key: 'mentalHealthSupport' }
              ].map((event) => {
                const Icon = event.icon;
                return (
                  <Button
                    key={event.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-gray-50"
                    onClick={() => handleLifeEventSelect(event.id)}
                  >
                    <Icon className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="text-sm">{t(event.key)}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Progress Status */}
          {(lifeEventMatched || servicesRetrieved || eligibilityChecking) && (
            <div className="px-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {t("progressStatus")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    lifeEventMatched ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {lifeEventMatched ? <Check className="w-4 h-4" /> : <Circle className="w-2 h-2" />}
                  </div>
                  <span className="text-sm text-gray-600">{t("lifeEventMatched")}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    servicesRetrieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {servicesRetrieved ? <Check className="w-4 h-4" /> : <Circle className="w-2 h-2" />}
                  </div>
                  <span className="text-sm text-gray-600">{t("servicesRetrieved")}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    eligibilityChecking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {eligibilityChecking ? <Clock className="w-4 h-4" /> : <Circle className="w-2 h-2" />}
                  </div>
                  <span className="text-sm text-gray-600">{t("checkingEligibility")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-gov-navy text-white rounded-full flex items-center justify-center">
                {currentAgent.avatar}
              </div>
              <div>
                <h2 className="font-medium text-gray-900">{currentAgent.name}</h2>
                <p className="text-xs text-green-600 flex items-center">
                  <Circle className="w-2 h-2 fill-current mr-1" />
                  {currentAgent.status}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue>
                    <Languages className="w-4 h-4" />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span>{lang.nativeName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        {trustBarOpen && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    {t("aiStandardCompliant")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDataDrawerOpen(true)}
                  className="text-blue-700 hover:text-blue-800"
                >
                  <Info className="w-4 h-4 mr-2" />
                  {t("dataUse")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTrustBarOpen(false)}
                  className="text-blue-700 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Mode Toggle */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{t("normalMode")}</span>
                <Switch
                  checked={readableMode}
                  onCheckedChange={setReadableMode}
                />
                <span className="text-sm text-gray-600">{t("readableMode")}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
                className="text-gray-600 hover:text-gray-800"
              >
                <Phone className="w-4 h-4 mr-1" />
                {t("call")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
                className="text-gray-600 hover:text-gray-800"
              >
                <Video className="w-4 h-4 mr-1" />
                {t("video")}
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  readableMode ? 'text-lg leading-relaxed' : 'text-sm'
                } ${
                  msg.type === "user"
                    ? "bg-nav-teal text-white"
                    : "bg-white border border-gray-200"
                } rounded-lg px-4 py-3 shadow-sm`}
              >
                <p className={msg.type === "user" ? "text-white" : "text-gray-900"}>
                  {msg.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${
                    msg.type === "user" ? "text-teal-100" : "text-gray-500"
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                  
                  {msg.type === "agent" && (
                    <div className="flex items-center space-x-2">
                      {confidenceByMsgId[msg.id] && (
                        <Badge variant="secondary" className="text-xs">
                          {t("confidenceHigh")}
                        </Badge>
                      )}
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          className="p-1 h-6 w-6 text-gray-500 hover:text-green-600"
                          title={t("helpful")}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFeedbackOpenForMsg(msg.id)}
                          className="p-1 h-6 w-6 text-gray-500 hover:text-red-600"
                          title={t("notAccurate")}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setWhyOpen(true)}
                          className="p-1 h-6 w-6 text-gray-500 hover:text-blue-600"
                          title={t("whyThisAnswer")}
                        >
                          <Info className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {msg.actions && (
                  <div className="flex space-x-2 mt-3">
                    {msg.actions.map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={action.type === "primary" ? "default" : "outline"}
                        onClick={action.onClick}
                        className="text-xs"
                      >
                        {action.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggested Services */}
          {suggestedServices.length > 0 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">{t("suggestedServices")}</h3>
                <div className="space-y-3">
                  {suggestedServices.map((service) => (
                    <Card key={service.service_id} className="border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {service.jurisdiction}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {service.agency}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{service.eligibility}</p>
                        {service.funding && (
                          <p className="text-xs text-gray-500 mb-3">
                            Funding: {service.funding}
                          </p>
                        )}
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-nav-teal hover:bg-nav-teal/90">
                            {t("applyNow")}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEligibilityService(service);
                              setEligibilityOpen(true);
                            }}
                          >
                            {t("checkEligibility")}
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            Source: {service.source}
                          </span>
                          <span className="text-xs text-gray-500">
                            Updated: {service.last_updated}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-xs text-gray-500">{currentAgent.name} is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("placeholder")}
                className={`pr-20 ${readableMode ? 'text-lg' : 'text-sm'}`}
                dir={currentLangConfig.rtl ? 'rtl' : 'ltr'}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={`p-1.5 ${isListening ? 'text-red-600 bg-red-50' : 'text-gray-500'}`}
                  title={isListening ? t("stopListening") : t("startListening")}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSpeechToggle}
                  className={`p-1.5 ${speechEnabled ? 'text-blue-600' : 'text-gray-500'}`}
                  title={t("toggleSpeech")}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-nav-teal hover:bg-nav-teal/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            {currentAgent.responseTime}
          </p>
        </div>
      </div>

      {/* Data Sources Modal */}
      <Dialog open={dataDrawerOpen} onOpenChange={setDataDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("sourcesUsed")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This assistant uses verified government datasets to provide accurate information.
            </p>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Data.gov.au</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Official Australian government datasets including Services Australia eligibility criteria and application processes.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Real-time</Badge>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Transparency.gov.au</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Program funding information, performance metrics, and government service delivery data.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Updated daily</Badge>
                    <Badge variant="secondary">Public</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Privacy & Consent</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Store chat history for improvements</span>
                  <Switch
                    checked={consentStoreChat}
                    onCheckedChange={setConsentStoreChat}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Use location for relevant services</span>
                  <Switch
                    checked={consentUseLocation}
                    onCheckedChange={setConsentUseLocation}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Why This Answer Modal */}
      <Dialog open={whyOpen} onOpenChange={setWhyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("whyThisAnswer")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This response was generated based on:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Your specific situation and keywords</li>
              <li>• Current Data.gov.au service eligibility criteria</li>
              <li>• Funding availability from Transparency.gov.au</li>
              <li>• Australian Government AI Technical Standard guidelines</li>
            </ul>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-500">
                Need human assistance? <button className="text-nav-teal hover:underline" onClick={() => {}}>
                  {t("talkToHuman")}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog
        open={feedbackOpenForMsg !== null}
        onOpenChange={(open) => !open && setFeedbackOpenForMsg(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("notAccurate")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t("whatsWrong")}</p>
            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-nav-teal"
              placeholder="Your feedback helps improve our AI assistant..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFeedbackOpenForMsg(null);
                setFeedbackText("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                // Handle feedback submission
                setFeedbackOpenForMsg(null);
                setFeedbackText("");
              }}
              className="bg-nav-teal hover:bg-nav-teal/90"
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Eligibility Check Modal */}
      <Dialog open={eligibilityOpen} onOpenChange={setEligibilityOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("checkEligibility")}</DialogTitle>
          </DialogHeader>
          {eligibilityService && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{eligibilityService.name}</h4>
                <p className="text-sm text-gray-600">{eligibilityService.agency}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <Input
                    value={eligibilityForm.age}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                  <Select
                    value={eligibilityForm.employment}
                    onValueChange={(value) => setEligibilityForm({...eligibilityForm, employment: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <Input
                    value={eligibilityForm.income}
                    onChange={(e) => setEligibilityForm({...eligibilityForm, income: e.target.value})}
                    placeholder="Enter annual income"
                  />
                </div>
              </div>
              
              {eligibilityResult && (
                <div className={`p-4 rounded-lg ${
                  eligibilityResult === 'eligible' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className={`font-medium ${
                    eligibilityResult === 'eligible' ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {eligibilityResult === 'eligible' 
                      ? 'You appear to be eligible for this service'
                      : 'Eligibility unclear - please contact the service directly'
                    }
                  </p>
                  {eligibilityResult === 'eligible' && (
                    <Button
                      size="sm"
                      className="mt-3 bg-nav-teal hover:bg-nav-teal/90"
                      onClick={() => window.open(eligibilityService.apply_url, '_blank')}
                    >
                      {t("applyNow")}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEligibilityOpen(false);
                setEligibilityResult(null);
                setEligibilityForm({ age: "", employment: "", income: "" });
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                // Mock eligibility check
                const isEligible = eligibilityForm.age && parseInt(eligibilityForm.age) >= 22 && 
                                   eligibilityForm.employment === 'unemployed';
                setEligibilityResult(isEligible ? 'eligible' : 'unclear');
                setEligibilityChecking(true);
              }}
              className="bg-nav-teal hover:bg-nav-teal/90"
              disabled={!eligibilityForm.age || !eligibilityForm.employment}
            >
              {t("checkEligibility")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sources Modal */}
      <Dialog open={showSources} onOpenChange={setShowSources}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("sourcesUsed")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Data.gov.au</span>
              <Badge variant="outline">Primary source</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Transparency.gov.au</span>
              <Badge variant="secondary">Funding data</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}