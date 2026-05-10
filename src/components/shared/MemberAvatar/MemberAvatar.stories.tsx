import type { Meta, StoryObj } from '@storybook/react';
import MemberAvatar from './MemberAvatar';

const meta = {
  title: 'Shared/MemberAvatar',
  component: MemberAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MemberAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const user = { display_name: 'Sarah Johnson', avatar_url: null };
const shortUser = { display_name: 'Ali', avatar_url: null };
const longUser = { display_name: 'Bartholomew Kingstonville', avatar_url: null };

export const Medium: Story = { args: { user, size: 'md' } };
export const Small: Story = { args: { user, size: 'sm' } };
export const Large: Story = { args: { user, size: 'lg' } };
export const SingleName: Story = { args: { user: shortUser, size: 'md' } };
export const LongName: Story = { args: { user: longUser, size: 'md' } };
