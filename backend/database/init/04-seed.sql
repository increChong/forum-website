-- Forum Website Database Seed Data
-- Version: 1.0.0
-- Created: 2026-03-08

-- =====================================================
-- Default Boards (板块)
-- =====================================================
INSERT INTO boards (id, name, slug, description, icon, sort_order) VALUES
    (uuid_generate_v4(), '技术交流', 'tech', '技术讨论、经验分享、编程交流', '💻', 1),
    (uuid_generate_v4(), '学习资料', 'learning', '学习资源、教程分享、知识总结', '📚', 2),
    (uuid_generate_v4(), '资源分享', 'resources', '软件工具、网盘资源、素材分享', '🗂️', 3),
    (uuid_generate_v4(), '生活杂谈', 'life', '生活话题、趣事分享、情感交流', '🌈', 4),
    (uuid_generate_v4(), '求助问答', 'help', '问题求助、经验求助、求推荐', '❓', 5);

-- =====================================================
-- Default Resource Categories (资源分类)
-- =====================================================
INSERT INTO resource_categories (id, name, slug, icon, sort_order) VALUES
    (uuid_generate_v4(), '软件工具', 'software', '🔧', 1),
    (uuid_generate_v4(), '学习教程', 'tutorials', '📖', 2),
    (uuid_generate_v4(), '电子书', 'ebooks', '📕', 3),
    (uuid_generate_v4(), '影视资源', 'movies', '🎬', 4),
    (uuid_generate_v4(), '音频资源', 'audio', '🎵', 5),
    (uuid_generate_v4(), '其他', 'others', '📦', 6);

-- Software subcategories
INSERT INTO resource_categories (name, slug, parent_id, icon, sort_order)
SELECT '开发工具', 'dev-tools', id, '⌨️', 1 FROM resource_categories WHERE slug = 'software'
UNION ALL
SELECT '设计工具', 'design-tools', id, '🎨', 2 FROM resource_categories WHERE slug = 'software'
UNION ALL
SELECT '效率工具', 'productivity', id, '⚡', 3 FROM resource_categories WHERE slug = 'software';

-- Tutorial subcategories
INSERT INTO resource_categories (name, slug, parent_id, icon, sort_order)
SELECT '编程教程', 'programming', id, '👨‍💻', 1 FROM resource_categories WHERE slug = 'tutorials'
UNION ALL
SELECT '语言学习', 'languages', id, '🌐', 2 FROM resource_categories WHERE slug = 'tutorials'
UNION ALL
SELECT '职业培训', 'career', id, '💼', 3 FROM resource_categories WHERE slug = 'tutorials';

-- =====================================================
-- Default Tags (标签)
-- =====================================================
INSERT INTO tags (name) VALUES
    ('前端'),
    ('后端'),
    ('Vue'),
    ('React'),
    ('Node.js'),
    ('Python'),
    ('Java'),
    ('Go'),
    ('数据库'),
    ('Docker'),
    ('Kubernetes'),
    ('AI'),
    ('机器学习'),
    ('设计'),
    ('产品'),
    ('求职'),
    ('面试'),
    ('资源'),
    ('教程'),
    ('开源');

-- =====================================================
-- Default Admin User (管理员)
-- Password: admin123 (bcrypt hash)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, nickname, role, level, points, email_verified) VALUES
    (
        uuid_generate_v4(),
        'admin',
        'admin@forum.local',
        '$2b$10$rQZ9hO6XK8Y3mN2pL5vW2.5X8Y3mN2pL5vW2.5X8Y3mN2pL5vW2.5X8Y3mN2pL5vW2',
        '管理员',
        'admin',
        6,
        10000,
        TRUE
    );

-- =====================================================
-- Test User (测试用户)
-- Password: test123 (bcrypt hash)
-- =====================================================
INSERT INTO users (id, username, email, password_hash, nickname, role, level, points, email_verified) VALUES
    (
        uuid_generate_v4(),
        'testuser',
        'test@forum.local',
        '$2b$10$rQZ9hO6XK8Y3mN2pL5vW2.5X8Y3mN2pL5vW2.5X8Y3mN2pL5vW2.5X8Y3mN2pL5vW2',
        '测试用户',
        'user',
        2,
        100,
        TRUE
    );

-- =====================================================
-- System Settings (系统设置 - 可选)
-- =====================================================
-- Note: If you want a settings table, create it separately
-- CREATE TABLE settings (
--     key VARCHAR(100) PRIMARY KEY,
--     value TEXT,
--     description VARCHAR(255)
-- );

-- INSERT INTO settings (key, value, description) VALUES
--     ('site_name', '话题圈', '网站名称'),
--     ('site_description', '话题交流与资源分享社区', '网站描述'),
--     ('points_per_topic', '5', '发帖获得积分'),
--     ('points_per_reply', '2', '回复获得积分'),
--     ('points_per_like', '1', '被点赞获得积分'),
--     ('max_topic_per_day_new', '3', '新用户每日发帖上限');
