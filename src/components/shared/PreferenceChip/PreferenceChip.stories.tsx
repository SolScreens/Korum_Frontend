import type { Meta, StoryObj } from '@storybook/react';
import PreferenceChip from './PreferenceChip';

const meta = {
  title: 'Shared/PreferenceChip',
  component: PreferenceChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onToggle: () => {} },
} satisfies Meta<typeof PreferenceChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = { args: { label: 'Action', selected: false } };
export const Selected: Story = { args: { label: 'Action', selected: true } };
export const LongLabel: Story = { args: { label: 'Edge of my seat', selected: false } };
export const LongLabelSelected: Story = { args: { label: 'Edge of my seat', selected: true } };
