import React from 'react'
import styles from "./notification.module.scss";
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

export default function NotificationClient() {

    return (
        <div className={styles.innerWrapper}>
            <div className={styles.innerContainer}>
                <div className={styles.notificationWrap}>
                    {items.map((item, i) => (
                        <Link href={item.href} className="listCard linkRow" key={i}>
                            <Image
                                src="/assets/images/note-circle.svg"
                                width={40}
                                height={40}
                                alt="icon"
                                className="cardIcon"
                            />
                            <div className="cardText">
                                <h3>{item.title}</h3>
                                <p>{item.subtitle}</p>
                            </div>
                            <Image
                                src="/assets/images/link-icon.svg"
                                width={16}
                                height={16}
                                alt="icon"
                                className="checkIcon"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
