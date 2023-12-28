<template>
  <div class="flex p-10">
    <UForm class="w-1/2" :state="state" @submit="onFormSubmit">
      <UFormGroup label="Title" name="title">
        <UInput v-model="state.title" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UInput v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="Body" name="body">
        <UTextarea v-model="state.body" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </UForm>

    <UForm :state="tagsFormState" @submit="onTagFormSubmit">
      <!-- tag list -->
      <UFormGroup label="Tags" name="newTag">
        <UInput v-model="tagsFormState.newTag" placeholder="New tag" />
      </UFormGroup>

      <div class="flex flex-col gap-2">
        <UCheckbox v-for="tag in tagsFormState.tags" v-model="tag.isActive" :label="tag.name" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { createArticle } from '~/services/articles'



const tags: Tag[] = [
  {
    name: "tag1",
    isActive: false,
  },
  {
    name: "tag2",
    isActive: true,
  },
  {
    name: "tag3",
    isActive: false,
  },
]



const state = ref({
  title: '',
  description: '',
  body: '',
});

const tagsFormState = ref<{
  newTag?: string;
  tags: Tag[];
}>({
  newTag: '',
  tags: [],
});


const activeTags = computed(() => tagsFormState.value.tags.filter(tag => tag.isActive).map(tag => tag.name))

function onTagFormSubmit() {
  // make sure input is not empty
  if (tagsFormState.value.newTag) {
    tagsFormState.value.tags = [
      ...tagsFormState.value.tags,
      {
        name: tagsFormState.value.newTag,
        isActive: true,
      },
    ];
  }

  // clear new tag input
  tagsFormState.value.newTag = undefined;
}



onMounted(() => {
  tagsFormState.value.tags = [...tagsFormState.value.tags, ...tags]
})



interface Tag {
  name: string;
  isActive: boolean;
}


const { status, error, execute } = useAsyncData(
  () => createArticle({
    article: {
      ...state.value,
      tagList: activeTags.value,

    }
  }),
  { immediate: false, server: false }

);


async function onFormSubmit() {

  await execute()
}

</script>

<style scoped></style>
