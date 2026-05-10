import type { Meta, StoryObj } from '@storybook/react';
import StatusBadge from './StatusBadge';

const meta = {
  title: 'Rooms/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collecting: Story = { args: { status: 'collecting' } };
export const Swiping: Story = { args: { status: 'swiping' } };
export const Done: Story = { args: { status: 'done' } };
