/**
 * Fitoly projesi için Mermaid.js kullanarak diyagramları oluşturan kod.
 * Kullanım: Bu dosyadaki kodları HTML dosyasına dahil edin veya mermaid.live adresinde çalıştırın.
 */

// Mermaid.js diyagramlarını tanımlama - Basitleştirilmiş versiyonlar
const diagrams = {
  // Teknoloji İlişkileri Diyagramı
  technologyDiagram: `graph TD
    A[Frontend: Next.js + React] --> B[Backend: Node.js + Express]
    B --> C[Veritabanı: PostgreSQL + Prisma]
    D[Kullanıcı] --> A
    D --> JWT[Güvenlik: JWT]
    JWT --> B
  `,

  // Veritabanı İlişkileri Diyagramı
  databaseDiagram: `erDiagram
    ROLE {
        int id PK
        string roleName
        timestamp createdAt
        timestamp updatedAt
    }
    
    GENDER {
        int id PK
        string genderName
        timestamp createdAt
        timestamp updatedAt
    }
    
    USER {
        int id PK
        string firstName
        string lastName
        string email
        string password
        string birthDate
        string parentName
        string parentPhone
        int roleId FK
        int genderId FK
        string profileImage
        boolean active
        string passwordResetToken
        datetime passwordResetExpires
        datetime passwordChangedAt
        json preferences
        json notificationPreferences
        string notes
        datetime startDate
        json performanceNotes
        timestamp createdAt
        timestamp updatedAt
    }
    
    ATTENDANCE_LOG {
        int id PK
        int studentId FK
        datetime date
        string status
        string note
        timestamp createdAt
        timestamp updatedAt
    }
    
    SPORT {
        int id PK
        string sportName
        timestamp createdAt
        timestamp updatedAt
    }
    
    CLASS {
        int id PK
        int sportId FK
        string section
        timestamp createdAt
        timestamp updatedAt
    }
    
    CLASS_COACH {
        int id PK
        int classId FK
        int coachId FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    CLASS_STUDENT {
        int id PK
        int classId FK
        int studentId FK
        timestamp createdAt
        timestamp updatedAt
    }
    
    ROLE ||--o{ USER : "role_id"
    GENDER ||--o{ USER : "gender_id"
    USER ||--o{ ATTENDANCE_LOG : "student_id"
    SPORT ||--o{ CLASS : "sport_id"
    CLASS ||--o{ CLASS_COACH : "class_id"
    CLASS ||--o{ CLASS_STUDENT : "class_id"
    USER ||--o{ CLASS_COACH : "coach_id"
    USER ||--o{ CLASS_STUDENT : "student_id"
  `,

  // HTTP İstek Akışı Diyagramı
  requestFlowDiagram: `graph LR
    A[İstemci] --> B[React]
    B --> C[API Service]
    C --> D[Express Router]
    D --> E[Authenticate]
    E --> F[Authorize]
    F --> G[Controller]
    G --> H[Veritabanı]
  `,

  // Güvenlik Mimarisi Diyagramı
  securityDiagram: `graph TD
    A[Kullanıcı] --> B[AuthWrapper]
    B --> C[localStorage JWT]
    C --> D[Axios Interceptor]
    D --> E[JWT Verification]
    E --> F[authenticate]
    F --> G[authorize]
  `,

  // HTTP İstek Akışı Diyagramı
  requestFlowDiagram: `
  sequenceDiagram
    participant Client as İstemci
    participant Components as React Bileşenleri
    participant API as API Servisi
    participant Router as Express Router
    participant Auth as Authenticate Middleware
    participant Role as Authorize Middleware
    participant Controller as Controller
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL
    
    Client->>Components: Kullanıcı İsteği
    Components->>API: HTTP İsteği
    API->>Router: İstek Yönlendirme
    Router->>Auth: Kimlik Doğrulama
    Auth->>Role: Yetki Kontrolü
    Role->>Controller: İş Mantığı İşleme
    Controller->>Prisma: Veri İşlemi
    Prisma->>DB: SQL Sorgusu
    DB->>Prisma: Veri Dönüşü
    Prisma->>Controller: İşlenmiş Veri
    Controller->>API: Yanıt
    API->>Components: JSON Yanıt
    Components->>Client: UI Güncelleme
  `,
};

/**
 * Bu JavaScript kodunu kullanarak HTML içerisinde diyagramları göstermek için:
 * 
 * 1. HTML dosyanızda mermaid.js'i ekleyin:
 * <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
 * 
 * 2. Bu dosyayı dahil edin:
 * <script src="DiagramCodes.js"></script>
 */

// Diyagramları eklemek için güvenli fonksiyon
function insertDiagramsToPlaceholders() {
  // Tüm diyagram yer tutucularını bul
  const placeholders = document.querySelectorAll('.diagram-placeholder');
  
  // Her bir yer tutucuya diyagram ekle
  placeholders.forEach((placeholder, index) => {
    // mermaid sınıfını ekle
    placeholder.classList.add('mermaid');
    
    // İçeriğini temizle
    placeholder.innerHTML = '';
    
    // Sırasına göre uygun diyagramı ekle
    let diagramCode = "graph TD\nA[Diyagram] --> B[Bulunamadı]";
    
    if (index === 0) {
      diagramCode = diagrams.requestFlowDiagram;
    } else if (index === 1) {
      diagramCode = diagrams.databaseDiagram;
    } else if (index === 2) {
      diagramCode = diagrams.technologyDiagram;
    } else if (index === 3) {
      diagramCode = diagrams.securityDiagram;
    }else if (index === 4) {
      diagramCode = diagrams.databaseDiagram;
    }

    
    // İçeriği doğrudan metin olarak ayarla
    placeholder.textContent = diagramCode;
  });
  
  // Tüm diyagramları yeniden işle
  try {
    mermaid.init(undefined, '.mermaid');
  } catch (error) {
    console.error('Mermaid initialization error:', error);
  }
} 