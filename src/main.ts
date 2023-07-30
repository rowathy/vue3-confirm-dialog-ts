import { type App, type Component } from 'vue';
import ConfirmDialogBox from './components/ConfirmDialogBox.vue';
import event from './event';

interface ConfirmDialogOption {
  callback?: (confirmed: boolean, password?: string) => void;
  // Add any other option properties you need here
}

interface ConfirmDialogFunction {
  (params: ConfirmDialogOption): void;
}

interface ConfirmDialogPlugin extends ConfirmDialogFunction {
  close: () => void;
}

const confirmDialogPlugin: ConfirmDialogPlugin = (params: ConfirmDialogOption) => {
  // Your confirm logic here

  // The close method is available on the confirm function
  confirmDialogPlugin.close = () => {
    // Implementation of the close method
    event.emit('close');
  };
};

confirmDialogPlugin.close = () => {
  // Implementation of the close method
  event.emit('close');
};

const dialogPlugin = {
  installed: false,
  params: {},

  install: (app: App, args: any = {}) => {
    if (dialogPlugin.installed) return;

    dialogPlugin.installed = true;
    dialogPlugin.params = args;

    app.component(
      args.componentName || 'vue3-confirm-dialog',
      ConfirmDialogBox.vue as Component
    );

    // Register the confirmDialog method on app.config.globalProperties
    app.config.globalProperties.confirmDialog = confirmDialogPlugin;

    // Also register the confirmDialog method directly on the app instance
    app.config.globalProperties.confirmDialog = confirmDialogPlugin;
  },
};

export default dialogPlugin;
