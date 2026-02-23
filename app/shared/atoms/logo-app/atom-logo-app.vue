<!-- The size of the logo will be determined by the sizeInPx computed property -->
<template>
  <div
    class="h-[--size]"
    :style="`--size:${sizeHeight}`"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 9 14"
    >
      <g>
        <g>
          <path
            fill="#0686b1"
            d="M6.36.8L.81 13.4h2.298L8.658.8z"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" src="./atom-logo-app.component.ts" />
