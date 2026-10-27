"use client";

import React, { useMemo } from "react";
import styles from "./LiveWork.module.scss"; // This SCSS now only needs layout for the page wrapper
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import Link from "next/link";
import { useGetMeetingDetails } from "@/services/liveClassesService";
import WorkSubmission from "@/app/_component/workSubmission/WorkSubmission";

interface LiveWorkClientProps {
  meetingId: number;
  workId: number;
}

export default function LiveWorkClient({
  meetingId,
  workId,
}: LiveWorkClientProps) {
  // 1. Fetch Data
  const { data: meetingDetailsResponse, isLoading: isMeetingLoading } =
    useGetMeetingDetails(meetingId);

  // 2. Filter specific work item
  const currentWork = useMemo(() => {
    if (!meetingDetailsResponse?.data?.live_works) return null;
    return meetingDetailsResponse.data.live_works.find(
      (work: any) => work.id === Number(workId)
    );
  }, [meetingDetailsResponse, workId]);

  if (isMeetingLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading Work Details...
      </div>
    );
  }

  if (!currentWork) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        <p>Work not found.</p>
        <Link href="/live-classes" className="button">
          Go Back
        </Link>
      </div>
    );
  }

  // 3. Determine Dynamic Title
  const pageTitle =
    currentWork.type === 2
      ? "Live Classes Home Work Sheet"
      : "Live Classes Class Work Sheet";

  return (
    <div className={styles.innerWrapper}>
      <div className={styles.innerContainer}>
        <SubscriptionAttention />

        {/* 4. Use the Reusable Component */}
        <WorkSubmission
          meetingId={meetingId}
          workId={workId}
          title={pageTitle}
          subTitle={currentWork.title}
          type={(currentWork.type as 1 | 2) || 1}
          pdfBase64={currentWork.pdf}
        />
      </div>
    </div>
  );
}

// "use client";

// import React, { useState, useMemo, useEffect, useRef } from "react";
// import styles from "./LiveWork.module.scss"; // Ensure file name matches
// import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
// import Image from "next/image";
// import Link from "next/link";
// import { useGetMeetingDetails } from "@/services/liveClassesService";
// import { usePost } from "@/utilities/api";
// import AWS from "aws-sdk";
// import { toast } from "react-toastify";
// import { BUCKET, CDN_BASE_URL, IDENTITY_POOL_ID } from "@/models/base";

// interface UploadedItem {
//   file: File;
//   previewUrl: string;
//   s3Url?: string;
//   uploadProgress: number;
//   isUploaded: boolean;
// }

// interface LiveWorkClientProps {
//   meetingId: number;
//   workId: number;
// }

// const useSubmitHomeWork = () => {
//   return usePost<any, Error, any>("api/v1/submit-homework");
// };

// export default function LiveWorkClient({
//   meetingId,
//   workId,
// }: LiveWorkClientProps) {
//   // State
//   const [files, setFiles] = useState<UploadedItem[]>([]);
//   const [activePreview, setActivePreview] = useState<string | null>(null); // If null, show PDF. If string, show Image.
//   const [isUploadingGlobal, setIsUploadingGlobal] = useState(false);

//   // PDF Viewer State
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [pdfDoc, setPdfDoc] = useState<any>(null);
//   const [pdfError, setPdfError] = useState<string | null>(null);

//   // API Hooks
//   const { data: meetingDetailsResponse, isLoading: isMeetingLoading } =
//     useGetMeetingDetails(meetingId);
//   const { mutate: submitHomeWork, isPending: isSubmitting } =
//     useSubmitHomeWork();

//   const currentWork = useMemo(() => {
//     if (!meetingDetailsResponse?.data?.live_works) return null;
//     return meetingDetailsResponse.data.live_works.find(
//       (work: any) => work.id === Number(workId)
//     );
//   }, [meetingDetailsResponse, workId]);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     if (activePreview !== null) return;

//     const encodedPdf = currentWork?.pdf;

//     if (typeof encodedPdf !== "string") {
//       setPdfError("PDF not available.");
//       return;
//     }

