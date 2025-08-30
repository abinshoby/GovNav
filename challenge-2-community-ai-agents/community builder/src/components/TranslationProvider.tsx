import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translation {
  // Navigation
  navigation: {
    home: string;
    navigator: string;
    communityAgent: string;
    datasets: string;
    help: string;
    back: string;
    mobile: string;
  };
  
  // Welcome/Repeat Screen
  welcomeScreen: {
    greeting: string;
    agentTitle: string;
    howCanHelp: string;
    discoverServices: string;
    discoverServicesDesc: string;
    bookAppointment: string;
    bookAppointmentDesc: string;
    checkTasks: string;
    checkTasksDesc: string;
    talkToVolunteer: string;
    talkToVolunteerDesc: string;
    chatPlaceholder: string;
    voiceOverButton: string;
    needHelp: string;
    callHelp: string;
    liveChat: string;
    repeat: string;
    speaking: string;
    language: string;
    voiceGuidance: string;
  };
  
  // Service Discovery
  serviceDiscovery: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    voiceSearch: string;
    listening: string;
    popularServices: string;
    foodAssistance: string;
    housingSupport: string;
    healthcareServices: string;
    employmentHelp: string;
    filters: string;
    location: string;
    serviceType: string;
    availability: string;
    search: string;
  };
  
  // Service Results
  serviceResults: {
    results: string;
    resultsFor: string;
    verified: string;
    bookNow: string;
    getDirections: string;
    callService: string;
    distance: string;
    openNow: string;
    closedNow: string;
    noResults: string;
    tryDifferent: string;
  };
  
  // Voice Assistant
  voiceAssistant: {
    title: string;
    pressToSpeak: string;
    listening: string;
    processing: string;
    voiceClarity: string;
    lastCommand: string;
    trySeying: string;
    goToServices: string;
    findFoodBank: string;
    bookAppointment: string;
    help: string;
    online: string;
    offline: string;
    limited: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    confirm: string;
    close: string;
    next: string;
    previous: string;
    save: string;
    edit: string;
    delete: string;
    yes: string;
    no: string;
  };
  
  // Accessibility
  accessibility: {
    highContrast: string;
    largeText: string;
    voiceGuidance: string;
    screenReader: string;
    keyboardNavigation: string;
    reducedMotion: string;
    hapticFeedback: string;
    skipToContent: string;
  };
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

const languages: LanguageOption[] = [
  { 
    code: 'en-AU', 
    name: 'English (Australia)', 
    nativeName: 'English',
    flag: '🇦🇺' 
  },
  { 
    code: 'ar-SA', 
    name: 'Arabic (Saudi Arabia)', 
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true
  },
  { 
    code: 'zh-CN', 
    name: 'Chinese (Simplified)', 
    nativeName: '中文',
    flag: '🇨🇳' 
  },
  { 
    code: 'hi-IN', 
    name: 'Hindi (India)', 
    nativeName: 'हिन्दी',
    flag: '🇮🇳' 
  },
  { 
    code: 'es-ES', 
    name: 'Spanish (Spain)', 
    nativeName: 'Español',
    flag: '🇪🇸' 
  },
  { 
    code: 'vi-VN', 
    name: 'Vietnamese (Vietnam)', 
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳' 
  },
  { 
    code: 'kau-AU', 
    name: 'Kaurna (Adelaide)', 
    nativeName: 'Kaurna',
    flag: '🏛️' 
  }
];

