<template>
  <div class="resource-detail-page">
    <el-skeleton v-if="loading" :rows="10" animated />
    
    <template v-else-if="resource">
      <el-row :gutter="24">
        <el-col :span="16">
          <el-card>
            <div class="resource-header">
              <img :src="resource.cover || defaultCover" class="resource-cover" />
              <div class="resource-info">
                <h1>{{ resource.title }}</h1>
                <div class="meta">
                  <span><el-icon><User /></el-icon> {{ resource.author?.nickname }}</span>
                  <span><el-icon><Download /></el-icon> {{ resource.downloadCount }} 下载</span>
                  <el-rate v-model="resource.ratingAvg" disabled />
                </div>
                <div class="points" v-if="resource.pointsRequired > 0">
                  需要 {{ resource.pointsRequired }} 积分
                </div>
              </div>
            </div>
            
            <div class="resource-description">
              <h3>资源描述</h3>
              <p>{{ resource.description }}</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card>
            <el-button type="primary" size="large" style="width: 100%" @click="getDownloadLink">
              获取下载链接
            </el-button>
            
            <div v-if="downloadLink" class="download-info">
              <p>下载链接：</p>
              <el-input v-model="downloadLink" readonly>
                <template #append>
                  <el-button @click="copyLink">复制</el-button>
                </template>
              </el-input>
              <p v-if="extractCode">提取码：{{ extractCode }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { resourceApi } from '@/api/resource';
import type { Resource } from '@/types';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const resource = ref<Resource | null>(null);
const downloadLink = ref('');
const extractCode = ref('');
const defaultCover = 'https://via.placeholder.com/200x150?text=Resource';

onMounted(() => {
  fetchResource();
});

async function fetchResource() {
  const id = route.params.id as string;
  loading.value = true;
  try {
    resource.value = await resourceApi.getById(id);
  } catch (error) {
    ElMessage.error('加载资源失败');
    router.push('/resources');
  } finally {
    loading.value = false;
  }
}

async function getDownloadLink() {
  try {
    const result = await resourceApi.getDownloadLink(resource.value!.id);
    downloadLink.value = result.link;
    extractCode.value = result.extractCode || '';
  } catch (error) {
    ElMessage.error('获取下载链接失败');
  }
}

function copyLink() {
  navigator.clipboard.writeText(downloadLink.value);
  ElMessage.success('链接已复制');
}
</script>

<style scoped lang="scss">
.resource-detail-page {
  .resource-header {
    display: flex;
    gap: 24px;

    .resource-cover {
      width: 200px;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }

    .resource-info {
      flex: 1;

      h1 {
        font-size: 24px;
        margin-bottom: 12px;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 16px;
        color: #909399;
        font-size: 14px;
        margin-bottom: 12px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .points {
        color: #e6a23c;
        font-weight: 500;
      }
    }
  }

  .resource-description {
    margin-top: 24px;

    h3 {
      margin-bottom: 12px;
    }

    p {
      color: #606266;
      line-height: 1.8;
    }
  }

  .download-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
