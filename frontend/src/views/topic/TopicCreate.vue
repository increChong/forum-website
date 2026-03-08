<template>
  <div class="topic-create-page">
    <el-card>
      <template #header>
        <h2>发布话题</h2>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入话题标题" maxlength="200" show-word-limit />
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="支持 Markdown 格式"
          />
        </el-form-item>
        
        <el-form-item label="板块">
          <el-select v-model="form.boardId" placeholder="选择板块">
            <el-option label="技术交流" value="tech" />
            <el-option label="生活杂谈" value="life" />
            <el-option label="求助问答" value="help" />
          </el-select>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { topicApi } from '@/api/topic';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  title: '',
  content: '',
  boardId: '',
});

const rules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 200, message: '标题长度为5-200个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' },
  ],
};

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    const topic = await topicApi.create(form);
    ElMessage.success('发布成功');
    router.push(`/topic/${topic.id}`);
  } catch (error) {
    ElMessage.error('发布失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.topic-create-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
