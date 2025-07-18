export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          reputation: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          reputation?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          reputation?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          color: string
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          category_id: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms: string[]
          variables: Record<string, any>
          example_output: string | null
          usage_instructions: string | null
          author_id: string | null
          status: 'draft' | 'published' | 'archived' | 'rejected'
          featured: boolean
          rating_avg: number
          rating_count: number
          usage_count: number
          favorites_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          category_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms?: string[]
          variables?: Record<string, any>
          example_output?: string | null
          usage_instructions?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived' | 'rejected'
          featured?: boolean
          rating_avg?: number
          rating_count?: number
          usage_count?: number
          favorites_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          category_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms?: string[]
          variables?: Record<string, any>
          example_output?: string | null
          usage_instructions?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived' | 'rejected'
          featured?: boolean
          rating_avg?: number
          rating_count?: number
          usage_count?: number
          favorites_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      prompt_tags: {
        Row: {
          prompt_id: string
          tag_id: string
        }
        Insert: {
          prompt_id: string
          tag_id: string
        }
        Update: {
          prompt_id?: string
          tag_id?: string
        }
      }
      ratings: {
        Row: {
          id: string
          prompt_id: string
          user_id: string
          rating: number
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id: string
          rating: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string
          rating?: number
          review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collection_prompts: {
        Row: {
          collection_id: string
          prompt_id: string
          added_at: string
        }
        Insert: {
          collection_id: string
          prompt_id: string
          added_at?: string
        }
        Update: {
          collection_id?: string
          prompt_id?: string
          added_at?: string
        }
      }
      prompt_usage: {
        Row: {
          id: string
          prompt_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string
          category_id: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms: string[]
          variables: Record<string, any>
          example_output: string | null
          usage_instructions: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewer_id: string | null
          review_notes: string | null
          submitted_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          content: string
          category_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms?: string[]
          variables?: Record<string, any>
          example_output?: string | null
          usage_instructions?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewer_id?: string | null
          review_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          content?: string
          category_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          ai_platforms?: string[]
          variables?: Record<string, any>
          example_output?: string | null
          usage_instructions?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewer_id?: string | null
          review_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Category = Tables<'categories'>
export type Tag = Tables<'tags'>
export type Prompt = Tables<'prompts'>
export type Rating = Tables<'ratings'>
export type Favorite = Tables<'favorites'>
export type Collection = Tables<'collections'>
export type PromptUsage = Tables<'prompt_usage'>
export type Submission = Tables<'submissions'>

export type PromptWithDetails = Prompt & {
  category: Category | null
  tags: Tag[]
  author: User | null
  is_favorited?: boolean
  user_rating?: number
}