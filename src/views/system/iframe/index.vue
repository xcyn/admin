<template>
  <ibps-container-frame :src="src" />
</template>
<script>
import { transformUrl } from '@/utils/url'

export default {
  computed: {
    src() {
      return transformUrl(this.$route.meta.defaultUrl)
    }
  }
}
</script>
