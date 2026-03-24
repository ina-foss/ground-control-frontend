<template>
  <div v-safe-html="parsedMarkdown" class="markdown bg-surface" ></div>
</template>

<script>
import md from "~/utils/markdown";

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    parsedMarkdown() {
      return md.render(this.content);
    },
  },
};
</script>
