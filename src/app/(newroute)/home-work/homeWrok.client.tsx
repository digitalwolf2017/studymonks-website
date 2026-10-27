"use client";

import React, { useState } from "react";
import styles from "./homeWork.module.scss";
import SubscriptionAttention from "@/app/_component/subscriptionAttention/SubscriptionAttention";
import Image from "next/image";

interface UploadedItem {
    file: File;
    url: string;
}

export default function HomeWrokClient() {
    const [files, setFiles] = useState<UploadedItem[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const uploaded = Array.from(e.target.files);

        const mapped: UploadedItem[] = uploaded.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setFiles((prev) => [...prev, ...mapped]);
    };

    const handleDelete = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));

        if (preview && preview === files[index]?.url) {
            setPreview(null);
        }
    };

    return (
        <div className={styles.innerWrapper}>
            <div className={styles.innerContainer}>
                <SubscriptionAttention />

                <div className={styles.homeWrokWrapper}>
                    <h1 className={styles.sectionHeading}>Live Classes Home Work Sheet</h1>

                    <div className={styles.homeWorkCont}>
                        {/* LEFT SIDE */}
                        <div className={styles.itemWrapper}>
                            <h2 className="sectionSubHeading">Upload Your Answers</h2>

                            <div className={styles.uploadWrap}>
                                {/* Upload Box */}
                                <label className={styles.mainUploadCard}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                    <span>+ Add file</span>
                                </label>

                                {/* Cards */}
                                <div className={styles.showCardWrap}>
                                    {files.map((item, index) => (
                                        <div
                                            key={index}
                                            className={styles.uploadCard}
                                            onClick={() => setPreview(item.url)}
                                        >
                                            {/* 👇 Updated label here */}
                                            <span>Image {index + 1}</span>

                                            <button
                                                className={styles.delBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(index);
                                                }}
                                            >
                                                <Image
                                                    src={"/assets/images/del.svg"}
                                                    width={14}
                                                    height={14}
                                                    alt="delete"
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.buttonWrap} ${styles.typeOne}`}>
                                <button className="button">Submit</button>
                            </div>
                        </div>

                        {/* RIGHT SIDE PREVIEW */}
                        <div className={styles.previewWrapper}>
                            <div className={styles.previewDiv}>
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            borderRadius: "12px",
                                        }}
                                    />
                                ) : (
                                    <p style={{ opacity: 0.5 }}>Select an image to preview</p>
                                )}
                            </div>
                            <div className={`${styles.buttonWrap} ${styles.typeTwo}`}>
                                <button className="button">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
