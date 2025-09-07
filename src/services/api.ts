// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Use proxy in development
  : "https://mawso3a.pythonanywhere.com/api"; // Use direct URL in production

// Types for API responses
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category: number;
  description?: string;
}

export interface Kind {
  id: number;
  name: string;
  slug: string;
}

export interface ContentEntry {
  id: number;
  title: string;
  slug?: string;
  author: string;
  description: string;
  content?: string;
  full_description?: string;
  category: Category | number;
  subcategory?: Subcategory | number | null;
  date: string;
  pages?: number;
  page_count?: number | null;
  size?: number | null;
  language: string;
  tags?: string;
  cover_image_link?: string | null;
  pdf_file_link?: string | null;
  created_at?: string;
  updated_at?: string;
  published?: boolean;
  entry_type?: "manuscript" | "book" | "investigation";
  kind?: number | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface UploadResponse {
  url: string;
  filename: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("auth_token");

    // Clean up any invalid tokens on initialization
    this.validateAndCleanToken();
  }

  private validateAndCleanToken() {
    const token = localStorage.getItem("auth_token");
    if (token === "test_token" || !token || token.length < 10) {
      localStorage.removeItem("auth_token");
      this.token = null;
    }
  }

  private getHeaders(): HeadersInit {
    // Refresh token from localStorage in case it was updated
    this.token = localStorage.getItem("auth_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // If JSON parsing fails, create a generic error object
        errorData = {
          detail: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      // Handle specific error cases
      if (response.status === 403) {
        console.warn(
          "🔐 Authentication failed. Token may be invalid or expired. Trying public access..."
        );
        console.warn("Current token:", this.token ? "Present" : "Missing");
        // Don't throw error immediately, let the calling function handle fallback
        throw new Error(
          "ليس لديك صلاحية للقيام بهذا الإجراء. يرجى تسجيل الدخول بحساب صالح."
        );
      }

      if (response.status === 401) {
        console.error("🔐 Unauthorized access. Please login.");
        this.token = null;
        localStorage.removeItem("auth_token");
        throw new Error(
          "انتهت صلاحية جلسة الدخول. يرجى تسجيل الدخول مرة أخرى."
        );
      }

      if (response.status === 400) {
        console.error("📝 Bad request:", errorData);

        // Log detailed validation errors if available
        if (errorData && typeof errorData === "object") {
          Object.keys(errorData).forEach((field) => {
            console.error(`❌ Field '${field}':`, errorData[field]);
          });
        }

        // Create user-friendly error message
        let errorMessage = "خطأ في البيانات المرسلة";
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData && typeof errorData === "object") {
          const fieldErrors = Object.keys(errorData)
            .map((field) => {
              const fieldError = Array.isArray(errorData[field])
                ? errorData[field][0]
                : errorData[field];
              return `${field}: ${fieldError}`;
            })
            .join(", ");
          errorMessage = `خطأ في الحقول: ${fieldErrors}`;
        }

        throw new Error(errorMessage);
      }

      // Generic error handling
      const errorMessage =
        errorData.detail ||
        errorData.message ||
        `HTTP error! status: ${response.status}`;
      console.error(`🚨 API Error (${response.status}):`, errorData);
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/auth-token/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.token = data.token;
    localStorage.setItem("auth_token", data.token);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/logout/`, {
        method: "POST",
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.token = null;
      localStorage.removeItem("auth_token");
    }
  }

  async getProfile(): Promise<any> {
    const response = await fetch(`${this.baseURL}/profile/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseURL}/categories/`, {
      headers: this.getHeaders(),
      mode: "cors",
      credentials: "omit",
    });

    // If 403 error, try without authentication
    if (response.status === 403) {
      const publicHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      };

      const publicResponse = await fetch(`${this.baseURL}/categories/`, {
        headers: publicHeaders,
        mode: "cors",
        credentials: "omit",
      });

      if (publicResponse.ok) {
        const data = await publicResponse.json();
        return data.results || data;
      }
    }

    const data = await this.handleResponse<any>(response);
    // Handle paginated response by extracting results array
    return data.results || data;
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${this.baseURL}/categories/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Category>(response);
  }

  async getCategory(id: number): Promise<Category> {
    const response = await fetch(`${this.baseURL}/categories/${id}/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Category>(response);
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${this.baseURL}/categories/${id}/`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Category>(response);
  }

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/categories/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    const response = await fetch(`${this.baseURL}/subcategories/`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    // Handle paginated response by extracting results array
    return data.results || data;
  }

  async createSubcategory(data: Partial<Subcategory>): Promise<Subcategory> {
    const response = await fetch(`${this.baseURL}/subcategories/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Subcategory>(response);
  }

