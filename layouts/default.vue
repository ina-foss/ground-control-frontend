<template >
    <div class="bg-gray-50 min-h-screen "> 
        <Header />
        <slot  />
    </div>
</template>

<script setup lang="ts" >
import { OpenAPI } from '../api/generate/core/OpenAPI';
import { useService } from '../composables/useService';
    
    

    const service = useService()
    
    OpenAPI.HEADERS = service.$application.getDefaultHeader()
    console.log(service.$application.getDefaultHeader())
    console.log(OpenAPI)

</script>


