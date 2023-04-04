<template>
  <div
    style="
      background-color: var(--color-background-soft);
      border-radius: var(--border-radius);
      padding: 0.8rem 1.4rem;
      margin-bottom: 1rem;
    ">
    <n-spin :show="loading">
      <div style="margin-bottom: 0.6rem; display: flex; align-items: center">
        <h3 style="font-weight: 700; padding-right: 1rem">Period {{ periodN }}</h3>
        <n-button
          size="small"
          type="error"
          @click="deletePeriod(periodN)"
          style="margin-right: 1rem"
          >Delete Period</n-button
        >
        <n-button size="small" type="success" @click="newArticle()">Add News Article</n-button>
      </div>
      <div
        v-for="(article, i) in articles"
        :key="article.created"
        style="
          max-width: 300px;
          background-color: var(--color-background-mute);
          border-radius: var(--border-radius);
          margin-bottom: 0.5rem;
        ">
        <n-spin :show="deleteloading[i]">
          <div style="padding: 1rem; padding-bottom: 0.5rem">
            <n-spin :show="fileloading[i]">
              <div
                style="width: 100%; aspect-ratio: 3/2; position: relative; margin-bottom: 0.5rem">
                <img
                  :src="formatStorageUrl(article.image)"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: var(--border-radius-inset1);
                  " />
                <n-button
                  size="small"
                  style="position: absolute; bottom: 0.8rem; right: 0.5rem"
                  type="success"
                  @click="editImage(i)"
                  >edit</n-button
                >
              </div>
              <input
                type="file"
                style="display: none"
                :id="`file-input-${periodN}-${i}`"
                accept="image/*"
                @change="(e) => fileChanged(i, e)" />
            </n-spin>
            <n-input :default-value="article.headline" @input="(e) => headlineUpdated(i, e)" />
            <div></div>
          </div>
          <div
            style="
              padding: 0.5rem 1rem 0.5rem 1rem;
              border-top: 1px solid #555;
              display: flex;
              justify-content: flex-end;
            ">
            <n-button
              type="error"
              size="small"
              @click="(e) => deleteArticle(i, e)"
              :disabled="false"
              >delete</n-button
            >
          </div>
        </n-spin>
      </div></n-spin
    >
  </div>
</template>

<script>
import { formatStorageUrl, uploadFile } from '../utils/storage';
import { v4 as uuidV4 } from 'uuid';
export default {
  props: ['periodData', 'periodN', 'updateArticle', 'addArticle', 'removeArticle', 'removePeriod'],
  data() {
    return {
      articles: this.periodData.articles,
      fileloading: new Array(this.periodData.articles.length).fill(false),
      deleteloading: new Array(this.periodData.articles.length).fill(false),
      loading: false,
    };
  },
  methods: {
    async deletePeriod() {
      this.loading = true;
      await this.removePeriod(this.periodN);
      this.loading = false;
    },
    async deleteArticle(i, e) {
      this.deleteloading[i] = true;
      this.removeArticle(this.periodN, i);
      this.deleteloading.splice(i, 1);
      this.fileloading.splice(i, 1);
    },
    async fileChanged(i, e) {
      console.log(e);
      this.fileloading[i] = true;
      const f = e.target.files[0];
      const fext = f.name.split('.');
      const ext = fext[fext.length - 1];
      const newFile = await uploadFile(f, `newsImages/${uuidV4()}.${ext}`);
      await this.updateArticle(this.periodN, i, newFile.metadata.fullPath, true);
      this.fileloading[i] = false;
    },
    editImage(i) {
      const fileInput = document.getElementById(`file-input-${this.periodN}-${i}`);
      fileInput.click();
    },
    formatStorageUrl,
    headlineUpdated(i, e) {
      this.updateArticle(this.periodN, i, e, false);
    },
    newArticle() {
      this.addArticle(this.periodN);
      this.fileloading.push(false);
      this.deleteloading.push(false);
    },
  },
};
</script>