//     const loadPdf = async () => {
//       try {
//         // Correct import (NO legacy)
//         const pdfjs = await import("pdfjs-dist");

//         // Correct worker setup for Next.js
//         pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//           "pdfjs-dist/build/pdf.worker.min.js",
//           import.meta.url
//         ).toString();

//         // Decode Base64 → URL
//         const pdfUrl = atob(encodedPdf);

//         if (!pdfUrl.startsWith("http")) {
//           throw new Error("Decoded value is not a valid PDF URL");
//         }

//         // Load via URL (THIS IS THE KEY)
//         const loadingTask = pdfjs.getDocument({
//           url: pdfUrl,
//           withCredentials: false,
//         });

//         const pdf = await loadingTask.promise;

//         setPdfDoc(pdf);
//         setPdfError(null);
//       } catch (err) {
//         console.error("PDF Load Error:", err);
//         setPdfError("Failed to load PDF document.");
//       }
//     };

//     loadPdf();
//   }, [currentWork, activePreview]);
//   // Re-run when switching back to PDF

//   // Render Pages once PDF is loaded
//   useEffect(() => {
//     if (!pdfDoc || !containerRef.current || activePreview !== null) return;

//     containerRef.current.innerHTML = "";

//     const observer = new IntersectionObserver(
//       (entries, obs) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const canvas = entry.target as HTMLCanvasElement;
//             const pageNum = parseInt(canvas.dataset.page || "1", 10);

//             if (canvas.dataset.rendered) return;

//             pdfDoc.getPage(pageNum).then((page: any) => {
//               // Scale adjusted for better fit
//               const scale = 1.2;
//               const viewport = page.getViewport({ scale });
//               const context = canvas.getContext("2d");

//               canvas.height = viewport.height;
//               canvas.width = viewport.width;

//               if (context) {
//                 const renderContext = {
//                   canvasContext: context,
//                   viewport: viewport,
//                 };
//                 page.render(renderContext);
//                 canvas.dataset.rendered = "true";
//               }
//             });

//             obs.unobserve(canvas);
//           }
//         });
//       },
//       { root: null, rootMargin: "200px", threshold: 0.1 }
//     );

//     for (let i = 1; i <= pdfDoc.numPages; i++) {
//       const canvas = document.createElement("canvas");
//       canvas.dataset.page = i.toString();
//       canvas.style.display = "block";
//       canvas.style.margin = "0 auto 20px";
//       canvas.style.maxWidth = "100%";
//       canvas.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
//       canvas.style.background = "#fff";
//       // Initial height placeholder
//       canvas.height = 800;
//       containerRef.current.appendChild(canvas);
//       observer.observe(canvas);
//     }
//     return () => observer.disconnect();
//   }, [pdfDoc, activePreview]);

//   // --- HELPER: Sanitize File Name ---
//   const getSanitizedFileName = (originalName: string) => {
//     // 1. Get the extension (e.g., "jpg")
//     const lastDotIndex = originalName.lastIndexOf(".");
//     const ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : "";
//     const nameWithoutExt =
//       lastDotIndex !== -1
//         ? originalName.substring(0, lastDotIndex)
//         : originalName;

//     // 2. Clean the Name:
//     // - Replace spaces with underscores (_)
//     // - Remove all characters that are NOT alphanumeric, underscore, or hyphen
//     const cleanName = nameWithoutExt
//       .replace(/\s+/g, "_") // Replace spaces with _
//       .replace(/[^a-zA-Z0-9-_]/g, ""); // Remove special chars like @, #, $, %, (, )

//     // 3. Construct final path: live_work/TIMESTAMP_CleanName.ext
//     return `live_work/${Date.now()}_${cleanName}${ext}`;
//   };

//   // --- AWS UPLOAD LOGIC ---
//   const uploadFileToS3 = async (fileItem: UploadedItem, index: number) => {
//     return new Promise<string>((resolve, reject) => {
//       AWS.config.update({
//         region: "ap-south-1",
//         credentials: new AWS.CognitoIdentityCredentials({
//           IdentityPoolId: IDENTITY_POOL_ID,
//         }),
//       });

