<template>
  <transition name="fade">
    <div v-if="isShow" @click="handleClickOverlay" class="vc-overlay" id="vueConfirm">
      <transition name="zoom">
        <div v-if="isShow" ref="vueConfirmDialog" class="vc-container">
          <span class="vc-text-grid">
            <h4 v-if="dialog.title" class="vc-title" v-html="dialog.title"></h4>
            <p v-if="dialog.message" class="vc-text" v-html="dialog.message"></p>
            <span v-if="dialog.auth">
              <input
                  v-focus
                  v-model="password"
                  @keyup.prevent="e => handleClickButton(e, true)"
                  class="vc-input"
                  type="password"
                  name="vc-password"
                  placeholder="Password"
                  autocomplete="off"
              />
            </span>
          </span>
          <div :class="['vc-btn-grid', { isMono: !dialog.button.no || !dialog.button.yes }]">
            <button
                v-if="dialog.button.no"
                @click.stop="e => handleClickButton(e, false)"
                class="vc-btn left"
                type="button"
            >
              {{ dialog.button.no }}
            </button>

            <button
                v-if="dialog.button.yes"
                :disabled="dialog.auth ? !password : false"
                @click.stop="e => handleClickButton(e, true)"
                class="vc-btn"
                type="button"
            >
              {{ dialog.button.yes }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import event from '../event';
const isShow = ref(false);
const password = ref(null);
const dialog = ref({
  auth: false,
  title: '',
  message: '',
  button: {}
});
const params = ref({});

const resetState = () => {
  password.value = null;
  dialog.value = {
    auth: false,
    title: '',
    message: '',
    button: {},
    callback: () => {}
  };
};

const handleClickButton = ({ target }, confirm) => {
  if (target.id === 'vueConfirm') return;
  if (confirm && dialog.value.auth && !password.value) return;
  isShow.value = false;
  if (params.value.callback) {
    params.value.callback(confirm, password.value);
  }
};

const handleClickOverlay = ({ target }) => {
  if (target.id === 'vueConfirm') {
    isShow.value = false;
    if (params.value.callback) {
      params.value.callback(false, password.value);
    }
  }
};

const open = (params) => {
  resetState();
  params.value = params;
  isShow.value = true;
  // set params to dialog state
  Object.entries(params).forEach((param) => {
    if (typeof param[1] === typeof dialog.value[param[0]]) {
      dialog.value[param[0]] = param[1];
    }
  });
};

onMounted(() => {
  event.on('open', (params) => {
    open(params);
  });
  event.on('close', () => {
    handleClickOverlay({ target: { id: 'vueConfirm' } });
  });
});
</script>

<style lang="scss">
:root {
  --title-color: black;
  --message-color: black;
  --overlay-background-color: #0000004a;
  --container-box-shadow: #0000004a 0px 3px 8px 0px;
  --base-background-color: #ffffff;
  --button-color: #4083ff;
  --button-background-color: #ffffff;
  --button-border-color: #e0e0e0;
  --button-background-color-disabled: #f5f5f5;
  --button-background-color-hover: #f5f5f5;
  --button-box-shadow-active: inset 0 2px 0px 0px #00000014;
  --input-background-color: #ebebeb;
  --input-background-color-hover: #dfdfdf;
  --font-size-m: 16px;
  --font-size-s: 14px;
  --font-weight-black: 900;
  --font-weight-bold: 700;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --font-weight-light: 300;
}
/**
* Dialog
*/
.vc-overlay *,
.vc-overlay *:before,
.vc-overlay *:after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-decoration: none;
  -webkit-touch-callout: none;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
.vc-title {
  color: var(--title-color);
  padding: 0 1rem;
  width: 100%;
  font-weight: var(--font-weight-black);
  text-align: center;
  font-size: var(--font-size-m);
  line-height: initial;
  margin-bottom: 5px;
}
.vc-text {
  color: var(--message-color);
  padding: 0 1rem;
  width: 100%;
  font-weight: var(--font-weight-medium);
  text-align: center;
  font-size: var(--font-size-s);
  line-height: initial;
}
.vc-overlay {
  background-color: var(--overlay-background-color);
  width: 100%;
  height: 100%;
  transition: all 0.1s ease-in;
  left: 0;
  top: 0;
  z-index: 999999999999;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: baseline;
}
.vc-container {
  background-color: var(--base-background-color);
  border-radius: 1rem;
  width: 286px;
  height: auto;
  display: grid;
  grid-template-rows: 1fr max-content;
  box-shadow: var(--container-box-shadow);
}
.vc-text-grid {
  padding: 1rem;
}
.vc-btn-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 0 0 1rem 1rem;
  overflow: hidden;
}
.vc-btn-grid.isMono {
  grid-template-columns: 1fr;
}
.vc-btn {
  border-radius: 0 0 1rem 0;
  color: var(--button-color);
  background-color: var(--button-background-color);
  border: 0;
  font-size: 1rem;
  border-top: 1px solid var(--button-border-color);
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  outline: none;
  min-height: 50px;
}
.vc-btn:hover {
  background-color: var(--button-background-color-hover);
}
.vc-btn:disabled {
  background-color: var(--button-background-color-disabled);
}
.vc-btn:active {
  box-shadow: var(--button-box-shadow-active);
}
.vc-btn.left {
  border-radius: 0;
  border-right: 1px solid var(--button-border-color);
}
.vc-input[type='password'] {
  width: 100%;
  outline: none;
  border-radius: 8px;
  height: 35px;
  border: 0;
  margin: 5px 0;
  background-color: var(--input-background-color);
  padding: 0 0.5rem;
  font-size: var(--font-size-m);
  transition: 0.21s ease;
}
.vc-input[type='password']:hover,
.vc-input[type='password']:focus {
  background-color: var(--input-background-color-hover);
}
/**
* Transition
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.21s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.21s;
  animation-fill-mode: both;
  animation-name: zoom;
}
.zoom-leave-active {
  animation-direction: reverse;
}
@keyframes zoom {
  from {
    opacity: 0;
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
</style>
