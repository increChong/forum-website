<template>
  <div class="search-page">
    <div class="search-header">
      <el-input
        v-model="keyword"
        placeholder="搜索话题、资源、用户..."
        size="large"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </template>
      </el-input>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="全部" name="all">
        <template #label>
          全部 ({{ total }})
        </template>
      </el-tab-pane>
      <el-tab-pane label="话题" name="topic">
        <template #label>
          话题 ({{ topicsTotal }})
        </template>
      </el-tab-pane>
      <el-tab-pane label="资源" name="resource">
        <template #label>
          资源 ({{ resourcesTotal }})
        </template>
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <template #label>
          用户 ({{ usersTotal }})
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="search-results">
      <el-skeleton v-if="loading" :rows="5" animated />

      <template v-else>
        <!-- 话题结果 -->
        <div v-if="(activeTab === 'all' || activeTab === 'topic') && topics.length" class="result-section">
          <h3 v-if="activeTab === 'all'">话题</h3>
          <div v-for="topic in topics" :key="topic.id" class="result-item" @click="router.push(`/topic/${topic.id}`)">
            <h4 v-html="highlightKeyword(topic.title, keyword)"></h4>
            <p v-html="highlightKeyword(topic.content, keyword)"></p>
            <div class="meta">
              <span>{{ topic.author?.nickname }}</span>
              <span>{{ topic.viewCount }} 浏览</span>
              <span>{{ topic.replyCount }} 回复</span>
            </div>
          </div>
        </div>

        <!-- 资源结果 -->
        <div v-if="(activeTab === 'all' || activeTab === 'resource') && resources.length" class="result-section">
          <h3 v-if="activeTab === 'all'">资源</h3>
          <div v-for="resource in resources" :key="resource.id" class="result-item" @click="router.push(`/resource/${resource.id}`)">
            <h4 v-html="highlightKeyword(resource.title, keyword)"></h4>
            <p v-html="highlightKeyword(resource.description, keyword)"></p>
            <div class="meta">
              <span>{{ resource.author?.nickname }}</span>
              <span>{{ resource.downloadCount }} 下载</span>
              <span v-if="resource.pointsRequired > 0">{{ resource.pointsRequired }} 积分</span>
            </div>
          </div>
        </div>

        <!-- 用户结果 -->
        <div v-if="(activeTab === 'all' || activeTab === 'user') && users.length" class="result-section">
          <h3 v-if="activeTab === 'all'">用户</h3>
          <div v-for="user in users" :key="user.id" class="result-item user-item" @click="router.push(`/user/${user.id}`)">
            <el-avatar :size="40" :src="user.avatar">{{ user.nickname?.charAt(0) || 'U' }}</el-avatar>
            <div class="user-info">
              <h4 v-html="highlightKeyword(user.nickname || user.username, keyword)"></h4>
              <p>{{ user.bio || '这个人很懒，什么都没写' }}</p>
              <div class="meta">
                <span>Lv.{{ user.level }}</span>
                <span>{{ user.points }} 积分</span>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="total === 0 && keyword" description="未找到相关结果" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { request } from '@/api/request';

const router = useRouter();
const route = useRoute();

const keyword = ref('');
const activeTab = ref('all');
const loading = ref(false);

const topics = ref<any[]>([]);
const resources = ref<any[]>([]);
const users = ref<any[]>([]);
const topicsTotal = ref(0);
const resourcesTotal = ref(0);
const usersTotal = ref(0);
const total = ref(0);

onMounted(() => {
  if (route.query.q) {
    keyword.value = route.query.q as string;
    handleSearch();
  }
});

watch(() => route.query.q, (newQ) => {
  if (newQ) {
    keyword.value = newQ as string;
    handleSearch();
  }
});

async function handleSearch() {
  if (!keyword.value.trim()) return;

  loading.value = true;
  try {
    const response = await request.get('/search', {
      params: {
        q: keyword.value,
        type: activeTab.value,
      },
    });

    topics.value = response.topics || [];
    resources.value = response.resources || [];
    users.value = response.users || [];
    topicsTotal.value = response.topicsTotal || 0;
    resourcesTotal.value = response.resourcesTotal || 0;
    usersTotal.value = response.usersTotal || 0;
    total.value = response.total || 0;

    // 更新URL
    router.replace({ query: { q: keyword.value } });
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    loading.value = false;
  }
}

function handleTabChange() {
  handleSearch();
}

function highlightKeyword(text: string, keyword: string) {
  if (!text || !keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
</script>

<style scoped lang="scss">
.search-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;

  .search-header {
    margin-bottom: 24px;
  }

  .search-results {
    margin-top: 16px;

    .result-section {
      margin-bottom: 32px;

      h3 {
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
        color: #303133;
      }
    }

    .result-item {
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;

      &:hover {
        background-color: #fafafa;
      }

      h4 {
        margin: 0 0 8px;
        font-size: 16px;
        color: #303133;

        :deep(mark) {
          background-color: #ffd700;
          color: inherit;
        }
      }

      p {
        margin: 0 0 8px;
        font-size: 14px;
        color: #606266;
        line-height: 1.6;

        :deep(mark) {
          background-color: #ffd700;
          color: inherit;
        }
      }

      .meta {
        font-size: 12px;
        color: #909399;

        span {
          margin-right: 16px;
        }
      }
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 16px;

      .user-info {
        flex: 1;
      }
    }
  }
}
</style>
