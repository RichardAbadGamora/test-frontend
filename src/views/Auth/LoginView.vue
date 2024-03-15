<template>
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <AppIcon :size="40" class="text-primary" />
          <h2 class="mt-8 app__page-heading">
            {{ $t('login-title') }}
          </h2>
        </div>

        <div v-if="showForm">
          <LoginForm :login-type="loginType" @success="handleLoginSuccess" />

          <hr class="or" />

          <div class="flex mt-10">
            <a :href="GOOGLE_LOGIN_URL" class="w-full btn--light m-1">Google</a>
          </div>
        </div>

        <div v-else class="my-5">
          <span>{{ $t('magic-link-was-sent') }}</span>
          <a href="/" class="w-full btn--primary mt-5">
            {{ $t('go-back') }}
          </a>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img class="absolute inset-0 h-full w-full object-cover" :src="image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { OtpAuthAction } from '@/enums/OtpAuthAction'
import { GOOGLE_LOGIN_URL } from '@/configs/App'
import LoginForm from '@/components/Auth/LoginForm.vue'
import image from '@/assets/images/laptop.webp'
import AppIcon from '@/components/App/AppIcon.vue'

const showForm: Ref<boolean> = ref(true)
const loginType = ref(OtpAuthAction.EMAIL_PASS_LOGIN)

const handleLoginSuccess = () => {
  showForm.value = false
}
</script>
<style scoped lang="scss">
.or {
  position: relative;
  display: block;
  border-bottom: 1px solid #e4e4e4;
  margin: 8px 0;
  overflow: visible;
}
hr.or:before {
  content: 'or sign in with';
  position: absolute;
  display: inline-block;
  line-height: 1;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #707070;
  padding: 0 16px;
}
</style>
