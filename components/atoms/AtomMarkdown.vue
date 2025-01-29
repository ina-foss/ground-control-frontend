<template>
  <div v-safe-html="parsedMarkdown" class="markdown-content"></div>

</template>

<script>
import md from "@/utils/markdown";

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

<style>
.markdown-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}
.markdown-content p {
  line-height: 1.6;
  color: #555;
}
.markdown-content a {
  color: #007bff;
  text-decoration: none;
}
.markdown-content a:hover {
  text-decoration: underline;
}
</style>
