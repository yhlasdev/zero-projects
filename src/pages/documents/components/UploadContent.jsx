import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import { documentAdd } from "../../../api/queries/post";
import { useAppMutation } from "../../../hooks/useMutation";

const UploadContent = ({ closeSet }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: "",
      title: "",
    },
    mode: "onSubmit",
  });

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const mutation = useAppMutation({
    mutationFn: documentAdd,
    queryKey: ["documents"],
    onSuccess: () => {
      closeSet();
    },
  });

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = [
      "jpg",
      "jpeg",
      "png",
      "txt",
      "pdf",
      "xls",
      "xlsx",
      "doc",
      "docx",
    ];
    const fileExtension = file.name.split(".").pop().toUpperCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert("Unsupported file format");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const submitHandler = async (data) => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", selectedFile);
    formData.append("file_type", fileExtension.toUpperCase()); 

    mutation.mutate(formData);
  };

  return (
    <Box p={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Upload Document</Typography>
        <IconButton onClick={closeSet}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(submitHandler)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Box mb={2}>
              <Typography mb={1}>Document Title</Typography>
              <input
                {...field}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </Box>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Box mb={2}>
              <Typography mb={1}>Description</Typography>
              <textarea
                {...field}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </Box>
          )}
        />

        <Box
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileChange(e.dataTransfer.files[0]);
          }}
          sx={{
            border: "2px dashed #d0d5dd",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#fafafa",
            mb: 3,
            "&:hover": { backgroundColor: "#f0f4f8" },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: "#98a2b3" }} />
          <Typography mt={1} fontWeight={500}>
            {selectedFile
              ? selectedFile.name
              : "Click to upload or drag and drop"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            JPG, JPEG, PNG, TXT, PDF, XLS, XLSX, DOC, DOCX (max. 10MB)
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files[0])}
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png,.txt,.pdf,.xls,.xlsx,.doc,.docx"
          />
        </Box>

        <Box display="flex" justifyContent="end" gap={2}>
          <Button variant="outlined" onClick={closeSet}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
          >
            Upload Document
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UploadContent;