  async getSubcategory(id: number): Promise<Subcategory> {
    const response = await fetch(`${this.baseURL}/subcategories/${id}/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<Subcategory>(response);
  }

  async updateSubcategory(
    id: number,
    data: Partial<Subcategory>
  ): Promise<Subcategory> {
    const response = await fetch(`${this.baseURL}/subcategories/${id}/`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Subcategory>(response);
  }

  async deleteSubcategory(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/subcategories/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async getCategorySubcategories(categoryId: number): Promise<Subcategory[]> {
    const response = await fetch(
      `${this.baseURL}/categories/${categoryId}/subcategories/`,
      {
        headers: this.getHeaders(),
      }
    );
    return this.handleResponse<Subcategory[]>(response);
  }

  // Kinds
  async getKinds(): Promise<Kind[]> {
    const response = await fetch(`${this.baseURL}/kinds/`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    // Handle paginated response by extracting results array
    return data.results || data;
  }

  // Content Entries
  async getEntries(params?: {
    category?: string;
    subcategory?: string;
    entry_type?: string;
    page?: number;
    limit?: number;
  }): Promise<ContentEntry[]> {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.append("category", params.category);
    if (params?.subcategory)
      searchParams.append("subcategory", params.subcategory);
    if (params?.entry_type)
      searchParams.append("entry_type", params.entry_type);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    // If no limit is specified, set a high limit to get all entries
    if (!params?.limit) {
      searchParams.append("limit", "2000"); // High limit to get all entries
    }

    const response = await fetch(`${this.baseURL}/entries/?${searchParams}`, {
      headers: this.getHeaders(),
      mode: "cors",
      credentials: "omit",
    });

    // If 403 error, try without authentication
    if (response.status === 403) {
      const publicHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      };

      const publicResponse = await fetch(
        `${this.baseURL}/entries/?${searchParams}`,
        {
          headers: publicHeaders,
          mode: "cors",
          credentials: "omit",
        }
      );

      if (publicResponse.ok) {
        const result = await publicResponse.json();

        // Handle different response structures
        if (result && typeof result === "object") {
          // If the response has a 'results' property (paginated response), use that
          if ("results" in result && Array.isArray(result.results)) {
            return result.results as ContentEntry[];
          }
          // If the response has a 'value' property, use that (PowerShell format)
          if ("value" in result && Array.isArray(result.value)) {
            return result.value as ContentEntry[];
          }
          // If the response is directly an array
          if (Array.isArray(result)) {
            return result as ContentEntry[];
          }
        }

        // Fallback to empty array
        return [];
      }
    }

    const result = await this.handleResponse<any>(response);

    // Handle different response structures
    if (result && typeof result === "object") {
      // If the response has a 'results' property (paginated response), use that
      if ("results" in result && Array.isArray(result.results)) {
        return result.results as ContentEntry[];
      }
      // If the response has a 'value' property, use that (PowerShell format)
      if ("value" in result && Array.isArray(result.value)) {
        return result.value as ContentEntry[];
      }
      // If the response is directly an array
      if (Array.isArray(result)) {
        return result as ContentEntry[];
      }
    }

    // Fallback to empty array
    return [];
  }

  // Get all entries with pagination support (for AdminBooks)
  async getAllEntriesPaginated(
    page: number = 1,
    limit: number = 2000
  ): Promise<{
    results: ContentEntry[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await fetch(
      `${this.baseURL}/entries/?page=${page}&limit=${limit}`,
      {
        headers: this.getHeaders(),
        mode: "cors",
        credentials: "omit",
      }
    );

    const result = await this.handleResponse<any>(response);

    return {
      results: result.results || [],
      count: result.count || 0,
      next: result.next || null,
      previous: result.previous || null,
    };
  }

  // Get entries with pagination
  async getEntriesPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    results: ContentEntry[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await fetch(
      `${this.baseURL}/entries/?page=${page}&limit=${limit}`,
      {
        headers: this.getHeaders(),
        mode: "cors",
        credentials: "omit",
      }
    );

    // If 403 error, try without authentication
    if (response.status === 403) {
      const publicHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      };

      const publicResponse = await fetch(
        `${this.baseURL}/entries/?page=${page}&limit=${limit}`,
        {
          headers: publicHeaders,
          mode: "cors",
          credentials: "omit",
        }
      );

      if (publicResponse.ok) {
        const result = await publicResponse.json();
        return {
          results: result.results || [],
          count: result.count || 0,
          next: result.next || null,
          previous: result.previous || null,
        };
      }
    }

    const result = await this.handleResponse<any>(response);

    return {
      results: result.results || [],
      count: result.count || 0,
      next: result.next || null,
      previous: result.previous || null,
    };
  }

  async getEntry(id: number): Promise<ContentEntry> {
    const response = await fetch(`${this.baseURL}/entries/${id}/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<ContentEntry>(response);
  }

  // تحديث دالة إنشاء المدخل لتدعم رفع الملفات مباشرة
  async createEntry(
    data: Partial<ContentEntry>,
    files?: {
      cover_image?: File;
      pdf_file?: File;
    }
  ): Promise<ContentEntry> {
    // إذا كانت هناك ملفات، استخدم FormData
    if (files && (files.cover_image || files.pdf_file)) {
      // تحديث الرمز المميز من التخزين المحلي
      this.token = localStorage.getItem("auth_token");

      const formData = new FormData();

      // إضافة البيانات الأساسية
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // تعامل خاص مع القيم الرقمية والمنطقية
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value === null) {
            formData.append(key, "");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // إضافة الملفات
      if (files.cover_image) {
        formData.append("cover_image", files.cover_image);
      }

      if (files.pdf_file) {
        formData.append("pdf_file", files.pdf_file);
      }

      // إرسال الطلب مع FormData - لا نضيف Content-Type هنا، سيقوم المتصفح بإضافته تلقائيًا
      const headers: HeadersInit = {};
      if (this.token) {
        headers["Authorization"] = `Token ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}/entries/`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create entry error response:", errorText);
        throw new Error(
          `فشل في إنشاء المحتوى: ${response.status} ${response.statusText}`
        );
      }

      return this.handleResponse<ContentEntry>(response);
    } else {
      // إرسال البيانات كـ FormData لتجنب مشاكل التحقق

      const formData = new FormData();

      // إضافة البيانات الأساسية
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // تعامل خاص مع القيم الرقمية والمنطقية
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value === null) {
            formData.append(key, "");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // إرسال الطلب مع FormData
      const headers: HeadersInit = {};
      if (this.token) {
        headers["Authorization"] = `Token ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}/entries/`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create entry error response:", errorText);
        throw new Error(
          `فشل في إنشاء المحتوى: ${response.status} ${response.statusText}`
        );
      }

      return this.handleResponse<ContentEntry>(response);
    }
  }

  async updateEntry(
    id: number,
    data: Partial<ContentEntry>,
    files?: {
      cover_image?: File;
      pdf_file?: File;
    }
  ): Promise<ContentEntry> {
    // إذا كانت هناك ملفات، استخدم FormData
    if (files && (files.cover_image || files.pdf_file)) {
      // تحديث الرمز المميز من التخزين المحلي
      this.token = localStorage.getItem("auth_token");

      const formData = new FormData();

      // إضافة البيانات الأساسية
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // تعامل خاص مع القيم الرقمية والمنطقية
          if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value === null) {
            formData.append(key, "");
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // إضافة الملفات
      if (files.cover_image) {
        formData.append("cover_image", files.cover_image);
      }

      if (files.pdf_file) {
        formData.append("pdf_file", files.pdf_file);
      }

      // إرسال الطلب مع FormData - لا نضيف Content-Type هنا، سيقوم المتصفح بإضافته تلقائيًا
      const headers: HeadersInit = {};
      if (this.token) {
        headers["Authorization"] = `Token ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}/entries/${id}/`, {
        method: "PUT",
        headers: headers,
        body: formData,
      });

      return this.handleResponse<ContentEntry>(response);
    } else {
      // إذا لم تكن هناك ملفات، استخدم JSON كالمعتاد
      const response = await fetch(`${this.baseURL}/entries/${id}/`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse<ContentEntry>(response);
    }
  }

  async deleteEntry(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/entries/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async searchEntries(query: string): Promise<ContentEntry[]> {
    const response = await fetch(
      `${this.baseURL}/entries/search/?q=${encodeURIComponent(query)}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await this.handleResponse<any>(response);
    // Handle paginated response by extracting results array
    return data.results || data;
  }

  // Latest Projects
  async getLatestProjects(): Promise<ContentEntry[]> {
    const response = await fetch(`${this.baseURL}/latest-projects/`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<any>(response);
    // Handle paginated response by extracting results array
    return data.results || data;
  }

  // File Uploads
  async uploadPDF(file: File): Promise<UploadResponse> {
    // تحديث الرمز المميز من التخزين المحلي
    this.token = localStorage.getItem("auth_token");

    if (!this.token) {
      throw new Error("لم يتم تسجيل الدخول. يرجى تسجيل الدخول أولاً.");
    }

    const formData = new FormData();
    formData.append("file", file);

    // استخدام طريقة مختلفة لإرسال الرؤوس مع FormData
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/pdf/`, {
      method: "POST",
      headers: headers,
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDF Upload error response:", errorText);
      throw new Error(
        `فشل في رفع ملف PDF: ${response.status} ${response.statusText}`
      );
    }

    return this.handleResponse<UploadResponse>(response);
  }

  async uploadImage(file: File): Promise<UploadResponse> {
    // تحديث الرمز المميز من التخزين المحلي
    this.token = localStorage.getItem("auth_token");

    if (!this.token) {
      throw new Error("لم يتم تسجيل الدخول. يرجى تسجيل الدخول أولاً.");
    }

    const formData = new FormData();
    formData.append("file", file);

    // استخدام طريقة مختلفة لإرسال الرؤوس مع FormData
    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Token ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/image/`, {
      method: "POST",
      headers: headers,
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image Upload error response:", errorText);
      throw new Error(
        `فشل في رفع الصورة: ${response.status} ${response.statusText}`
      );
    }

    return this.handleResponse<UploadResponse>(response);
  }

  // Users (Admin only)
  async getUsers(): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/users/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getUser(id: number): Promise<any> {
    const response = await fetch(`${this.baseURL}/users/${id}/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<any>(response);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper functions for backward compatibility
export const getLatestItems = async (
  limit: number = 6
): Promise<ContentEntry[]> => {
  try {
    const items = await apiClient.getLatestProjects();
    return items.slice(0, limit);
  } catch (error) {
    console.error("Error fetching latest items:", error);
    return [];
  }
};

export const getItemById = async (id: string): Promise<ContentEntry | null> => {
  try {
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    return await apiClient.getEntry(numericId);
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    return null;
  }
};

export const searchItems = async (query: string): Promise<ContentEntry[]> => {
  try {
    return await apiClient.searchEntries(query);
  } catch (error) {
    console.error("Error searching items:", error);
    return [];
  }
};
