import type { Preview } from '@storybook/react-vite'
import '@asnewyla/tokens/tokens.css';
import '@asnewyla/button/styles.css';
import '@asnewyla/image/styles.css';
import '@asnewyla/layout/styles.css';
import '@asnewyla/input/styles.css';
import '@asnewyla/form/styles.css';
import '@asnewyla/card/styles.css';
import '@asnewyla/checkbox/styles.css';
import '@asnewyla/radio/styles.css';
import '@asnewyla/select/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;