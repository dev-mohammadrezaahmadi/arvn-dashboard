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

    <UForm :state="state" @submit="onTagFormSubmit">
      <!-- tag list -->
      <UFormGroup label="Tags" name="newTag">
        <UInput v-model="tagsFormState.newTag" placeholder="New tag" />
      </UFormGroup>


      <div class="flex flex-col gap-2">
        <UCheckbox
          v-for="tag in state.tagList"
          v-model="tag.isActive"
          :label="tag.name"
        />
      </div>
    </UForm>

  </div>
</template>

<script setup lang="ts">
import { createArticle, getTags } from "~/services/articles";
interface Tag {
  name: string;
  isActive: boolean;
}

const state = ref<{
  title: string;
  description: string;
  body: string;
  tagList: Tag[];
}>({
  title: "",
  description: "",
  body: "",
  tagList: [],
});

const tagsFormState = ref<{
  newTag: string;
}>({
  newTag: "",
});

const activeTags = computed(() =>
  state.value.tagList.filter((tag) => tag.isActive)
);

function onTagFormSubmit() {
  // make sure input is not empty
  if (tagsFormState.value.newTag === "") {
    return;
  }

  state.value.tagList.push({
    name: tagsFormState.value.newTag,
    isActive: true,
  });

  // clear new tag input
  tagsFormState.value.newTag = "";
}

// get initial tags
const { data } = await useAsyncData(() => getTags());
if (data.value) {
  // state.value.tagList = data.value.tags
  state.value.tagList = [
    ...state.value.tagList,
    ...data.value.tags.map((tag) => ({ name: tag, isActive: true })),
  ];
}
const sortedTags = computed(() => {
  return state.value.tagList.sort((a, b) => a.name.localeCompare(b.name));
});

const { status, error, execute } = useAsyncData(
  () =>
    createArticle({
      article: {
        ...state.value,
        tagList: activeTags.value.map((tag) => tag.name),
      },
    }),
  { immediate: false, server: false }
);

async function onFormSubmit() {
  await execute();
}
</script>

<style scoped></style>
