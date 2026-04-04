export type BlockCategory = 'TITLE' | 'SUMMARY' | 'SKILL' | 'PROJECT' | 'PERSONAL_INFO';
export type Language = 'VI' | 'EN';
export type Domain = 'IT' | 'LEGAL' | 'GENERAL';

export interface MasterBlock {
  id: string;
  category: BlockCategory;
  variant: string;
  content: string | Record<string, any>;
  keywords: string[];
  language: Language;
  domain: Domain;
}

export const masterCVBlocks: MasterBlock[] = [
  // ================= PERSONAL INFO =================
  {
    id: "personal-hung",
    category: "PERSONAL_INFO",
    variant: "Main Contact",
    content: {
      fullName: "NGUYEN CONG HUNG",
      email: "chienthan0200@gmail.com",
      phone: "0379207086",
      location: "District 7, Ho Chi Minh City"
    },
    keywords: ["contact", "personal", "info"],
    language: "VI",
    domain: "IT"
  },

  // ================= TITLES =================
  {
    id: "title-hung-senior",
    category: "TITLE",
    variant: "Senior Fullstack",
    content: "NGUYEN CONG HUNG | Senior Fullstack Engineer (ReactJS & Mobile)",
    keywords: ["senior", "fullstack", "reactjs", "mobile"],
    language: "VI",
    domain: "IT"
  },

  // ================= SUMMARIES =================
  {
    id: "summary-hung-original",
    category: "SUMMARY",
    variant: "Professional Summary",
    content: "Tôi là một kỹ sư phần mềm giàu kinh nghiệm với thế mạnh chuyên sâu về thiết kế kiến trúc hệ thống và phát triển ứng dụng đa nền nền tảng (Web & Mobile). Tôi thành thạo ReactJS, React Native và Angular, kết hợp tư duy OOP và Design Patterns để xây dựng các giải pháp như ví điện tử, hệ thống Selfcare và chatbot. Với kinh nghiệm làm chủ cơ sở dữ liệu (MySQL, MongoDB) cùng khả năng tối ưu hóa UI/UX và REST API, tôi cam kết mang lại hiệu năng cao và trải nghiệm người dùng mượt mà cho các sản phẩm công nghệ.",
    keywords: ["summary", "architecture", "web", "mobile", "reactjs", "react native", "angular", "oop", "design patterns"],
    language: "VI",
    domain: "IT"
  },

  // ================= SKILLS =================
  {
    id: "skills-hung-original",
    category: "SKILL",
    variant: "Technical Skills",
    content: {
      "Frontend": "ReactJS, React Native, Angular, JavaScript, HTML5, CSS3",
      "Backend & Database": "REST API, MongoDB, MySQL, Elasticsearch, Node.js",
      "System Architecture": "OOP, Design Patterns, Clean Architecture, Microservices",
      "Tools & Ops": "Docker, CI/CD, Git, Performance Optimization"
    },
    keywords: ["skills", "react", "node", "mongo", "mysql", "architecture", "docker"],
    language: "VI",
    domain: "IT"
  },

  // ================= PROJECTS =================
  {
    id: "project-thiso-hung",
    category: "PROJECT",
    variant: "Thiso Retail",
    content: {
      name: "Thiso Retail (SmartOffice - ERP/WMS)",
      role: "Fullstack Engineer",
      blocks: [
        {
          type: "UI & Performance",
          items: [
            "Thiết kế và triển khai giao diện người dùng trên thiết bị di động, tối ưu hóa hiệu năng render danh sách hàng ngàn dữ liệu tại mức 60fps.",
            "Xây dựng hệ thống quản lý kho (WMS) và ứng dụng nội bộ, tích hợp REST API để đảm bảo luồng nghiệp vụ thông suốt."
          ]
        },
        {
          type: "Architecture",
          items: [
            "Áp dụng tư duy lập trình hướng đối tượng (OOP) để cấu trúc hóa module quản lý hạn sử dụng và cảnh báo giao nhận theo thời gian thực."
          ]
        }
      ]
    },
    keywords: ["erpwms", "ui", "performance", "60fps", "wms", "rest api", "oop"],
    language: "VI",
    domain: "IT"
  },
  {
    id: "project-finance-hung",
    category: "PROJECT",
    variant: "Financial System",
    content: {
      name: "Financial System (Customer Orders & Financial Management)",
      role: "Backend & Database Developer",
      blocks: [
        {
          type: "Backend & DB",
          items: [
            "Thiết kế kiến trúc Backend bằng Node.js và hệ quản trị cơ sở dữ liệu MySQL/PostgreSQL, đáp ứng bài toán đối soát tài chính phức tạp.",
            "Tối ưu hóa truy vấn SQL (Query Optimization) và sử dụng Indexing để xử lý khối lượng dữ liệu lớn, đảm bảo tốc độ phản hồi nhanh cho người dùng."
          ]
        },
        {
          type: "Ops",
          items: [
            "Triển khai Docker và CI/CD để tự động hóa quy trình deploy, đảm bảo tính ổn định và sẵn sàng cho hệ thống thanh toán."
          ]
        }
      ]
    },
    keywords: ["backend", "node.js", "mysql", "postgresql", "sql optimization", "indexing", "docker", "ci/cd"],
    language: "VI",
    domain: "IT"
  },
  {
    id: "project-namtech-hung",
    category: "PROJECT",
    variant: "N.A.M Tech",
    content: {
      name: "N.A.M Tech (Ticking App & Mobile Solutions)",
      role: "Mobile Engineer",
      blocks: [
        {
          type: "React Native & UX",
          items: [
            "Sử dụng React Native để phát triển ứng dụng đa nền tảng, thiết kế UI/UX tối ưu cho các công cụ hỗ trợ nhân sự hiện trường."
          ]
        },
        {
          type: "Architectural Patterns",
          items: [
            "Triển khai kiến trúc Offline-first giúp ứng dụng hoạt động ổn định khi mất mạng và đồng bộ dữ liệu ngầm khi có kết nối.",
            "Phát triển hệ thống Push Notification Real-time bằng cách can thiệp Native Bridge (iOS/Android) để nâng cao trải nghiệm người dùng."
          ]
        }
      ]
    },
    keywords: ["react native", "uiux", "offline-first", "push notification", "native bridge"],
    language: "VI",
    domain: "IT"
  },

  // ================= EDUCATION =================
  {
    id: "edu-bach-khoa",
    category: "PROJECT", // We use PROJECT category or just custom for now
    variant: "Education",
    content: "Đại học Bách Khoa, Cử nhân Công nghệ Thông tin - 2020",
    keywords: ["education", "bach khoa", "cs"],
    language: "VI",
    domain: "IT"
  },

  // ================= LEGAL DOMAIN BLOOPS (Keep from previous turn) =================
  {
    id: "title-legal",
    category: "TITLE",
    variant: "Legal Counsel",
    content: "Senior Legal Counsel | Dispute Resolution & Compliance Specialist",
    keywords: ["legal", "counsel", "compliance", "dispute resolution"],
    language: "VI",
    domain: "LEGAL"
  },
  {
    id: "summary-legal",
    category: "SUMMARY",
    variant: "Litigation/Corporate",
    content: "Tôi là Luật sư với hơn 8 năm kinh nghiệm chuyên sâu trong lĩnh vực giải quyết tranh chấp kinh doanh (Dispute Resolution) và quản trị tuân thủ (Compliance).",
    keywords: ["luật sư", "tranh chấp", "viac", "compliance"],
    language: "VI",
    domain: "LEGAL"
  }
];
