import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709875200000 implements MigrationInterface {
  name = 'InitialSchema1709875200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create enum types
    await queryRunner.query(`
      CREATE TYPE user_status AS ENUM ('active', 'banned', 'deleted')
    `);
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin')
    `);
    await queryRunner.query(`
      CREATE TYPE topic_status AS ENUM ('draft', 'published', 'hidden', 'deleted')
    `);
    await queryRunner.query(`
      CREATE TYPE resource_status AS ENUM ('draft', 'published', 'hidden', 'deleted')
    `);

    // Create updated_at trigger function
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          nickname VARCHAR(100),
          avatar VARCHAR(500),
          bio TEXT,
          level INTEGER DEFAULT 1,
          points INTEGER DEFAULT 0,
          status user_status DEFAULT 'active',
          role user_role DEFAULT 'user',
          email_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create boards table
    await queryRunner.query(`
      CREATE TABLE boards (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          icon VARCHAR(500),
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create topics table
    await queryRunner.query(`
      CREATE TABLE topics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
          author_id UUID REFERENCES users(id) ON DELETE SET NULL,
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          view_count INTEGER DEFAULT 0,
          like_count INTEGER DEFAULT 0,
          reply_count INTEGER DEFAULT 0,
          favorite_count INTEGER DEFAULT 0,
          is_pinned BOOLEAN DEFAULT FALSE,
          is_essence BOOLEAN DEFAULT FALSE,
          status topic_status DEFAULT 'published',
          last_reply_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create replies table
    await queryRunner.query(`
      CREATE TABLE replies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
          author_id UUID REFERENCES users(id) ON DELETE SET NULL,
          parent_id UUID REFERENCES replies(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          floor INTEGER NOT NULL,
          like_count INTEGER DEFAULT 0,
          status topic_status DEFAULT 'published',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create resource_categories table
    await queryRunner.query(`
      CREATE TABLE resource_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          parent_id UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
          icon VARCHAR(500),
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create resources table
    await queryRunner.query(`
      CREATE TABLE resources (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          author_id UUID REFERENCES users(id) ON DELETE SET NULL,
          category_id UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          cover VARCHAR(500),
          link TEXT NOT NULL,
          extract_code VARCHAR(50),
          points_required INTEGER DEFAULT 0,
          download_count INTEGER DEFAULT 0,
          favorite_count INTEGER DEFAULT 0,
          rating_avg DECIMAL(3,2) DEFAULT 0,
          rating_count INTEGER DEFAULT 0,
          status resource_status DEFAULT 'published',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create tags table
    await queryRunner.query(`
      CREATE TABLE tags (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(50) UNIQUE NOT NULL,
          usage_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create topic_tags table
    await queryRunner.query(`
      CREATE TABLE topic_tags (
          topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
          tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (topic_id, tag_id)
      )
    `);

    // Create resource_tags table
    await queryRunner.query(`
      CREATE TABLE resource_tags (
          resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
          tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (resource_id, tag_id)
      )
    `);

    // Create likes table
    await queryRunner.query(`
      CREATE TABLE likes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          target_type VARCHAR(20) NOT NULL,
          target_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, target_type, target_id)
      )
    `);

    // Create favorites table
    await queryRunner.query(`
      CREATE TABLE favorites (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          target_type VARCHAR(20) NOT NULL,
          target_id UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, target_type, target_id)
      )
    `);

    // Create follows table
    await queryRunner.query(`
      CREATE TABLE follows (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
          following_id UUID REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(follower_id, following_id),
          CHECK (follower_id != following_id)
      )
    `);

    // Create resource_reviews table
    await queryRunner.query(`
      CREATE TABLE resource_reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          content TEXT,
          is_valid BOOLEAN,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(resource_id, user_id)
      )
    `);

    // Create notifications table
    await queryRunner.query(`
      CREATE TABLE notifications (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          title VARCHAR(200),
          content TEXT,
          is_read BOOLEAN DEFAULT FALSE,
          related_type VARCHAR(50),
          related_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create point_logs table
    await queryRunner.query(`
      CREATE TABLE point_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          points INTEGER NOT NULL,
          description VARCHAR(255),
          related_type VARCHAR(50),
          related_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create triggers
    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_boards_updated_at
          BEFORE UPDATE ON boards
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_topics_updated_at
          BEFORE UPDATE ON topics
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_replies_updated_at
          BEFORE UPDATE ON replies
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_resources_updated_at
          BEFORE UPDATE ON resources
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `);

    // Create indexes
    await this.createIndexes(queryRunner);
  }

  private async createIndexes(queryRunner: QueryRunner): Promise<void> {
    // Users indexes
    await queryRunner.query(`CREATE INDEX idx_users_username ON users(username)`);
    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX idx_users_status ON users(status)`);

    // Topics indexes
    await queryRunner.query(`CREATE INDEX idx_topics_board_id ON topics(board_id)`);
    await queryRunner.query(`CREATE INDEX idx_topics_author_id ON topics(author_id)`);
    await queryRunner.query(`CREATE INDEX idx_topics_status ON topics(status)`);
    await queryRunner.query(`CREATE INDEX idx_topics_created_at ON topics(created_at DESC)`);
    await queryRunner.query(`
      CREATE INDEX idx_topics_content ON topics 
      USING gin(to_tsvector('simple', title || ' ' || content))
    `);

    // Resources indexes
    await queryRunner.query(`CREATE INDEX idx_resources_author_id ON resources(author_id)`);
    await queryRunner.query(`CREATE INDEX idx_resources_status ON resources(status)`);
    await queryRunner.query(`CREATE INDEX idx_resources_created_at ON resources(created_at DESC)`);

    // Likes/Favorites indexes
    await queryRunner.query(`CREATE INDEX idx_likes_user_id ON likes(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_likes_target ON likes(target_type, target_id)`);
    await queryRunner.query(`CREATE INDEX idx_favorites_user_id ON favorites(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_favorites_target ON favorites(target_type, target_id)`);

    // Notifications indexes
    await queryRunner.query(`CREATE INDEX idx_notifications_user_id ON notifications(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS point_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`DROP TABLE IF EXISTS resource_reviews`);
    await queryRunner.query(`DROP TABLE IF EXISTS follows`);
    await queryRunner.query(`DROP TABLE IF EXISTS favorites`);
    await queryRunner.query(`DROP TABLE IF EXISTS likes`);
    await queryRunner.query(`DROP TABLE IF EXISTS resource_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS topic_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS resources`);
    await queryRunner.query(`DROP TABLE IF EXISTS resource_categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS replies`);
    await queryRunner.query(`DROP TABLE IF EXISTS topics`);
    await queryRunner.query(`DROP TABLE IF EXISTS boards`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS resource_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS topic_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_status`);

    // Drop trigger function
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);
  }
}
