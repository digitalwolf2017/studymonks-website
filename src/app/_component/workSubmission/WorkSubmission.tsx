"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./WorkSubmission.module.scss";
import Image from "next/image";
import { usePost } from "@/utilities/api";
import AWS from "aws-sdk";
import { toast } from "react-toastify";
import { BUCKET, CDN_BASE_URL, IDENTITY_POOL_ID } from "@/models/base";

// --- Types ---
interface UploadedItem {
  file: File;
  previewUrl: string;
  s3Url?: string;
  uploadProgress: number;
  isUploaded: boolean;
}

export interface WorkSubmissionProps {
  workId: number;
  meetingId: number;
  title: string;
  type: 1 | 2; // 1 = Class Work, 2 = Home Work
  pdfBase64?: string | null; // The encoded PDF string
  subTitle?: string;
}

// Custom Hook for Submission
const useSubmitHomeWork = () => {
  return usePost<any, Error, any>("api/v1/submit-homework");
};

export default function WorkSubmission({
  workId,
  meetingId,
  title,
  type,
  pdfBase64,
  subTitle,
}: WorkSubmissionProps) {
  // --- State ---
  const [files, setFiles] = useState<UploadedItem[]>([]);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);

  // PDF Viewer State
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // API Mutation
  const { mutate: submitHomeWork, isPending: isSubmitting } =
    useSubmitHomeWork();

  // --- SECURITY: Disable Shortcuts & Right Click ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable: Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "p", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
      // Disable: Ctrl+Shift+I (Inspect), F12
      if (
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          e.key.toLowerCase() === "i") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Attach listeners to the specific container or document
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // --- 1. LOAD PDF DOCUMENT ---
  useEffect(() => {
    if (!containerRef.current || activePreview !== null) return;
    if (!pdfBase64 || typeof pdfBase64 !== "string") return;

    const loadPdf = async () => {
      try {
        // @ts-ignore
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");

        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        // Decode base64
        const decoded = atob(pdfBase64).trim();

        let loadingTask;

        // CASE 1: base64 contains a URL (YOUR CASE)
        if (decoded.startsWith("http")) {
          loadingTask = pdfjsLib.getDocument({
            url: decoded,
            withCredentials: false,
          });
        }
        // CASE 2: real base64 PDF (future-proof)
        else {
          const binaryString = decoded;
          const len = binaryString.length;
          const bytes = new Uint8Array(len);

          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          loadingTask = pdfjsLib.getDocument({ data: bytes });
        }

        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setPdfError(null);
      } catch (err) {
        console.error("PDF Load Error:", err);
        setPdfError("Failed to load PDF document.");
      }
    };

    loadPdf();
  }, [pdfBase64, activePreview]);

  // --- 2. RENDER PAGES (LAZY LOADING) ---
  useEffect(() => {
    if (!pdfDoc || !containerRef.current || activePreview !== null) return;

    const container = containerRef.current;
    container.innerHTML = ""; // Clear previous content

    const scale = 1.3; // Matches reference scale
    const observerOptions = {
      root: null, // viewport
      rootMargin: "100px", // pre-load margin
      threshold: 0.1,
    };

    // --- Observer Logic ---
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const canvas = entry.target as HTMLCanvasElement;
          const pageNum = parseInt(canvas.dataset.page || "0", 10);

          if (canvas.dataset.rendered === "true") return; // already rendered

          // Render Page
          pdfDoc.getPage(pageNum).then((page: any) => {
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const context = canvas.getContext("2d");
            if (context) {
              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
              page.render(renderContext);
              canvas.dataset.rendered = "true";
              // Optional: Remove min-height after render to fit exact content
              canvas.style.minHeight = "auto";
            }
          });

          obs.unobserve(canvas); // Stop observing once rendered
        }
      });
    }, observerOptions);

    // --- Create Placeholders ---
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const canvas = document.createElement("canvas");
      canvas.dataset.page = i.toString();

      // Styling matches reference CSS
      canvas.style.display = "block";
      canvas.style.margin = "0 auto 20px auto";
      canvas.style.backgroundColor = "white"; // "background: white"
      canvas.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)"; // "box-shadow"
      canvas.style.minHeight = "400px"; // Placeholder height
      canvas.style.maxWidth = "100%"; // Responsive constraint

      container.appendChild(canvas);
      observer.observe(canvas);
    }

    return () => {
      observer.disconnect();
    };
  }, [pdfDoc, activePreview]);

  // --- AWS UPLOAD LOGIC ---
  const getSanitizedFileName = (originalName: string) => {
    const lastDotIndex = originalName.lastIndexOf(".");
    const ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : "";
    const nameWithoutExt =
      lastDotIndex !== -1
        ? originalName.substring(0, lastDotIndex)
        : originalName;
    const cleanName = nameWithoutExt
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9-_]/g, "");
    return `live_work/${Date.now()}_${cleanName}${ext}`;
  };

  const uploadFileToS3 = async (fileItem: UploadedItem, index: number) => {
    return new Promise<string>((resolve, reject) => {
      AWS.config.update({
        region: "ap-south-1",
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: IDENTITY_POOL_ID,
        }),
      });

      const s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        params: { Bucket: BUCKET },
      });

      const fileName = getSanitizedFileName(fileItem.file.name);

      const upload = s3.upload({
        Bucket: BUCKET,
        Key: fileName,
        Body: fileItem.file,
        ContentType: fileItem.file.type,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setFiles((prev) => {
          const newFiles = [...prev];
          if (newFiles[index]) {
            newFiles[index].uploadProgress = percent;
          }
          return newFiles;
        });
      });

      upload.send((err, data) => {
        if (err) {
          console.error("S3 Upload Error:", err);
          reject(err);
        } else {
          const fileUrl = `${CDN_BASE_URL}/${fileName}`;
          setFiles((prev) => {
            const newFiles = [...prev];
            if (newFiles[index]) {
              newFiles[index].isUploaded = true;
              newFiles[index].s3Url = fileUrl;
            }
            return newFiles;
          });
          resolve(fileUrl);
        }
      });
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadProgress: 0,
      isUploaded: false,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) setActivePreview(newFiles[0].previewUrl);
    e.target.value = "";
  };

  const handleDelete = (index: number) => {
    const fileToDelete = files[index];
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (activePreview === fileToDelete.previewUrl) setActivePreview(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    setIsUploadingGlobal(true);

    try {
      const uploadPromises = files.map(async (item, index) => {
        if (item.isUploaded && item.s3Url) return item.s3Url;
        return await uploadFileToS3(item, index);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const userStr = localStorage.getItem("study_monk_user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user?.id) throw new Error("User not found. Please login.");

      const submissionPromises = uploadedUrls.map((url) => {
        const payload = {
          live_work_id: workId,
          zoom_class_id: meetingId,
          type: type,
          user_id: user.id,
          file: url,
        };
        return submitHomeWork(payload);
      });

      await Promise.all(submissionPromises);

      toast.success("Submitted successfully!");
      setFiles([]);
      setActivePreview(null);
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsUploadingGlobal(false);
    }
  };

  return (
    <div className={styles.submissionWrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.sectionHeading}>{title}</h1>
        {subTitle && <span className={styles.subTitle}>{subTitle}</span>}
      </div>

      <div className={styles.contentGrid}>
        {/* --- LEFT SIDE: UPLOAD --- */}
        <div className={styles.itemWrapper}>
          <h2 className="sectionSubHeading">Upload Your Answers</h2>

          <div className={styles.uploadWrap}>
            <label className={styles.mainUploadCard}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploadingGlobal}
              />
              <span>+ Add Image</span>
            </label>

            <div className={styles.showCardWrap}>
              {files.map((item, index) => (
                <div
                  key={index}
                  className={styles.uploadCard}
                  onClick={() => setActivePreview(item.previewUrl)}
                  style={{
                    borderColor:
                      activePreview === item.previewUrl ? "#182C74" : "#f1f1f1",
                    backgroundColor:
                      activePreview === item.previewUrl ? "#eef2ff" : "#fff",
                  }}
                >
                  <span>Image {index + 1}</span>
                  {item.uploadProgress > 0 && item.uploadProgress < 100 && (
                    <div className={styles.progressBar}>
                      <div style={{ width: `${item.uploadProgress}%` }}></div>
                    </div>
                  )}
                  {item.isUploaded && <div className={styles.checkMark}>✓</div>}

                  <button
                    className={styles.delBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    disabled={isUploadingGlobal}
                  >
                    <Image
                      src="/assets/images/del.svg"
                      width={14}
                      height={14}
                      alt="delete"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* View Toggle & Submit */}
          <div className={styles.actionButtons}>
            <button
              className={`button ${activePreview === null ? "" : "greyBtn"}`}
              onClick={() => setActivePreview(null)}
            >
              <Image
                src="/assets/images/note-circle.svg"
                width={20}
                height={20}
                alt="pdf"
              />
              View Question Paper
            </button>
            <button
              className="button"
              onClick={handleSubmit}
              disabled={isUploadingGlobal || files.length === 0 || isSubmitting}
            >
              {isUploadingGlobal || isSubmitting
                ? "Submitting..."
                : "Submit Answers"}
            </button>
          </div>
        </div>

        {/* --- RIGHT SIDE: PREVIEW --- */}
        <div className={styles.previewWrapper}>
          <div className={styles.previewHeader}>
            <h3>{activePreview ? "Image Preview" : "Question Paper"}</h3>
          </div>

          {/* PDF CONTAINER */}
          <div
            className={styles.pdfContainer}
            style={{ display: activePreview === null ? "block" : "none" }}
          >
            {pdfError ? (
              <div className={styles.errorBox}>{pdfError}</div>
            ) : (
              // ref maps to "pdfContainer" in reference code
              <div
                ref={containerRef}
                className={styles.canvasScrollArea}
                onContextMenu={(e) => e.preventDefault()} // Extra security on container
              >
                {!pdfDoc && !pdfBase64 && (
                  <p className={styles.loadingText}>No PDF Attached.</p>
                )}
                {!pdfDoc && pdfBase64 && (
                  <p className={styles.loadingText}>Loading PDF...</p>
                )}
              </div>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {activePreview && (
            <div className={styles.imagePreviewContainer}>
              <img src={activePreview} alt="preview" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
