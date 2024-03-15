<template>
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <AppIcon :size="40" class="text-primary" />
          <h2 class="mt-8 app__page-heading">
            {{ $t('register-title') }}
          </h2>
        </div>

        <div v-if="showForm">
          <RegisterForm
            :registration-type="registrationType"
            @success="handleRegistrationSuccess"
          />

          <hr class="or" />

          <div class="flex mt-10">
            <a :href="GOOGLE_LOGIN_URL" class="w-full btn--light m-1">Google</a>
          </div>

          <!-- <div class="flex mt-10">
            <button
              v-if="registrationType !== OtpAuthAction.MAGIC_LINK_REGISTRATION"
              type="button"
              class="w-full btn--light m-1"
              @click="handleShowHide(OtpAuthAction.MAGIC_LINK_REGISTRATION)"
            >
              {{ $t('magic-link') }}
            </button>
          </div>
          <div class="p-1">
            <button
              v-if="showEmailPassBtn"
              type="button"
              class="w-full btn--light"
              @click="handleShowHide(OtpAuthAction.EMAIL_PASS_REGISTRATION)"
            >
              {{ $t('email-and-password') }}
            </button>
          </div> -->
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
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import image from '@/assets/images/laptop.webp'
import AppIcon from '@/components/App/AppIcon.vue'

const showForm: Ref<boolean> = ref(true)

const registrationType = ref(OtpAuthAction.EMAIL_PASS_REGISTRATION)

const handleRegistrationSuccess = () => {
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
  content: 'or sign up with';
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
