<template>
  <div class="topic-detail-page">
    <el-skeleton v-if="loading" :rows="10" animated />
    
    <template v-else-if="topic">
      <div class="topic-header">
        <h1 class="topic-title">{{ topic.title }}</h1>
        <div class="topic-meta">
          <el-avatar :size="32" :src="topic.author?.avatar" />
          <span class="author-name">{{ topic.author?.nickname || topic.author?.username }}</span>
          <span class="divider">·</span>
          <span>{{ formatTime(topic.createdAt) }}</span>
          <span class="divider">·</span>
          <span>{{ topic.viewCount }} 浏览</span>
        </div>
      </div>

      <div class="topic-content markdown-body" v-html="renderMarkdown(topic.content)" />

      <div class="topic-actions">
        <el-button @click="handleLike">
          <el-icon><Star /></el-icon>
          点赞 {{ topic.likeCount }}
        </el-button>
        <el-button @click="handleFavorite">
          <el-icon><CollectionTag /></el-icon>
          收藏 {{ topic.favoriteCount }}
        </el-button>
      </div>

      <div class="replies-section">
        <h3>回复 ({{ topic.replyCount }})</h3>
        
        <div class="reply-list">
          <div v-for="reply in replies" :key="reply.id" class="reply-item">
            <el-avatar :size="40" :src="reply.author?.avatar" />
            <div class="reply-content">
              <div class="reply-header">
                <span class="author">{{ reply.author?.nickname || reply.author?.username }}</span>
                <span class="floor">#{{ reply.floor }}</span>
                <span class="time">{{ formatTime(reply.createdAt) }}</span>
              </div>
              <div class="reply-text">{{ reply.content }}</div>
            </div>
          </div>
        </div>

        <div class="reply-form">
          <el-input
            v-model="replyContent"
            type="textarea"
            :rows="4"
            placeholder="写下你的回复..."
          />
          <el-button type="primary" :loading="submitting" @click="submitReply">
            发表回复
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { topicApi } from '@/api/topic';
import type { Topic, Reply } from '@/types';
import dayjs from 'dayjs';
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const submitting = ref(false);
const topic = ref<Topic | null>(null);
const replies = ref<Reply[]>([]);
const replyContent = ref('');

onMounted(() => {
  fetchTopic();
});

async function fetchTopic() {
  const id = route.params.id as string;
  loading.value = true;
  try {
    topic.value = await topicApi.getById(id);
    const response = await topicApi.getReplies(id);
    replies.value = response.items;
  } catch (error) {
    ElMessage.error('加载话题失败');
    router.push('/');
  } finally {
    loading.value = false;
  }
}

async function handleLike() {
  try {
    await topicApi.like(topic.value!.id);
    topic.value!.likeCount++;
  } catch (error) {
    ElMessage.error('操作失败');
  }
}

async function handleFavorite() {
  try {
    await topicApi.favorite(topic.value!.id);
    topic.value!.favoriteCount++;
  } catch (error) {
    ElMessage.error('操作失败');
  }
}

async function submitReply() {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容');
    return;
  }
  
  submitting.value = true;
  try {
    const reply = await topicApi.createReply(topic.value!.id, {
      content: replyContent.value,
    });
    replies.value.push(reply);
    replyContent.value = '';
    topic.value!.replyCount++;
    ElMessage.success('回复成功');
  } catch (error) {
    ElMessage.error('回复失败');
  } finally {
    submitting.value = false;
  }
}

function formatTime(time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}

function renderMarkdown(content: string) {
  return marked(content);
}
</script>

<style scoped lang="scss">
.topic-detail-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;

  .topic-header {
    margin-bottom: 24px;

    .topic-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .topic-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #909399;
      font-size: 14px;

      .author-name {
        color: #409eff;
      }

      .divider {
        color: #dcdfe6;
      }
    }
  }

  .topic-content {
    padding: 24px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .topic-actions {
    padding: 16px 0;
    display: flex;
    gap: 12px;
  }

  .replies-section {
    margin-top: 32px;

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
    }

    .reply-item {
      display: flex;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;

      .reply-content {
        flex: 1;

        .reply-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .author {
            font-weight: 500;
          }

          .floor {
            color: #909399;
            font-size: 12px;
          }

          .time {
            color: #c0c4cc;
            font-size: 12px;
          }
        }

        .reply-text {
          color: #606266;
          line-height: 1.6;
        }
      }
    }

    .reply-form {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>
