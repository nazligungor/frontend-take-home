import React, { useState } from "react";
import { Button, Dialog, Text, TextField, Flex } from "@radix-ui/themes";
import { updateRoleName } from "./apiUtils";

export const EditRoleDialog = ({
  roleId,
  open,
  onOpenChange,
  onEditRoleSuccess,
}: {
  roleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditRoleSuccess: () => void;
}) => {
  const [newName, setNewName] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewName(value);
  };

  const handleRoleUpdate = async () => {
    const success = await updateRoleName(roleId, newName);
    if (success) {
      onEditRoleSuccess();
      setNewName("");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit Role</Dialog.Title>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              defaultValue=""
              placeholder="Enter role name"
              value={newName}
              onChange={handleChange}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={onOpenChange}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleRoleUpdate}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
