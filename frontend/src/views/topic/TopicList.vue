<template>
  <div class="topic-list-page">
    <div class="page-header">
      <el-radio-group v-model="sortBy" @change="fetchTopics">
        <el-radio-button value="latest">最新</el-radio-button>
        <el-radio-button value="hot">热门</el-radio-button>
        <el-radio-button value="essence">精华</el-radio-button>
      </el-radio-group>
      
      <el-button type="primary" @click="router.push('/topic/create')">
        发布话题
      </el-button>
    </div>

    <div class="topic-list">
      <el-skeleton v-if="loading" :rows="5" animated />
      
      <template v-else>
        <div
          v-for="topic in topics"
          :key="topic.id"
          class="topic-item"
          @click="router.push(`/topic/${topic.id}`)"
        >
          <div class="topic-content">
            <div class="topic-title">
              <el-tag v-if="topic.isPinned" type="danger" size="small">置顶</el-tag>
              <el-tag v-if="topic.isEssence" type="warning" size="small">精华</el-tag>
              <span>{{ topic.title }}</span>
            </div>
            <div class="topic-meta">
              <span>
                <el-avatar :size="20" :src="topic.author?.avatar" />
                {{ topic.author?.nickname || topic.author?.username }}
              </span>
              <span>{{ formatTime(topic.createdAt) }}</span>
            </div>
          </div>
          <div class="topic-stats">
            <span><el-icon><View /></el-icon> {{ topic.viewCount }}</span>
            <span><el-icon><ChatDotRound /></el-icon> {{ topic.replyCount }}</span>
            <span><el-icon><Star /></el-icon> {{ topic.likeCount }}</span>
          </div>
        </div>
        
        <el-empty v-if="!topics.length" description="暂无话题" />
      </template>
    </div>

    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="fetchTopics"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { topicApi } from '@/api/topic';
import type { Topic } from '@/types';
import dayjs from 'dayjs';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const topics = ref<Topic[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 20;
const sortBy = ref<'latest' | 'hot' | 'essence'>('latest');

onMounted(() => {
  fetchTopics();
});

async function fetchTopics() {
  loading.value = true;
  try {
    const response = await topicApi.getList({
      page: page.value,
      limit: pageSize,
      sortBy: sortBy.value,
    });
    topics.value = response.items;
    total.value = response.total;
  } catch (error) {
    console.error('Failed to fetch topics:', error);
  } finally {
    loading.value = false;
  }
}

function formatTime(time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}
</script>

<style scoped lang="scss">
.topic-list-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .topic-list {
    background: #fff;
    border-radius: 8px;
  }

  .topic-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #fafafa;
    }

    &:last-child {
      border-bottom: none;
    }

    .topic-content {
      flex: 1;

      .topic-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #303133;
        margin-bottom: 8px;
      }

      .topic-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 12px;
        color: #909399;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .topic-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #909399;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .el-pagination {
    margin-top: 20px;
    justify-content: center;
  }
}
</style>
