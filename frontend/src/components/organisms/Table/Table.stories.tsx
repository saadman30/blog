import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Table, { type TableProps } from "./Table";

const meta = {
  title: "Organisms/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    header: { control: false },
    body: { control: false },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const basicHeader: TableProps["header"] = (
  <tr>
    <th>Title</th>
    <th>Status</th>
    <th>Last updated</th>
  </tr>
);

const basicBody: TableProps["body"] = (
  <>
    <tr>
      <td>Designing a calm writing workflow</td>
      <td>Draft</td>
      <td>Just now</td>
    </tr>
    <tr>
      <td>Shipping tiny improvements</td>
      <td>Published</td>
      <td>1 day ago</td>
    </tr>
  </>
);

export const Default: Story = {
  args: {
    header: basicHeader,
    body: basicBody,
    "aria-label": "Posts table",
  },
};

export const EmptyBody: Story = {
  args: {
    header: basicHeader,
    body: null,
    "aria-label": "Empty posts table",
  },
};

