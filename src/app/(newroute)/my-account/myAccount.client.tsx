"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "./myAccount.module.scss";
import Image from 'next/image';
import Link from 'next/link';

const items = [
    {
        title: "This is a Class work document (pdf)",
        subtitle: "Worksheet",
        href: "/",
    },
    {
        title: "Homework Set A",
        subtitle: "Practice Sheet",
        href: "/",
    },
    {
        title: "Reading Material",
        subtitle: "Notes",
        href: "/",
    },
    {
        title: "Project Brief",
        subtitle: "Guidelines",
        href: "/",
    },
    {
        title: "Quiz Prep",
        subtitle: "Review",
        href: "/",
    },
];

export default function MyAccountClient() {

    const [email, setEmail] = useState("liton@ghmail.com");
    const [tempEmail, setTempEmail] = useState(email);
    const [isEditing, setIsEditing] = useState(false);

    const emailInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isEditing && emailInputRef.current) {
            const input = emailInputRef.current;

            input.focus();
            const length = input.value.length;
            input.setSelectionRange(length, length);
        }
    }, [isEditing]);

    const handleEdit = () => {
        setTempEmail(email);
        setIsEditing(true);
    };

    const handleSave = () => {
        setEmail(tempEmail);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempEmail(email);
        setIsEditing(false);
    };


    return (
        <div className={styles.innerWrapper}>
            <div className={styles.innerContainer}>
                <h1 className='sectionHeading'>My Profile</h1>
                <div className={styles.profileWrapper}>
                    <div className={styles.profileInfo}>

                        <button className={styles.editBtn} onClick={handleEdit}>
                            <Image src={"/assets/images/edit-white.svg"} width={20} height={20} alt='icon' />
                        </button>

                        <div className={styles.infoRow}>
                            <p>Classroom ID</p>
                            <h3>SM256845</h3>
                        </div>

                        <div className={styles.infoRow}>
                            <p>Phone Number</p>
                            <h3>9876543210</h3>
                        </div>

                        <div className={styles.infoRow}>
                            <p>Email</p>
                            <input
                                ref={emailInputRef}
                                type="text"
                                value={tempEmail}
                                disabled={!isEditing}
                                onChange={(e) => setTempEmail(e.target.value)}
                            />
                        </div>

                        {isEditing && (
                            <div className={styles.infoRow}>
                                <p></p>
                                <button className='button greenBtn' onClick={handleSave}>Save</button>
                                <button className='button greyBtn' onClick={handleCancel}>Cancel</button>
                            </div>
                        )}

                        <div className={styles.buttonWrapper}>
                            <Link href={"/update-password"} className='button'>Reset Password</Link>
                        </div>
                    </div>

                    <div className={styles.referralsWrap}>
                        <p>My Referrals</p>
                        <h3>SM000122545</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
