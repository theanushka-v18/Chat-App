import {
  Alert,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProfileImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Please select a JPG, PNG, or WEBP image.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds the maximum limit of 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    handleFileChange(selectedFile);
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack gap="md" align="center">
      <UnstyledButton
        onClick={triggerFilePicker}
        aria-label="Upload profile picture"
        style={{
          borderRadius: "50%",
          position: "relative",
        }}
      >
        <Avatar
          src={previewUrl}
          alt="Profile picture preview"
          size={120}
          radius="xl"
          color="gray.4"
        >
          {!previewUrl && "?"}
        </Avatar>
      </UnstyledButton>

      <Text size="sm" c="dimmed" ta="center">
        Tap your avatar to upload
      </Text>
      <Text size="xs" c="dimmed" ta="center">
        JPG, PNG or WEBP (max 5MB)
      </Text>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleInputChange}
      />

      {error && (
        <Alert color="red" title="Invalid image" role="alert" w="100%">
          {error}
        </Alert>
      )}

      {file && (
        <Group justify="space-between" w="100%">
          <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
            {file.name}
          </Text>

          <Button variant="light" color="red" onClick={handleRemoveFile}>
            Remove
          </Button>
        </Group>
      )}
    </Stack>
  );
};

export default ProfileImageUpload;