const translations: Record<string, Translation> = {
  'en-AU': {
    navigation: {
      home: 'Home',
      navigator: 'Navigator',
      communityAgent: 'Community Agent',
      datasets: 'Datasets',
      help: 'Help',
      back: 'Back',
      mobile: 'Mobile'
    },
    welcomeScreen: {
      greeting: 'Hi, I\'m your Community Agent',
      agentTitle: 'Community Agent',
      howCanHelp: 'How can I help you today?',
      discoverServices: 'Discover services',
      discoverServicesDesc: 'Find local government and community services',
      bookAppointment: 'Book an appointment',
      bookAppointmentDesc: 'Schedule appointments with government offices',
      checkTasks: 'Check my tasks',
      checkTasksDesc: 'View your ongoing applications and tasks',
      talkToVolunteer: 'Talk to a volunteer',
      talkToVolunteerDesc: 'Connect with a local volunteer helper',
      chatPlaceholder: 'Type your request here... (e.g., "Find food banks near me")',
      voiceOverButton: 'Read aloud',
      needHelp: 'Need immediate assistance?',
      callHelp: 'Call (555) 123-HELP',
      liveChat: 'Live Chat',
      repeat: 'Repeat',
      speaking: 'Speaking...',
      language: 'Language',
      voiceGuidance: 'Voice Guidance'
    },
    serviceDiscovery: {
      title: 'What service are you looking for?',
      subtitle: 'Type, speak, or choose from popular services below',
      searchPlaceholder: 'Search for services (e.g., food bank, healthcare)',
      voiceSearch: 'Voice Search',
      listening: 'Listening...',
      popularServices: 'Popular Services',
      foodAssistance: 'Food Assistance',
      housingSupport: 'Housing Support',
      healthcareServices: 'Healthcare Services',
      employmentHelp: 'Employment Help',
      filters: 'Filters',
      location: 'Location',
      serviceType: 'Service Type',
      availability: 'Availability',
      search: 'Search'
    },
    serviceResults: {
      results: 'Results',
      resultsFor: 'Results for',
      verified: 'Government Verified',
      bookNow: 'Book Now',
      getDirections: 'Get Directions',
      callService: 'Call Service',
      distance: 'km away',
      openNow: 'Open Now',
      closedNow: 'Closed Now',
      noResults: 'No results found',
      tryDifferent: 'Try a different search term'
    },
    voiceAssistant: {
      title: 'Voice Assistant',
      pressToSpeak: 'Press to Speak',
      listening: 'Listening...',
      processing: 'Processing...',
      voiceClarity: 'Voice Clarity',
      lastCommand: 'Last command:',
      trySeying: 'Try saying:',
      goToServices: 'Go to services',
      findFoodBank: 'Find food bank',
      bookAppointment: 'Book appointment',
      help: 'Help',
      online: 'Online',
      offline: 'Offline',
      limited: 'Limited'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      yes: 'Yes',
      no: 'No'
    },
    accessibility: {
      highContrast: 'High Contrast',
      largeText: 'Large Text',
      voiceGuidance: 'Voice Guidance',
      screenReader: 'Screen Reader',
      keyboardNavigation: 'Keyboard Navigation',
      reducedMotion: 'Reduced Motion',
      hapticFeedback: 'Haptic Feedback',
      skipToContent: 'Skip to main content'
    }
  },
  'ar-SA': {
    navigation: {
      home: 'الرئيسية',
      navigator: 'المتصفح',
      communityAgent: 'وكيل المجتمع',
      datasets: 'البيانات',
      help: 'المساعدة',
      back: 'رجوع',
      mobile: 'الجوال'
    },
    welcomeScreen: {
      greeting: 'مرحباً، أنا وكيل المجتمع',
      agentTitle: 'وكيل المجتمع',
      howCanHelp: 'كيف يمكنني مساعدتك اليوم؟',
      discoverServices: 'اكتشف الخدمات',
      discoverServicesDesc: 'ابحث عن الخدمات الحكومية والمجتمعية المحلية',
      bookAppointment: 'احجز موعداً',
      bookAppointmentDesc: 'حدد مواعيد مع المكاتب الحكومية',
      checkTasks: 'راجع مهامي',
      checkTasksDesc: 'اعرض طلباتك ومهامك الجارية',
      talkToVolunteer: 'تحدث مع متطوع',
      talkToVolunteerDesc: 'تواصل مع متطوع محلي مساعد',
      chatPlaceholder: 'اكتب طلبك هنا... (مثل "ابحث عن بنوك الطعام قريباً مني")',
      voiceOverButton: 'قراءة بصوت عالٍ',
      needHelp: 'تحتاج مساعدة فورية؟',
      callHelp: 'اتصل (555) 123-HELP',
      liveChat: 'دردشة مباشرة',
      repeat: 'كرر',
      speaking: 'يتحدث...',
      language: 'اللغة',
      voiceGuidance: 'الإرشاد الصوتي'
    },
    serviceDiscovery: {
      title: 'ما الخدمة التي تبحث عنها؟',
      subtitle: 'اكتب أو تحدث أو اختر من الخدمات الشائعة أدناه',
      searchPlaceholder: 'ابحث عن الخدمات (مثل بنك الطعام، الرعاية الصحية)',
      voiceSearch: 'البحث الصوتي',
      listening: 'يستمع...',
      popularServices: 'الخدمات الشائعة',
      foodAssistance: 'المساعدة الغذائية',
      housingSupport: 'دعم الإسكان',
      healthcareServices: 'خدمات الرعاية الصحية',
      employmentHelp: 'مساعدة التوظيف',
      filters: 'المرشحات',
      location: 'الموقع',
      serviceType: 'نوع الخدمة',
      availability: 'التوفر',
      search: 'بحث'
    },
    serviceResults: {
      results: 'النتائج',
      resultsFor: 'نتائج لـ',
      verified: 'موثق حكومياً',
      bookNow: 'احجز الآن',
      getDirections: 'احصل على الاتجاهات',
      callService: 'اتصل بالخدمة',
      distance: 'كم بعيداً',
      openNow: 'مفتوح الآن',
      closedNow: 'مغلق الآن',
      noResults: 'لم يتم العثور على نتائج',
      tryDifferent: 'جرب مصطلح بحث مختلف'
    },
    voiceAssistant: {
      title: 'المساعد الصوتي',
      pressToSpeak: 'اضغط للتحدث',
      listening: 'يستمع...',
      processing: 'يعالج...',
      voiceClarity: 'وضوح الصوت',
      lastCommand: 'الأمر الأخير:',
      trySeying: 'جرب قول:',
      goToServices: 'اذهب إلى الخدمات',
      findFoodBank: 'ابحث عن بنك الطعام',
      bookAppointment: 'احجز موعداً',
      help: 'مساعدة',
      online: 'متصل',
      offline: 'غير متصل',
      limited: 'محدود'
    },
    common: {
      loading: 'جارٍ التحميل...',
      error: 'خطأ',
      retry: 'أعد المحاولة',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      close: 'إغلاق',
      next: 'التالي',
      previous: 'السابق',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      yes: 'نعم',
      no: 'لا'
    },
    accessibility: {
      highContrast: 'تباين عالي',
      largeText: 'نص كبير',
      voiceGuidance: 'الإرشاد الصوتي',
      screenReader: 'قارئ الشاشة',
      keyboardNavigation: 'التنقل بلوحة المفاتيح',
      reducedMotion: 'حركة مقللة',
      hapticFeedback: 'ردود الفعل اللمسية',
      skipToContent: 'انتقل إلى المحتوى الرئيسي'
    }
  },
  'zh-CN': {
    navigation: {
      home: '首页',
      navigator: '导航器',
      communityAgent: '社区助手',
      datasets: '数据集',
      help: '帮助',
      back: '返回',
      mobile: '手机'
    },
    welcomeScreen: {
      greeting: '您好，我是您的社区助手',
      agentTitle: '社区助手',
      howCanHelp: '今天我能为您做些什么？',
      discoverServices: '发现服务',
      discoverServicesDesc: '查找当地政府和社区服务',
      bookAppointment: '预约',
      bookAppointmentDesc: '与政府办公室预约',
      checkTasks: '检查我的任务',
      checkTasksDesc: '查看您正在进行的申请和任务',
      talkToVolunteer: '与志愿者交谈',
      talkToVolunteerDesc: '联系当地志愿者助手',
      chatPlaceholder: '在此输入您的请求...（例如，"在我附近找食物银行"）',
      voiceOverButton: '朗读',
      needHelp: '需要立即帮助吗？',
      callHelp: '致电 (555) 123-HELP',
      liveChat: '在线聊天',
      repeat: '重复',
      speaking: '正在说话...',
      language: '语言',
      voiceGuidance: '语音指导'
    },
    serviceDiscovery: {
      title: '您在寻找什么服务？',
      subtitle: '输入、说话或从下面的热门服务中选择',
      searchPlaceholder: '搜索服务（例如，食物银行、医疗保健）',
      voiceSearch: '语音搜索',
      listening: '正在听...',
      popularServices: '热门服务',
      foodAssistance: '食物援助',
      housingSupport: '住房支持',
      healthcareServices: '医疗保健服务',
      employmentHelp: '就业帮助',
      filters: '过滤器',
      location: '位置',
      serviceType: '服务类型',
      availability: '可用性',
      search: '搜索'
    },
    serviceResults: {
      results: '结果',
      resultsFor: '搜索结果',
      verified: '政府验证',
      bookNow: '立即预订',
      getDirections: '获取路线',
      callService: '致电服务',
      distance: '公里外',
      openNow: '现在开放',
      closedNow: '现在关闭',
      noResults: '未找到结果',
      tryDifferent: '尝试不同的搜索词'
    },
    voiceAssistant: {
      title: '语音助手',
      pressToSpeak: '按下说话',
      listening: '正在听...',
      processing: '处理中...',
      voiceClarity: '语音清晰度',
      lastCommand: '最后命令：',
      trySeying: '尝试说：',
      goToServices: '去服务',
      findFoodBank: '查找食物银行',
      bookAppointment: '预约',
      help: '帮助',
      online: '在线',
      offline: '离线',
      limited: '有限'
    },
    common: {
      loading: '加载中...',
      error: '错误',
      retry: '重试',
      cancel: '取消',
      confirm: '确认',
      close: '关闭',
      next: '下一个',
      previous: '上一个',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      yes: '是',
      no: '否'
    },
    accessibility: {
      highContrast: '高对比度',
      largeText: '大文本',
      voiceGuidance: '语音指导',
      screenReader: '屏幕阅读器',
      keyboardNavigation: '键盘导航',
      reducedMotion: '减少动画',
      hapticFeedback: '触觉反馈',
      skipToContent: '跳转到主要内容'
    }
  },
  // Adding more languages with similar structure...
  'hi-IN': {
    navigation: {
      home: 'होम',
      navigator: 'नेविगेटर',
      communityAgent: 'कम्युनिटी एजेंट',
      datasets: 'डेटासेट',
      help: 'सहायता',
      back: 'वापस',
      mobile: 'मोबाइल'
    },
    welcomeScreen: {
      greeting: 'नमस्ते, मैं आपका कम्युनिटी एजेंट हूं',
      agentTitle: 'कम्युनिटी एजेंट',
      howCanHelp: 'आज मैं आपकी कैसे सहायता कर सकता हूं?',
      discoverServices: 'सेवाएं खोजें',
      discoverServicesDesc: 'स्थानीय सरकारी और सामुदायिक सेवाएं खोजें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      bookAppointmentDesc: 'सरकारी कार्यालयों के साथ अपॉइंटमेंट शेड्यूल करें',
      checkTasks: 'मेरे कार्य देखें',
      checkTasksDesc: 'अपने चालू आवेदन और कार्य देखें',
      talkToVolunteer: 'स्वयंसेवक से बात करें',
      talkToVolunteerDesc: 'स्थानीय स्वयंसेवक सहायक से जुड़ें',
      chatPlaceholder: 'यहां अपना अनुरोध टाइप करें... (जैसे, "मेरे पास फूड बैंक खोजें")',
      voiceOverButton: 'जोर से पढ़ें',
      needHelp: 'तत्काल सहायता चाहिए?',
      callHelp: 'कॉल करें (555) 123-HELP',
      liveChat: 'लाइव चैट',
      repeat: 'दोहराएं',
      speaking: 'बोल रहा है...',
      language: 'भाषा',
      voiceGuidance: 'आवाज निर्देशन'
    },
    serviceDiscovery: {
      title: 'आप किस सेवा की तलाश कर रहे हैं?',
      subtitle: 'टाइप करें, बोलें या नीचे की लोकप्रिय सेवाओं से चुनें',
      searchPlaceholder: 'सेवाओं की खोज करें (जैसे, फूड बैंक, स्वास्थ्य सेवा)',
      voiceSearch: 'आवाज खोज',
      listening: 'सुन रहा है...',
      popularServices: 'लोकप्रिय सेवाएं',
      foodAssistance: 'भोजन सहायता',
      housingSupport: 'आवास सहायता',
      healthcareServices: 'स्वास्थ्य सेवाएं',
      employmentHelp: 'रोजगार सहायता',
      filters: 'फिल्टर',
      location: 'स्थान',
      serviceType: 'सेवा प्रकार',
      availability: 'उपलब्धता',
      search: 'खोजें'
    },
    serviceResults: {
      results: 'परिणाम',
      resultsFor: 'के लिए परिणाम',
      verified: 'सरकारी सत्यापित',
      bookNow: 'अभी बुक करें',
      getDirections: 'दिशा-निर्देश प्राप्त करें',
      callService: 'सेवा को कॉल करें',
      distance: 'किमी दूर',
      openNow: 'अभी खुला',
      closedNow: 'अभी बंद',
      noResults: 'कोई परिणाम नहीं मिला',
      tryDifferent: 'एक अलग खोज शब्द आज़माएं'
    },
    voiceAssistant: {
      title: 'आवाज सहायक',
      pressToSpeak: 'बोलने के लिए दबाएं',
      listening: 'सुन रहा है...',
      processing: 'प्रसंस्करण...',
      voiceClarity: 'आवाज स्पष्टता',
      lastCommand: 'अंतिम आदेश:',
      trySeying: 'कहने की कोशिश करें:',
      goToServices: 'सेवाओं में जाएं',
      findFoodBank: 'फूड बैंक खोजें',
      bookAppointment: 'अपॉइंटमेंट बुक करें',
      help: 'सहायता',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      limited: 'सीमित'
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      retry: 'पुनः प्रयास करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      close: 'बंद करें',
      next: 'अगला',
      previous: 'पिछला',
      save: 'सेव करें',
      edit: 'संपादित करें',
      delete: 'मिटाएं',
      yes: 'हां',
      no: 'नहीं'
    },
    accessibility: {
      highContrast: 'उच्च कंट्रास्ट',
      largeText: 'बड़ा टेक्स्ट',
      voiceGuidance: 'आवाज निर्देशन',
      screenReader: 'स्क्रीन रीडर',
      keyboardNavigation: 'कीबोर्ड नेवीगेशन',
      reducedMotion: 'कम गति',
      hapticFeedback: 'स्पर्श फीडबैक',
      skipToContent: 'मुख्य सामग्री पर जाएं'
    }
  },
  'es-ES': {
    navigation: {
      home: 'Inicio',
      navigator: 'Navegador',
      communityAgent: 'Agente Comunitario',
      datasets: 'Conjuntos de datos',
      help: 'Ayuda',
      back: 'Atrás',
      mobile: 'Móvil'
    },
    welcomeScreen: {
      greeting: 'Hola, soy tu Agente Comunitario',
      agentTitle: 'Agente Comunitario',
      howCanHelp: '¿Cómo puedo ayudarte hoy?',
      discoverServices: 'Descubrir servicios',
      discoverServicesDesc: 'Encuentra servicios gubernamentales y comunitarios locales',
      bookAppointment: 'Reservar una cita',
      bookAppointmentDesc: 'Programa citas con oficinas gubernamentales',
      checkTasks: 'Revisar mis tareas',
      checkTasksDesc: 'Ve tus aplicaciones y tareas en curso',
      talkToVolunteer: 'Hablar con un voluntario',
      talkToVolunteerDesc: 'Conecta con un voluntario local',
      chatPlaceholder: 'Escribe tu solicitud aquí... (ej., "Encontrar bancos de alimentos cerca de mí")',
      voiceOverButton: 'Leer en voz alta',
      needHelp: '¿Necesitas ayuda inmediata?',
      callHelp: 'Llamar (555) 123-HELP',
      liveChat: 'Chat en vivo',
      repeat: 'Repetir',
      speaking: 'Hablando...',
      language: 'Idioma',
      voiceGuidance: 'Guía de voz'
    },
    serviceDiscovery: {
      title: '¿Qué servicio estás buscando?',
      subtitle: 'Escribe, habla o elige de los servicios populares a continuación',
      searchPlaceholder: 'Buscar servicios (ej., banco de alimentos, atención médica)',
      voiceSearch: 'Búsqueda por voz',
      listening: 'Escuchando...',
      popularServices: 'Servicios populares',
      foodAssistance: 'Asistencia alimentaria',
      housingSupport: 'Apoyo de vivienda',
      healthcareServices: 'Servicios de salud',
      employmentHelp: 'Ayuda de empleo',
      filters: 'Filtros',
      location: 'Ubicación',
      serviceType: 'Tipo de servicio',
      availability: 'Disponibilidad',
      search: 'Buscar'
    },
    serviceResults: {
      results: 'Resultados',
      resultsFor: 'Resultados para',
      verified: 'Verificado por el gobierno',
      bookNow: 'Reservar ahora',
      getDirections: 'Obtener direcciones',
      callService: 'Llamar al servicio',
      distance: 'km de distancia',
      openNow: 'Abierto ahora',
      closedNow: 'Cerrado ahora',
      noResults: 'No se encontraron resultados',
      tryDifferent: 'Prueba un término de búsqueda diferente'
    },
    voiceAssistant: {
      title: 'Asistente de voz',
      pressToSpeak: 'Presiona para hablar',
      listening: 'Escuchando...',
      processing: 'Procesando...',
      voiceClarity: 'Claridad de voz',
      lastCommand: 'Último comando:',
      trySeying: 'Intenta decir:',
      goToServices: 'Ir a servicios',
      findFoodBank: 'Encontrar banco de alimentos',
      bookAppointment: 'Reservar cita',
      help: 'Ayuda',
      online: 'En línea',
      offline: 'Fuera de línea',
      limited: 'Limitado'
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      close: 'Cerrar',
      next: 'Siguiente',
      previous: 'Anterior',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      yes: 'Sí',
      no: 'No'
    },
    accessibility: {
      highContrast: 'Alto contraste',
      largeText: 'Texto grande',
      voiceGuidance: 'Guía de voz',
      screenReader: 'Lector de pantalla',
      keyboardNavigation: 'Navegación por teclado',
      reducedMotion: 'Movimiento reducido',
      hapticFeedback: 'Retroalimentación háptica',
      skipToContent: 'Saltar al contenido principal'
    }
  },
  'vi-VN': {
    navigation: {
      home: 'Trang chủ',
      navigator: 'Điều hướng',
      communityAgent: 'Đại lý Cộng đồng',
      datasets: 'Bộ dữ liệu',
      help: 'Trợ giúp',
      back: 'Quay lại',
      mobile: 'Di động'
    },
    welcomeScreen: {
      greeting: 'Xin chào, tôi là Đại lý Cộng đồng của bạn',
      agentTitle: 'Đại lý Cộng đồng',
      howCanHelp: 'Hôm nay tôi có thể giúp gì cho bạn?',
      discoverServices: 'Khám phá dịch vụ',
      discoverServicesDesc: 'Tìm dịch vụ chính phủ và cộng đồng địa phương',
      bookAppointment: 'Đặt lịch hẹn',
      bookAppointmentDesc: 'Lên lịch cuộc hẹn với văn phòng chính phủ',
      checkTasks: 'Kiểm tra nhiệm vụ của tôi',
      checkTasksDesc: 'Xem các ứng dụng và nhiệm vụ đang tiến hành của bạn',
      talkToVolunteer: 'Nói chuyện với tình nguyện viên',
      talkToVolunteerDesc: 'Kết nối với người hỗ trợ tình nguyện địa phương',
      chatPlaceholder: 'Nhập yêu cầu của bạn ở đây... (ví dụ: "Tìm ngân hàng thực phẩm gần tôi")',
      voiceOverButton: 'Đọc to',
      needHelp: 'Cần hỗ trợ ngay lập tức?',
      callHelp: 'Gọi (555) 123-HELP',
      liveChat: 'Trò chuyện trực tiếp',
      repeat: 'Lặp lại',
      speaking: 'Đang nói...',
      language: 'Ngôn ngữ',
      voiceGuidance: 'Hướng dẫn bằng giọng nói'
    },
    serviceDiscovery: {
      title: 'Bạn đang tìm kiếm dịch vụ gì?',
      subtitle: 'Gõ, nói hoặc chọn từ các dịch vụ phổ biến bên dưới',
      searchPlaceholder: 'Tìm kiếm dịch vụ (ví dụ: ngân hàng thực phẩm, chăm sóc sức khỏe)',
      voiceSearch: 'Tìm kiếm bằng giọng nói',
      listening: 'Đang nghe...',
      popularServices: 'Dịch vụ phổ biến',
      foodAssistance: 'Hỗ trợ thực phẩm',
      housingSupport: 'Hỗ trợ nhà ở',
      healthcareServices: 'Dịch vụ chăm sóc sức khỏe',
      employmentHelp: 'Trợ giúp việc làm',
      filters: 'Bộ lọc',
      location: 'Vị trí',
      serviceType: 'Loại dịch vụ',
      availability: 'Tình trạng có sẵn',
      search: 'Tìm kiếm'
    },
    serviceResults: {
      results: 'Kết quả',
      resultsFor: 'Kết quả cho',
      verified: 'Được chính phủ xác minh',
      bookNow: 'Đặt ngay',
      getDirections: 'Lấy chỉ đường',
      callService: 'Gọi dịch vụ',
      distance: 'km xa',
      openNow: 'Đang mở',
      closedNow: 'Đang đóng',
      noResults: 'Không tìm thấy kết quả',
      tryDifferent: 'Thử một từ khóa tìm kiếm khác'
    },
    voiceAssistant: {
      title: 'Trợ lý giọng nói',
      pressToSpeak: 'Nhấn để nói',
      listening: 'Đang nghe...',
      processing: 'Đang xử lý...',
      voiceClarity: 'Độ rõ giọng nói',
      lastCommand: 'Lệnh cuối:',
      trySeying: 'Thử nói:',
      goToServices: 'Đi đến dịch vụ',
      findFoodBank: 'Tìm ngân hàng thực phẩm',
      bookAppointment: 'Đặt lịch hẹn',
      help: 'Trợ giúp',
      online: 'Trực tuyến',
      offline: 'Ngoại tuyến',
      limited: 'Hạn chế'
    },
    common: {
      loading: 'Đang tải...',
      error: 'Lỗi',
      retry: 'Thử lại',
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      close: 'Đóng',
      next: 'Tiếp theo',
      previous: 'Trước',
      save: 'Lưu',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      yes: 'Có',
      no: 'Không'
    },
    accessibility: {
      highContrast: 'Độ tương phản cao',
      largeText: 'Văn bản lớn',
      voiceGuidance: 'Hướng dẫn giọng nói',
      screenReader: 'Trình đọc màn hình',
      keyboardNavigation: 'Điều hướng bàn phím',
      reducedMotion: 'Chuyển động giảm',
      hapticFeedback: 'Phản hồi xúc giác',
      skipToContent: 'Bỏ qua đến nội dung chính'
    }
  },
  'kau-AU': {
    navigation: {
      home: 'Yarta',
      navigator: 'Parnako',
      communityAgent: 'Kuma Ngaityu',
      datasets: 'Parna Marlda',
      help: 'Yurrampi',
      back: 'Warraparingga',
      mobile: 'Munaintya'
    },
    welcomeScreen: {
      greeting: 'Palya, ngai yaitya Kuma Ngaityu',
      agentTitle: 'Kuma Ngaityu',
      howCanHelp: 'Warrana ngai yurrampi ngadlu tuwila?',
      discoverServices: 'Yurrampi tampinthi',
      discoverServicesDesc: 'Kuma ngura yurrampi parnako',
      bookAppointment: 'Purli parnarri',
      bookAppointmentDesc: 'Kuma yarta purli parnarri',
      checkTasks: 'Ngai parna pudni',
      checkTasksDesc: 'Yaitya parna pudni tampinthi',
      talkToVolunteer: 'Purrutappa kuma',
      talkToVolunteerDesc: 'Ngura purrutappa kuma',
      chatPlaceholder: 'Ngadlu parna tyirrampa... (parninthi "meyunna yurrampi")',
      voiceOverButton: 'Ngangki parlinthi',
      needHelp: 'Tuwila yurrampi mangka?',
      callHelp: 'Kulkandhu (555) 123-HELP',
      liveChat: 'Tuwila parnangku',
      repeat: 'Warraparinthi',
      speaking: 'Parnangku...',
      language: 'Kaurna',
      voiceGuidance: 'Ngangki yurrampi'
    },
    serviceDiscovery: {
      title: 'Warrana yurrampi tampityinangku?',
      subtitle: 'Tyirrampa, parnangku kudla popular yurrampi',
      searchPlaceholder: 'Yurrampi tampinthi (parninthi meyunna, mongkuna)',
      voiceSearch: 'Ngangki tampinthi',
      listening: 'Ngangityinangku...',
      popularServices: 'Popular Yurrampi',
      foodAssistance: 'Meyunna Yurrampi',
      housingSupport: 'Yurtu Yurrampi',
      healthcareServices: 'Mongkuna Yurrampi',
      employmentHelp: 'Parna Yurrampi',
      filters: 'Kalparrinthi',
      location: 'Yarta',
      serviceType: 'Yurrampi Kaurna',
      availability: 'Tampari',
      search: 'Tampinthi'
    },
    serviceResults: {
      results: 'Parna',
      resultsFor: 'Parna yaitya',
      verified: 'Kuma Pudlangku',
      bookNow: 'Tuwila Parnarri',
      getDirections: 'Warrana Parnako',
      callService: 'Yurrampi Kulkandhu',
      distance: 'marni warrirangga',
      openNow: 'Tuwila Purlaityu',
      closedNow: 'Tuwila Pukarri',
      noResults: 'Kaurna parna',
      tryDifferent: 'Mukarntu tampinthi'
    },
    voiceAssistant: {
      title: 'Ngangki Yurrampi',
      pressToSpeak: 'Parnangku Ngapinthi',
      listening: 'Ngangityinangku...',
      processing: 'Parnangku...',
      voiceClarity: 'Ngangki Marlaityu',
      lastCommand: 'Kaurna parna:',
      trySeying: 'Parnangku yurrama:',
      goToServices: 'Yurrampi awi',
      findFoodBank: 'Meyunna tampinthi',
      bookAppointment: 'Purli parnarri',
      help: 'Yurrampi',
      online: 'Ngaityu',
      offline: 'Kauwi',
      limited: 'Yambarrku'
    },
    common: {
      loading: 'Parnangku...',
      error: 'Mukarntu',
      retry: 'Warraparinthi',
      cancel: 'Kauwi',
      confirm: 'Marlaityu',
      close: 'Pukarri',
      next: 'Warni',
      previous: 'Kaurna',
      save: 'Pudlinthi',
      edit: 'Mukarntu',
      delete: 'Kauwi',
      yes: 'Marlaityu',
      no: 'Kauwi'
    },
    accessibility: {
      highContrast: 'Marni Pudlangku',
      largeText: 'Yurru Tyirra',
      voiceGuidance: 'Ngangki Yurrampi',
      screenReader: 'Pudni Ngangkityu',
      keyboardNavigation: 'Parnako Munaintya',
      reducedMotion: 'Yambarrku Parnatya',
      hapticFeedback: 'Ngapinthi Marlaityu',
      skipToContent: 'Parna awi'
    }
  }
};

interface TranslationContextType {
  currentLanguage: string;
  currentTranslation: Translation;
  availableLanguages: LanguageOption[];
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('govnav-language');
      if (saved && translations[saved]) {
        return saved;
      }
    }
    return 'en-AU';
  });

  const currentTranslation = translations[currentLanguage] || translations['en-AU'];
  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const isRTL = currentLanguageInfo.rtl || false;

  const setLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('govnav-language', language);
      
      // Apply RTL/LTR direction to document
      document.documentElement.dir = languages.find(lang => lang.code === language)?.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  };

  // Helper function to get nested translation values
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = currentTranslation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Apply language direction on mount and change
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const contextValue: TranslationContextType = {
    currentLanguage,
    currentTranslation,
    availableLanguages: languages,
    setLanguage,
    t,
    isRTL
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}