//       const s3 = new AWS.S3({
//         apiVersion: "2006-03-01",
//         params: { Bucket: BUCKET },
//       });

//       // 👇 USAGE: Generate the clean file name here
//       const fileName = getSanitizedFileName(fileItem.file.name);

//       const upload = s3.upload({
//         Bucket: BUCKET,
//         Key: fileName, // Use the sanitized name
//         Body: fileItem.file,
//         ContentType: fileItem.file.type,
//       });

//       upload.on("httpUploadProgress", (progress) => {
//         const percent = Math.round((progress.loaded / progress.total) * 100);
//         setFiles((prev) => {
//           const newFiles = [...prev];
//           if (newFiles[index]) {
//             newFiles[index].uploadProgress = percent;
//           }
//           return newFiles;
//         });
//       });

//       upload.send((err, data) => {
//         if (err) {
//           console.error("S3 Upload Error:", err);
//           reject(err);
//         } else {
//           // The Location might contain encoded characters, so we construct the URL manually
//           // using CDN_BASE_URL + fileName to ensure it matches exactly what we saved.
//           const fileUrl = `${CDN_BASE_URL}/${fileName}`;

//           setFiles((prev) => {
//             const newFiles = [...prev];
//             if (newFiles[index]) {
//               newFiles[index].isUploaded = true;
//               newFiles[index].s3Url = fileUrl;
//             }
//             return newFiles;
//           });
//           resolve(fileUrl);
//         }
//       });
//     });
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newFiles = Array.from(e.target.files).map((file) => ({
//       file,
//       previewUrl: URL.createObjectURL(file),
//       uploadProgress: 0,
//       isUploaded: false,
//     }));
//     setFiles((prev) => [...prev, ...newFiles]);

//     // Automatically switch preview to the newly uploaded image
//     if (newFiles.length > 0) {
//       setActivePreview(newFiles[0].previewUrl);
//     }
//     e.target.value = "";
//   };

//   const handleDelete = (index: number) => {
//     const fileToDelete = files[index];
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//     // If we deleted the currently viewed image, switch back to PDF
//     if (activePreview === fileToDelete.previewUrl) {
//       setActivePreview(null);
//     }
//   };

//   const handleSubmit = async () => {
//     if (files.length === 0) {
//       toast.error("Please select at least one image.");
//       return;
//     }

//     setIsUploadingGlobal(true);

//     try {
//       const uploadPromises = files.map(async (item, index) => {
//         if (item.isUploaded && item.s3Url) return item.s3Url;
//         return await uploadFileToS3(item, index);
//       });

//       const uploadedUrls = await Promise.all(uploadPromises);

//       const userStr = localStorage.getItem("study_monk_user");
//       const user = userStr ? JSON.parse(userStr) : null;
//       if (!user?.id) throw new Error("User not found.");

//       const submissionPromises = uploadedUrls.map((url) => {
//         const payload = {
//           live_work_id: workId,
//           zoom_meeting_id: meetingId, // Mapped
//           type: currentWork?.type || 1,
//           user_id: user.id,
//           file: url,
//         };
//         return submitHomeWork(payload);
//       });

//       await Promise.all(submissionPromises);

//       toast.success("Submitted successfully!");
//       setFiles([]);
//       setActivePreview(null); // Reset to PDF view
//     } catch (error) {
//       console.error("Submission Error:", error);
//       toast.error("Failed to submit. Please try again.");
//     } finally {
//       setIsUploadingGlobal(false);
//     }
//   };

//   if (isMeetingLoading) {
//     return <div className={styles.loadingState}>Loading...</div>;
//   }

//   if (!currentWork) {
//     return (
//       <div className={styles.errorState}>
//         <p>Work not found.</p>
//         <Link href="/live-classes" className="button">
//           Go Back
//         </Link>
//       </div>
//     );
//   }

//   const pageTitle =
//     currentWork.type === 2
//       ? "Live Classes Home Work Sheet"
//       : "Live Classes Class Work Sheet";

//   return (
//     <div
//       className={styles.innerWrapper}
//       onContextMenu={(e) => e.preventDefault()}
//     >
//       <div className={styles.innerContainer}>
//         <SubscriptionAttention />

//         <div className={styles.homeWrokWrapper}>
//           <div
//             className={styles.headerRow}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <h1 className={styles.sectionHeading}>{pageTitle}</h1>
//             <span
//               style={{ color: "#666", fontSize: "14px", marginLeft: "15px" }}
//             >
//               {currentWork.title}
//             </span>
//           </div>

//           <div className={styles.homeWorkCont}>
//             {/* --- LEFT SIDE: UPLOAD & CONTROLS --- */}
//             <div className={styles.itemWrapper}>
//               <h2 className="sectionSubHeading">Upload Your Answers</h2>

//               <div className={styles.uploadWrap}>
//                 <label className={styles.mainUploadCard}>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleFileSelect}
//                     disabled={isUploadingGlobal}
//                   />
//                   <span>+ Add Image</span>
//                 </label>

//                 <div className={styles.showCardWrap}>
//                   {files.map((item, index) => (
//                     <div
//                       key={index}
//                       className={styles.uploadCard}
//                       onClick={() => setActivePreview(item.previewUrl)}
//                       style={{
//                         borderColor:
//                           activePreview === item.previewUrl
//                             ? "#182C74"
//                             : "#f1f1f1",
//                         backgroundColor:
//                           activePreview === item.previewUrl
//                             ? "#eef2ff"
//                             : "#fff",
//                       }}
//                     >
//                       <span>Image {index + 1}</span>
//                       {item.uploadProgress > 0 && item.uploadProgress < 100 && (
//                         <div className={styles.progressBar}>
//                           <div
//                             style={{ width: `${item.uploadProgress}%` }}
//                           ></div>
//                         </div>
//                       )}
//                       {item.isUploaded && (
//                         <div className={styles.checkMark}>✓</div>
//                       )}

//                       <button
//                         className={styles.delBtn}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(index);
//                         }}
//                         disabled={isUploadingGlobal}
//                       >
//                         <Image
//                           src="/assets/images/del.svg"
//                           width={14}
//                           height={14}
//                           alt="delete"
//                         />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* View Toggle Buttons */}
//               <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//                 <button
//                   className={`button ${
//                     activePreview === null ? "" : "greyBtn"
//                   }`}
//                   onClick={() => setActivePreview(null)}
//                 >
//                   <Image
//                     src="/assets/images/note-circle.svg"
//                     width={20}
//                     height={20}
//                     alt="pdf"
//                   />
//                   View Question Paper
//                 </button>
//                 <button
//                   className="button"
//                   onClick={handleSubmit}
//                   disabled={isUploadingGlobal || files.length === 0}
//                 >
//                   {isUploadingGlobal || isSubmitting
//                     ? "Submitting..."
//                     : "Submit Answers"}
//                 </button>
//               </div>
//             </div>

//             {/* --- RIGHT SIDE: PREVIEW AREA (PDF OR IMAGE) --- */}
//             <div className={styles.previewWrapper}>
//               <div className={styles.previewHeader}>
//                 <h3>{activePreview ? "Image Preview" : "Question Paper"}</h3>
//               </div>

//               {/* PDF CONTAINER */}
//               <div
//                 className={styles.pdfContainer}
//                 style={{ display: activePreview === null ? "block" : "none" }}
//               >
//                 {pdfError ? (
//                   <div className={styles.errorBox}>{pdfError}</div>
//                 ) : (
//                   <div ref={containerRef} className={styles.canvasScrollArea}>
//                     {!pdfDoc && (
//                       <p className={styles.loadingText}>Loading PDF...</p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* IMAGE PREVIEW CONTAINER */}
//               {activePreview && (
//                 <div className={styles.imagePreviewContainer}>
//                   <img src={activePreview} alt="preview" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
