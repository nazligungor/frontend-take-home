import React from "react";
import { Table, IconButton, Text } from "@radix-ui/themes";
import { DropdownMenu } from "radix-ui";
import { Role } from "../../server/src/models";
import { formatDate } from "./apiUtils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export const RolesTable = ({
  roles,
  rolesLoading,
  onEditRole,
}: {
  roles: Role[];
  rolesLoading: boolean;
  onEditRole: (id: string) => void;
}) => {
  return (
    <Table.Root variant="surface" size="2" className="TextField">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell style={{ width: "20%" }}>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: "60%" }}>Description</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: "20%" }}>Created At</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rolesLoading && (
          <Table.Row>
            <Table.Cell colSpan={2}>
              <Text align="center" size="2" color="gray">
                Loading...
              </Text>
            </Table.Cell>
          </Table.Row>
        )}

        {roles.length > 0 &&
          !rolesLoading &&
          roles.map((role) => (
            <Table.Row>
              <Table.Cell>{role.name}</Table.Cell>
              <Table.Cell>{role.description}</Table.Cell>
              <Table.Cell>{formatDate(role.createdAt)}</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <IconButton variant="ghost" size="1" radius="full">
                      <DotsHorizontalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content sideOffset={5} className="DropdownMenuContent">
                    <DropdownMenu.Item
                      className="DropdownMenuItem"
                      onSelect={() => onEditRole(role.id)}
                    >
                      Edit role
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="DropdownMenuItem"
                      onSelect={() => console.log(role.id)}
                    >
                      Delete role
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
