import { setGlobalConfig } from '@storybook/testing-vue';

// Storybook's preview file location
import * as globalStorybookConfig from './.storybook/preview';

setGlobalConfig(globalStorybookConfig);
