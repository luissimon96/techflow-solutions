// TypeScript types for Supabase database schema
export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          role: 'admin' | 'super-admin';
          is_active: boolean;
          last_login?: string;
          login_attempts: number;
          lock_until?: string;
          password_changed_at?: string;
          reset_password_token?: string;
          reset_password_expires?: string;
          two_factor_secret?: string;
          two_factor_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password_hash: string;
          role?: 'admin' | 'super-admin';
          is_active?: boolean;
          last_login?: string;
          login_attempts?: number;
          lock_until?: string;
          password_changed_at?: string;
          reset_password_token?: string;
          reset_password_expires?: string;
          two_factor_secret?: string;
          two_factor_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string;
          role?: 'admin' | 'super-admin';
          is_active?: boolean;
          last_login?: string;
          login_attempts?: number;
          lock_until?: string;
          password_changed_at?: string;
          reset_password_token?: string;
          reset_password_expires?: string;
          two_factor_secret?: string;
          two_factor_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_refresh_tokens: {
        Row: {
          id: string;
          admin_id: string;
          token_hash: string;
          expires_at: string;
          created_at: string;
          revoked_at?: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          token_hash: string;
          expires_at: string;
          created_at?: string;
          revoked_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          token_hash?: string;
          expires_at?: string;
          created_at?: string;
          revoked_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description?: string;
          category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          subcategory?: string;
          industry?: 'e-commerce' | 'saude' | 'educacao' | 'financeiro' | 'logistica' | 'varejo' | 'servicos' | 'tecnologia' | 'manufatura' | 'agricultura' | 'outro';
          status: 'draft' | 'review' | 'published' | 'archived';
          featured: boolean;
          visibility: 'public' | 'private' | 'client_only';
          team_size?: number;
          methodology: 'agile' | 'scrum' | 'kanban' | 'waterfall' | 'custom';
          author: string;
          last_modified_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description?: string;
          category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          subcategory?: string;
          industry?: 'e-commerce' | 'saude' | 'educacao' | 'financeiro' | 'logistica' | 'varejo' | 'servicos' | 'tecnologia' | 'manufatura' | 'agricultura' | 'outro';
          status?: 'draft' | 'review' | 'published' | 'archived';
          featured?: boolean;
          visibility?: 'public' | 'private' | 'client_only';
          team_size?: number;
          methodology?: 'agile' | 'scrum' | 'kanban' | 'waterfall' | 'custom';
          author?: string;
          last_modified_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string;
          category?: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          subcategory?: string;
          industry?: 'e-commerce' | 'saude' | 'educacao' | 'financeiro' | 'logistica' | 'varejo' | 'servicos' | 'tecnologia' | 'manufatura' | 'agricultura' | 'outro';
          status?: 'draft' | 'review' | 'published' | 'archived';
          featured?: boolean;
          visibility?: 'public' | 'private' | 'client_only';
          team_size?: number;
          methodology?: 'agile' | 'scrum' | 'kanban' | 'waterfall' | 'custom';
          author?: string;
          last_modified_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_clients: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          industry?: string;
          size?: 'startup' | 'pequena' | 'media' | 'grande' | 'multinacional';
          is_public: boolean;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          industry?: string;
          size?: 'startup' | 'pequena' | 'media' | 'grande' | 'multinacional';
          is_public?: boolean;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          industry?: string;
          size?: 'startup' | 'pequena' | 'media' | 'grande' | 'multinacional';
          is_public?: boolean;
        };
      };
      quotes: {
        Row: {
          id: string;
          client_name: string;
          client_email: string;
          client_phone?: string;
          client_company?: string;
          client_position?: string;
          project_name: string;
          project_description: string;
          project_type: 'Desenvolvimento Web' | 'Aplicativo Mobile' | 'E-commerce' | 'Dashboard/Analytics' | 'Sistema ERP' | 'API/Backend' | 'Consultoria Técnica' | 'Manutenção/Suporte' | 'Outro';
          project_category: 'Novo desenvolvimento' | 'Migração/Refatoração' | 'Integração' | 'Melhoria/Otimização' | 'Correção de bugs' | 'Consultoria';
          timeline: '1-2 semanas' | '3-4 semanas' | '1-2 meses' | '3-4 meses' | '5-6 meses' | 'Mais de 6 meses' | 'Flexível';
          budget: 'R$ 5.000 - R$ 15.000' | 'R$ 15.000 - R$ 30.000' | 'R$ 30.000 - R$ 50.000' | 'R$ 50.000 - R$ 100.000' | 'Acima de R$ 100.000' | 'A definir';
          has_existing_system: boolean;
          existing_system_details?: string;
          main_goals?: string;
          target_audience?: string;
          status: 'pending' | 'in_analysis' | 'proposal_sent' | 'accepted' | 'rejected' | 'canceled';
          proposal_value?: number;
          proposal_timeline?: string;
          proposal_notes?: string;
          proposal_sent_at?: string;
          proposal_accepted_at?: string;
          consent: boolean;
          source: 'website' | 'referral' | 'social_media' | 'direct';
          urgency: 'low' | 'medium' | 'high';
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_email: string;
          client_phone?: string;
          client_company?: string;
          client_position?: string;
          project_name: string;
          project_description: string;
          project_type: 'Desenvolvimento Web' | 'Aplicativo Mobile' | 'E-commerce' | 'Dashboard/Analytics' | 'Sistema ERP' | 'API/Backend' | 'Consultoria Técnica' | 'Manutenção/Suporte' | 'Outro';
          project_category: 'Novo desenvolvimento' | 'Migração/Refatoração' | 'Integração' | 'Melhoria/Otimização' | 'Correção de bugs' | 'Consultoria';
          timeline: '1-2 semanas' | '3-4 semanas' | '1-2 meses' | '3-4 meses' | '5-6 meses' | 'Mais de 6 meses' | 'Flexível';
          budget: 'R$ 5.000 - R$ 15.000' | 'R$ 15.000 - R$ 30.000' | 'R$ 30.000 - R$ 50.000' | 'R$ 50.000 - R$ 100.000' | 'Acima de R$ 100.000' | 'A definir';
          has_existing_system?: boolean;
          existing_system_details?: string;
          main_goals?: string;
          target_audience?: string;
          status?: 'pending' | 'in_analysis' | 'proposal_sent' | 'accepted' | 'rejected' | 'canceled';
          proposal_value?: number;
          proposal_timeline?: string;
          proposal_notes?: string;
          proposal_sent_at?: string;
          proposal_accepted_at?: string;
          consent: boolean;
          source?: 'website' | 'referral' | 'social_media' | 'direct';
          urgency?: 'low' | 'medium' | 'high';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string;
          client_company?: string;
          client_position?: string;
          project_name?: string;
          project_description?: string;
          project_type?: 'Desenvolvimento Web' | 'Aplicativo Mobile' | 'E-commerce' | 'Dashboard/Analytics' | 'Sistema ERP' | 'API/Backend' | 'Consultoria Técnica' | 'Manutenção/Suporte' | 'Outro';
          project_category?: 'Novo desenvolvimento' | 'Migração/Refatoração' | 'Integração' | 'Melhoria/Otimização' | 'Correção de bugs' | 'Consultoria';
          timeline?: '1-2 semanas' | '3-4 semanas' | '1-2 meses' | '3-4 meses' | '5-6 meses' | 'Mais de 6 meses' | 'Flexível';
          budget?: 'R$ 5.000 - R$ 15.000' | 'R$ 15.000 - R$ 30.000' | 'R$ 30.000 - R$ 50.000' | 'R$ 50.000 - R$ 100.000' | 'Acima de R$ 100.000' | 'A definir';
          has_existing_system?: boolean;
          existing_system_details?: string;
          main_goals?: string;
          target_audience?: string;
          status?: 'pending' | 'in_analysis' | 'proposal_sent' | 'accepted' | 'rejected' | 'canceled';
          proposal_value?: number;
          proposal_timeline?: string;
          proposal_notes?: string;
          proposal_sent_at?: string;
          proposal_accepted_at?: string;
          consent?: boolean;
          source?: 'website' | 'referral' | 'social_media' | 'direct';
          urgency?: 'low' | 'medium' | 'high';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          company?: string;
          phone?: string;
          subject: string;
          message: string;
          consent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          company?: string;
          phone?: string;
          subject: string;
          message: string;
          consent: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          company?: string;
          phone?: string;
          subject?: string;
          message?: string;
          consent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      project_complete: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description?: string;
          category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          status: 'draft' | 'review' | 'published' | 'archived';
          featured: boolean;
          visibility: 'public' | 'private' | 'client_only';
          client_name?: string;
          slug?: string;
          views?: number;
          likes?: number;
          shares?: number;
          live_url?: string;
          github_url?: string;
          created_at: string;
        };
      };
      featured_projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description?: string;
          category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          slug?: string;
          views?: number;
          client_name?: string;
          created_at: string;
        };
      };
      published_projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description?: string;
          category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
          featured: boolean;
          slug?: string;
          views?: number;
          client_name?: string;
          created_at: string;
        };
      };
      quote_summary: {
        Row: {
          id: string;
          client_name: string;
          client_email: string;
          client_company?: string;
          project_name: string;
          project_type: string;
          project_category: string;
          timeline: string;
          budget: string;
          status: string;
          proposal_value?: number;
          urgency: string;
          created_at: string;
          response_time_days?: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      admin_role: 'admin' | 'super-admin';
      project_category: 'web' | 'mobile' | 'ecommerce' | 'dashboard' | 'erp' | 'api' | 'consultoria';
      project_status: 'draft' | 'review' | 'published' | 'archived';
      project_visibility: 'public' | 'private' | 'client_only';
      quote_status: 'pending' | 'in_analysis' | 'proposal_sent' | 'accepted' | 'rejected' | 'canceled';
    };
  };
}