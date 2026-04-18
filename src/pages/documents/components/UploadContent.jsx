import { Box, Button, IconButton, Typography } from "@mui/material";

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L5 15M5 5l10 10" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { useForm, Controller } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { documentAdd } from "../../../api/queries/post";
import { updateDocument } from "../../../api/queries/put";
import { useAppMutation } from "../../../hooks/useMutation";
import { useLocale } from "../../../hooks/useLocale";

// Upload cloud icon as SVG to match Figma exactly
const UploadCloudIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.667 26.667L20 20l-6.667 6.667M20 20v15"
      stroke="#9F9F9F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.983 30.65A8.333 8.333 0 0 0 30 15h-2.1A13.333 13.333 0 1 0 5 27.383"
      stroke="#9F9F9F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.667 26.667L20 20l-6.667 6.667"
      stroke="#9F9F9F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  boxSizing: "border-box",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "#101828",
  outline: "none",
  transition: "border-color 0.2s",
  backgroundColor: "#fff",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#344054",
  marginBottom: "6px",
  display: "block",
};

const UploadContent = ({ closeSet, editingDoc }) => {


  const { t } = useLocale();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
      title: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (editingDoc) {
      reset({
        title: editingDoc.title,
        description: editingDoc.description,
      });
    }
  }, [editingDoc, reset]);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addMutation = useAppMutation({
    mutationFn: documentAdd,
    queryKey: ["documents"],
    onSuccess: () => {
      closeSet();
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: updateDocument,
    queryKey: ["documents"],
    onSuccess: () => {
      closeSet();
    },
  });

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = [
      "jpg", "jpeg", "png", "txt", "pdf",
      "xls", "xlsx", "doc", "docx",
    ];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert(t("documents.upload.unsupported"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t("documents.upload.maxSize"));
      return;
    }

    setSelectedFile(file);
  };

  const submitHandler = async (data) => {
    try {
      let uploadedFile = editingDoc?.file || "";
      let fileExtension = editingDoc?.file_type?.toLowerCase() || "";

      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("files", selectedFile);

        const uploadResponse = await fetch(
          "http://194.156.117.223:8004/yerinde/storage-service/documents/upload-file",
          { method: "POST", body: formData }
        );

        if (!uploadResponse.ok) throw new Error(t("documents.upload.uploadFailed"));

        const resData = await uploadResponse.json();

        if (!resData.status || !resData.data?.content?.length) {
          throw new Error(resData.message || t("common.error"));
        }
        uploadedFile = resData.data;
        fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      } else if (!editingDoc) {
        alert(t("documents.upload.selectFileReq"));
        return;
      }

      const payload = {
        title: data.title,
        description: data.description,
        file: uploadedFile,
        file_type: fileExtension.toUpperCase(),
        ...(editingDoc && { id: editingDoc.id }),
      };

      if (editingDoc) {
        updateMutation.mutate(payload);
      } else {
        addMutation.mutate(payload);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(t("documents.upload.uploadErr") + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 896,
        borderRadius: "12px",
        background: "#FFFFFF",
        boxShadow: "0px 25px 50px -12px #00000040",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 65,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "24px",
          borderBottom: "1px solid #9F9F9F33",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#101828",
            lineHeight: 1,
          }}
        >
          {editingDoc ? t("documents.editDoc") || "Edit Document" : t("documents.uploadDoc")}
        </Typography>
        <IconButton
          onClick={closeSet}
          size="small"
          sx={{
            color: "#667085",
            p: "6px",
            "&:hover": { backgroundColor: "#F2F4F7" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: "24px", pt: "24px", pb: "24px", flex: 1 }}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Box mb="20px">
                <label style={labelStyle}>{t("documents.upload.title")}</label>
                <input
                  {...field}
                  required
                  placeholder={t("documents.upload.titlePlaceholder")}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1C2D4A")}
                  onBlur={(e) => (e.target.style.borderColor = "#D0D5DD")}
                />
              </Box>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Box mb="20px">
                <label style={labelStyle}>{t("documents.upload.desc")}</label>
                <textarea
                  {...field}
                  rows={3}
                  placeholder={t("documents.upload.descPlaceholder")}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: "1.5",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1C2D4A")}
                  onBlur={(e) => (e.target.style.borderColor = "#D0D5DD")}
                />
              </Box>
            )}
          />

          <label style={labelStyle}>{t("documents.upload.uploadFile")}</label>

          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
            sx={{
              width: "100%",
              height: 148,
              borderRadius: "8px",
              border: "2px dashed",
              borderColor: dragOver ? "#1C2D4A" : "#9F9F9F99",
              backgroundImage: dragOver
                ? "none"
                : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: dragOver ? "#F5F7FA" : "#FAFAFA",
              transition: "background-color 0.2s, border-color 0.2s",
              mb: "24px",
              gap: "8px",
            }}
          >
            <UploadCloudIcon />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: selectedFile ? "#101828" : "#344054",
                mt: "4px",
              }}
            >
              {selectedFile ? selectedFile.name : t("documents.upload.dropzone")}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#9F9F9F",
              }}
            >
              {t("documents.upload.fileInfo")}
            </Typography>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: "none" }}
              accept=".jpg,.jpeg,.png,.txt,.pdf,.xls,.xlsx,.doc,.docx"
            />

            {editingDoc?.title}
          </Box>

          <Box display="flex" justifyContent="flex-end" gap="12px">
            <Button
              variant="outlined"
              onClick={closeSet}
              sx={{
                height: 40,
                px: "16px",
                borderRadius: "8px",
                border: "1px solid #D0D5DD",
                color: "#344054",
                fontSize: "14px",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #D0D5DD",
                },
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addMutation.isPending || updateMutation.isPending || isUploading}
              sx={{
                height: 40,
                px: "16px",
                borderRadius: "8px",
                backgroundColor: "#1C2D4A",
                fontSize: "14px",
                fontWeight: 500,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#162438",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#1C2D4A99",
                  color: "#fff",
                },
              }}
            >
              {isUploading
                ? t("documents.upload.uploading")
                : editingDoc
                  ? t("common.save")
                  : t("documents.uploadDoc")}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UploadContent;