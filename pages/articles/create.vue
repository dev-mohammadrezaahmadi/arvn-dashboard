<template>
  <h1 class="px-5 py-5 text-5xl capitalize text-start font-bold">new aritcle</h1>
  <div class="px-5 py-5 flex gap-6">
    <UForm class="flex w-2/3 flex-col gap-6"  :state="state" @submit="onFormSubmit">
      <UFormGroup label="Title" name="title">
        <UInput placeholder="Title" size="xl" v-model="state.title" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UInput placeholder="Description" size="xl" v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="Body" name="body">
        <UTextarea v-model="state.body" />
      </UFormGroup>

      <UButton :loading="createArticleStatus === 'pending'" class="w-fit" size="xl" color="blue" type="submit" label="Submit" />
    </UForm>

    <UForm class="w-1/3" :state="state" @submit="onTagFormSubmit">
      <!-- tag list -->
      <UFormGroup label="Tags" name="newTag">
        <UInput size="xl" v-model="tagsFormState.newTag" placeholder="New tag" />
      </UFormGroup>


      <div class="flex flex-col gap-2 mt-6">
        <UCheckbox
          v-for="tag in sortedTags"
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

const toast = useToast()
const router = useRouter()

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

const { status: createArticleStatus, error, execute } = useAsyncData(
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
  if (createArticleStatus.value === "pending") {
  } else if (createArticleStatus.value === "error") {
    toast.add({
      title: error.value?.cause as string,
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } else if (createArticleStatus.value === "success") {
    toast.add({
      title: "Article created successfuly",
      color: "green",
      icon: "i-heroicons-check-solid",
    });
    router.push("/");
  }
}
</script>

<style scoped></style>
