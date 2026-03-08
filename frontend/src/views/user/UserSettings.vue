<template>
  <div class="user-settings-page">
    <el-card>
      <template #header>
        <h2>个人设置</h2>
      </template>
      
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" maxlength="100" />
        </el-form-item>
        
        <el-form-item label="头像">
          <el-avatar :size="80" :src="form.avatar">{{ form.nickname?.charAt(0) || 'U' }}</el-avatar>
          <el-button style="margin-left: 16px">更换头像</el-button>
        </el-form-item>
        
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" maxlength="500" show-word-limit />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSave">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { userApi } from '@/api/user';

const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  nickname: '',
  avatar: '',
  bio: '',
});

onMounted(() => {
  if (userStore.user) {
    form.nickname = userStore.user.nickname || '';
    form.avatar = userStore.user.avatar || '';
    form.bio = userStore.user.bio || '';
  }
});

async function handleSave() {
  loading.value = true;
  try {
    const updated = await userApi.updateProfile(form);
    userStore.user = updated;
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
.user-settings-page {
  max-width: 600px;
}
</style>
