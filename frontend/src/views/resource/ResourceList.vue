<template>
  <div class="resource-list-page">
    <div class="page-header">
      <el-cascader
        v-model="selectedCategory"
        :options="categories"
        :props="{ value: 'id', label: 'name', checkStrictly: true }"
        placeholder="选择分类"
        clearable
        @change="fetchResources"
      />
      
      <el-radio-group v-model="sortBy" @change="fetchResources">
        <el-radio-button value="latest">最新</el-radio-button>
        <el-radio-button value="popular">热门</el-radio-button>
        <el-radio-button value="downloads">下载最多</el-radio-button>
      </el-radio-group>
      
      <el-button type="primary" @click="router.push('/resource/create')">
        分享资源
      </el-button>
    </div>

    <div class="resource-list">
      <el-skeleton v-if="loading" :rows="5" animated />
      
      <template v-else>
        <el-row :gutter="20">
          <el-col v-for="resource in resources" :key="resource.id" :span="6">
            <el-card class="resource-card" @click="router.push(`/resource/${resource.id}`)">
              <img :src="resource.cover || defaultCover" class="resource-cover" />
              <div class="resource-info">
                <h4>{{ resource.title }}</h4>
                <div class="resource-meta">
                  <span>{{ resource.downloadCount }} 下载</span>
                  <el-rate v-model="resource.ratingAvg" disabled />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-empty v-if="!resources.length" description="暂无资源" />
      </template>
    </div>

    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="fetchResources"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { resourceApi } from '@/api/resource';
import type { Resource, ResourceCategory } from '@/types';

const router = useRouter();

const loading = ref(false);
const resources = ref<Resource[]>([]);
const categories = ref<ResourceCategory[]>([]);
const selectedCategory = ref<string[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 20;
const sortBy = ref<'latest' | 'popular' | 'downloads'>('latest');
const defaultCover = 'https://via.placeholder.com/200x150?text=Resource';

onMounted(() => {
  fetchCategories();
  fetchResources();
});

async function fetchCategories() {
  try {
    categories.value = await resourceApi.getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
}

async function fetchResources() {
  loading.value = true;
  try {
    const response = await resourceApi.getList({
      page: page.value,
      limit: pageSize,
      categoryId: selectedCategory.value[selectedCategory.value.length - 1],
      sortBy: sortBy.value,
    });
    resources.value = response.items;
    total.value = response.total;
  } catch (error) {
    console.error('Failed to fetch resources:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.resource-list-page {
  .page-header {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  .resource-list {
    .resource-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .resource-cover {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 4px;
      }

      .resource-info {
        margin-top: 12px;

        h4 {
          margin: 0 0 8px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .resource-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #909399;

          .el-rate {
            --el-rate-icon-size: 12px;
          }
        }
      }
    }
  }

  .el-pagination {
    margin-top: 20px;
    justify-content: center;
  }
}
</style>
