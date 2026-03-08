<template>
  <div class="main-layout">
    <header class="header">
      <div class="container header-content">
        <div class="logo" @click="router.push('/')">
          <span class="logo-text">话题圈</span>
        </div>
        
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/resources" class="nav-item">资源</router-link>
        </nav>

        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索话题、资源..."
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon @click="handleSearch"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="user-area">
          <template v-if="userStore.isLoggedIn">
            <el-button type="primary" @click="router.push('/topic/create')">
              发布话题
            </el-button>
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="32" :src="userStore.user?.avatar">
                  {{ userStore.user?.nickname?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="username">{{ userStore.user?.nickname || userStore.user?.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人主页</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button @click="router.push('/login')">登录</el-button>
            <el-button type="primary" @click="router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <main class="main-content container">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 话题圈. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const searchKeyword = ref('');

onMounted(() => {
  if (userStore.token && !userStore.user) {
    userStore.fetchCurrentUser();
  }
});

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/', query: { q: searchKeyword.value } });
  }
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push(`/user/${userStore.user?.id}`);
      break;
    case 'settings':
      router.push('/settings');
      break;
    case 'logout':
      userStore.logout();
      router.push('/');
      break;
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    display: flex;
    align-items: center;
    height: 60px;
    gap: 24px;
  }

  .logo {
    cursor: pointer;
    
    .logo-text {
      font-size: 20px;
      font-weight: 600;
      color: #409eff;
    }
  }

  .nav {
    display: flex;
    gap: 20px;

    .nav-item {
      color: #606266;
      font-size: 15px;
      
      &:hover, &.router-link-active {
        color: #409eff;
      }
    }
  }

  .search-box {
    flex: 1;
    max-width: 400px;
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

.main-content {
  flex: 1;
}

.footer {
  background: #fff;
  border-top: 1px solid #ebeef5;
  padding: 20px 0;
  text-align: center;
  color: #909399;
  font-size: 13px;
}
</style>
