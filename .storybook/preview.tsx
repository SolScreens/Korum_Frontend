import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import '../src/index.css';

const preview: Preview = {
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
