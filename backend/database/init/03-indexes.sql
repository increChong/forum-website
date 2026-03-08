-- Forum Website Database Indexes
-- Version: 1.0.0
-- Created: 2026-03-08

-- =====================================================
-- Users Indexes
-- =====================================================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- Boards Indexes
-- =====================================================
CREATE INDEX idx_boards_slug ON boards(slug);
CREATE INDEX idx_boards_is_active ON boards(is_active);
CREATE INDEX idx_boards_sort_order ON boards(sort_order);

-- =====================================================
-- Topics Indexes
-- =====================================================
CREATE INDEX idx_topics_board_id ON topics(board_id);
CREATE INDEX idx_topics_author_id ON topics(author_id);
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX idx_topics_last_reply_at ON topics(last_reply_at DESC);
CREATE INDEX idx_topics_is_pinned ON topics(is_pinned);
CREATE INDEX idx_topics_is_essence ON topics(is_essence);

-- Full-text search index for topics
CREATE INDEX idx_topics_content ON topics 
    USING gin(to_tsvector('simple', title || ' ' || content));

-- Hot topics composite index
CREATE INDEX idx_topics_hot ON topics 
    ((like_count + reply_count * 2 + view_count / 10) DESC);

-- =====================================================
-- Replies Indexes
-- =====================================================
CREATE INDEX idx_replies_topic_id ON replies(topic_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_replies_parent_id ON replies(parent_id);
CREATE INDEX idx_replies_created_at ON replies(created_at);

-- =====================================================
-- Resources Indexes
-- =====================================================
CREATE INDEX idx_resources_author_id ON resources(author_id);
CREATE INDEX idx_resources_category_id ON resources(category_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX idx_resources_download_count ON resources(download_count DESC);
CREATE INDEX idx_resources_rating_avg ON resources(rating_avg DESC);

-- Full-text search index for resources
CREATE INDEX idx_resources_content ON resources 
    USING gin(to_tsvector('simple', title || ' ' || COALESCE(description, '')));

-- =====================================================
-- Resource Categories Indexes
-- =====================================================
CREATE INDEX idx_resource_categories_parent_id ON resource_categories(parent_id);
CREATE INDEX idx_resource_categories_slug ON resource_categories(slug);
CREATE INDEX idx_resource_categories_sort_order ON resource_categories(sort_order);

-- =====================================================
-- Tags Indexes
-- =====================================================
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- =====================================================
-- Likes Indexes
-- =====================================================
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- =====================================================
-- Favorites Indexes
-- =====================================================
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_type, target_id);

-- =====================================================
-- Follows Indexes
-- =====================================================
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- =====================================================
-- Resource Reviews Indexes
-- =====================================================
CREATE INDEX idx_resource_reviews_resource_id ON resource_reviews(resource_id);
CREATE INDEX idx_resource_reviews_user_id ON resource_reviews(user_id);
CREATE INDEX idx_resource_reviews_rating ON resource_reviews(rating);

-- =====================================================
-- Notifications Indexes
-- =====================================================
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- =====================================================
-- Point Logs Indexes
-- =====================================================
CREATE INDEX idx_point_logs_user_id ON point_logs(user_id);
CREATE INDEX idx_point_logs_created_at ON point_logs(created_at DESC);
CREATE INDEX idx_point_logs_type ON point_logs(type);
