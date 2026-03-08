<template>
  <div class="user-profile-page">
    <el-skeleton v-if="loading" :rows="10" animated />
    
    <template v-else-if="user">
      <el-card>
        <div class="profile-header">
          <el-avatar :size="80" :src="user.avatar">{{ user.nickname?.charAt(0) || 'U' }}</el-avatar>
          <div class="user-info">
            <h1>{{ user.nickname || user.username }}</h1>
            <p class="bio">{{ user.bio || '这个人很懒，什么都没写' }}</p>
            <div class="stats">
              <span>等级: {{ user.level }}</span>
              <span>积分: {{ user.points }}</span>
            </div>
          </div>
        </div>
      </el-card>
      
      <el-tabs v-model="activeTab" class="content-tabs">
        <el-tab-pane label="话题" name="topics">
          <div class="topic-list">
            <div v-for="topic in topics" :key="topic.id" class="topic-item" @click="router.push(`/topic/${topic.id}`)">
              <h4>{{ topic.title }}</h4>
              <p>{{ topic.replyCount }} 回复 · {{ topic.likeCount }} 点赞</p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资源" name="resources">
          <div class="resource-list">
            <div v-for="resource in resources" :key="resource.id" class="resource-item" @click="router.push(`/resource/${resource.id}`)">
              <h4>{{ resource.title }}</h4>
              <p>{{ resource.downloadCount }} 下载</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userApi } from '@/api/user';
import type { User, Topic, Resource } from '@/types';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const user = ref<User | null>(null);
const topics = ref<Topic[]>([]);
const resources = ref<Resource[]>([]);
const activeTab = ref('topics');

onMounted(() => {
  fetchUser();
});

async function fetchUser() {
  const id = route.params.id as string;
  loading.value = true;
  try {
    user.value = await userApi.getById(id);
    const [topicsRes, resourcesRes] = await Promise.all([
      userApi.getTopics(id),
      userApi.getResources(id),
    ]);
    topics.value = topicsRes.items;
    resources.value = resourcesRes.items;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.user-profile-page {
  .profile-header {
    display: flex;
    gap: 24px;
    align-items: center;

    .user-info {
      h1 {
        margin: 0 0 8px;
        font-size: 24px;
      }

      .bio {
        color: #909399;
        margin: 0 0 12px;
      }

      .stats {
        display: flex;
        gap: 16px;
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .content-tabs {
    margin-top: 24px;
  }

  .topic-item, .resource-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    h4 {
      margin: 0 0 4px;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
