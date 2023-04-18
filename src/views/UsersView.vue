<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    ">
    <h1>Manage Users</h1>
    <n-button @click="createUserOpen = true" type="success" secondary
      >New User
      <template #icon>
        <n-icon>
          <add-icon />
        </n-icon> </template
    ></n-button>
  </div>
  <n-space vertical v-if="admins.length > 0">
    <div
      v-for="admin in admins"
      :key="admin.uid"
      style="
        background-color: var(--color-background-soft);
        border: 2px solid var(--color-background-mute);
        border-radius: var(--border-radius);
        padding: 0.5rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
      <h3 style="padding-bottom: 0.2rem">{{ admin.email }}</h3>
      <n-button
        secondary
        circle
        type="error"
        @click="deleteUser(admin.uid)"
        :disabled="admin.uid == forceUser().uid || loadingUIDs[admin.uid]"
        :loading="loadingUIDs[admin.uid]">
        <template #icon>
          <n-icon><bin-icon /></n-icon> </template
      ></n-button>
    </div>
  </n-space>
  <n-space vertical v-else class="fadeOut">
    <n-skeleton
      height="54px"
      width="100%"
      style="border-radius: var(--border-radius)"
      v-for="i in Array.from(Array(4).keys())" />
  </n-space>

  <modal :show="createUserOpen">
    <h1 style="font-weight: 700; padding-bottom: 1rem">New User</h1>
    <span class="inputLabel"
      >Email
      <span class="errorLabel" v-if="!validateEmail(newEmail) && validateNewEmail"
        >*invalid</span
      ></span
    >
    <n-input
      size="large"
      placeholder="Email"
      class="bpad"
      v-model:value="newEmail"
      @blur="validateNewEmail = true"
      :status="newEmail == '' && validateNewEmail ? 'error' : ''" />
    <span class="inputLabel"
      >Password
      <span class="errorLabel" v-if="newPassword.length < 8 && validateNewPassword"
        >*at least 8 characters</span
      ></span
    >
    <n-input
      size="large"
      type="password"
      show-password-on="mousedown"
      placeholder="Password"
      class="bpad"
      v-model:value="newPassword"
      @blur="validateNewPassword = true"
      :status="newPassword.length < 8 && validateNewPassword ? 'error' : ''" />
    <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 1rem">
      <n-button secondary type="error" @click="createUserOpen = false">
        <template #icon>
          <n-icon>
            <close-icon />
          </n-icon>
        </template>
        Cancel
      </n-button>
      <n-button
        type="success"
        style="margin-left: 1rem"
        @click="createUser()"
        :disabled="!formValid || loading"
        :loading="loading">
        <template #icon>
          <n-icon>
            <checkmark-icon />
          </n-icon>
        </template>
        Create
      </n-button>
    </div></modal
  >
</template>

<script>
import {
  Add as AddIcon,
  Checkmark as CheckmarkIcon,
  Close as CloseIcon,
  TrashBinOutline as BinIcon,
} from '@vicons/ionicons5';
import { getFn } from '../utils/functions';
import { forceUser } from '../utils/auth';
import _ from 'lodash';

export default {
  data() {
    return {
      newEmail: '',
      validateNewEmail: false,
      newPassword: '',
      validateNewPassword: false,
      createUserOpen: false,
      loading: false,
      admins: [],
      loadingUIDs: {},
      forceUser,
    };
  },
  computed: {
    formValid() {
      return this.validateEmail(this.newEmail) && this.newPassword.length >= 8;
    },
  },
  beforeMount() {
    this.listAdmins();
  },
  methods: {
    safeGet(obj, path, defaultValue) {
      return _.get(obj, path, defaultValue);
    },
    async deleteUser(uid) {
      this.loadingUIDs[uid] = true;
      const deleteAdmin = getFn('deleteUser');
      await deleteAdmin({ uid });
      this.listAdmins();
      delete this.loadingUIDs[uid];
    },
    async listAdmins() {
      const getAdmins = getFn('listAdmins');
      const admins = await getAdmins();
      this.admins = admins.data;
    },
    async createUser() {
      this.loading = true;
      const create = getFn('createAdmin');
      await create({ email: this.newEmail, password: this.newPassword });
      this.createUserOpen = false;
      this.newEmail = '';
      this.newPassword = '';
      this.validateNewEmail = false;
      this.validateNewPassword = false;
      this.loading = false;
      this.listAdmins();
    },
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
  },
  components: {
    CheckmarkIcon,
    CloseIcon,
    AddIcon,
    BinIcon,
  },
};
</script>
