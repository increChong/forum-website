<template>
  <div class="resource-create-page">
    <el-card>
      <template #header>
        <h2>分享资源</h2>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资源标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源标题" maxlength="200" show-word-limit />
        </el-form-item>
        
        <el-form-item label="资源描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请描述资源内容" />
        </el-form-item>
        
        <el-form-item label="网盘链接" prop="link">
          <el-input v-model="form.link" placeholder="网盘分享链接" />
        </el-form-item>
        
        <el-form-item label="提取码">
          <el-input v-model="form.extractCode" placeholder="提取码（如有）" maxlength="50" />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="选择分类">
            <el-option label="软件工具" value="software" />
            <el-option label="学习教程" value="tutorials" />
            <el-option label="电子书" value="ebooks" />
            <el-option label="其他" value="others" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所需积分">
          <el-input-number v-model="form.pointsRequired" :min="0" :max="100" />
          <span class="hint">设为0表示免费</span>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            发布
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormRules } from 'element-plus';
import { resourceApi } from '@/api/resource';

const router = useRouter();
const loading = ref(false);

const form = reactive({
  title: '',
  description: '',
  link: '',
  extractCode: '',
  categoryId: '',
  pointsRequired: 0,
});

const rules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 200, message: '标题长度为5-200个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
  ],
  link: [
    { required: true, message: '请输入网盘链接', trigger: 'blur' },
  ],
};

async function handleSubmit() {
  loading.value = true;
  try {
    const resource = await resourceApi.create(form);
    ElMessage.success('发布成功');
    router.push(`/resource/${resource.id}`);
  } catch (error) {
    ElMessage.error('发布失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.resource-create-page {
  max-width: 800px;
  margin: 0 auto;

  .hint {
    margin-left: 8px;
    color: #909399;
    font-size: 12px;
  }
}
</style>
