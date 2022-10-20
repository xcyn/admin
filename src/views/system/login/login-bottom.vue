<template>
  <div class="login-bottom-container">
    <div class="copyright">
      2016-2021 ®<a href="http://www.bpmhome.cn" target="_blank" rel="noopener noreferrer">{{ companyName }}</a>-{{ $t('common.copyright') }}
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        companyName: process.env.VUE_APP_COMPANY
      }
    }
  }
</script>
